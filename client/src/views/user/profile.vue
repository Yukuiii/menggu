<script setup>
/**
 * 个人中心页 - 用户信息展示、实名认证、账户管理
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores'
import { apiGetProfile, apiVerify } from '../../api/user'
import { apiWalletBalance } from '../../api/wallet'
import {
  Home, ChevronRight, User, Mail, Phone, Wallet, Shield,
  Settings, LogOut, Gem, ShoppingBag, ArrowRight, Edit3,
  CheckCircle, AlertCircle, Copy, Heart
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const copied = ref('')

const user = ref({
  nickname: '',
  email: '',
  phone: '',
  walletAddress: '',
  isVerified: false,
  realName: '',
  idCard: '',
  avatar: '',
  joinTime: '',
  stats: { collections: 0, orders: 0, totalSpent: 0 }
})

// 实名认证表单
const showVerify = ref(false)
const verifyForm = ref({ realName: '', idCard: '' })
const verifyLoading = ref(false)

/** 提交实名认证 */
const handleVerify = async () => {
  if (!verifyForm.value.realName || !verifyForm.value.idCard) return
  verifyLoading.value = true
  try {
    await apiVerify({
      realName: verifyForm.value.realName,
      idCard: verifyForm.value.idCard
    })
    user.value.isVerified = true
    user.value.realName = verifyForm.value.realName
    showVerify.value = false
  } finally {
    verifyLoading.value = false
  }
}

/** 复制钱包地址 */
const copyWallet = async () => {
  try { await navigator.clipboard.writeText(user.value.walletAddress); copied.value = 'wallet'; setTimeout(() => copied.value = '', 1500) } catch {}
}

/** 退出登录 */
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

