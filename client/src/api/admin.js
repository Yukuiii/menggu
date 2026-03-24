import request from './request'

/** 管理后台看板 */
export function apiAdminDashboard() {
  return request.get('/admin/dashboard')
}

/** 用户列表 */
export function apiAdminUserList(params) {
  return request.get('/admin/users', { params })
}

/** 藏品列表 */
export function apiAdminCollectionList(params) {
  return request.get('/admin/collections', { params })
}

/** 订单列表 */
export function apiAdminOrderList(params) {
  return request.get('/admin/orders', { params })
}

/** 创作者列表 */
export function apiAdminCreatorList(params) {
  return request.get('/admin/creators', { params })
}

/** 审核藏品 */
export function apiAdminAuditCollection(id, data) {
  return request.post(`/admin/collections/${id}/audit`, data)
}

/** 审核创作者 */
export function apiAdminAuditCreator(id, data) {
  return request.post(`/admin/creators/${id}/audit`, data)
}
