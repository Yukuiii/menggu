<script setup>
/**
 * 登录页面 - 邮箱 + 密码登录，含表单校验与加载状态
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-vue-next'
import { apiLogin } from '../../api/user'
import { useUserStore } from '../../stores'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const form = ref({ email: '', password: '' })
// 登录角色
const loginRole = ref('user')
// 控制密码显隐
const showPassword = ref(false)
// 加载状态
const loading = ref(false)
// 错误信息
const error = ref('')

// 简单的邮箱格式校验
const emailValid = computed(() => !form.value.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
const canSubmit = computed(() => form.value.email && form.value.password.length >= 6)

/** 提交登录表单 */
const handleLogin = async () => {
  if (!canSubmit.value) return
  loading.value = true
  error.value = ''
  try {
    const data = await apiLogin({ email: form.value.email, password: form.value.password })
    // 校验角色是否匹配
    if (loginRole.value === 'admin' && data.user.role !== 'admin') {
      error.value = '该账号不是管理员'
      return
    }
    if (loginRole.value === 'user' && data.user.role === 'admin') {
      error.value = '管理员请选择管理员登录'
      return
    }
    userStore.loginSuccess(data)
    router.push(loginRole.value === 'admin' ? '/admin' : '/market')
  } catch (e) {
    error.value = e.message || '账号或密码错误，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>
    </div>

    <!-- 左侧品牌区 -->
    <div class="auth-brand">

      <div class="brand-content">
        <div class="brand-tag">蒙古族非遗数字藏品平台</div>
        <h1 class="brand-title">守护非遗，<br /><span class="brand-highlight">数字永恒</span></h1>
        <p class="brand-desc">链上存证 · 限量发行 · 自由流转，用数字技术让蒙古族服饰文化瑰宝永恒传承。</p>
        <div class="brand-stats">
          <div class="brand-stat">
            <div class="brand-stat-value">1,000+</div>
            <div class="brand-stat-label">数字藏品</div>
          </div>
          <div class="brand-stat-divider"></div>
          <div class="brand-stat">
            <div class="brand-stat-value">200+</div>
            <div class="brand-stat-label">非遗纹样</div>
          </div>
          <div class="brand-stat-divider"></div>
          <div class="brand-stat">
            <div class="brand-stat-value">10,000+</div>
            <div class="brand-stat-label">注册用户</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="auth-form-area">
      <div class="auth-card">
        <!-- 顶部切换 -->
        <div class="auth-tabs">
          <span class="auth-tab active">登录</span>
          <span class="auth-tab-divider">/</span>
          <router-link to="/register" class="auth-tab">注册</router-link>
        </div>

        <h2 class="auth-title">欢迎回来</h2>
        <p class="auth-subtitle">登录账号，探索蒙古族非遗数字藏品</p>

        <!-- 错误提示 -->
        <div v-if="error" class="auth-error">
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form" novalidate>
          <!-- 角色选择 -->
          <div class="role-switch">
            <label :class="['role-option', { active: loginRole === 'user' }]" @click="loginRole = 'user'">
              <span class="role-dot"></span>
              <span>用户登录</span>
            </label>
            <label :class="['role-option', { active: loginRole === 'admin' }]" @click="loginRole = 'admin'">
              <span class="role-dot"></span>
              <span>管理员登录</span>
            </label>
          </div>

          <!-- 邮箱 -->
          <div class="form-group" :class="{ 'has-error': form.email && !emailValid }">
            <label class="form-label">邮箱地址</label>
            <div class="form-input-wrap">
              <span class="form-icon"><Mail :size="16" /></span>
              <input
                id="login-email"
                v-model="form.email"
                type="email"
                placeholder="请输入邮箱"
                class="form-input"
                autocomplete="email"
              />
            </div>
            <span v-if="form.email && !emailValid" class="form-error-msg">请输入有效的邮箱地址</span>
          </div>

          <!-- 密码 -->
          <div class="form-group">
            <label class="form-label">
              密码
            </label>
            <div class="form-input-wrap">
              <span class="form-icon"><Lock :size="16" /></span>
              <input
                id="login-password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码（至少6位）"
                class="form-input"
                autocomplete="current-password"
              />
              <button type="button" class="form-eye" @click="showPassword = !showPassword">
                <Eye v-if="!showPassword" :size="16" />
                <EyeOff v-else :size="16" />
              </button>
            </div>
          </div>

          <!-- 提交按钮 -->
          <button
            id="login-submit"
            type="submit"
            class="btn-auth"
            :class="{ 'btn-loading': loading }"
            :disabled="!canSubmit || loading"
          >
            <span v-if="!loading" class="btn-inner">
              登录账号
              <ArrowRight :size="16" />
            </span>
            <span v-else class="loading-dots">
              <span></span><span></span><span></span>
            </span>
          </button>
        </form>

        <!-- 分割线 -->
        <div class="auth-divider"><span>或</span></div>



        <p class="auth-footer-text">
          还没有账号？
          <router-link to="/register" class="auth-link">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 页面布局 ===== */
.auth-page {
  min-height: 100svh;
  display: flex;
  position: relative;
  overflow: hidden;
  background: #fff;
}

/* 背景装饰气泡 */
.bg-decoration { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}
.blob-1 {
  width: 500px; height: 500px;
  background: #C6893F;
  top: -150px; left: -100px;
}
.blob-2 {
  width: 400px; height: 400px;
  background: #E2B97F;
  bottom: -100px; left: 300px;
}
.blob-3 {
  width: 300px; height: 300px;
  background: #A97030;
  top: 50%; right: -50px;
}

/* ===== 左侧品牌区 ===== */
.auth-brand {
  flex: 0 0 480px;
  background: linear-gradient(160deg, #C6893F 0%, #A97030 60%, #8A5A24 100%);
  padding: 48px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.auth-brand::after {
  content: '';
  position: absolute;
  bottom: -80px; right: -80px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 60px;
}

.brand-logo-img {
  width: 36px; height: 36px;
  border-radius: 8px;
  object-fit: cover;
}

.brand-logo-text { letter-spacing: -0.5px; }

.brand-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  margin-bottom: 20px;
}

.brand-title {
  font-size: 42px;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  letter-spacing: -0.5px;
  margin-bottom: 20px;
}

.brand-highlight {
  position: relative;
  display: inline-block;
}

.brand-highlight::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 0; right: 0;
  height: 3px;
  background: rgba(255,255,255,0.4);
  border-radius: 2px;
}

.brand-desc {
  font-size: 15px;
  line-height: 1.8;
  color: rgba(255,255,255,0.7);
  margin-bottom: 40px;
  max-width: 340px;
}

.brand-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand-stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
}

.brand-stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  margin-top: 2px;
}

