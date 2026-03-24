/** 统一成功响应 */
function success(res, data = null, message = '操作成功') {
  res.json({ code: 0, message, data })
}

/** 统一失败响应（HTTP 始终返回 200，业务错误通过 code 区分） */
function fail(res, message = '操作失败', code = 1) {
  res.json({ code, message, data: null })
}

module.exports = { success, fail }
