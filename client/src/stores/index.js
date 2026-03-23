import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiGetProfile } from '../api/user'

/** 用户状态管理 */
export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)

  /** 设置登录令牌并持久化 */
  function setToken(val) {
    token.value = val
    localStorage.setItem('token', val)
  }

  /** 设置用户信息 */
  function setUserInfo(info) {
    userInfo.value = info
  }

  /** 登录成功后同时保存 token 和用户信息 */
  function loginSuccess(data) {
    setToken(data.token)
    setUserInfo(data.user)
  }

  /** 拉取当前登录用户的最新信息 */
  async function fetchProfile() {
    if (!token.value) return
    const user = await apiGetProfile()
    setUserInfo(user)
  }

  /** 退出登录，清除所有状态 */
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return { token, userInfo, setToken, setUserInfo, loginSuccess, fetchProfile, logout }
})
