<script setup>
/**
 * 注册页面 - 新用户邮箱注册，含表单校验、密码强度检测与服务条款
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-vue-next'
import { apiRegister } from '../../api/user'

const router = useRouter()

// 表单数据
const form = ref({ name: '', email: '', password: '', confirm: '' })
// 控制密码显隐
const showPassword = ref(false)
const showConfirm = ref(false)
// 同意条款
const agreed = ref(false)
// 加载状态
const loading = ref(false)
// 错误信息
const error = ref('')
// 提交成功状态
const success = ref(false)

// 邮箱校验
const emailValid = computed(() => !form.value.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))

// 密码强度计算（0~3：弱/中/强）
const passwordStrength = computed(() => {
    const p = form.value.password
    if (!p) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
})

const strengthLabel = computed(() => ['', '强度：弱', '强度：中', '强度：强'][passwordStrength.value])
const strengthColor = computed(() => ['', '#e03131', '#FD7E14', '#20C997'][passwordStrength.value])

// 密码一致性校验
const confirmMatch = computed(() => !form.value.confirm || form.value.confirm === form.value.password)

// 提交条件：所有字段有值 + 格式正确 + 同意条款
const canSubmit = computed(() =>
    form.value.name.trim() &&
    form.value.email && emailValid.value &&
    form.value.password.length >= 6 &&
    confirmMatch.value && form.value.confirm &&
    agreed.value
)

/** 提交注册表单 */
const handleRegister = async () => {
    if (!canSubmit.value) return
    loading.value = true
    error.value = ''
    try {
        await apiRegister({
            email: form.value.email,
            password: form.value.password,
            nickname: form.value.name.trim()
        })
        success.value = true
        setTimeout(() => router.push('/login'), 2000)
    } catch (e) {
        error.value = e.message || '注册失败，该邮箱可能已注册'
    } finally {
        loading.value = false
    }
}

// 注册福利列表
const perks = [
    '免费浏览 1,000+ 数字藏品',
    '高颅的链上相册与协议',
    '支持藏品流转与转赠',
    '永久收藏，历史游览可查',
]
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
                <h1 class="brand-title">加入我们，<br /><span class="brand-highlight">收藏非遗</span></h1>
                <p class="brand-desc">免费注册即可浏览全部藏品，每一件都是中华民族文化的独特购藏。</p>
                <!-- 特权列表 -->
                <ul class="brand-perks">
                    <li v-for="perk in perks" :key="perk" class="brand-perk">
                        <CheckCircle :size="16" color="#4ade80" />
                        <span>{{ perk }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 右侧表单区 -->
        <div class="auth-form-area">
            <!-- 成功状态 -->
            <div v-if="success" class="success-state">
                <div class="success-icon">
                    <CheckCircle :size="48" color="#C6893F" />
                </div>
                <h2 class="success-title">注册成功！</h2>
                <p class="success-desc">正在跳转到登录页面...</p>
            </div>

            <div v-else class="auth-card">
                <!-- 顶部切换 -->
                <div class="auth-tabs">
                    <router-link to="/login" class="auth-tab">登录</router-link>
                    <span class="auth-tab-divider">/</span>
                    <span class="auth-tab active">注册</span>
                </div>

                <h2 class="auth-title">创建账号</h2>
                <p class="auth-subtitle">开启你的蒙古族非遗收藏之旅</p>

                <!-- 错误提示 -->
                <div v-if="error" class="auth-error">{{ error }}</div>

                <form @submit.prevent="handleRegister" class="auth-form" novalidate>
                    <!-- 姓名 -->
                    <div class="form-group">
                        <label class="form-label">姓名 / 昵称</label>
                        <div class="form-input-wrap">
                            <span class="form-icon">
                                <User :size="16" />
                            </span>
                            <input id="reg-name" v-model="form.name" type="text" placeholder="你的姓名或昵称"
                                class="form-input" autocomplete="name" />
                        </div>
                    </div>

                    <!-- 邮箱 -->
                    <div class="form-group" :class="{ 'has-error': form.email && !emailValid }">
                        <label class="form-label">邮箱地址</label>
                        <div class="form-input-wrap">
                            <span class="form-icon">
                                <Mail :size="16" />
                            </span>
                            <input id="reg-email" v-model="form.email" type="email" placeholder="请输入邮箱"
                                class="form-input" autocomplete="email" />
                        </div>
                        <span v-if="form.email && !emailValid" class="form-error-msg">请输入有效的邮箱地址</span>
                    </div>

                    <!-- 密码 -->
                    <div class="form-group">
                        <label class="form-label">设置密码</label>
                        <div class="form-input-wrap">
                            <span class="form-icon">
                                <Lock :size="16" />
                            </span>
                            <input id="reg-password" v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                placeholder="至少6位，建议包含大写字母和数字" class="form-input" autocomplete="new-password" />
                            <button type="button" class="form-eye" @click="showPassword = !showPassword">
                                <Eye v-if="!showPassword" :size="16" />
                                <EyeOff v-else :size="16" />
                            </button>
                        </div>
                        <!-- 密码强度条 -->
                        <div v-if="form.password" class="strength-bar">
                            <div class="strength-track">
                                <div class="strength-fill"
                                    :style="{ width: (passwordStrength / 3 * 100) + '%', background: strengthColor }">
                                </div>
                            </div>
                            <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
                        </div>
                    </div>

                    <!-- 确认密码 -->
                    <div class="form-group" :class="{ 'has-error': form.confirm && !confirmMatch }">
                        <label class="form-label">确认密码</label>
                        <div class="form-input-wrap">
                            <span class="form-icon">
                                <Lock :size="16" />
                            </span>
                            <input id="reg-confirm" v-model="form.confirm" :type="showConfirm ? 'text' : 'password'"
                                placeholder="再次输入密码" class="form-input" autocomplete="new-password" />
                            <button type="button" class="form-eye" @click="showConfirm = !showConfirm">
                                <Eye v-if="!showConfirm" :size="16" />
                                <EyeOff v-else :size="16" />
                            </button>
                        </div>
                        <span v-if="form.confirm && !confirmMatch" class="form-error-msg">两次输入的密码不一致</span>
                    </div>

                    <!-- 服务条款 -->
                    <label class="agree-row" for="reg-agree">
                        <input id="reg-agree" v-model="agreed" type="checkbox" class="agree-checkbox" />
                        <span class="agree-text">
                            我已阅读并同意
                            <a href="#" class="auth-link">服务条款</a>
                            与
                            <a href="#" class="auth-link">隐私政策</a>
                        </span>
                    </label>

                    <!-- 提交按钮 -->
                    <button id="reg-submit" type="submit" class="btn-auth" :class="{ 'btn-loading': loading }"
                        :disabled="!canSubmit || loading">
                        <span v-if="!loading" class="btn-inner">
                            立即注册
                            <ArrowRight :size="16" />
                        </span>
                        <span v-else class="loading-dots">
                            <span></span><span></span><span></span>
                        </span>
                    </button>
                </form>

                <p class="auth-footer-text">
                    已有账号？
                    <router-link to="/login" class="auth-link">直接登录</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ===== 页面布局（与 Login.vue 复用相同基础结构） ===== */
.auth-page {
    min-height: 100svh;
    display: flex;
    position: relative;
    overflow: hidden;
    background: #fff;
}

.bg-decoration {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.bg-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.12;
}

.blob-1 {
    width: 500px;
    height: 500px;
    background: #C6893F;
    top: -150px;
    left: -100px;
}

.blob-2 {
    width: 400px;
    height: 400px;
    background: #E2B97F;
    bottom: -100px;
    left: 300px;
}

.blob-3 {
    width: 300px;
    height: 300px;
    background: #A97030;
    top: 50%;
    right: -50px;
}

/* 左侧品牌 */
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
    bottom: -80px;
    right: -80px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
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
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
}

