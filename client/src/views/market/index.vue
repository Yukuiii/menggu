<script setup>
/**
 * 藏品市场页 - 展示全部数字藏品，支持搜索、分类筛选、状态筛选
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search, SlidersHorizontal, Image, Video, Box, Music,
  Clock, ShoppingBag, CheckCircle, ArrowRight, ArrowLeft,
  Home, ChevronRight, Gem, Filter, X, Flame, Sparkles
} from 'lucide-vue-next'
import coverImg from '../../assets/衣服1.jpeg'

const router = useRouter()

// 搜索关键词
const searchQuery = ref('')
// 当前分类
const activeCategory = ref('all')
// 当前状态筛选
const activeStatus = ref('all')
// 移动端筛选面板开关
const showFilter = ref(false)

// 分类选项
const categories = [
  { key: 'all', label: '全部', icon: Gem },
  { key: 'image', label: '服饰图鉴', icon: Image },
  { key: 'pattern', label: '纹样艺术', icon: Sparkles },
  { key: 'video', label: '工艺视频', icon: Video },
  { key: '3d', label: '3D 模型', icon: Box }
]

// 状态选项
const statuses = [
  { key: 'all', label: '全部状态' },
  { key: 'upcoming', label: '即将发售' },
  { key: 'selling', label: '发售中' },
  { key: 'soldout', label: '已售罄' }
]

// 模拟藏品数据
const collections = ref([
  {
    id: 1, name: '蒙古长袍·苍穹蓝', cover: coverImg, category: 'image', status: 'selling',
    price: 99.00, totalSupply: 500, currentNo: 327,
    creator: '额尔敦工作室', saleTime: '2026-03-20T10:00:00',
    seriesName: '草原华裳'
  },
  {
    id: 2, name: '鹿纹银饰·月光', cover: coverImg, category: 'pattern', status: 'selling',
    price: 59.00, totalSupply: 1000, currentNo: 812,
    creator: '银月坊', saleTime: '2026-03-18T10:00:00',
    seriesName: '草原纹语'
  },
  {
    id: 3, name: '马头琴制作工艺', cover: coverImg, category: 'video', status: 'upcoming',
    price: 39.00, totalSupply: 200, currentNo: 0,
    creator: '巴特尔大师', saleTime: '2026-03-25T10:00:00',
    seriesName: '匠心传承'
  },
  {
    id: 4, name: '蒙古战袍·铁骑', cover: coverImg, category: 'image', status: 'soldout',
    price: 199.00, totalSupply: 100, currentNo: 100,
    creator: '额尔敦工作室', saleTime: '2026-03-10T10:00:00',
    seriesName: '草原华裳'
  },
  {
    id: 5, name: '卷草纹·金丝绣', cover: coverImg, category: 'pattern', status: 'selling',
    price: 79.00, totalSupply: 300, currentNo: 156,
    creator: '乌兰花刺绣坊', saleTime: '2026-03-19T10:00:00',
    seriesName: '草原纹语'
  },
  {
    id: 6, name: '蒙古靴·云纹踏雪', cover: coverImg, category: '3d', status: 'upcoming',
    price: 129.00, totalSupply: 150, currentNo: 0,
    creator: '草原数字', saleTime: '2026-03-28T10:00:00',
    seriesName: '足下生花'
  },
  {
    id: 7, name: '那达慕盛装·火红', cover: coverImg, category: 'image', status: 'selling',
    price: 149.00, totalSupply: 200, currentNo: 88,
    creator: '额尔敦工作室', saleTime: '2026-03-15T10:00:00',
    seriesName: '草原华裳'
  },
  {
    id: 8, name: '犄纹腰带·银鞍', cover: coverImg, category: 'pattern', status: 'soldout',
    price: 69.00, totalSupply: 500, currentNo: 500,
    creator: '银月坊', saleTime: '2026-03-08T10:00:00',
    seriesName: '草原纹语'
  },
  {
    id: 9, name: '毡房制作全记录', cover: coverImg, category: 'video', status: 'selling',
    price: 49.00, totalSupply: 300, currentNo: 201,
    creator: '巴特尔大师', saleTime: '2026-03-17T10:00:00',
    seriesName: '匠心传承'
  },
  {
    id: 10, name: '蒙古头饰·珊瑚冠', cover: coverImg, category: '3d', status: 'selling',
    price: 169.00, totalSupply: 100, currentNo: 42,
    creator: '草原数字', saleTime: '2026-03-22T10:00:00',
    seriesName: '头上风华'
  },
  {
    id: 11, name: '云纹刺绣·春意', cover: coverImg, category: 'pattern', status: 'upcoming',
    price: 89.00, totalSupply: 400, currentNo: 0,
    creator: '乌兰花刺绣坊', saleTime: '2026-03-30T10:00:00',
    seriesName: '草原纹语'
  },
  {
    id: 12, name: '蒙古新娘嫁衣', cover: coverImg, category: 'image', status: 'selling',
    price: 299.00, totalSupply: 50, currentNo: 31,
    creator: '额尔敦工作室', saleTime: '2026-03-21T10:00:00',
    seriesName: '草原华裳'
  }
])

/** 根据筛选条件过滤藏品 */
const filteredCollections = computed(() => {
  return collections.value.filter(item => {
    // 搜索过滤
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!item.name.toLowerCase().includes(q) && !item.creator.toLowerCase().includes(q)) {
        return false
      }
    }
    // 分类过滤
    if (activeCategory.value !== 'all' && item.category !== activeCategory.value) return false
    // 状态过滤
    if (activeStatus.value !== 'all' && item.status !== activeStatus.value) return false
    return true
  })
})

