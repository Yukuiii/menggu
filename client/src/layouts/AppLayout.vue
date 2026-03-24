<script setup>
/**
 * 应用布局 - 除首页外所有页面共用的导航栏 + 页脚
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores'
import { Menu, X, User, LogOut } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const navOpen = ref(false)

/** 是否已登录 */
const isLoggedIn = computed(() => !!userStore.token)

/** 退出登录 */
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-layout">
    <!-- 顶部导航 -->
    <nav class="app-nav">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">
          <img src="../assets/logo.png" alt="蒙服饰" class="logo-img" />
        </router-link>

        <!-- 桌面端菜单 -->
        <div class="nav-links">
          <router-link to="/market" class="nav-link">藏品市场</router-link>
          <router-link to="/my-collections" class="nav-link">我的藏品</router-link>
          <router-link to="/orders" class="nav-link">我的订单</router-link>
          <router-link to="/creator" class="nav-link">创作者</router-link>
        </div>

        <!-- 右侧操作 -->
        <div class="nav-actions">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="btn-nav-user">
              <User :size="16" />
              <span>{{ userStore.userInfo?.nickname || '个人中心' }}</span>
            </router-link>
            <button class="btn-nav-logout" @click="handleLogout">
              <LogOut :size="16" />
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-nav-outline">登录</router-link>
            <router-link to="/register" class="btn-nav-primary">注册</router-link>
          </template>
        </div>

        <!-- 移动端汉堡 -->
        <button class="nav-toggle" @click="navOpen = !navOpen">
          <Menu v-if="!navOpen" :size="22" />
          <X v-else :size="22" />
        </button>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="navOpen" class="nav-mobile">
        <router-link to="/market" class="nav-mobile-link" @click="navOpen = false">藏品市场</router-link>
        <router-link to="/my-collections" class="nav-mobile-link" @click="navOpen = false">我的藏品</router-link>
        <router-link to="/orders" class="nav-mobile-link" @click="navOpen = false">我的订单</router-link>
        <router-link to="/creator" class="nav-mobile-link" @click="navOpen = false">创作者</router-link>
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="nav-mobile-link" @click="navOpen = false">个人中心</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-nav-primary mobile-btn" @click="navOpen = false">登录 / 注册</router-link>
        </template>
      </div>
    </nav>

    <!-- 页面内容插槽 -->
    <main class="app-content">
      <router-view />
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <p>© 2026 蒙古服饰非遗数字藏品平台. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  --accent: #C6893F;
  --accent-dark: #A97030;
  --accent-bg: #FFF8EE;
  --text-h: #1a1a2e;
  --text: #555;
  --text-light: #999;
  --bg: #FFFCF8;
  --border: #f0ebe4;
  --card-bg: #fff;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===== 导航栏 ===== */
.app-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 252, 248, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.logo-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  font-size: 14px;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;
  padding: 4px 0;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--accent);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
}

/* 右侧操作 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-nav-outline {
  display: inline-flex;
  align-items: center;
  padding: 7px 18px;
  border-radius: 8px;
  background: transparent;
  color: var(--text-h);
  font-size: 13px;
  font-weight: 500;
  border: 1.5px solid var(--border);
  text-decoration: none;
  transition: all 0.2s;
}
.btn-nav-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-nav-primary {
  display: inline-flex;
  align-items: center;
  padding: 8px 22px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-nav-primary:hover {
  background: var(--accent-dark);
}

.btn-nav-user {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 8px;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-nav-user:hover {
  background: var(--accent);
  color: #fff;
}

.btn-nav-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: transparent;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-nav-logout:hover {
  border-color: #e03131;
  color: #e03131;
  background: #fff5f5;
}

/* 移动端 */
.nav-toggle {
  display: none;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-h);
}

.nav-mobile {
  display: none;
  flex-direction: column;
  padding: 12px 20px 16px;
  border-top: 1px solid var(--border);
  background: var(--card-bg);
}

.nav-mobile-link {
  padding: 12px 0;
  font-size: 14px;
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid var(--border);
}
.nav-mobile-link:hover {
  color: var(--accent);
}

.mobile-btn {
  margin-top: 8px;
  text-align: center;
  display: block;
}

/* ===== 内容区 ===== */
.app-content {
  flex: 1;
}

/* ===== 页脚 ===== */
.app-footer {
  text-align: center;
  padding: 32px 40px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-light);
}
.app-footer p {
  margin: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .nav-links,
  .nav-actions {
    display: none;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-mobile {
    display: flex;
  }

  .nav-inner {
    padding: 0 20px;
  }
}
</style>