.brand-logo-text {
    letter-spacing: -0.5px;
}

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
    color: rgba(255, 255, 255, 0.6);
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
    bottom: 2px;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 2px;
}

.brand-desc {
    font-size: 15px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 28px;
    max-width: 340px;
}

/* 特权列表 */
.brand-perks {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.brand-perk {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
}

/* 右侧 */
.auth-form-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    z-index: 1;
}

/* 成功状态 */
.success-state {
    text-align: center;
}

.success-icon {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    background: rgba(198, 137, 63, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scale-in {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.success-title {
    font-size: 24px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 8px;
}

.success-desc {
    font-size: 14px;
    color: #999;
}

.auth-card {
    width: 100%;
    max-width: 440px;
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

.auth-tab.active {
    color: #C6893F;
}

.auth-tab:not(.active):hover {
    color: #888;
}

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
    margin-bottom: 28px;
}

.auth-error {
    background: #fff5f5;
    border: 1px solid #fcc;
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: #e03131;
    margin-bottom: 20px;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group.has-error .form-input {
    border-color: #e03131;
}

.form-label {
    font-size: 13px;
    font-weight: 600;
    color: #1a1a2e;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

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

.form-input::placeholder {
    color: #ccc;
}

.form-input:focus {
    border-color: #C6893F;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(198, 137, 63, 0.1);
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

.form-eye:hover {
    color: #C6893F;
}

.form-error-msg {
    font-size: 12px;
    color: #e03131;
}

/* 密码强度条 */
.strength-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
}

.strength-track {
    flex: 1;
    height: 4px;
    background: #f0ebe4;
    border-radius: 2px;
    overflow: hidden;
}

.strength-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s ease, background 0.3s ease;
}

.strength-label {
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

/* 服务条款 */
.agree-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
}

.agree-checkbox {
    width: 16px;
    height: 16px;
    margin-top: 2px;
    accent-color: #C6893F;
    cursor: pointer;
    flex-shrink: 0;
}

.agree-text {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
}

.auth-link {
    color: #C6893F;
    font-weight: 600;
    text-decoration: none;
}

.auth-link:hover {
    text-decoration: underline;
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
    box-shadow: 0 8px 25px rgba(198, 137, 63, 0.35);
    transform: translateY(-1px);
}

.btn-auth:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-inner {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.loading-dots {
    display: flex;
    gap: 6px;
    align-items: center;
}

.loading-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
    animation: dot-pulse 1.2s ease-in-out infinite;
}

.loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes dot-pulse {

    0%,
    80%,
    100% {
        transform: scale(0.6);
        opacity: 0.5;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
}

.auth-footer-text {
    text-align: center;
    font-size: 14px;
    color: #999;
    margin-top: 20px;
}

/* 响应式 */
@media (max-width: 900px) {
    .auth-brand {
        display: none;
    }

    .auth-form-area {
        padding: 24px 20px;
    }

    .auth-card {
        max-width: 100%;
    }
}
</style>
