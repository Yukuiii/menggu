<script setup>
/**
 * 站内信页面 - 展示用户的系统通知并支持标记已读
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home, ChevronRight, Bell, CheckCheck, Package, Shield, MessageSquare, ArrowRight, Gift
} from 'lucide-vue-next'
import {
  apiNotificationList,
  apiNotificationMarkAllRead,
  apiNotificationMarkRead
} from '../../api/notification'

const router = useRouter()
const loading = ref(true)
const notifications = ref([])

/** 获取通知类型对应图标 */
const getTypeIcon = (type) => {
  const map = {
    purchase: Package,
    gift: Gift,
    audit: Shield,
    system: MessageSquare,
    sale: Bell
  }
  return map[type] || Bell
}

/** 获取通知类型对应文案 */
const getTypeLabel = (type) => {
  const map = {
    purchase: '购买通知',
    gift: '转赠通知',
    audit: '审核通知',
    system: '系统通知',
    sale: '发售通知'
  }
  return map[type] || '站内信'
}

/** 是否存在未读站内信 */
const hasUnread = computed(() => notifications.value.some((item) => !item.isRead))

/** 派发站内信状态更新事件 */
const emitNotificationsUpdated = () => {
  window.dispatchEvent(new CustomEvent('notifications-updated'))
}

/** 加载站内信列表 */
const loadNotifications = async () => {
  loading.value = true
  try {
    const data = await apiNotificationList({ page: 1, limit: 100 })
    notifications.value = data.list || []
  } catch {
    notifications.value = []
  } finally {
    loading.value = false
  }
}

/** 标记单条站内信为已读 */
const handleMarkRead = async (item) => {
  if (item.isRead) return
  await apiNotificationMarkRead(item.id)
  item.isRead = true
  emitNotificationsUpdated()
}

/** 将全部站内信标记为已读 */
const handleMarkAllRead = async () => {
  if (!hasUnread.value) return
  await apiNotificationMarkAllRead()
  notifications.value.forEach((item) => {
    item.isRead = true
  })
  emitNotificationsUpdated()
}

onMounted(loadNotifications)
</script>

<template>
  <div class="notifications-page">
    <div class="breadcrumb-bar">
      <div class="breadcrumb-inner">
        <router-link to="/" class="breadcrumb-item">
          <Home :size="14" /><span>首页</span>
        </router-link>
        <ChevronRight :size="14" class="breadcrumb-sep" />
        <router-link to="/profile" class="breadcrumb-item">个人中心</router-link>
        <ChevronRight :size="14" class="breadcrumb-sep" />
        <span class="breadcrumb-current">站内信</span>
      </div>
    </div>

    <main class="page-main">
      <div class="main-inner">
        <div class="page-header">
          <div>
            <h1 class="page-title"><Bell :size="28" /> 站内信</h1>
            <p class="page-desc">系统通知、购买结果、审核结果与转赠动态都会在这里展示</p>
          </div>
          <button class="btn-read-all" :disabled="!hasUnread" @click="handleMarkAllRead">
            <CheckCheck :size="16" />
            全部已读
          </button>
        </div>

        <div v-if="loading" class="loading">加载中...</div>

        <div v-else-if="notifications.length === 0" class="empty">
          <Bell :size="48" class="empty-icon" />
          <h3>暂无站内信</h3>
          <p>后续购买、审核或系统消息会在这里通知你</p>
          <button class="btn-go" @click="router.push('/market')">
            <ArrowRight :size="14" /> 浏览市场
          </button>
        </div>

        <div v-else class="notification-list">
          <button
            v-for="item in notifications"
            :key="item.id"
            :class="['notification-card', { unread: !item.isRead }]"
            @click="handleMarkRead(item)"
          >
            <div class="nc-icon">
              <component :is="getTypeIcon(item.type)" :size="20" />
            </div>
            <div class="nc-body">
              <div class="nc-header">
                <div class="nc-title-row">
                  <span class="nc-title">{{ item.title }}</span>
                  <span class="nc-tag">{{ getTypeLabel(item.type) }}</span>
                  <span v-if="!item.isRead" class="nc-dot"></span>
                </div>
                <span class="nc-time">{{ item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN') : '-' }}</span>
              </div>
              <p class="nc-content">{{ item.content }}</p>
            </div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.notifications-page {
  --accent: #C6893F; --accent-dark: #A97030; --accent-bg: #FFF8EE;
  --text-h: #1a1a2e; --text: #555; --text-light: #999;
  --bg: #FFFCF8; --bg-soft: #FFFAF4; --border: #f0ebe4;
  --card-bg: #fff; --radius: 16px;
  min-height: 100vh; background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.breadcrumb-bar { border-bottom: 1px solid var(--border); background: var(--card-bg); }
.breadcrumb-inner { max-width: 1200px; margin: 0 auto; padding: 14px 40px; display: flex; align-items: center; gap: 6px; }
.breadcrumb-item { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-light); text-decoration: none; transition: color 0.2s; }
.breadcrumb-item:hover { color: var(--accent); }
.breadcrumb-sep { color: var(--text-light); opacity: 0.4; }
.breadcrumb-current { font-size: 13px; color: var(--text-h); font-weight: 500; }

.page-main { padding: 32px 0 60px; }
.main-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 32px;
}
.page-title { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 800; color: var(--text-h); margin: 0 0 8px; }
.page-title svg { color: var(--accent); }
.page-desc { font-size: 14px; color: var(--text); margin: 0; }

.btn-read-all {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 18px; border-radius: 8px;
  border: 1.5px solid var(--border); background: var(--card-bg);
  color: var(--text-h); font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}
.btn-read-all:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}
.btn-read-all:disabled { opacity: 0.5; cursor: not-allowed; }

