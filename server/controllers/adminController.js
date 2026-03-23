const { success } = require('../utils/response')

/** 获取数据看板 */
exports.dashboard = async (req, res, next) => {
  try {
    // TODO: 实现数据看板逻辑
    success(res, { users: 0, orders: 0, revenue: 0, collections: 0 })
  } catch (err) { next(err) }
}

/** 获取用户列表 */
exports.userList = async (req, res, next) => {
  try {
    // TODO: 实现用户列表查询
    success(res, [])
  } catch (err) { next(err) }
}

/** 审核藏品 */
exports.auditCollection = async (req, res, next) => {
  try {
    // TODO: 实现藏品审核逻辑
    success(res, null, '审核完成')
  } catch (err) { next(err) }
}

/** 审核创作者入驻 */
exports.auditCreator = async (req, res, next) => {
  try {
    // TODO: 实现创作者审核逻辑
    success(res, null, '审核完成')
  } catch (err) { next(err) }
}
