<script setup>
/**
 * 订单列表页 - 展示用户全部订单，支持状态筛选
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Home, ChevronRight, ShoppingBag, Clock, CheckCircle,
  XCircle, ArrowRight, CreditCard, Calendar
} from 'lucide-vue-next'
import coverImg from '../../assets/衣服1.jpeg'

const router = useRouter()
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待支付' },
  { key: 'paid', label: '已完成' },
  { key: 'cancelled', label: '已取消' }
]

// 模拟订单数据
const orders = ref([
  {
    id: 'ORD20260320001', status: 'paid', time: '2026-03-20 10:00:32', payTime: '2026-03-20 10:01:05',
    collection: { id: 1, name: '蒙古长袍·苍穹蓝', cover: coverImg, tokenId: 327 },
    price: 99.00, payMethod: '微信支付'
  },
  {
    id: 'ORD20260319002', status: 'paid', time: '2026-03-19 14:22:10', payTime: '2026-03-19 14:22:48',
    collection: { id: 5, name: '卷草纹·金丝绣', cover: coverImg, tokenId: 156 },
    price: 79.00, payMethod: '支付宝'
  },
  {
    id: 'ORD20260322003', status: 'pending', time: '2026-03-22 11:30:05', payTime: '',
    collection: { id: 10, name: '蒙古头饰·珊瑚冠', cover: coverImg, tokenId: null },
    price: 169.00, payMethod: ''
  },
  {
    id: 'ORD20260315004', status: 'cancelled', time: '2026-03-15 09:10:22', payTime: '',
    collection: { id: 7, name: '那达慕盛装·火红', cover: coverImg, tokenId: null },
    price: 149.00, payMethod: ''
  }
])

/** 按状态筛选 */
const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeTab.value)
})

/** 状态信息 */
const getStatusInfo = (status) => {
  const map = {
    pending: { label: '待支付', class: 'st-pending', icon: Clock },
    paid: { label: '已完成', class: 'st-paid', icon: CheckCircle },
    cancelled: { label: '已取消', class: 'st-cancelled', icon: XCircle }
  }
  return map[status] || map.pending
}
</script>

<template>
  <div class="orders-page">

    <header class="page-header">
      <div class="header-inner">
        <div class="breadcrumb">
          <router-link to="/" class="bc-item"><Home :size="14" /><span>首页</span></router-link>
          <ChevronRight :size="14" class="bc-sep" />
          <span class="bc-current">我的订单</span>
        </div>
        <h1 class="page-title"><ShoppingBag :size="28" /> 我的订单</h1>
        <!-- 状态标签 -->
        <div class="tabs">
          <button v-for="t in tabs" :key="t.key" :class="['tab', { active: activeTab === t.key }]" @click="activeTab = t.key">
            {{ t.label }}
          </button>
        </div>
      </div>
    </header>

    <main class="page-main">
      <div class="main-inner">
        <div v-if="filteredOrders.length" class="order-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card" @click="router.push(`/order/${order.id}`)">
            <!-- 订单头 -->
            <div class="order-head">
              <span class="order-id">{{ order.id }}</span>
              <div :class="['order-status', getStatusInfo(order.status).class]">
                <component :is="getStatusInfo(order.status).icon" :size="13" />
                {{ getStatusInfo(order.status).label }}
              </div>
            </div>
            <!-- 订单体 -->
            <div class="order-body">
              <img :src="order.collection.cover" :alt="order.collection.name" class="order-img" />
              <div class="order-info">
                <h3 class="order-name">{{ order.collection.name }}</h3>
                <div class="order-meta">
                  <span><Calendar :size="13" /> {{ order.time }}</span>
                  <span v-if="order.collection.tokenId"><span class="meta-label">Token</span> #{{ order.collection.tokenId }}</span>
                </div>
              </div>
              <div class="order-right">
                <div class="order-price">¥{{ order.price.toFixed(2) }}</div>
                <div v-if="order.payMethod" class="order-pay"><CreditCard :size="12" /> {{ order.payMethod }}</div>
              </div>
            </div>
            <!-- 订单操作 -->
            <div class="order-foot">
              <button v-if="order.status === 'pending'" class="btn-pay" @click.stop>立即支付</button>
              <button class="btn-detail" @click.stop="router.push(`/order/${order.id}`)">
                查看详情 <ArrowRight :size="13" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty">
          <ShoppingBag :size="48" class="empty-icon" />
          <h3>暂无订单</h3>
          <p>快去市场挑选心仪的藏品吧</p>
          <router-link to="/market" class="empty-btn">浏览市场 <ArrowRight :size="14" /></router-link>
        </div>
      </div>
    </main>


  </div>
