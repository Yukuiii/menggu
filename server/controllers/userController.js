const { success } = require('../utils/response')

/** 用户登录 */
exports.login = async (req, res, next) => {
  try {
    // TODO: 实现登录逻辑
    success(res, { token: 'mock-token' }, '登录成功')
  } catch (err) { next(err) }
}

/** 获取用户信息 */
exports.getProfile = async (req, res, next) => {
  try {
    // TODO: 实现获取用户信息逻辑
    success(res, null)
  } catch (err) { next(err) }
}

/** 实名认证 */
exports.verify = async (req, res, next) => {
  try {
    // TODO: 实现实名认证逻辑
    success(res, null, '认证成功')
  } catch (err) { next(err) }
}
