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

/** 系列列表（用于发布页系列选择） */
export function apiAdminSeriesList(params) {
  return request.get('/admin/series', { params })
}
