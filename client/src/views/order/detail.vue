<script setup>
/**
 * 订单详情页 - 重新设计版
 */
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, CheckCircle, Clock, XCircle, ShoppingBag, 
  CreditCard, Hash, Copy, FileText, ChevronRight
} from 'lucide-vue-next'
import { apiOrderDetail, apiPayOrder } from '../../api/order'

const route = useRoute()
const router = useRouter()
const copied = ref('')

const order = ref({
  id: route.params.id,
  orderNo: '',
  status: 'pending',
  createTime: '',
  payTime: '',
  payMethod: '',
  collection: {
    id: '',
    name: '',
    cover: '',
    seriesName: '',
    creator: '',
    tokenId: null
  },
  price: 0,
  chainHash: '',
  buyer: { nickname: '', walletAddress: '' }
})

/** 状态配置 */
const statusMap = {
  pending: { label: '待支付', desc: '请在 15 分钟内完成支付', class: 'st-pending', icon: Clock },
  paid: { label: '支付成功', desc: '交易已完成，藏品已发放至您的账户', class: 'st-paid', icon: CheckCircle },
  cancelled: { label: '已取消', desc: '订单已超时或主动取消', class: 'st-cancelled', icon: XCircle }
}
const statusInfo = computed(() => statusMap[order.value.status] || statusMap.pending)

const fetchOrder = async () => {
  const data = await apiOrderDetail(route.params.id)
  order.value = {
    id: data.id,
    orderNo: data.orderNo,
    status: data.status === 0 ? 'pending' : data.status === 1 || data.status === 2 ? 'paid' : 'cancelled',
    createTime: data.createdAt,
    payTime: data.paidAt,
    payMethod: data.status === 1 || data.status === 2 ? '钱包余额支付' : '',
    collection: {
      id: data.Collection?.id,
      name: data.Collection?.name || '-',
      cover: data.Collection?.cover || '',
      seriesName: data.Collection?.Series?.name || '-',
      creator: data.Collection?.Series?.Creator?.name || '未知创作者',
      tokenId: data.tokenId
    },
    price: Number(data.amount || 0),
    chainHash: data.Collection?.chainHash || '',
    buyer: {
      nickname: data.User?.nickname || '',
      walletAddress: data.User?.walletAddress || ''
    }
  }
}

const handlePay = async () => {
  await apiPayOrder(route.params.id)
  await fetchOrder()
}

onMounted(() => {
  fetchOrder()
})

/** 复制文本 */
const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = label;
    setTimeout(() => copied.value = '', 1500)
  } catch {}
}
</script>

<template>
  <div class="order-detail-page">
    <div class="od-container">
      <!-- 返回按钮 -->
      <button class="back-btn" @click="router.back()">
        <ArrowLeft :size="16" />
        返回上一页
      </button>

      <div class="receipt-card">
        <!-- 交易状态头 -->
        <div class="receipt-header" :class="statusInfo.class">
          <component :is="statusInfo.icon" :size="48" class="status-icon" />
          <h2 class="status-title">{{ statusInfo.label }}</h2>
          <p class="status-desc">{{ statusInfo.desc }}</p>
          <div class="status-amount">¥{{ order.price.toFixed(2) }}</div>
          <button v-if="order.status === 'pending'" class="btn-pay" @click="handlePay">立即支付</button>
        </div>

        <div class="receipt-divider">
          <div class="hole left"></div>
          <div class="dash-line"></div>
          <div class="hole right"></div>
        </div>

        <!-- 交易内容区 -->
        <div class="receipt-body">
          <!-- 藏品卡片 -->
          <div class="collection-box" @click="router.push(`/collection/${order.collection.id}`)">
            <img :src="order.collection.cover" :alt="order.collection.name" class="col-cover" />
            <div class="col-info">
              <span class="col-series">{{ order.collection.seriesName }}</span>
              <h3 class="col-name">{{ order.collection.name }}</h3>
              <div class="col-meta">
                <span>{{ order.collection.creator }}</span>
                <span v-if="order.collection.tokenId" class="col-token">#{{ order.collection.tokenId }}</span>
              </div>
            </div>
            <ChevronRight :size="16" class="col-arrow" />
          </div>

          <!-- 订单明细列表 -->
          <ul class="detail-list">
            <li class="detail-item">
              <span class="detail-label">订单编号</span>
              <span class="detail-value mono">
                {{ order.orderNo }}
                <button class="icon-copy" @click="copyText(order.orderNo, 'id')">
                  <CheckCircle v-if="copied === 'id'" :size="14" class="copied" />
                  <Copy v-else :size="14" />
                </button>
              </span>
            </li>
            
            <li class="detail-item" v-if="order.chainHash">
              <span class="detail-label">交易哈希</span>
              <span class="detail-value mono hash-text">
                {{ order.chainHash.slice(0,12) }}...{{ order.chainHash.slice(-10) }}
                <button class="icon-copy" @click="copyText(order.chainHash, 'hash')">
                  <CheckCircle v-if="copied === 'hash'" :size="14" class="copied" />
                  <Copy v-else :size="14" />
                </button>
              </span>
            </li>

            <li class="detail-item">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ order.createTime }}</span>
            </li>

            <li class="detail-item" v-if="order.payTime">
              <span class="detail-label">支付时间</span>
              <span class="detail-value">{{ order.payTime }}</span>
            </li>

            <li class="detail-item" v-if="order.payMethod">
              <span class="detail-label">支付方式</span>
              <span class="detail-value">{{ order.payMethod }}</span>
            </li>
            
            <li class="detail-divider"></li>

            <li class="detail-item">
              <span class="detail-label">买家昵称</span>
              <span class="detail-value">{{ order.buyer.nickname }}</span>
            </li>

            <li class="detail-item">
              <span class="detail-label">钱包地址</span>
              <span class="detail-value mono small">{{ order.buyer.walletAddress.slice(0,8) }}...{{ order.buyer.walletAddress.slice(-6) }}</span>
            </li>
            
            <li class="detail-divider"></li>

            <li class="detail-item">
              <span class="detail-label">商品金额</span>
              <span class="detail-value">¥{{ order.price.toFixed(2) }}</span>
            </li>
            
            <li class="detail-item">
              <span class="detail-label">服务费</span>
              <span class="detail-value">免收</span>
            </li>
          </ul>
        </div>
        
        <!-- 底部 -->
        <div class="receipt-footer">
          平台采用区块链技术存证，数据不可篡改。
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail-page {
  --accent: #C6893F;
  --accent-dark: #A97030;
  --text-h: #1a1a2e;
  --text: #555;
  --text-light: #999;
  --bg: #FFFCF8;
  --bg-soft: #FFFAF4;
  --border: #f0ebe4;
  
  min-height: 100vh;
  padding: 32px 20px 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
}

