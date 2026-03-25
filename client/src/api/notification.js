import request from './request'

/** 获取站内信列表 */
export function apiNotificationList(params) {
  return request.get('/notifications', { params })
}

/** 获取未读站内信数量 */
export function apiNotificationUnreadCount() {
  return request.get('/notifications/unread-count')
}

/** 将单条站内信标记为已读 */
export function apiNotificationMarkRead(id) {
  return request.post(`/notifications/${id}/read`)
}

/** 将全部站内信标记为已读 */
export function apiNotificationMarkAllRead() {
  return request.post('/notifications/read-all')
}