/** 获取状态标签样式 */
const getStatusInfo = (status) => {
  const map = {
    upcoming: { label: '即将发售', class: 'status-upcoming', icon: Clock },
    selling: { label: '发售中', class: 'status-selling', icon: Flame },
    soldout: { label: '已售罄', class: 'status-soldout', icon: CheckCircle }
  }
  return map[status] || map.selling
}

/** 计算销售进度百分比 */
const getSaleProgress = (item) => {
  if (item.totalSupply === 0) return 0
  return Math.round((item.currentNo / item.totalSupply) * 100)
}

/** 格式化价格 */
const formatPrice = (price) => {
  return price.toFixed(2)
}

/** 跳转藏品详情 */
const goDetail = (id) => {
  router.push(`/collection/${id}`)
}

/** 获取分类对应的装饰色 */
const getCategoryColor = (category) => {
  const map = {
    image: '#FF6B6B',
    pattern: '#845EF7',
    video: '#20C997',
    '3d': '#FD7E14'
  }
  return map[category] || '#C6893F'
}
</script>

<template>
  <div class="market-page">
    <!-- 顶部导航 -->
    <nav class="market-nav">
      <div class="nav-inner">
        <router-link to="/" class="nav-logo">
          <img src="../../assets/logo.png" alt="蒙服饰" class="logo-image" />
        </router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/market" class="nav-link active">藏品市场</router-link>
          <router-link to="/my-collections" class="nav-link">我的藏品</router-link>
        </div>
        <div class="nav-actions">
          <router-link to="/login" class="btn-nav-outline">登录</router-link>
          <router-link to="/register" class="btn-nav-primary">注册</router-link>
        </div>
      </div>
    </nav>

    <!-- 页面头部 -->
    <header class="market-header">
      <div class="header-inner">
        <!-- 面包屑 -->
        <div class="breadcrumb">
          <router-link to="/" class="breadcrumb-item">
            <Home :size="14" />
            <span>首页</span>
          </router-link>
          <ChevronRight :size="14" class="breadcrumb-sep" />
          <span class="breadcrumb-current">藏品市场</span>
        </div>

        <div class="header-content">
          <div class="header-text">
            <h1 class="market-title">
              <Gem :size="32" class="title-icon" />
              藏品市场
            </h1>
            <p class="market-desc">探索蒙古族服饰非遗数字藏品，每一件都承载千年文化记忆</p>
          </div>
          <div class="header-stat">
            <span class="stat-num">{{ filteredCollections.length }}</span>
            <span class="stat-label">件藏品</span>
          </div>
        </div>

        <!-- 搜索栏 -->
        <div class="search-bar">
          <Search :size="18" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索藏品名称、创作者..."
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <X :size="16" />
          </button>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="market-main">
      <div class="main-inner">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <!-- 分类标签 -->
          <div class="filter-categories">
            <button
              v-for="cat in categories"
              :key="cat.key"
              :class="['filter-tag', { active: activeCategory === cat.key }]"
              @click="activeCategory = cat.key"
            >
              <component :is="cat.icon" :size="15" />
              <span>{{ cat.label }}</span>
            </button>
          </div>

          <!-- 状态筛选 -->
          <div class="filter-status">
            <button
              v-for="s in statuses"
              :key="s.key"
              :class="['status-tag', { active: activeStatus === s.key }]"
              @click="activeStatus = s.key"
            >
              {{ s.label }}
            </button>
          </div>
        </div>

        <!-- 藏品卡片网格 -->
        <div v-if="filteredCollections.length" class="collections-grid">
          <div
            v-for="item in filteredCollections"
            :key="item.id"
            class="collection-card"
            @click="goDetail(item.id)"
          >
            <!-- 封面区 -->
            <div class="card-cover">
              <!-- 封面图片 -->
              <img :src="item.cover" :alt="item.name" class="card-cover-img" />
              <!-- 状态角标 -->
              <div :class="['card-status', getStatusInfo(item.status).class]">
                <component :is="getStatusInfo(item.status).icon" :size="12" />
                <span>{{ getStatusInfo(item.status).label }}</span>
              </div>
              <!-- 系列名 -->
              <div class="card-series">{{ item.seriesName }}</div>
            </div>

            <!-- 信息区 -->
            <div class="card-body">
              <h3 class="card-name">{{ item.name }}</h3>
              <p class="card-creator">{{ item.creator }}</p>

              <!-- 销售进度 -->
              <div v-if="item.status !== 'upcoming'" class="card-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{
                      width: getSaleProgress(item) + '%',
                      background: item.status === 'soldout' ? '#999' : getCategoryColor(item.category)
                    }"
                  ></div>
                </div>
                <span class="progress-text">{{ item.currentNo }}/{{ item.totalSupply }}</span>
              </div>
              <div v-else class="card-countdown">
                <Clock :size="13" />
                <span>{{ new Date(item.saleTime).toLocaleDateString('zh-CN') }} 开售</span>
              </div>

              <!-- 底部：价格 + 按钮 -->
              <div class="card-footer">
                <div class="card-price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ formatPrice(item.price) }}</span>
                </div>
                <button
                  :class="['card-btn', { 'btn-disabled': item.status === 'soldout' }]"
                  :disabled="item.status === 'soldout'"
                >
                  {{ item.status === 'soldout' ? '已售罄' : item.status === 'upcoming' ? '预约' : '立即购买' }}
                  <ArrowRight v-if="item.status !== 'soldout'" :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <Gem :size="48" class="empty-icon" />
          <h3 class="empty-title">暂无符合条件的藏品</h3>
          <p class="empty-desc">试试调整筛选条件或搜索关键词</p>
          <button class="btn-reset" @click="searchQuery = ''; activeCategory = 'all'; activeStatus = 'all'">
            重置筛选
          </button>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="market-footer">
      <p>© 2026 蒙古服饰非遗数字藏品平台. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
