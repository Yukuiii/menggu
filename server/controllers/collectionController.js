const { Collection, Creator } = require('../models')
const { success, fail } = require('../utils/response')
const { Op } = require('sequelize')

/** 获取藏品列表（支持分类/状态/搜索/分页） */
exports.list = async (req, res, next) => {
  try {
    const { category, status, search, priceMin, priceMax, page = 1, limit = 12 } = req.query
    const where = {}

    // 状态筛选
    if (status && status !== 'all') {
      const statusMap = { selling: 5, soldout: 6 }
      where.status = statusMap[status] || parseInt(status)
    } else {
      where.status = { [Op.gte]: 5 }
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

    // 搜索条件
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } }
      ]
    }

    const includeOptions = [{
      model: Creator,
      attributes: ['id', 'name', 'avatar'],
      ...(search ? { where: { name: { [Op.like]: `%${search}%` } }, required: false } : {})
    }]

    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Collection.findAndCountAll({
      where,
      include: includeOptions,
      order: [['createdAt', 'DESC']],
      offset,
      limit: parseInt(limit),
      distinct: true
    })

    // 搜索创作者名称时补充过滤
    let filteredRows = rows
    if (search) {
      filteredRows = rows.filter(item => {
        const nameMatch = item.name && item.name.includes(search)
        const creatorMatch = item.Creator?.name && item.Creator.name.includes(search)
        return nameMatch || creatorMatch
      })
    }

    success(res, { list: filteredRows, total: count, page: parseInt(page), limit: parseInt(limit) })
  } catch (err) { next(err) }
}

/** 获取藏品详情（含创作者信息） */
exports.detail = async (req, res, next) => {
  try {
    const collection = await Collection.findByPk(req.params.id, {
      include: [{
        model: Creator,
        attributes: ['id', 'name', 'avatar', 'intro', 'worksCount', 'totalSales']
      }]
    })

    if (!collection) return fail(res, '藏品不存在')

    success(res, collection)
  } catch (err) { next(err) }
}

/** 创建藏品（创作者调用，提交审核） */
exports.create = async (req, res, next) => {
  try {
    const { name, cover, fileUrl, fileType, category, price, totalSupply, limitPerUser, description } = req.body

    if (!name || !cover || !price || !totalSupply) {
      return fail(res, '请填写完整藏品信息')
    }

    // 校验创作者身份
    const creator = await Creator.findOne({ where: { userId: req.userId } })
    if (!creator || creator.status !== 1) {
      return fail(res, '仅认证创作者可发布藏品')
    }

    const collection = await Collection.create({
      name, cover, fileUrl, fileType: fileType || 'image', category,
      creatorId: creator.id, totalSupply, price, limitPerUser: limitPerUser || 1,
      description, status: 1 // 审核中
    })

    // 更新创作者作品数
    await creator.increment('worksCount')

    success(res, collection, '藏品已提交审核')
  } catch (err) { next(err) }
}
