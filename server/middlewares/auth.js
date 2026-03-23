const { fail } = require('../utils/response')

/** JWT 认证中间件 */
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return fail(res, '请先登录', 401, 401)
  }
  // TODO: 实现 JWT 验证逻辑
  next()
}

module.exports = auth
