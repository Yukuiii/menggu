import request from './request'

/** 查询钱包余额 */
export function apiWalletBalance() {
  return request.get('/wallet/balance')
}

/** 模拟充值 */
export function apiRecharge(amount) {
  return request.post('/wallet/recharge', { amount })
}
