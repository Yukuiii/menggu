const { User, Order, Collection, Creator, Notification, UserCollection, sequelize } = require('../models')
const { success, fail } = require('../utils/response')
const { generateChainHash, generateContractAddress, getNextBlockHeight } = require('../utils/chain')
const { Op } = require('sequelize')

/** 获取数据看板 */
exports.dashboard = async (req, res, next) => {
  try {
    const [users, orders, revenue, collections] = await Promise.all([
      User.count(),
      Order.count({ where: { status: { [Op.in]: [1, 2] } } }),
      Order.sum('amount', { where: { status: { [Op.in]: [1, 2] } } }),
      Collection.count({ where: { status: { [Op.gte]: 4 } } })
    ])

    success(res, {
      users,
      orders,
      revenue: revenue || 0,
      collections
    })
  } catch (err) { next(err) }
}

/** 获取用户列表（分页+搜索） */
exports.userList = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query
    const where = {}

    if (search) {
      where[Op.or] = [
        { nickname: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    }
    if (status !== undefined && status !== '' && status !== 'all') {
      where.status = parseInt(status)
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 获取用户详情（含持有藏品和交易记录） */
exports.userDetail = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) return fail(res, '用户不存在')

    // 并发查询持有藏品和订单记录
    const [collections, orders] = await Promise.all([
      UserCollection.findAll({
        where: { userId: user.id },
        include: [{ model: Collection, attributes: ['id', 'name', 'cover', 'price'] }],
        order: [['createdAt', 'DESC']],
        limit: 20
      }),
      Order.findAll({
        where: { userId: user.id },
        include: [{ model: Collection, attributes: ['id', 'name', 'cover'] }],
        order: [['createdAt', 'DESC']],
        limit: 20
      })
    ])

    success(res, { ...user.toJSON(), collections, orders })
  } catch (err) { next(err) }
}

/** 封禁/解封用户 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return fail(res, '用户不存在')

    const newStatus = user.status === 1 ? 0 : 1
    await user.update({ status: newStatus })

    const action = newStatus === 0 ? '封禁' : '解封'
    await Notification.create({
      userId: user.id,
      title: `账号已${action}`,
      content: newStatus === 0 ? '您的账号已被封禁，如有疑问请联系客服' : '您的账号已解封，可正常使用',
      type: 'system'
    })

    success(res, { status: newStatus }, `用户已${action}`)
  } catch (err) { next(err) }
}

/** 审核藏品（通过/拒绝） */
exports.auditCollection = async (req, res, next) => {
  try {
    const { action, rejectReason } = req.body
    const collection = await Collection.findByPk(req.params.id, {
      include: [{ model: Creator, include: [User] }]
    })

    if (!collection) return fail(res, '藏品不存在')
    if (collection.status !== 1) return fail(res, '该藏品不在待审核状态')

    if (action === 'approve') {
      const chainHash = generateChainHash(`${collection.name}-${collection.id}`)
      const contractAddress = generateContractAddress()
      const blockHeight = getNextBlockHeight()
      const now = new Date()

      await collection.update({ status: 5, chainHash, contractAddress, blockHeight, chainTime: now })

      const creatorUserId = collection.Creator?.userId
      if (creatorUserId) {
        await Notification.create({
          userId: creatorUserId,
          title: '藏品审核通过',
          content: `您的藏品「${collection.name}」已通过审核`,
          type: 'audit'
        })
      }

      success(res, collection, '审核通过')
    } else if (action === 'reject') {
      if (!rejectReason) return fail(res, '请填写拒绝原因')
      await collection.update({ status: 3 })

      const creatorUserId = collection.Creator?.userId
      if (creatorUserId) {
        await Notification.create({
          userId: creatorUserId,
          title: '藏品审核未通过',
          content: `您的藏品「${collection.name}」审核未通过，原因：${rejectReason}`,
          type: 'audit'
        })
      }

      success(res, null, '已拒绝')
    } else {
      fail(res, 'action 参数无效，请传 approve 或 reject')
    }
  } catch (err) { next(err) }
}

/** 藏品上架/下架 */
exports.toggleCollectionStatus = async (req, res, next) => {
  try {
    const { action } = req.body
    const collection = await Collection.findByPk(req.params.id)
    if (!collection) return fail(res, '藏品不存在')

    if (action === 'online') {
      // 上架：仅已通过的藏品可上架
      if (![2, 7].includes(collection.status)) {
        return fail(res, '仅已通过或已下架的藏品可上架')
      }
      await collection.update({ status: 5 })
      success(res, null, '已上架')
    } else if (action === 'offline') {
      // 下架：仅发售中/待发售的藏品可下架
      if (![5].includes(collection.status)) {
        return fail(res, '仅发售中的藏品可下架')
      }
      await collection.update({ status: 7 })
      success(res, null, '已下架')
    } else {
      fail(res, 'action 参数无效，请传 online 或 offline')
    }
  } catch (err) { next(err) }
}

