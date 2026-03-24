import request from './request'

/** 创建订单 */
export function apiCreateOrder(data) {
  return request.post('/orders', data)
}

/** 获取订单列表 */
export function apiOrderList(params) {
  return request.get('/orders', { params })
}

/** 获取订单详情 */
export function apiOrderDetail(id) {
  return request.get(`/orders/${id}`)
}

/** 支付订单 */
export function apiPayOrder(id) {
  return request.post(`/orders/${id}/pay`)
}
