const { UserCollection, Collection, Creator, User, TransferRecord, Notification, sequelize } = require('../models')
const { success, fail } = require('../utils/response')
const { generateChainHash } = require('../utils/chain')
const path = require('path')

/** 获取我的藏品列表 */
exports.list = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query
    const where = { userId: req.userId }

    const includeCollection = {
      model: Collection,
      attributes: ['id', 'name', 'cover', 'price', 'fileType'],
      include: [{ model: Creator, attributes: ['id', 'name'] }]
    }

    // 关键词搜索（藏品名称）
    if (search) {
      includeCollection.where = {
        name: { [require('sequelize').Op.like]: `%${search}%` }
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await UserCollection.findAndCountAll({
      where,
      include: [includeCollection],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 获取我的藏品详情（含流转历史） */
exports.detail = async (req, res, next) => {
  try {
    const uc = await UserCollection.findByPk(req.params.id, {
      include: [{
        model: Collection,
        include: [{ model: Creator, attributes: ['id', 'name', 'avatar'] }]
      }]
    })

    if (!uc) return fail(res, '藏品记录不存在')
    if (uc.userId !== req.userId) return fail(res, '无权查看')

    // 自动更新可转赠状态
    if (!uc.isTransferable && uc.transferCooldownAt && new Date() >= new Date(uc.transferCooldownAt)) {
      await uc.update({ isTransferable: true })
      uc.isTransferable = true
    }

    // 查询该藏品编号的流转记录
    const transfers = await TransferRecord.findAll({
      where: { collectionId: uc.collectionId, tokenId: uc.tokenId },
      include: [
        { model: User, as: 'fromUser', attributes: ['id', 'nickname', 'walletAddress'] },
        { model: User, as: 'toUser', attributes: ['id', 'nickname', 'walletAddress'] }
      ],
      order: [['createdAt', 'ASC']]
    })

    success(res, { ...uc.toJSON(), transfers })
  } catch (err) { next(err) }
}

/** 转赠藏品（事务操作） */
exports.transfer = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { recipientAddress } = req.body
    if (!recipientAddress) {
      await t.rollback()
      return fail(res, '请输入接收方钱包地址')
    }

    // 查找持有记录并加锁
    const uc = await UserCollection.findByPk(req.params.id, { lock: true, transaction: t })
    if (!uc || uc.userId !== req.userId) {
      await t.rollback()
      return fail(res, '藏品记录不存在')
    }

    // 校验冷却期
    if (!uc.isTransferable) {
      if (uc.transferCooldownAt && new Date() < new Date(uc.transferCooldownAt)) {
        await t.rollback()
        return fail(res, `该藏品尚在冷却期，${new Date(uc.transferCooldownAt).toLocaleDateString()}后可转赠`)
      }
    }

    // 查找接收方
    const recipient = await User.findOne({ where: { walletAddress: recipientAddress } })
    if (!recipient) {
      await t.rollback()
      return fail(res, '接收方钱包地址不存在')
    }
    if (recipient.id === req.userId) {
      await t.rollback()
      return fail(res, '不能转赠给自己')
    }
    if (!recipient.isVerified) {
      await t.rollback()
      return fail(res, '接收方未完成实名认证')
    }

    // 执行转赠
    const chainHash = generateChainHash(`transfer-${uc.id}-${recipient.id}`)
    await uc.update({
      userId: recipient.id,
      acquireType: 'gift',
      acquireTime: new Date(),
      isTransferable: false,
      transferCooldownAt: new Date(Date.now() + 72 * 3600 * 1000) // 72小时冷却期
    }, { transaction: t })

    // 创建流转记录
    await TransferRecord.create({
      userCollectionId: uc.id,
      collectionId: uc.collectionId,
      tokenId: uc.tokenId,
      fromUserId: req.userId,
      toUserId: recipient.id,
      type: 'gift',
      chainHash
    }, { transaction: t })

    // 获取藏品名称用于通知
    const collection = await Collection.findByPk(uc.collectionId, { attributes: ['name'] })
    const tokenLabel = `「${collection.name}」#${String(uc.tokenId).padStart(4, '0')}`

    // 通知双方
    await Notification.bulkCreate([
      { userId: req.userId, title: '转赠成功', content: `您已将${tokenLabel}转赠给钱包 ${recipientAddress}`, type: 'gift' },
      { userId: recipient.id, title: '收到转赠', content: `您收到了${tokenLabel}的转赠`, type: 'gift' }
    ], { transaction: t })

    await t.commit()
    success(res, { chainHash }, '转赠成功')
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

/** 下载藏品原始文件 */
exports.download = async (req, res, next) => {
  try {
    const uc = await UserCollection.findByPk(req.params.id, {
      include: [{ model: Collection, attributes: ['fileUrl', 'name'] }]
    })

    if (!uc) return fail(res, '藏品记录不存在')
    if (uc.userId !== req.userId) return fail(res, '无权下载')

    const fileUrl = uc.Collection?.fileUrl
    if (!fileUrl) return fail(res, '该藏品暂无原始文件')

    // 本地文件下载
    const filePath = path.join(__dirname, '..', fileUrl)
    res.download(filePath, `${uc.Collection.name}_${uc.tokenId}${path.extname(fileUrl)}`)
  } catch (err) { next(err) }
}
