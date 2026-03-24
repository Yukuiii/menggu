import request from './request'

/** 获取藏品列表（支持分类/状态/价格/搜索/分页） */
export function apiCollectionList(params) {
  return request.get('/collections', { params })
}

/** 获取藏品详情 */
export function apiCollectionDetail(id) {
  return request.get(`/collections/${id}`)
}
