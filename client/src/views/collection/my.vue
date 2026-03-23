<script setup>
/**
 * 我的藏品页 - 展示用户持有的全部数字藏品
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home, ChevronRight, Gem, Grid3x3, List, Search, X,
  ArrowRight, Hash, Calendar, Gift, ExternalLink
} from 'lucide-vue-next'
import coverImg from '../../assets/衣服1.jpeg'

const router = useRouter()
const searchQuery = ref('')
const viewMode = ref('grid') // grid | list

// 模拟已购藏品
const myCollections = ref([
  {
    id: 1, name: '蒙古长袍·苍穹蓝', cover: coverImg,
    seriesName: '草原华裳', creator: '额尔敦工作室',
    tokenId: 327, purchaseTime: '2026-03-20 10:00:32',
    price: 99.00, chainHash: '0xa3f7c8d92e4b1056f8c5e7d3a9b0c1d4'
  },
  {
    id: 5, name: '卷草纹·金丝绣', cover: coverImg,
    seriesName: '草原纹语', creator: '乌兰花刺绣坊',
    tokenId: 156, purchaseTime: '2026-03-19 14:22:10',
    price: 79.00, chainHash: '0xb4e8d9f03f5c2167a9d6f8e4bac1d2e5'
  },
  {
    id: 9, name: '毡房制作全记录', cover: coverImg,
    seriesName: '匠心传承', creator: '巴特尔大师',
    tokenId: 201, purchaseTime: '2026-03-17 08:15:44',
    price: 49.00, chainHash: '0xc5f9eaf14a6d3278bad7a9f5cbc2d3e6'
  },
  {
    id: 10, name: '蒙古头饰·珊瑚冠', cover: coverImg,
    seriesName: '头上风华', creator: '草原数字',
    tokenId: 42, purchaseTime: '2026-03-22 11:30:05',
    price: 169.00, chainHash: '0xd6a0fbb25b7e4389cbe8b0a6dcd3e4f7'
  }
])

/** 搜索过滤 */
const filtered = computed(() => {
  if (!searchQuery.value) return myCollections.value
  const q = searchQuery.value.toLowerCase()
  return myCollections.value.filter(i =>
    i.name.toLowerCase().includes(q) || i.creator.toLowerCase().includes(q)
  )
})

/** 总资产估值 */
const totalValue = computed(() =>
  myCollections.value.reduce((sum, i) => sum + i.price, 0)
)
</script>

