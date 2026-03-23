import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 用户状态管理 */
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  /** 设置登录令牌 */
  function setToken(val) {
    token.value = val
    localStorage.setItem('token', val)
  }

  /** 设置用户信息 */
  function setUserInfo(info) {
    userInfo.value = info
  }

  /** 清除登录状态 */
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, setToken, setUserInfo, logout }
})
