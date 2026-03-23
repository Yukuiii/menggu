/** 统一成功响应 */
function success(res, data = null, message = '操作成功') {
  res.json({ code: 0, message, data })
}

/** 统一失败响应 */
function fail(res, message = '操作失败', code = 1, status = 400) {
  res.status(status).json({ code, message, data: null })
}

module.exports = { success, fail }
