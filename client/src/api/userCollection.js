import request from './request'

/** 获取我的藏品列表 */
export function apiMyCollectionList(params) {
  return request.get('/my-collections', { params })
}

/** 获取我的藏品详情 */
export function apiMyCollectionDetail(id) {
  return request.get(`/my-collections/${id}`)
}

/** 转赠藏品 */
export function apiTransfer(id, recipientAddress) {
  return request.post(`/my-collections/${id}/transfer`, { recipientAddress })
}

/** 下载藏品原文件 */
export function getDownloadUrl(id) {
  return `/api/my-collections/${id}/download`
}