.loading { text-align: center; padding: 60px 20px; font-size: 14px; color: var(--text-light); }

.empty { text-align: center; padding: 80px 20px; }
.empty-icon { color: var(--border); margin-bottom: 16px; }
.empty h3 { font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0 0 8px; }
.empty p { font-size: 14px; color: var(--text-light); margin: 0 0 24px; }
.btn-go {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 24px; border-radius: 8px;
  background: var(--accent); color: #fff;
  font-size: 14px; font-weight: 600; border: none;
  cursor: pointer; font-family: inherit; transition: all 0.2s;
}
.btn-go:hover { background: var(--accent-dark); }

.notification-list { display: flex; flex-direction: column; gap: 16px; }
.notification-card {
  display: flex; gap: 18px; width: 100%; padding: 20px 24px;
  background: var(--card-bg); border: 1px solid var(--border);
  border-radius: var(--radius); text-align: left; cursor: pointer;
  transition: all 0.2s; font-family: inherit;
}
.notification-card:hover { box-shadow: 0 4px 20px rgba(198,137,63,0.08); border-color: transparent; }
.notification-card.unread { border-color: rgba(198,137,63,0.35); background: linear-gradient(180deg, #fffdf9 0%, #fff 100%); }

.nc-icon {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--accent-bg); color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.nc-body { flex: 1; min-width: 0; }
.nc-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 8px;
}
.nc-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.nc-title { font-size: 16px; font-weight: 700; color: var(--text-h); }
.nc-tag {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 999px;
  background: var(--bg-soft); color: var(--text-light);
  font-size: 11px; font-weight: 600;
}
.nc-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #e03131;
}
.nc-time { font-size: 12px; color: var(--text-light); white-space: nowrap; }
.nc-content { font-size: 14px; line-height: 1.7; color: var(--text); margin: 0; }

@media (max-width: 768px) {
  .breadcrumb-inner, .main-inner { padding-left: 20px; padding-right: 20px; }
  .page-header, .nc-header { flex-direction: column; }
  .btn-read-all { width: 100%; justify-content: center; }
  .notification-card { padding: 18px; }
}
</style>