<template>
  <div class="my-page">

    <!-- 头部 -->
    <header class="page-header">
      <div class="header-inner">
        <div class="breadcrumb">
          <router-link to="/" class="bc-item"><Home :size="14" /><span>首页</span></router-link>
          <ChevronRight :size="14" class="bc-sep" />
          <span class="bc-current">我的藏品</span>
        </div>
        <div class="header-row">
          <div>
            <h1 class="page-title"><Gem :size="28" /> 我的藏品</h1>
            <p class="page-desc">共持有 <strong>{{ myCollections.length }}</strong> 件藏品，总估值 <strong>¥{{ totalValue.toFixed(2) }}</strong></p>
          </div>
        </div>
        <!-- 搜索 + 视图切换 -->
        <div class="toolbar">
          <div class="search-bar">
            <Search :size="16" class="search-icon" />
            <input v-model="searchQuery" placeholder="搜索藏品名称或创作者..." class="search-input" />
            <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''"><X :size="14" /></button>
          </div>
          <div class="view-toggle">
            <button :class="['toggle-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'"><Grid3x3 :size="16" /></button>
            <button :class="['toggle-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'"><List :size="16" /></button>
          </div>
        </div>
      </div>
    </header>

    <!-- 内容 -->
    <main class="page-main">
      <div class="main-inner">
        <!-- 网格视图 -->
        <div v-if="filtered.length && viewMode === 'grid'" class="grid-view">
          <div v-for="item in filtered" :key="item.id" class="card" @click="router.push(`/my-collection/${item.id}`)">
            <div class="card-cover">
              <img :src="item.cover" :alt="item.name" class="card-img" />
              <div class="card-token">#{{ item.tokenId }}</div>
            </div>
            <div class="card-body">
              <div class="card-series">{{ item.seriesName }}</div>
              <h3 class="card-name">{{ item.name }}</h3>
              <p class="card-creator">{{ item.creator }}</p>
              <div class="card-footer">
                <span class="card-price">¥{{ item.price.toFixed(2) }}</span>
                <button class="card-btn"><Gift :size="13" /> 转赠</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-if="filtered.length && viewMode === 'list'" class="list-view">
          <div v-for="item in filtered" :key="item.id" class="list-item" @click="router.push(`/my-collection/${item.id}`)">
            <img :src="item.cover" :alt="item.name" class="list-img" />
            <div class="list-info">
              <div class="list-series">{{ item.seriesName }}</div>
              <h3 class="list-name">{{ item.name }}</h3>
              <p class="list-creator">{{ item.creator }}</p>
            </div>
            <div class="list-meta">
              <div class="meta-item"><Hash :size="13" /> #{{ item.tokenId }}</div>
              <div class="meta-item"><Calendar :size="13" /> {{ item.purchaseTime.split(' ')[0] }}</div>
            </div>
            <div class="list-price">¥{{ item.price.toFixed(2) }}</div>
            <button class="list-btn" @click.stop><Gift :size="14" /> 转赠</button>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!filtered.length" class="empty">
          <Gem :size="48" class="empty-icon" />
          <h3>{{ searchQuery ? '未找到相关藏品' : '暂无藏品' }}</h3>
          <p>{{ searchQuery ? '试试其他关键词' : '快去市场挑选心仪的藏品吧' }}</p>
          <router-link to="/market" class="empty-btn">浏览市场 <ArrowRight :size="14" /></router-link>
        </div>
      </div>
    </main>


  </div>
</template>

