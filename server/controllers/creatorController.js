const { Creator, User, Series, Collection } = require('../models')
const { success, fail } = require('../utils/response')
const { Op } = require('sequelize')

/** 申请入驻创作者 */
exports.apply = async (req, res, next) => {
  try {
    // 校验实名认证
    const user = await User.findByPk(req.userId)
    if (!user.isVerified) return fail(res, '请先完成实名认证')

    // 检查是否已申请过
    const existing = await Creator.findOne({ where: { userId: req.userId } })
    if (existing) {
      if (existing.status === 0) return fail(res, '您的入驻申请正在审核中')
      if (existing.status === 1) return fail(res, '您已是认证创作者')
      // status=2（已拒绝）允许重新申请，更新信息
      const { name, intro, portfolio, contact, certifiedType } = req.body
      await existing.update({ name, intro, portfolio, contact, certifiedType, status: 0, rejectReason: null })
      return success(res, existing, '重新申请已提交')
    }

    const { name, intro, portfolio, contact, certifiedType } = req.body
    if (!name) return fail(res, '请填写创作者名称')

    const creator = await Creator.create({
      userId: req.userId,
      name, intro, portfolio, contact, certifiedType,
      status: 0
    })

    success(res, creator, '申请已提交')
  } catch (err) { next(err) }
}

/** 获取当前用户的创作者信息 */
exports.profile = async (req, res, next) => {
  try {
    const creator = await Creator.findOne({
      where: { userId: req.userId },
      include: [{ model: User, attributes: ['id', 'nickname', 'email', 'avatar'] }]
    })
    success(res, creator)
  } catch (err) { next(err) }
}

/** 获取创作者数据统计 */
exports.stats = async (req, res, next) => {
  try {
    const creator = await Creator.findOne({ where: { userId: req.userId } })
    if (!creator) return fail(res, '您还不是创作者', 1, 404)

    success(res, {
      totalSales: creator.totalSales,
      totalRevenue: creator.totalRevenue,
      availableRevenue: creator.availableRevenue,
      worksCount: creator.worksCount,
      fansCount: creator.fansCount
    })
  } catch (err) { next(err) }
}

/** 获取创作者作品列表（支持状态筛选） */
exports.works = async (req, res, next) => {
  try {
    const creator = await Creator.findOne({ where: { userId: req.userId } })
    if (!creator) return fail(res, '您还不是创作者', 1, 404)

    const { status, page = 1, limit = 10 } = req.query
    const where = {}

    // 查询该创作者所有系列
    const seriesIds = (await Series.findAll({
      where: { creatorId: creator.id },
      attributes: ['id']
    })).map(s => s.id)

    if (seriesIds.length === 0) {
      return success(res, { list: [], total: 0, page: parseInt(page), limit: parseInt(limit) })
    }

    where.seriesId = { [Op.in]: seriesIds }

    // 状态筛选
    if (status && status !== 'all') {
      const statusMap = { draft: 0, pending: 1, approved: 2, rejected: 3 }
      if (statusMap[status] !== undefined) {
        where.status = statusMap[status]
      } else {
        where.status = parseInt(status)
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Collection.findAndCountAll({
      where,
      include: [{ model: Series, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit)
    })

    success(res, { list: rows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 发布新藏品（提交审核） */
exports.publish = async (req, res, next) => {
  try {
    const creator = await Creator.findOne({ where: { userId: req.userId } })
    if (!creator || creator.status !== 1) {
      return fail(res, '仅认证创作者可发布藏品', 1, 403)
    }

    const { seriesId, name, cover, fileUrl, fileType, price, totalSupply, limitPerUser, saleTime, description } = req.body

    if (!name || !cover || !seriesId || !price || !totalSupply || !saleTime) {
      return fail(res, '请填写完整藏品信息')
    }

    // 校验系列归属
    const series = await Series.findByPk(seriesId)
    if (!series || series.creatorId !== creator.id) {
      return fail(res, '系列不存在或无权操作', 1, 403)
    }

    const collection = await Collection.create({
      name, cover, fileUrl, fileType: fileType || 'image',
      seriesId, totalSupply, price, limitPerUser: limitPerUser || 1,
      saleTime, description, status: 1 // 审核中
    })

    await creator.increment('worksCount')

    success(res, { collectionId: collection.id, status: 'pending' }, '藏品已提交审核')
  } catch (err) { next(err) }
}

/** 创建藏品系列 */
exports.createSeries = async (req, res, next) => {
  try {
    const creator = await Creator.findOne({ where: { userId: req.userId } })
    if (!creator || creator.status !== 1) {
      return fail(res, '仅认证创作者可创建系列', 1, 403)
    }

    const { name, cover, description } = req.body
    if (!name) return fail(res, '请填写系列名称')

    const series = await Series.create({
      creatorId: creator.id,
      name, cover, description
    })

    success(res, series, '系列创建成功')
  } catch (err) { next(err) }
}
