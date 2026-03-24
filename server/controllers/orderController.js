const { Order, Collection, Creator, User, UserCollection, TransferRecord, CreatorRevenue, Notification, sequelize } = require('../models')
const { success, fail } = require('../utils/response')
const { generateOrderNo } = require('../utils/order')
const { generateChainHash, getNextBlockHeight } = require('../utils/chain')
const { Op } = require('sequelize')

/** 创建订单（校验实名、库存、限购） */
exports.create = async (req, res, next) => {
  try {
    const { collectionId } = req.body
    if (!collectionId) return fail(res, '请选择藏品')

    // 校验用户实名
    const user = await User.findByPk(req.userId)
    if (!user.isVerified) return fail(res, '请先完成实名认证')

    // 校验藏品状态
    const collection = await Collection.findByPk(collectionId)
    if (!collection) return fail(res, '藏品不存在')
    if (collection.status !== 5) return fail(res, '该藏品当前不可购买')

    // 校验库存
    if (collection.currentNo >= collection.totalSupply) {
      return fail(res, '该藏品已售罄')
    }

    // 校验限购（统计该用户对此藏品的有效订单：待支付+已支付）
    const orderCount = await Order.count({
      where: {
        userId: req.userId,
        collectionId,
        status: { [Op.in]: [0, 1, 2] }
      }
    })
    if (orderCount >= collection.limitPerUser) {
      return fail(res, `每人限购${collection.limitPerUser}件，您已达上限`)
    }

    // 生成订单
    const orderNo = generateOrderNo()
    const expireAt = new Date(Date.now() + 15 * 60 * 1000) // 15分钟过期

    const order = await Order.create({
      orderNo,
      userId: req.userId,
      collectionId,
      amount: collection.price,
      status: 0,
      expireAt
    })

    success(res, {
      orderId: order.id,
      orderNo: order.orderNo,
      amount: order.amount,
      expireAt: order.expireAt
    }, '下单成功')
  } catch (err) { next(err) }
}

/** 支付订单（事务+行锁，原子操作） */
exports.pay = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    // 1. 查订单并加锁
    const order = await Order.findByPk(req.params.id, { lock: true, transaction: t })
    if (!order || order.userId !== req.userId) {
      await t.rollback()
      return fail(res, '订单不存在')
    }
    if (order.status !== 0) {
      await t.rollback()
      return fail(res, '订单状态异常，无法支付')
    }

    // 2. 检查过期
    if (new Date() > new Date(order.expireAt)) {
      await order.update({ status: 3 }, { transaction: t })
      await t.commit()
      return fail(res, '订单已过期')
    }

    // 3. 查用户并加锁，校验余额
    const user = await User.findByPk(req.userId, { lock: true, transaction: t })
    if (parseFloat(user.balance) < parseFloat(order.amount)) {
      await t.rollback()
      return fail(res, '余额不足，请先充值')
    }

    // 4. 查藏品并加锁，再次校验库存
    const collection = await Collection.findByPk(order.collectionId, {
      lock: true, transaction: t,
      include: [{ model: Creator }]
    })
    if (collection.currentNo >= collection.totalSupply) {
      await t.rollback()
      return fail(res, '该藏品已售罄')
    }

    // 5. 扣减用户余额
    user.balance = parseFloat(user.balance) - parseFloat(order.amount)
    await user.save({ transaction: t })

    // 6. 递增已售编号，获取tokenId
    collection.currentNo += 1
    const tokenId = collection.currentNo
    // 若售罄则更新状态
    if (collection.currentNo >= collection.totalSupply) {
      collection.status = 6
    }
    await collection.save({ transaction: t })

    // 7. 生成链上数据
    const chainHash = generateChainHash(`${order.id}-${tokenId}-${collection.name}`)
    const blockHeight = getNextBlockHeight()

    // 8. 更新订单
    await order.update({
      status: 1,
      paidAt: new Date(),
      tokenId
    }, { transaction: t })

    // 9. 创建用户藏品持有记录
    const uc = await UserCollection.create({
      userId: req.userId,
      collectionId: collection.id,
      tokenId,
      chainHash,
      acquireType: 'purchase',
      acquireTime: new Date(),
      isTransferable: false,
      transferCooldownAt: new Date(Date.now() + 72 * 3600 * 1000) // 72小时冷却期
    }, { transaction: t })

    // 10. 创建流转记录
    await TransferRecord.create({
      userCollectionId: uc.id,
      collectionId: collection.id,
      tokenId,
      fromUserId: null,
      toUserId: req.userId,
      type: 'purchase',
      chainHash
    }, { transaction: t })

    // 11. 计算创作者分成
    const creator = collection.Creator
    if (creator) {
      const rate = parseFloat(creator.commissionRate)
      const orderAmount = parseFloat(order.amount)
      const revenueAmount = parseFloat((orderAmount * rate / 100).toFixed(2))
      const platformAmount = parseFloat((orderAmount - revenueAmount).toFixed(2))

      await CreatorRevenue.create({
        creatorId: creator.id,
        orderId: order.id,
        collectionId: collection.id,
        orderAmount,
        commissionRate: rate,
        revenueAmount,
        platformAmount,
        status: 0
      }, { transaction: t })

      // 更新创作者统计
      await creator.increment({
        totalSales: 1,
        totalRevenue: revenueAmount,
        availableRevenue: revenueAmount
      }, { transaction: t })
    }

    // 12. 创建购买成功通知
    await Notification.create({
      userId: req.userId,
      title: '购买成功',
      content: `您已成功购买「${collection.name}」#${String(tokenId).padStart(4, '0')}`,
      type: 'purchase'
    }, { transaction: t })

    await t.commit()

    success(res, {
      orderId: order.id,
      orderNo: order.orderNo,
      tokenId,
      chainHash,
      blockHeight,
      paidAt: order.paidAt
    }, '支付成功')
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

/** 获取当前用户订单列表（支持状态筛选和分页） */
exports.list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const where = { userId: req.userId }

    if (status && status !== 'all') {
      const statusMap = { pending: 0, paid: 1, completed: 2, cancelled: 3, refunded: 4 }
      where.status = statusMap[status] !== undefined ? statusMap[status] : parseInt(status)
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [{
        model: Collection,
        attributes: ['id', 'name', 'cover', 'price', 'fileType']
      }],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    // 运行时自动过期
    for (const order of rows) {
      if (order.status === 0 && order.expireAt && new Date() > new Date(order.expireAt)) {
        await order.update({ status: 3 })
        order.status = 3
      }
    }

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 获取订单详情 */
exports.detail = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: Collection,
          attributes: ['id', 'name', 'cover', 'price', 'fileType', 'chainHash', 'contractAddress'],
          include: [{ model: Creator, attributes: ['id', 'name'] }]
        },
        { model: User, attributes: ['id', 'nickname', 'walletAddress'] }
      ]
    })

    if (!order) return fail(res, '订单不存在')
    if (order.userId !== req.userId) return fail(res, '无权查看此订单')

    // 运行时自动过期
    if (order.status === 0 && order.expireAt && new Date() > new Date(order.expireAt)) {
      await order.update({ status: 3 })
      order.status = 3
    }

    success(res, order)
  } catch (err) { next(err) }
}
