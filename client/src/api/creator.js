import request from './request'

/** 申请入驻创作者 */
export function apiCreatorApply(data) {
  return request.post('/creator/apply', data)
}

/** 获取当前用户创作者信息 */
export function apiCreatorProfile() {
  return request.get('/creator/profile')
}

/** 获取创作者统计数据 */
export function apiCreatorStats() {
  return request.get('/creator/stats')
}

/** 获取创作者作品列表 */
export function apiCreatorWorks(params) {
  return request.get('/creator/works', { params })
}

/** 发布藏品（提交审核） */
export function apiCreatorPublish(data) {
  return request.post('/creator/publish', data)
}

