const { success } = require('../utils/response')

/** 申请入驻 */
exports.apply = async (req, res, next) => {
  try {
    // TODO: 实现创作者入驻申请逻辑
    success(res, null, '申请已提交')
  } catch (err) { next(err) }
}

/** 获取创作者信息 */
exports.profile = async (req, res, next) => {
  try {
    // TODO: 实现获取创作者信息逻辑
    success(res, null)
  } catch (err) { next(err) }
}

/** 获取创作者数据统计 */
exports.stats = async (req, res, next) => {
  try {
    // TODO: 实现数据统计逻辑
    success(res, { totalSales: 0, totalRevenue: 0, followers: 0 })
  } catch (err) { next(err) }
}
