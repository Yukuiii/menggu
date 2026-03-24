const { Collection, Series, Creator, TransferRecord, User } = require('../models')
const { success, fail } = require('../utils/response')
const { Op } = require('sequelize')

/** 获取藏品列表（支持分类/状态/价格区间/系列/搜索/分页） */
exports.list = async (req, res, next) => {
  try {
    const { category, status, search, priceMin, priceMax, seriesId, page = 1, limit = 12 } = req.query
    const where = {}

    // 状态筛选：前端传 upcoming/selling/soldout 映射为数据库状态码
    if (status && status !== 'all') {
      const statusMap = { upcoming: 4, selling: 5, soldout: 6 }
      where.status = statusMap[status] || parseInt(status)
    } else {
      // 默认只返回已上架的藏品（状态 >= 4）
      where.status = { [Op.gte]: 4 }
    }

    // 分类筛选
    if (category && category !== 'all') {
      where.fileType = category
    }

    // 价格区间筛选
    if (priceMin || priceMax) {
      where.price = {}
      if (priceMin) where.price[Op.gte] = parseFloat(priceMin)
      if (priceMax) where.price[Op.lte] = parseFloat(priceMax)
    }

    // 系列筛选
    if (seriesId) {
      where.seriesId = parseInt(seriesId)
    }

    // 搜索条件（藏品名称或创作者名称）
    const includeOptions = [{
      model: Series,
      attributes: ['id', 'name'],
      include: [{
        model: Creator,
        attributes: ['id', 'name', 'avatar'],
        // 创作者名称模糊搜索
        ...(search ? { where: { name: { [Op.like]: `%${search}%` } }, required: false } : {})
      }]
    }]

    // 关键词搜索：藏品名称 OR 创作者名称
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ]
    }

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Collection.findAndCountAll({
      where,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
      distinct: true
    })

    // 搜索创作者名称时，补充过滤（因 OR 条件无法跨表直接用 where）
    let filteredRows = rows
    if (search) {
      filteredRows = rows.filter(item => {
        const nameMatch = item.name && item.name.includes(search)
        const creatorMatch = item.Series?.Creator?.name && item.Series.Creator.name.includes(search)
        return nameMatch || creatorMatch
      })
    }



    success(res, { list: filteredRows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 获取藏品详情（含创作者信息和流转记录） */
exports.detail = async (req, res, next) => {
  try {
    const collection = await Collection.findByPk(req.params.id, {
      include: [{
        model: Series,
        attributes: ['id', 'name'],
        include: [{
          model: Creator,
          attributes: ['id', 'name', 'avatar', 'intro', 'worksCount', 'totalSales']
        }]
      }]
    })

    if (!collection) return fail(res, '藏品不存在')



    // 查询流转记录
    const transfers = await TransferRecord.findAll({
      where: { collectionId: collection.id },
      include: [
        { model: User, as: 'fromUser', attributes: ['id', 'nickname', 'walletAddress'] },
        { model: User, as: 'toUser', attributes: ['id', 'nickname', 'walletAddress'] }
      ],
      order: [['createdAt', 'DESC']]
    })

    success(res, { ...collection.toJSON(), transfers })
  } catch (err) { next(err) }
}

/** 创建藏品（创作者调用，提交审核） */
exports.create = async (req, res, next) => {
  try {
    const { seriesId, name, cover, fileUrl, fileType, price, totalSupply, limitPerUser, description } = req.body

    if (!name || !cover || !seriesId || !price || !totalSupply) {
      return fail(res, '请填写完整藏品信息')
    }

    // 校验系列归属
    const series = await Series.findByPk(seriesId, { include: [Creator] })
    if (!series) return fail(res, '系列不存在')

    const creator = series.Creator
    if (!creator || creator.userId !== req.userId || creator.status !== 1) {
      return fail(res, '无权在该系列下创建藏品')
    }

    const collection = await Collection.create({
      name, cover, fileUrl, fileType: fileType || 'image',
      seriesId, totalSupply, price, limitPerUser: limitPerUser || 1,
      description, status: 1 // 审核中
    })

    // 更新创作者作品数
    await creator.increment('worksCount')

    success(res, collection, '藏品已提交审核')
  } catch (err) { next(err) }
}