.od-container {
  max-width: 540px;
  margin: 0 auto;
}

/* 返回按钮 */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  border: none;
  background: none;
  font-size: 14px;
  color: var(--text-light);
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
  margin-bottom: 24px;
}
.back-btn:hover {
  color: var(--accent);
}

/* 票据卡片设计 */
.receipt-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(198,137,63,0.08);
  overflow: hidden;
  border: 1px solid var(--border);
}

/* 状态头部 */
.receipt-header {
  padding: 40px 32px 32px;
  text-align: center;
}
.status-icon {
  margin-bottom: 16px;
}
.status-title {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
}
.status-desc {
  font-size: 14px;
  margin: 0 0 24px;
  opacity: 0.8;
}
.status-amount {
  font-size: 36px;
  font-weight: 900;
  color: var(--text-h);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.st-paid { color: #10B981; }
.st-paid .status-icon { color: #10B981; }
.st-paid .status-title { color: #10B981; }

.st-pending { color: #F59E0B; }
.st-pending .status-icon { color: #F59E0B; }
.st-pending .status-title { color: #F59E0B; }

.st-cancelled { color: #6B7280; }
.st-cancelled .status-icon { color: #6B7280; }
.st-cancelled .status-title { color: #6B7280; }

.btn-pay {
  margin-top: 24px;
  padding: 12px 36px;
  border-radius: 12px;
  background: #F59E0B;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(245,158,11,0.3);
}

/* 票据分割线（打孔设计） */
.receipt-divider {
  display: flex;
  align-items: center;
  position: relative;
  height: 20px;
  background: #fff;
}
.dash-line {
  flex: 1;
  border-top: 2px dashed var(--border);
  margin: 0 16px;
}
.hole {
  width: 24px;
  height: 24px;
  background: var(--bg);
  border-radius: 50%;
  position: absolute;
  top: -2px;
  border: 1px solid var(--border);
}
.hole.left { left: -12px; border-right-color: transparent; border-top-color: transparent; border-bottom-color: transparent; box-shadow: inset -2px 0 2px rgba(0,0,0,0.02); }
.hole.right { right: -12px; border-left-color: transparent; border-top-color: transparent; border-bottom-color: transparent; box-shadow: inset 2px 0 2px rgba(0,0,0,0.02); }

/* 票据体 */
.receipt-body {
  padding: 32px;
}

/* 藏品简易框 */
.collection-box {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-soft);
  border-radius: 12px;
  margin-bottom: 32px;
  cursor: pointer;
  transition: background 0.2s;
}
.collection-box:hover {
  background: var(--accent-bg);
}
.col-cover {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
}
.col-info {
  flex: 1;
}
.col-series {
  font-size: 11px;
  color: var(--accent);
  font-weight: 600;
}
.col-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-h);
  margin: 2px 0 4px;
}
.col-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-light);
}
.col-token {
  background: rgba(198,137,63,0.1);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: 600;
}
.col-arrow {
  color: var(--text-light);
}

/* 明细列表 */
.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.5;
}
.detail-label {
  color: var(--text-light);
  min-width: 80px;
}
.detail-value {
  color: var(--text-h);
  font-weight: 500;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 8px;
}
.detail-value.mono {
  font-family: 'SF Mono', 'Fira Code', monospace;
}
.detail-value.small {
  font-size: 13px;
}
.hash-text {
  word-break: break-all;
}
.detail-divider {
  height: 1px;
  background: var(--border);
  margin: 8px 0;
}

.icon-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-light);
  cursor: pointer;
  padding: 2px;
}
.icon-copy:hover { color: var(--accent); }
.copied { color: #10B981; }

.receipt-footer {
  text-align: center;
  padding: 20px;
  background: var(--bg-soft);
  font-size: 12px;
  color: var(--text-light);
  border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
  .receipt-header, .receipt-body { padding: 24px; }
  .status-amount { font-size: 32px; }
}
</style>