/* ===== 变量 ===== */
.market-page {
  --accent: #C6893F;
  --accent-dark: #A97030;
  --accent-bg: #FFF8EE;
  --text-h: #1a1a2e;
  --text: #555;
  --text-light: #999;
  --bg: #FFFCF8;
  --bg-soft: #FFFAF4;
  --border: #f0ebe4;
  --card-bg: #fff;
  --shadow: 0 2px 12px rgba(198, 137, 63, 0.06);
  --shadow-hover: 0 8px 30px rgba(198, 137, 63, 0.12);
  --radius: 16px;

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===== 导航栏 ===== */
.market-nav {
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

.logo-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
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
.nav-link.active {
  color: var(--accent);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
}

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

/* ===== 页面头部 ===== */
.market-header {
  background: linear-gradient(180deg, #fff, var(--bg));
  border-bottom: 1px solid var(--border);
}

.header-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 40px 32px;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: var(--accent);
}

.breadcrumb-sep {
  color: var(--text-light);
  opacity: 0.5;
}

.breadcrumb-current {
  font-size: 13px;
  color: var(--text-h);
  font-weight: 500;
}

.header-content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
}

.market-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 30px;
  font-weight: 800;
  color: var(--text-h);
  letter-spacing: -0.5px;
  margin: 0 0 8px;
}

