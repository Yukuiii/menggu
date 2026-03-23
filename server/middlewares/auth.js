const jwt = require('jsonwebtoken')
const config = require('../config')
const { fail } = require('../utils/response')

/** JWT 认证中间件：从 Authorization: Bearer <token> 中解析用户 ID */
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return fail(res, '请先登录', 401, 401)
  }
  try {
    // 验证并解码 token，将用户 ID 挂载到 req.userId
    const decoded = jwt.verify(token, config.jwt.secret)
    req.userId = decoded.id
    req.userEmail = decoded.email
    next()
  } catch (err) {
    return fail(res, 'Token 已失效，请重新登录', 401, 401)
  }
}

module.exports = auth
