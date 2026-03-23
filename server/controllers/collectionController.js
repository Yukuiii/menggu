const { success } = require('../utils/response')

/** 获取藏品列表 */
exports.list = async (req, res, next) => {
  try {
    // TODO: 实现藏品列表查询
    success(res, [])
  } catch (err) { next(err) }
}

/** 获取藏品详情 */
exports.detail = async (req, res, next) => {
  try {
    // TODO: 实现藏品详情查询
    success(res, null)
  } catch (err) { next(err) }
}

/** 创建藏品 */
exports.create = async (req, res, next) => {
  try {
    // TODO: 实现创建藏品逻辑
    success(res, null, '创建成功')
  } catch (err) { next(err) }
}
