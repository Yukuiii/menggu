<script setup>
/**
 * 订单详情页 - 展示单笔订单的完整信息
 */
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home, ChevronRight, ShoppingBag, CheckCircle, Clock, XCircle,
  CreditCard, Calendar, Hash, User, ArrowRight, Copy, FileText
} from 'lucide-vue-next'
import coverImg from '../../assets/衣服1.jpeg'

const route = useRoute()
const router = useRouter()
const copied = ref('')

// 模拟订单详情
const order = ref({
  id: route.params.id || 'ORD20260320001',
  status: 'paid',
  createTime: '2026-03-20 10:00:32',
  payTime: '2026-03-20 10:01:05',
  payMethod: '微信支付',
  collection: {
    id: 1, name: '蒙古长袍·苍穹蓝', cover: coverImg,
    seriesName: '草原华裳', creator: '额尔敦工作室', tokenId: 327
  },
  price: 99.00,
  chainHash: '0xa3f7c8d92e4b1056f8c5e7d3a9b0c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8b9b0',
  buyer: { nickname: '草原牧歌', walletAddress: '0x8f2d4a6b7c9e0f1d2a3b4c5d6e7f8a9b0c1d3a1c' }
})

/** 状态信息 */
const statusMap = {
  pending: { label: '待支付', desc: '请在30分钟内完成支付', class: 'st-pending', icon: Clock },
  paid: { label: '已完成', desc: '交易已完成，藏品已入库', class: 'st-paid', icon: CheckCircle },
  cancelled: { label: '已取消', desc: '订单已取消', class: 'st-cancelled', icon: XCircle }
}
const statusInfo = statusMap[order.value.status] || statusMap.pending

/** 复制 */
const copyText = async (text, label) => {
  try { await navigator.clipboard.writeText(text); copied.value = label; setTimeout(() => copied.value = '', 1500) } catch {}
}
</script>

