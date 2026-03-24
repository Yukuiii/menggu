<script setup>
/**
 * 我的关注 - 展示用户关注的创作者列表，支持取消关注
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home, ChevronRight, Heart, User, UserCheck, Package,
  Users, ArrowRight
} from 'lucide-vue-next'
import { apiFollowList, apiUnfollow } from '../../api/follow'

const router = useRouter()
const follows = ref([])
const loading = ref(true)

/** 加载关注列表 */
const loadFollows = async () => {
  loading.value = true
  try {
    const data = await apiFollowList()
    follows.value = data || []
  } catch { /* 错误已由拦截器处理 */ }
  loading.value = false
}

/** 取消关注 */
const handleUnfollow = async (creatorId, index) => {
  try {
    await apiUnfollow(creatorId)
    follows.value.splice(index, 1)
  } catch { /* 错误已由拦截器处理 */ }
}

onMounted(loadFollows)
</script>

<template>
  <div class="follows-page">
    <!-- 面包屑 -->
    <div class="breadcrumb-bar">
      <div class="breadcrumb-inner">
        <router-link to="/" class="breadcrumb-item">
          <Home :size="14" /><span>首页</span>
        </router-link>
        <ChevronRight :size="14" class="breadcrumb-sep" />
        <router-link to="/profile" class="breadcrumb-item">个人中心</router-link>
        <ChevronRight :size="14" class="breadcrumb-sep" />
        <span class="breadcrumb-current">我的关注</span>
      </div>
    </div>

    <main class="page-main">
      <div class="main-inner">
        <h1 class="page-title"><Heart :size="28" /> 我的关注</h1>
        <p class="page-desc">你关注的创作者，第一时间获取他们的新藏品动态</p>

        <!-- 加载态 -->
        <div v-if="loading" class="loading">加载中...</div>

        <!-- 空态 -->
        <div v-else-if="follows.length === 0" class="empty">
          <Heart :size="48" class="empty-icon" />
          <h3>暂无关注</h3>
          <p>去藏品市场发现优秀的创作者吧</p>
          <button class="btn-go" @click="router.push('/market')">
            <ArrowRight :size="14" /> 浏览市场
          </button>
        </div>

        <!-- 关注列表 -->
        <div v-else class="follow-list">
          <div v-for="(item, index) in follows" :key="item.id" class="follow-card">
            <div class="fc-avatar">
              <User :size="24" />
            </div>
            <div class="fc-info">
              <h3 class="fc-name">{{ item.Creator?.name || '未知创作者' }}</h3>
              <p class="fc-intro">{{ item.Creator?.intro || '暂无简介' }}</p>
              <div class="fc-stats">
                <span class="fc-stat"><Package :size="13" /> {{ item.Creator?.worksCount || 0 }} 作品</span>
                <span class="fc-stat"><Users :size="13" /> {{ item.Creator?.fansCount || 0 }} 粉丝</span>
              </div>
            </div>
            <button class="btn-unfollow" @click="handleUnfollow(item.Creator?.id, index)">
              <UserCheck :size="14" />
              已关注
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.follows-page {
  --accent: #C6893F; --accent-dark: #A97030; --accent-bg: #FFF8EE;
  --text-h: #1a1a2e; --text: #555; --text-light: #999;
  --bg: #FFFCF8; --bg-soft: #FFFAF4; --border: #f0ebe4;
  --card-bg: #fff; --radius: 16px;
  min-height: 100vh; background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 面包屑 */
.breadcrumb-bar { border-bottom: 1px solid var(--border); background: var(--card-bg); }
.breadcrumb-inner { max-width: 1200px; margin: 0 auto; padding: 14px 40px; display: flex; align-items: center; gap: 6px; }
.breadcrumb-item { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-light); text-decoration: none; transition: color 0.2s; }
.breadcrumb-item:hover { color: var(--accent); }
.breadcrumb-sep { color: var(--text-light); opacity: 0.4; }
.breadcrumb-current { font-size: 13px; color: var(--text-h); font-weight: 500; }

.page-main { padding: 32px 0 60px; }
.main-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

.page-title { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 800; color: var(--text-h); margin: 0 0 8px; }
.page-title svg { color: var(--accent); }
.page-desc { font-size: 14px; color: var(--text); margin: 0 0 32px; }

/* 加载 */
.loading { text-align: center; padding: 60px 20px; font-size: 14px; color: var(--text-light); }

/* 空态 */
.empty { text-align: center; padding: 80px 20px; }
.empty-icon { color: var(--border); margin-bottom: 16px; }
.empty h3 { font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0 0 8px; }
.empty p { font-size: 14px; color: var(--text-light); margin: 0 0 24px; }
.btn-go { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.btn-go:hover { background: var(--accent-dark); }

/* 关注列表 */
.follow-list { display: flex; flex-direction: column; gap: 16px; }
.follow-card {
  display: flex; align-items: center; gap: 20px; padding: 20px 24px;
  background: var(--card-bg); border: 1px solid var(--border);
  border-radius: var(--radius); transition: all 0.2s;
}
.follow-card:hover { box-shadow: 0 4px 20px rgba(198,137,63,0.08); border-color: transparent; }

.fc-avatar {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--accent-bg); display: flex; align-items: center;
  justify-content: center; color: var(--accent); flex-shrink: 0;
}

.fc-info { flex: 1; min-width: 0; }
.fc-name { font-size: 16px; font-weight: 700; color: var(--text-h); margin: 0 0 4px; }
.fc-intro { font-size: 13px; color: var(--text); margin: 0 0 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fc-stats { display: flex; gap: 16px; }
.fc-stat { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-light); }
.fc-stat svg { color: var(--accent); }

.btn-unfollow {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 20px; border-radius: 8px; flex-shrink: 0;
  background: transparent; color: var(--text-light);
  border: 1.5px solid var(--border);
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.2s; font-family: inherit;
}
.btn-unfollow:hover { border-color: #e03131; color: #e03131; background: #fff5f5; }

@media (max-width: 768px) {
  .breadcrumb-inner, .main-inner { padding-left: 20px; padding-right: 20px; }
  .follow-card { flex-wrap: wrap; }
  .btn-unfollow { width: 100%; justify-content: center; margin-top: 8px; }
}
</style>
