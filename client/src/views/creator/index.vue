<script setup>
/**
 * 创作者工作台 - 管理藏品发布、审核状态、收益统计
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home, ChevronRight, Palette, Plus, Clock, CheckCircle,
  XCircle, Eye, Edit3, TrendingUp, DollarSign, Package,
  ShoppingBag, BarChart3, Upload, Image, FileText
} from 'lucide-vue-next'
import coverImg from '../../assets/衣服1.jpeg'

const router = useRouter()
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'pending', label: '审核中' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已拒绝' }
]

// 模拟创作者数据
const stats = ref({
  totalWorks: 8,
  totalSales: 1520,
  totalRevenue: 45800,
  avgPrice: 128.50
})

// 模拟藏品列表
const works = ref([
  {
    id: 1, name: '蒙古长袍·苍穹蓝', cover: coverImg,
    status: 'approved', category: '服饰图鉴', seriesName: '草原华裳',
    price: 99.00, totalSupply: 500, sold: 327,
    createTime: '2026-03-18', approveTime: '2026-03-19'
  },
  {
    id: 7, name: '那达慕盛装·火红', cover: coverImg,
    status: 'approved', category: '服饰图鉴', seriesName: '草原华裳',
    price: 149.00, totalSupply: 200, sold: 88,
    createTime: '2026-03-12', approveTime: '2026-03-14'
  },
  {
    id: 12, name: '蒙古新娘嫁衣', cover: coverImg,
    status: 'approved', category: '服饰图鉴', seriesName: '草原华裳',
    price: 299.00, totalSupply: 50, sold: 31,
    createTime: '2026-03-19', approveTime: '2026-03-20'
  },
  {
    id: 4, name: '蒙古战袍·铁骑', cover: coverImg,
    status: 'approved', category: '服饰图鉴', seriesName: '草原华裳',
    price: 199.00, totalSupply: 100, sold: 100,
    createTime: '2026-03-05', approveTime: '2026-03-08'
  },
  {
    id: 101, name: '蒙古马鞍·金鹰纹', cover: coverImg,
    status: 'pending', category: '3D 模型', seriesName: '马上风华',
    price: 159.00, totalSupply: 120, sold: 0,
    createTime: '2026-03-22', approveTime: ''
  },
  {
    id: 102, name: '云纹绣花枕', cover: coverImg,
    status: 'draft', category: '纹样艺术', seriesName: '草原纹语',
    price: 0, totalSupply: 0, sold: 0,
    createTime: '2026-03-23', approveTime: ''
  },
  {
    id: 103, name: '蒙古族婚礼记录', cover: coverImg,
    status: 'rejected', category: '工艺视频', seriesName: '匠心传承',
    price: 89.00, totalSupply: 200, sold: 0,
    createTime: '2026-03-20', approveTime: '',
    rejectReason: '视频画质不满足平台要求，建议使用 1080p 以上分辨率重新录制'
  }
])

/** 按状态筛选 */
const filteredWorks = computed(() => {
  if (activeTab.value === 'all') return works.value
  return works.value.filter(w => w.status === activeTab.value)
})

/** 状态信息 */
const getStatusInfo = (status) => {
  const map = {
    draft: { label: '草稿', class: 'ws-draft', icon: Edit3 },
    pending: { label: '审核中', class: 'ws-pending', icon: Clock },
    approved: { label: '已通过', class: 'ws-approved', icon: CheckCircle },
    rejected: { label: '已拒绝', class: 'ws-rejected', icon: XCircle }
  }
  return map[status] || map.draft
}
</script>

<template>
  <div class="creator-page">

    <main class="page-main">
      <div class="main-inner">
        <!-- 欢迎区 -->
        <div class="welcome">
          <div class="welcome-text">
            <h1><Palette :size="32" /> 创作者工作台</h1>
            <p>管理你的数字藏品，查看审核状态与收益数据</p>
          </div>
          <button class="btn-create" @click="router.push('/publish')"><Plus :size="18" /> 发布新藏品</button>
        </div>

        <!-- 统计卡片 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(198,137,63,0.1);"><Package :size="22" style="color: #C6893F;" /></div>
            <div class="stat-body">
              <span class="stat-value">{{ stats.totalWorks }}</span>
              <span class="stat-label">发布作品</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(32,201,151,0.1);"><ShoppingBag :size="22" style="color: #20C997;" /></div>
            <div class="stat-body">
              <span class="stat-value">{{ stats.totalSales.toLocaleString() }}</span>
              <span class="stat-label">总销量</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(253,126,20,0.1);"><DollarSign :size="22" style="color: #FD7E14;" /></div>
            <div class="stat-body">
              <span class="stat-value">¥{{ stats.totalRevenue.toLocaleString() }}</span>
              <span class="stat-label">总收益</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(132,94,247,0.1);"><TrendingUp :size="22" style="color: #845EF7;" /></div>
            <div class="stat-body">
              <span class="stat-value">¥{{ stats.avgPrice }}</span>
              <span class="stat-label">均价</span>
            </div>
          </div>
        </div>

        <!-- 标签页 -->
        <div class="tabs-bar">
          <div class="tabs">
            <button v-for="t in tabs" :key="t.key" :class="['tab', { active: activeTab === t.key }]" @click="activeTab = t.key">
              {{ t.label }}
            </button>
          </div>
        </div>

        <!-- 作品列表 -->
        <div v-if="filteredWorks.length" class="works-list">
          <div v-for="work in filteredWorks" :key="work.id" class="work-card">
            <img :src="work.cover" :alt="work.name" class="work-img" />
            <div class="work-info">
              <div class="work-top">
                <div :class="['work-status', getStatusInfo(work.status).class]">
                  <component :is="getStatusInfo(work.status).icon" :size="12" />
                  {{ getStatusInfo(work.status).label }}
                </div>
                <span class="work-cat">{{ work.category }}</span>
              </div>
              <h3 class="work-name">{{ work.name }}</h3>
              <div class="work-meta">
                <span>{{ work.seriesName }}</span>
                <span>创建于 {{ work.createTime }}</span>
              </div>
              <!-- 拒绝原因 -->
              <div v-if="work.status === 'rejected' && work.rejectReason" class="work-reject">
                <XCircle :size="13" />
                {{ work.rejectReason }}
              </div>
            </div>
            <div class="work-stats">
              <template v-if="work.status === 'approved'">
                <div class="ws-item">
                  <span class="ws-value">¥{{ work.price.toFixed(2) }}</span>
                  <span class="ws-label">单价</span>
                </div>
                <div class="ws-item">
                  <span class="ws-value">{{ work.sold }}/{{ work.totalSupply }}</span>
                  <span class="ws-label">已售/总量</span>
                </div>
                <div class="ws-item">
                  <span class="ws-value">¥{{ (work.sold * work.price).toLocaleString() }}</span>
                  <span class="ws-label">收益</span>
                </div>
              </template>
              <template v-else-if="work.status === 'draft'">
                <button class="btn-edit"><Edit3 :size="14" /> 继续编辑</button>
              </template>
              <template v-else-if="work.status === 'pending'">
                <span class="pending-text"><Clock :size="14" /> 等待审核</span>
              </template>
              <template v-else>
                <button class="btn-edit"><Edit3 :size="14" /> 重新提交</button>
              </template>
            </div>
          </div>
        </div>

        <div v-else class="empty">
          <Palette :size="48" class="empty-icon" />
          <h3>暂无作品</h3>
          <p>开始发布你的第一件数字藏品吧</p>
          <button class="btn-create-sm" @click="router.push('/publish')"><Plus :size="14" /> 发布藏品</button>
        </div>
      </div>
    </main>


  </div>