</template>

<style scoped>
.orders-page {
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
.nav-link { font-size: 14px; color: var(--text); text-decoration: none; font-weight: 500; transition: color 0.2s; }
.nav-link:hover, .nav-link.active { color: var(--accent); }
.nav-actions { display: flex; gap: 10px; }
.btn-nav { display: inline-flex; padding: 8px 20px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.btn-nav:hover { background: var(--accent-dark); }

.page-header { background: linear-gradient(180deg, #fff, var(--bg)); border-bottom: 1px solid var(--border); }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 24px 40px 0; }
.breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 24px; }
.bc-item { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-light); text-decoration: none; }
.bc-item:hover { color: var(--accent); }
.bc-sep { color: var(--text-light); opacity: 0.4; }
.bc-current { font-size: 13px; color: var(--text-h); font-weight: 500; }
.page-title { display: flex; align-items: center; gap: 12px; font-size: 28px; font-weight: 800; color: var(--text-h); margin: 0 0 24px; }
.page-title svg { color: var(--accent); }

.tabs { display: flex; gap: 4px; }
.tab { padding: 10px 24px; border: none; background: transparent; font-size: 14px; font-weight: 500; color: var(--text-light); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; font-family: inherit; }
.tab:hover { color: var(--text-h); }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

.page-main { padding: 32px 0 60px; }
.main-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

.order-list { display: flex; flex-direction: column; gap: 16px; }
.order-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.2s; }
.order-card:hover { box-shadow: 0 4px 20px rgba(198,137,63,0.08); border-color: transparent; }

.order-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid var(--border); background: var(--bg-soft); }
.order-id { font-size: 13px; font-weight: 600; color: var(--text); font-family: monospace; }
.order-status { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 6px; }
.st-pending { background: rgba(253,126,20,0.1); color: #FD7E14; }
.st-paid { background: rgba(32,201,151,0.1); color: #20C997; }
.st-cancelled { background: rgba(153,153,153,0.1); color: #999; }

.order-body { display: flex; align-items: center; gap: 20px; padding: 20px; }
.order-img { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.order-info { flex: 1; min-width: 0; }
.order-name { font-size: 16px; font-weight: 700; color: var(--text-h); margin: 0 0 6px; }
.order-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-light); }
.order-meta span { display: inline-flex; align-items: center; gap: 4px; }
.order-meta svg { color: var(--accent); }
.meta-label { color: var(--text-light); }
.order-right { text-align: right; flex-shrink: 0; }
.order-price { font-size: 20px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
.order-pay { font-size: 12px; color: var(--text-light); display: flex; align-items: center; gap: 4px; justify-content: flex-end; }

.order-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 12px 20px; border-top: 1px solid var(--border); }
.btn-pay { padding: 8px 20px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 13px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-pay:hover { background: var(--accent-dark); }
.btn-detail { display: inline-flex; align-items: center; gap: 4px; padding: 8px 16px; border-radius: 8px; border: 1.5px solid var(--border); background: var(--card-bg); font-size: 13px; font-weight: 500; color: var(--text); cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-detail:hover { border-color: var(--accent); color: var(--accent); }

.empty { text-align: center; padding: 80px 20px; }
.empty-icon { color: var(--border); margin-bottom: 16px; }
.empty h3 { font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0 0 8px; }
.empty p { font-size: 14px; color: var(--text-light); margin: 0 0 24px; }
.empty-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 24px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 14px; font-weight: 600; text-decoration: none; }

.page-footer { text-align: center; padding: 32px 40px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-light); }
.page-footer p { margin: 0; }

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-inner, .header-inner, .main-inner { padding-left: 20px; padding-right: 20px; }
  .order-body { flex-wrap: wrap; }
  .order-right { width: 100%; text-align: left; margin-top: 8px; }
}
</style>