.title-icon {
  color: var(--accent);
}

.market-desc {
  font-size: 15px;
  color: var(--text);
  margin: 0;
}

.header-stat {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-shrink: 0;
}

.stat-num {
  font-size: 36px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-light);
}

/* 搜索栏 */
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 520px;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--text-light);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 13px 44px 13px 46px;
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-size: 14px;
  color: var(--text-h);
  background: var(--card-bg);
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.search-input::placeholder {
  color: #ccc;
}

.search-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(198, 137, 63, 0.1);
}

.search-clear {
  position: absolute;
  right: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--bg-soft);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-light);
  transition: all 0.2s;
}

.search-clear:hover {
  background: var(--border);
  color: var(--text-h);
}

/* ===== 主体 ===== */
.market-main {
  padding: 0 0 60px;
}

.main-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.filter-categories {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  background: transparent;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}

.filter-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-bg);
}

.filter-tag.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.filter-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-tag {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-light);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.status-tag:hover {
  color: var(--text-h);
  background: var(--bg-soft);
}

.status-tag.active {
  color: var(--accent);
  background: var(--accent-bg);
  font-weight: 600;
}

/* ===== 藏品卡片网格 ===== */
.collections-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.collection-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collection-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: transparent;
}

/* 封面区 */
.card-cover {
  position: relative;
  height: 240px;
  overflow: hidden;
  background: var(--bg-soft);
}

.card-cover-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
  border-radius: 16px;
  transition: transform 0.4s ease;
}

.collection-card:hover .card-cover-img {
  transform: scale(1.04);
}

.card-status {
  position: absolute;
  top: 14px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 2;
}

.status-upcoming {
  background: rgba(253, 126, 20, 0.9);
  color: #fff;
}

.status-selling {
  background: rgba(32, 201, 151, 0.9);
  color: #fff;
}

.status-soldout {
  background: rgba(153, 153, 153, 0.85);
  color: #fff;
}

.card-cover-icon {
  opacity: 0.3;
  transition: all 0.3s;
}

.collection-card:hover .card-cover-icon {
  opacity: 0.5;
  transform: scale(1.1);
}

.card-series {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-light);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  padding: 3px 10px;
  border-radius: 4px;
}

/* 信息区 */
.card-body {
  padding: 16px 18px 18px;
}

.card-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 4px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-creator {
  font-size: 12px;
  color: var(--text-light);
  margin: 0 0 14px;
}

/* 进度条 */
.card-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.progress-bar {
  flex: 1;
  height: 5px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.progress-text {
  font-size: 11px;
  color: var(--text-light);
  white-space: nowrap;
}

/* 倒计时 */
.card-countdown {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #FD7E14;
  margin-bottom: 14px;
}

/* 底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-price {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  margin-right: 2px;
}

.price-value {
  font-size: 20px;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.5px;
}

.card-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.card-btn:hover:not(.btn-disabled) {
  background: var(--accent-dark);
  box-shadow: 0 4px 12px rgba(198, 137, 63, 0.3);
}

.card-btn.btn-disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: var(--border);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 24px;
}

.btn-reset {
  padding: 10px 28px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-reset:hover {
  background: var(--accent-dark);
}

/* ===== 页脚 ===== */
.market-footer {
  text-align: center;
  padding: 32px 40px;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-light);
}

.market-footer p {
  margin: 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .collections-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .nav-links,
  .nav-actions {
    display: none;
  }

  .nav-inner,
  .header-inner,
  .main-inner {
    padding-left: 20px;
    padding-right: 20px;
  }

  .collections-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .market-title {
    font-size: 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-bar {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }
}
</style>