/** 管理员藏品列表（含所有状态） */
exports.collectionList = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    const where = {}

    if (status !== undefined && status !== '' && status !== 'all') {
      where.status = parseInt(status)
    }
    if (search) {
      where.name = { [Op.like]: `%${search}%` }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Collection.findAndCountAll({
      where,
      include: [{ model: Creator, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}



/** 管理员订单列表（全平台，支持状态/时间筛选） */
exports.orderList = async (req, res, next) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query
    const where = {}

    if (status !== undefined && status !== '' && status !== 'all') {
      where.status = parseInt(status)
    }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt[Op.gte] = new Date(startDate)
      if (endDate) where.createdAt[Op.lte] = new Date(endDate + ' 23:59:59')
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'nickname', 'email'] },
        { model: Collection, attributes: ['id', 'name', 'cover'] }
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 退款处理 */
exports.refundOrder = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const order = await Order.findByPk(req.params.id, {
      lock: true, transaction: t,
      include: [{ model: Collection }]
    })
    if (!order) { await t.rollback(); return fail(res, '订单不存在') }
    if (order.status !== 1) { await t.rollback(); return fail(res, '仅已支付订单可退款') }

    // 退还用户余额
    const user = await User.findByPk(order.userId, { lock: true, transaction: t })
    user.balance = parseFloat(user.balance) + parseFloat(order.amount)
    await user.save({ transaction: t })

    // 更新订单状态
    await order.update({ status: 4 }, { transaction: t })

    // 删除用户持有记录
    await UserCollection.destroy({
      where: { userId: order.userId, collectionId: order.collectionId, tokenId: order.tokenId },
      transaction: t
    })

    // 如果藏品已售罄，恢复为发售中
    const collection = order.Collection
    if (collection && collection.status === 6) {
      await collection.update({ status: 5 }, { transaction: t })
    }

    // 通知用户
    await Notification.create({
      userId: order.userId,
      title: '订单已退款',
      content: `您的订单 ${order.orderNo} 已退款，金额 ¥${order.amount} 已退回钱包`,
      type: 'system'
    }, { transaction: t })

    await t.commit()
    success(res, null, '退款成功')
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

/** 审核创作者入驻（通过/拒绝） */
exports.auditCreator = async (req, res, next) => {
  try {
    const { action, rejectReason } = req.body
    const creator = await Creator.findByPk(req.params.id)

    if (!creator) return fail(res, '创作者不存在')
    if (creator.status !== 0) return fail(res, '该创作者不在待审核状态')

    if (action === 'approve') {
      await creator.update({ status: 1, isCertified: true })
      await Notification.create({
        userId: creator.userId,
        title: '创作者入驻通过',
        content: '恭喜！您的创作者入驻申请已通过',
        type: 'audit'
      })
      success(res, creator, '审核通过')
    } else if (action === 'reject') {
      if (!rejectReason) return fail(res, '请填写拒绝原因')
      await creator.update({ status: 2, rejectReason })
      await Notification.create({
        userId: creator.userId,
        title: '创作者入驻未通过',
        content: `您的入驻申请未通过，原因：${rejectReason}`,
        type: 'audit'
      })
      success(res, null, '已拒绝')
    } else {
      fail(res, 'action 参数无效，请传 approve 或 reject')
    }
  } catch (err) { next(err) }
}

/** 创作者列表（管理视角） */
exports.creatorList = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    const where = {}

    if (status !== undefined && status !== '' && status !== 'all') {
      where.status = parseInt(status)
    }
    if (search) {
      where.name = { [Op.like]: `%${search}%` }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Creator.findAndCountAll({
      where,
      include: [{ model: User, attributes: ['id', 'nickname', 'email'] }],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 获取系统设置（限购规则/冷却期） */
exports.getSettings = async (req, res, next) => {
  try {
    // 从内存/配置读取，此处用默认值
    const settings = {
      defaultLimitPerUser: 1,
      transferCooldownHours: 72
    }
    success(res, settings)
  } catch (err) { next(err) }
}

/** 更新系统设置 */
exports.updateSettings = async (req, res, next) => {
  try {
    const { defaultLimitPerUser, transferCooldownHours } = req.body
    // 实际应持久化到数据库或配置文件，此处返回确认
    success(res, { defaultLimitPerUser, transferCooldownHours }, '设置已更新')
  } catch (err) { next(err) }
}