</template>

<style scoped>
.creator-page {
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
.nav-link:hover, .nav-link.active { color: var(--accent); }
.nav-actions { display: flex; gap: 10px; }
.btn-nav { display: inline-flex; padding: 8px 20px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; text-decoration: none; }

.page-main { padding: 32px 0 60px; }
.main-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

/* 欢迎区 */
.welcome { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
.welcome h1 { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 800; color: var(--text-h); margin: 0 0 8px; }
.welcome h1 svg { color: var(--accent); }
.welcome p { font-size: 14px; color: var(--text); margin: 0; }
.btn-create { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 10px; background: var(--accent); color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-create:hover { background: var(--accent-dark); box-shadow: 0 4px 15px rgba(198,137,63,0.3); }

/* 统计 */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.stat-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-body { display: flex; flex-direction: column; }
.stat-value { font-size: 22px; font-weight: 800; color: var(--text-h); }
.stat-label { font-size: 12px; color: var(--text-light); }

/* 标签 */
.tabs-bar { border-bottom: 1px solid var(--border); margin-bottom: 24px; }
.tabs { display: flex; gap: 4px; }
.tab { padding: 10px 24px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: var(--text-light); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; font-family: inherit; }
.tab:hover { color: var(--text-h); }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

/* 作品列表 */
.works-list { display: flex; flex-direction: column; gap: 16px; }
.work-card { display: flex; align-items: center; gap: 20px; padding: 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); transition: all 0.2s; }
.work-card:hover { box-shadow: 0 4px 20px rgba(198,137,63,0.08); border-color: transparent; }
.work-img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
.work-info { flex: 1; min-width: 0; }
.work-top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.work-status { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
.ws-draft { background: rgba(153,153,153,0.1); color: #999; }
.ws-pending { background: rgba(253,126,20,0.1); color: #FD7E14; }
.ws-approved { background: rgba(32,201,151,0.1); color: #20C997; }
.ws-rejected { background: rgba(224,49,49,0.1); color: #e03131; }
.work-cat { font-size: 11px; color: var(--text-light); padding: 2px 8px; border-radius: 4px; background: var(--bg-soft); }
.work-name { font-size: 16px; font-weight: 700; color: var(--text-h); margin: 0 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.work-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-light); }
.work-reject { margin-top: 8px; padding: 8px 12px; border-radius: 8px; background: #fff5f5; font-size: 12px; color: #e03131; display: flex; align-items: flex-start; gap: 6px; line-height: 1.5; }
.work-reject svg { flex-shrink: 0; margin-top: 2px; }

.work-stats { display: flex; align-items: center; gap: 24px; flex-shrink: 0; }
.ws-item { display: flex; flex-direction: column; align-items: center; min-width: 80px; }
.ws-value { font-size: 16px; font-weight: 800; color: var(--text-h); }
.ws-label { font-size: 11px; color: var(--text-light); }
.pending-text { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #FD7E14; font-weight: 600; }
.btn-edit { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card-bg); font-size: 13px; font-weight: 500; color: var(--text); cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-edit:hover { border-color: var(--accent); color: var(--accent); }

/* 空状态 */
.empty { text-align: center; padding: 80px 20px; }
.empty-icon { color: var(--border); margin-bottom: 16px; }
.empty h3 { font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0 0 8px; }
.empty p { font-size: 14px; color: var(--text-light); margin: 0 0 24px; }
.btn-create-sm { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }

.page-footer { text-align: center; padding: 32px 40px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-light); }
.page-footer p { margin: 0; }

@media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-inner, .main-inner { padding-left: 20px; padding-right: 20px; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .welcome { flex-direction: column; align-items: flex-start; gap: 16px; }
  .work-card { flex-wrap: wrap; }
  .work-stats { width: 100%; justify-content: flex-start; gap: 16px; margin-top: 8px; }
}
</style>