<template>
  <div class="od-page">

    <header class="page-header">
      <div class="header-inner">
        <div class="breadcrumb">
          <router-link to="/" class="bc-item"><Home :size="14" /><span>首页</span></router-link>
          <ChevronRight :size="14" class="bc-sep" />
          <router-link to="/orders" class="bc-item">我的订单</router-link>
          <ChevronRight :size="14" class="bc-sep" />
          <span class="bc-current">订单详情</span>
        </div>
      </div>
    </header>

    <main class="page-main">
      <div class="main-inner">
        <!-- 状态卡 -->
        <div :class="['status-card', statusInfo.class]">
          <component :is="statusInfo.icon" :size="40" />
          <div>
            <h2 class="status-label">{{ statusInfo.label }}</h2>
            <p class="status-desc">{{ statusInfo.desc }}</p>
          </div>
          <button v-if="order.status === 'pending'" class="btn-pay-now">立即支付</button>
        </div>

        <div class="detail-grid">
          <!-- 左列 -->
          <div class="detail-left">
            <!-- 藏品信息 -->
            <section class="section">
              <h3 class="section-title"><ShoppingBag :size="18" /> 藏品信息</h3>
              <div class="collection-row" @click="router.push(`/collection/${order.collection.id}`)">
                <img :src="order.collection.cover" :alt="order.collection.name" class="col-img" />
                <div class="col-info">
                  <div class="col-series">{{ order.collection.seriesName }}</div>
                  <h4 class="col-name">{{ order.collection.name }}</h4>
                  <p class="col-creator"><User :size="12" /> {{ order.collection.creator }}</p>
                  <div v-if="order.collection.tokenId" class="col-token">#{{ order.collection.tokenId }}</div>
                </div>
                <div class="col-price">¥{{ order.price.toFixed(2) }}</div>
              </div>
            </section>

            <!-- 链上信息 -->
            <section v-if="order.chainHash" class="section">
              <h3 class="section-title"><Hash :size="18" /> 链上凭证</h3>
              <div class="info-row">
                <span class="info-label">交易哈希</span>
                <span class="info-value mono">{{ order.chainHash }}</span>
                <button class="copy-btn" @click="copyText(order.chainHash, 'hash')">
                  <Copy v-if="copied !== 'hash'" :size="13" />
                  <CheckCircle v-else :size="13" class="copied-icon" />
                </button>
              </div>
            </section>
          </div>

          <!-- 右列 -->
          <div class="detail-right">
            <section class="section">
              <h3 class="section-title"><FileText :size="18" /> 订单信息</h3>
              <div class="info-list">
                <div class="info-row">
                  <span class="info-label">订单编号</span>
                  <span class="info-value mono">{{ order.id }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">创建时间</span>
                  <span class="info-value">{{ order.createTime }}</span>
                </div>
                <div v-if="order.payTime" class="info-row">
                  <span class="info-label">支付时间</span>
                  <span class="info-value">{{ order.payTime }}</span>
                </div>
                <div v-if="order.payMethod" class="info-row">
                  <span class="info-label">支付方式</span>
                  <span class="info-value"><CreditCard :size="13" /> {{ order.payMethod }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">买家昵称</span>
                  <span class="info-value">{{ order.buyer.nickname }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">钱包地址</span>
                  <span class="info-value mono small">{{ order.buyer.walletAddress }}</span>
                </div>
              </div>
            </section>

            <!-- 金额明细 -->
            <section class="section">
              <h3 class="section-title"><CreditCard :size="18" /> 金额明细</h3>
              <div class="info-list">
                <div class="info-row">
                  <span class="info-label">藏品价格</span>
                  <span class="info-value">¥{{ order.price.toFixed(2) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">平台服务费</span>
                  <span class="info-value">¥0.00</span>
                </div>
                <div class="info-row total">
                  <span class="info-label">实付金额</span>
                  <span class="info-value price-total">¥{{ order.price.toFixed(2) }}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>


  </div>
</template>

<style scoped>
.od-page {
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

.page-header { border-bottom: 1px solid var(--border); background: var(--card-bg); }
.header-inner { max-width: 1200px; margin: 0 auto; padding: 14px 40px; }
.breadcrumb { display: flex; align-items: center; gap: 6px; }
.bc-item { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--text-light); text-decoration: none; }
.bc-item:hover { color: var(--accent); }
.bc-sep { color: var(--text-light); opacity: 0.4; }
.bc-current { font-size: 13px; color: var(--text-h); font-weight: 500; }

.page-main { padding: 32px 0 60px; }
.main-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

/* 状态卡 */
.status-card { display: flex; align-items: center; gap: 20px; padding: 28px 32px; border-radius: var(--radius); margin-bottom: 28px; }
.status-card.st-paid { background: linear-gradient(135deg, #f0fdf4, #dcfce7); color: #16a34a; }
.status-card.st-pending { background: linear-gradient(135deg, #fffbeb, #fef3c7); color: #d97706; }
.status-card.st-cancelled { background: linear-gradient(135deg, #f9fafb, #f3f4f6); color: #9ca3af; }
.status-label { font-size: 22px; font-weight: 800; margin: 0 0 4px; }
.status-desc { font-size: 14px; margin: 0; opacity: 0.8; }
.btn-pay-now { margin-left: auto; padding: 12px 28px; border-radius: 10px; background: #d97706; color: #fff; font-size: 15px; font-weight: 700; border: none; cursor: pointer; }

/* 双列布局 */
.detail-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }

.section { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 20px; overflow: hidden; }
.section-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--text-h); margin: 0; padding: 16px 20px; border-bottom: 1px solid var(--border); }
.section-title svg { color: var(--accent); }

/* 藏品行 */
.collection-row { display: flex; align-items: center; gap: 16px; padding: 20px; cursor: pointer; transition: background 0.2s; }
.collection-row:hover { background: var(--bg-soft); }
.col-img { width: 80px; height: 80px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
.col-info { flex: 1; min-width: 0; }
.col-series { font-size: 11px; font-weight: 600; color: var(--accent); }
.col-name { font-size: 16px; font-weight: 700; color: var(--text-h); margin: 2px 0 4px; }
.col-creator { font-size: 12px; color: var(--text-light); margin: 0; display: flex; align-items: center; gap: 4px; }
.col-token { margin-top: 6px; display: inline-block; padding: 2px 8px; border-radius: 4px; background: var(--bg-soft); font-size: 11px; font-weight: 700; color: var(--text); font-family: monospace; }
.col-price { font-size: 22px; font-weight: 800; color: var(--accent); flex-shrink: 0; }

/* 信息列表 */
.info-list { padding: 4px 0; }
.info-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 20px; }
.info-row:not(:last-child) { border-bottom: 1px solid var(--border); }
.info-label { font-size: 13px; color: var(--text-light); min-width: 80px; flex-shrink: 0; }
.info-value { font-size: 13px; color: var(--text-h); font-weight: 500; flex: 1; word-break: break-all; display: flex; align-items: center; gap: 4px; }
.info-value svg { color: var(--accent); }
.mono { font-family: 'SF Mono', 'Fira Code', monospace; }
.small { font-size: 12px; }
.info-row.total { background: var(--bg-soft); }
.price-total { font-size: 20px; font-weight: 800; color: var(--accent); }

.copy-btn { flex-shrink: 0; border: none; background: var(--bg-soft); border-radius: 6px; padding: 6px; cursor: pointer; color: var(--text-light); transition: all 0.2s; display: flex; }
.copy-btn:hover { color: var(--accent); background: var(--accent-bg); }
.copied-icon { color: #20C997; }

.page-footer { text-align: center; padding: 32px 40px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-light); }
.page-footer p { margin: 0; }

@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-inner, .header-inner, .main-inner { padding-left: 20px; padding-right: 20px; }
  .detail-grid { grid-template-columns: 1fr; }
  .status-card { flex-wrap: wrap; }
}
</style>
