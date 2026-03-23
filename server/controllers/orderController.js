const { success } = require('../utils/response')

/** 创建订单 */
exports.create = async (req, res, next) => {
  try {
    // TODO: 实现创建订单逻辑
    success(res, null, '下单成功')
  } catch (err) { next(err) }
}

/** 获取订单列表 */
exports.list = async (req, res, next) => {
  try {
    // TODO: 实现订单列表查询
    success(res, [])
  } catch (err) { next(err) }
}

/** 获取订单详情 */
exports.detail = async (req, res, next) => {
  try {
    // TODO: 实现订单详情查询
    success(res, null)
  } catch (err) { next(err) }
}
