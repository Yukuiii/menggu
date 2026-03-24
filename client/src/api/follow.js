import request from './request'

/** 关注创作者 */
export function apiFollow(creatorId) {
  return request.post('/follows/follow', { creatorId })
}

/** 取消关注 */
export function apiUnfollow(creatorId) {
  return request.post('/follows/unfollow', { creatorId })
}

/** 获取我的关注列表 */
export function apiFollowList() {
  return request.get('/follows/')
}

/** 检查是否已关注某创作者 */
export function apiCheckFollow(creatorId) {
  return request.get(`/follows/check/${creatorId}`)
}