const fetchProfile = async () => {
  const [profile, wallet] = await Promise.all([
    apiGetProfile(),
    apiWalletBalance()
  ])
  user.value = {
    ...user.value,
    nickname: profile.nickname || '',
    email: profile.email || '',
    phone: profile.phone || '',
    walletAddress: wallet.address || profile.walletAddress || '',
    isVerified: !!profile.isVerified,
    realName: profile.realName || '',
    idCard: profile.idCard || '',
    avatar: profile.avatar || '',
    joinTime: profile.createdAt ? profile.createdAt.slice(0, 10) : '',
    stats: { ...user.value.stats, totalSpent: 0 }
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="profile-page">

    <main class="page-main">
      <div class="main-inner">
        <!-- 用户卡片 -->
        <div class="user-card">
          <div class="user-avatar">
            <User :size="36" />
          </div>
          <div class="user-info">
            <h1 class="user-name">{{ user.nickname }}</h1>
            <p class="user-email"><Mail :size="14" /> {{ user.email }}</p>
            <p class="user-join">注册于 {{ user.joinTime }}</p>
          </div>
          <div class="user-stats">
            <div class="stat-item" @click="router.push('/my-collections')">
              <Gem :size="20" />
              <span class="stat-value">{{ user.stats.collections }}</span>
              <span class="stat-label">藏品</span>
            </div>
            <div class="stat-item" @click="router.push('/orders')">
              <ShoppingBag :size="20" />
              <span class="stat-value">{{ user.stats.orders }}</span>
              <span class="stat-label">订单</span>
            </div>
            <div class="stat-item">
              <Wallet :size="20" />
              <span class="stat-value">¥{{ user.stats.totalSpent }}</span>
              <span class="stat-label">累计消费</span>
            </div>
          </div>
        </div>

        <div class="content-grid">
          <!-- 左列 -->
          <div class="col-left">
            <!-- 账户信息 -->
            <section class="section">
              <h3 class="section-title"><Settings :size="18" /> 账户信息</h3>
              <div class="info-list">
                <div class="info-row">
                  <span class="info-label"><User :size="14" /> 昵称</span>
                  <span class="info-value">{{ user.nickname }}</span>
                  <button class="edit-btn"><Edit3 :size="13" /></button>
                </div>
                <div class="info-row">
                  <span class="info-label"><Mail :size="14" /> 邮箱</span>
                  <span class="info-value">{{ user.email }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label"><Phone :size="14" /> 手机</span>
                  <span class="info-value">{{ user.phone || '未绑定' }}</span>
                  <button class="edit-btn"><Edit3 :size="13" /></button>
                </div>
                <div class="info-row">
                  <span class="info-label"><Wallet :size="14" /> 钱包</span>
                  <span class="info-value mono">{{ user.walletAddress }}</span>
                  <button class="copy-btn" @click="copyWallet">
                    <Copy v-if="copied !== 'wallet'" :size="13" />
                    <CheckCircle v-else :size="13" class="copied" />
                  </button>
                </div>
              </div>
            </section>

            <!-- 退出 -->
            <button class="btn-logout" @click="handleLogout">
              <LogOut :size="16" />
              退出登录
            </button>
          </div>

          <!-- 右列 -->
          <div class="col-right">
            <!-- 实名认证 -->
            <section class="section">
              <h3 class="section-title"><Shield :size="18" /> 实名认证</h3>
              <div class="verify-body">
                <div v-if="user.isVerified" class="verify-done">
                  <CheckCircle :size="40" class="verify-icon-done" />
                  <h4>已完成实名认证</h4>
                  <p>{{ user.realName }}</p>
                </div>
                <div v-else-if="!showVerify" class="verify-prompt">
                  <AlertCircle :size="40" class="verify-icon-warn" />
                  <h4>尚未实名认证</h4>
                  <p>完成实名认证后可进行藏品购买与转赠</p>
                  <button class="btn-verify" @click="showVerify = true">
                    <Shield :size="14" /> 立即认证
                  </button>
                </div>
                <form v-else class="verify-form" @submit.prevent="handleVerify">
                  <div class="form-group">
                    <label class="form-label">真实姓名</label>
                    <input v-model="verifyForm.realName" type="text" placeholder="请输入真实姓名" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">身份证号</label>
                    <input v-model="verifyForm.idCard" type="text" placeholder="请输入身份证号" class="form-input" maxlength="18" />
                  </div>
                  <div class="verify-actions">
                    <button type="button" class="btn-cancel" @click="showVerify = false">取消</button>
                    <button type="submit" class="btn-submit" :disabled="verifyLoading || !verifyForm.realName || !verifyForm.idCard">
                      {{ verifyLoading ? '认证中...' : '提交认证' }}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <!-- 快捷入口 -->
            <section class="section">
              <h3 class="section-title"><ArrowRight :size="18" /> 快捷入口</h3>
              <div class="quick-links">
                <router-link to="/my-collections" class="quick-link">
                  <Gem :size="18" /><span>我的藏品</span><ArrowRight :size="14" class="ql-arrow" />
                </router-link>
                <router-link to="/orders" class="quick-link">
                  <ShoppingBag :size="18" /><span>我的订单</span><ArrowRight :size="14" class="ql-arrow" />
                </router-link>
                <router-link to="/follows" class="quick-link">
                  <Heart :size="18" /><span>我的关注</span><ArrowRight :size="14" class="ql-arrow" />
                </router-link>
                <router-link to="/market" class="quick-link">
                  <Gem :size="18" /><span>藏品市场</span><ArrowRight :size="14" class="ql-arrow" />
                </router-link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>


  </div>
</template>

<style scoped>
.profile-page {
  --accent: #C6893F; --accent-dark: #A97030; --accent-bg: #FFF8EE;
  --text-h: #1a1a2e; --text: #555; --text-light: #999;
  --bg: #FFFCF8; --bg-soft: #FFFAF4; --border: #f0ebe4;
  --card-bg: #fff; --radius: 16px;
  min-height: 100vh; background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.top-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,252,248,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { display: flex; align-items: center; }
.logo-img { width: 120px; height: 120px; object-fit: contain; }
.nav-links { display: flex; gap: 32px; }
.nav-link { font-size: 14px; color: var(--text); text-decoration: none; font-weight: 500; }
.nav-link:hover { color: var(--accent); }
.nav-actions { display: flex; gap: 10px; }
.btn-nav { display: inline-flex; padding: 8px 20px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; text-decoration: none; }

.page-main { padding: 32px 0 60px; }
.main-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

/* 用户卡片 */
.user-card { display: flex; align-items: center; gap: 24px; padding: 32px; background: linear-gradient(135deg, var(--accent), var(--accent-dark)); border-radius: var(--radius); color: #fff; margin-bottom: 28px; }
.user-avatar { width: 72px; height: 72px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.user-info { flex: 1; }
.user-name { font-size: 24px; font-weight: 800; margin: 0 0 6px; }
.user-email { font-size: 14px; margin: 0 0 2px; opacity: 0.85; display: flex; align-items: center; gap: 6px; }
.user-join { font-size: 12px; margin: 0; opacity: 0.6; }
.user-stats { display: flex; gap: 28px; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 12px 16px; border-radius: 10px; transition: background 0.2s; }
.stat-item:hover { background: rgba(255,255,255,0.1); }
.stat-value { font-size: 20px; font-weight: 800; }
.stat-label { font-size: 11px; opacity: 0.7; }

/* 双列 */
.content-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }

.section { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 20px; }
.section-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--text-h); margin: 0; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.section-title svg { color: var(--accent); }

/* 信息列表 */
.info-list { padding: 4px 0; }
.info-row { display: flex; align-items: center; gap: 12px; padding: 14px 20px; }
.info-row:not(:last-child) { border-bottom: 1px solid var(--border); }
.info-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-light); min-width: 80px; flex-shrink: 0; }
.info-label svg { color: var(--accent); }
.info-value { font-size: 13px; color: var(--text-h); font-weight: 500; flex: 1; word-break: break-all; }
.mono { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; }
.edit-btn { border: none; background: var(--bg-soft); border-radius: 6px; padding: 6px; cursor: pointer; color: var(--text-light); transition: all 0.2s; display: flex; flex-shrink: 0; }
.edit-btn:hover { color: var(--accent); background: var(--accent-bg); }
.copy-btn { border: none; background: var(--bg-soft); border-radius: 6px; padding: 6px; cursor: pointer; color: var(--text-light); transition: all 0.2s; display: flex; flex-shrink: 0; }
.copy-btn:hover { color: var(--accent); background: var(--accent-bg); }
.copied { color: #20C997; }

.btn-logout { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; border-radius: 10px; border: 1.5px solid #fcc; background: #fff5f5; color: #e03131; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-logout:hover { background: #fee; border-color: #e03131; }

/* 实名认证 */
.verify-body { padding: 24px 20px; }
.verify-done, .verify-prompt { text-align: center; }
.verify-icon-done { color: #20C997; margin-bottom: 12px; }
.verify-icon-warn { color: #FD7E14; margin-bottom: 12px; }
.verify-done h4, .verify-prompt h4 { font-size: 16px; font-weight: 700; color: var(--text-h); margin: 0 0 6px; }
.verify-done p, .verify-prompt p { font-size: 13px; color: var(--text-light); margin: 0 0 16px; }
.btn-verify { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-verify:hover { background: var(--accent-dark); }

.verify-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 600; color: var(--text-h); }
.form-input { width: 100%; padding: 10px 14px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 14px; color: var(--text-h); background: var(--bg-soft); outline: none; transition: all 0.2s; font-family: inherit; box-sizing: border-box; }
.form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(198,137,63,0.1); }
.form-input::placeholder { color: #ccc; }
.verify-actions { display: flex; gap: 10px; justify-content: flex-end; }
.btn-cancel { padding: 8px 20px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card-bg); font-size: 13px; font-weight: 500; color: var(--text); cursor: pointer; font-family: inherit; }
.btn-submit { padding: 8px 20px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

/* 快捷入口 */
.quick-links { padding: 4px 0; }
.quick-link { display: flex; align-items: center; gap: 12px; padding: 14px 20px; text-decoration: none; color: var(--text-h); font-size: 14px; font-weight: 500; transition: background 0.2s; }
.quick-link:not(:last-child) { border-bottom: 1px solid var(--border); }
.quick-link:hover { background: var(--bg-soft); }
.quick-link svg:first-child { color: var(--accent); }
.quick-link span { flex: 1; }
.ql-arrow { color: var(--text-light); }

.page-footer { text-align: center; padding: 32px 40px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-light); }
.page-footer p { margin: 0; }

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-inner, .main-inner { padding-left: 20px; padding-right: 20px; }
  .user-card { flex-wrap: wrap; }
  .user-stats { width: 100%; justify-content: space-around; margin-top: 12px; }
  .content-grid { grid-template-columns: 1fr; }
}
</style>