<style scoped>
.my-page {
  --accent: #C6893F; --accent-dark: #A97030; --accent-bg: #FFF8EE;
  --text-h: #1a1a2e; --text: #555; --text-light: #999;
  --bg: #FFFCF8; --bg-soft: #FFFAF4; --border: #f0ebe4;
  --card-bg: #fff; --radius: 16px;
  min-height: 100vh; background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 导航 */
.top-nav { position: sticky; top: 0; z-index: 100; background: rgba(255,252,248,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
.nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { display: flex; align-items: center; }
.logo-img { width: 120px; height: 120px; object-fit: contain; }
.nav-links { display: flex; gap: 32px; }
.nav-link { font-size: 14px; color: var(--text); text-decoration: none; font-weight: 500; transition: color 0.2s; }
.nav-link:hover, .nav-link.active { color: var(--accent); }
.nav-actions { display: flex; gap: 10px; }
.btn-nav { display: inline-flex; padding: 8px 20px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.btn-nav:hover { background: var(--accent-dark); }

/* 头部 */
.page-header { background: linear-gradient(180deg, #fff, var(--bg)); border-bottom: 1px solid var(--border); }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 24px 40px 28px; }
.breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 24px; }
.bc-item { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-light); text-decoration: none; transition: color 0.2s; }
.bc-item:hover { color: var(--accent); }
.bc-sep { color: var(--text-light); opacity: 0.4; }
.bc-current { font-size: 13px; color: var(--text-h); font-weight: 500; }
.header-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.page-title { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 800; color: var(--text-h); margin: 0 0 8px; }
.page-title svg { color: var(--accent); }
.page-desc { font-size: 14px; color: var(--text); margin: 0; }
.page-desc strong { color: var(--accent); font-weight: 700; }

/* 工具栏 */
.toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.search-bar { position: relative; flex: 1; max-width: 400px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 36px 10px 40px; border: 1.5px solid var(--border); border-radius: 10px; font-size: 13px; color: var(--text-h); background: var(--card-bg); outline: none; transition: all 0.2s; font-family: inherit; }
.search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(198,137,63,0.1); }
.search-input::placeholder { color: #ccc; }
.search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); border: none; background: var(--bg-soft); border-radius: 4px; padding: 4px; cursor: pointer; color: var(--text-light); }
.view-toggle { display: flex; border: 1.5px solid var(--border); border-radius: 8px; overflow: hidden; }
.toggle-btn { padding: 8px 12px; border: none; background: var(--card-bg); cursor: pointer; color: var(--text-light); transition: all 0.2s; display: flex; align-items: center; }
.toggle-btn.active { background: var(--accent); color: #fff; }

/* 主体 */
.page-main { padding: 32px 0 60px; }
.main-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

/* 网格 */
.grid-view { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.card { background: var(--card-bg); border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; cursor: pointer; transition: all 0.3s; }
.card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(198,137,63,0.12); border-color: transparent; }
.card-cover { position: relative; height: 220px; background: var(--bg-soft); overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: contain; padding: 8px; border-radius: 16px; transition: transform 0.4s; }
.card:hover .card-img { transform: scale(1.04); }
.card-token { position: absolute; top: 12px; right: 12px; padding: 3px 10px; border-radius: 6px; background: rgba(0,0,0,0.6); color: #fff; font-size: 11px; font-weight: 700; font-family: monospace; }
.card-body { padding: 16px 18px 18px; }
.card-series { font-size: 11px; font-weight: 600; color: var(--accent); margin-bottom: 6px; }
.card-name { font-size: 15px; font-weight: 700; color: var(--text-h); margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-creator { font-size: 12px; color: var(--text-light); margin: 0 0 14px; }
.card-footer { display: flex; align-items: center; justify-content: space-between; }
.card-price { font-size: 18px; font-weight: 800; color: var(--accent); }
.card-btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 6px; border: 1.5px solid var(--border); background: var(--card-bg); font-size: 12px; font-weight: 500; color: var(--text); cursor: pointer; transition: all 0.2s; font-family: inherit; }
.card-btn:hover { border-color: var(--accent); color: var(--accent); }

/* 列表 */
.list-view { display: flex; flex-direction: column; gap: 12px; }
.list-item { display: flex; align-items: center; gap: 20px; padding: 16px 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.list-item:hover { box-shadow: 0 4px 15px rgba(198,137,63,0.08); border-color: transparent; }
.list-img { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.list-info { flex: 1; min-width: 0; }
.list-series { font-size: 11px; font-weight: 600; color: var(--accent); }
.list-name { font-size: 15px; font-weight: 700; color: var(--text-h); margin: 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.list-creator { font-size: 12px; color: var(--text-light); margin: 0; }
.list-meta { display: flex; flex-direction: column; gap: 4px; min-width: 140px; }
.meta-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-light); }
.meta-item svg { color: var(--accent); }
.list-price { font-size: 18px; font-weight: 800; color: var(--accent); min-width: 80px; text-align: right; }
.list-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card-bg); font-size: 13px; font-weight: 500; color: var(--text); cursor: pointer; transition: all 0.2s; font-family: inherit; flex-shrink: 0; }
.list-btn:hover { border-color: var(--accent); color: var(--accent); }

/* 空状态 */
.empty { text-align: center; padding: 80px 20px; }
.empty-icon { color: var(--border); margin-bottom: 16px; }
.empty h3 { font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0 0 8px; }
.empty p { font-size: 14px; color: var(--text-light); margin: 0 0 24px; }
.empty-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.empty-btn:hover { background: var(--accent-dark); }

/* 页脚 */
.page-footer { text-align: center; padding: 32px 40px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-light); }
.page-footer p { margin: 0; }

@media (max-width: 1024px) { .grid-view { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-inner, .header-inner, .main-inner { padding-left: 20px; padding-right: 20px; }
  .grid-view { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .list-meta { display: none; }
}
@media (max-width: 480px) { .grid-view { grid-template-columns: 1fr; } }
</style>