.brand-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.2);
}

/* ===== 右侧表单区 ===== */
.auth-form-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.auth-card {
  width: 100%;
  max-width: 420px;
}

.auth-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 32px;
}

.auth-tab {
  font-size: 14px;
  font-weight: 600;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s;
  text-decoration: none;
}

.auth-tab.active { color: #C6893F; }
.auth-tab:not(.active):hover { color: #888; }

.auth-tab-divider {
  color: #ddd;
  font-size: 14px;
}

.auth-title {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.auth-subtitle {
  font-size: 14px;
  color: #999;
  margin-bottom: 32px;
}

/* 错误提示 */
.auth-error {
  background: #fff5f5;
  border: 1px solid #fcc;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: #e03131;
  margin-bottom: 20px;
}

/* 表单 */
.auth-form { display: flex; flex-direction: column; gap: 20px; }

/* 角色切换 */
.role-switch {
  display: flex;
  gap: 12px;
}
.role-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1.5px solid #f0ebe4;
  border-radius: 10px;
  background: #FFFAF4;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  color: #999;
}
.role-option:hover {
  border-color: #C6893F;
  color: #1a1a2e;
}
.role-option.active {
  border-color: #C6893F;
  background: #FFF8EE;
  color: #C6893F;
  font-weight: 600;
}
.role-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ddd;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;
}
.role-option.active .role-dot {
  border-color: #C6893F;
}
.role-option.active .role-dot::after {
  content: '';
  position: absolute;
  top: 2.5px; left: 2.5px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #C6893F;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.has-error .form-input { border-color: #e03131; }

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label-link {
  font-size: 12px;
  font-weight: 500;
  color: #C6893F;
  text-decoration: none;
}
.form-label-link:hover { text-decoration: underline; }

.form-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.form-icon {
  position: absolute;
  left: 14px;
  color: #bbb;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 14px 12px 42px;
  border: 1.5px solid #f0ebe4;
  border-radius: 10px;
  font-size: 14px;
  color: #1a1a2e;
  background: #FFFAF4;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input::placeholder { color: #ccc; }

.form-input:focus {
  border-color: #C6893F;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(198,137,63,0.1);
}

.form-eye {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: #bbb;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}
.form-eye:hover { color: #C6893F; }

.form-error-msg {
  font-size: 12px;
  color: #e03131;
}

/* 提交按钮 */
.btn-auth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  background: #C6893F;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 4px;
  font-family: inherit;
}

.btn-auth:hover:not(:disabled) {
  background: #A97030;
  box-shadow: 0 8px 25px rgba(198,137,63,0.35);
  transform: translateY(-1px);
}

.btn-inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 加载点动画 */
.loading-dots { display: flex; gap: 6px; align-items: center; }
.loading-dots span {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: dot-pulse 1.2s ease-in-out infinite;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* 分割线 */
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
  color: #ddd;
  font-size: 13px;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eef0f5;
}

/* 第三方按钮 */
.social-btns { display: flex; gap: 12px; flex-direction: column; }
.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border: 1.5px solid #eef0f5;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.social-btn:hover {
  border-color: #C6893F;
  background: #FFFAF4;
}

/* 底部文字 */
.auth-footer-text {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-top: 24px;
}

.auth-link {
  color: #C6893F;
  font-weight: 600;
  text-decoration: none;
}
.auth-link:hover { text-decoration: underline; }

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .auth-brand { display: none; }
  .auth-form-area { padding: 24px 20px; }
  .auth-card { max-width: 100%; }
}
</style>
