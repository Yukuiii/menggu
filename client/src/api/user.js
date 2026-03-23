import request from './request'

/** 用户注册 */
export function apiRegister(data) {
  return request.post('/user/register', data)
}

/** 用户登录 */
export function apiLogin(data) {
  return request.post('/user/login', data)
}

/** 获取当前用户信息 */
export function apiGetProfile() {
  return request.get('/user/profile')
}

/** 实名认证 */
export function apiVerify(data) {
  return request.post('/user/verify', data)
}
