<script setup>
/**
 * 立即购买页 - 确认订单并使用钱包余额支付
 */
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home, ChevronRight, ShoppingCart, Wallet, ShieldCheck,
  CheckCircle, AlertCircle, Loader2, ArrowLeft, Hash, Lock
} from 'lucide-vue-next'
import { apiCollectionDetail } from '../../api/collection'
import { apiCreateOrder, apiPayOrder } from '../../api/order'
import { apiWalletBalance } from '../../api/wallet'

const route = useRoute()
const router = useRouter()

// 购买状态：confirm | paying | success | fail
const buyState = ref('confirm')
const agreedTerms = ref(false)

const collection = ref({
  id: route.params.id,
  name: '',
  cover: '',
  seriesName: '',
  creator: '',
  price: 0,
  totalSupply: 0,
  currentNo: 0,
  tokenId: null
})

const wallet = ref({
  address: '',
  balance: 0
})

/** 余额是否充足 */
const canAfford = computed(() => wallet.value.balance >= collection.value.price)

/** 支付后余额 */
const remainBalance = computed(() => (wallet.value.balance - collection.value.price).toFixed(2))

// 支付成功后的订单信息
const orderResult = ref(null)
const orderId = ref(null)

const fetchCheckoutData = async () => {
  const [collectionData, walletData] = await Promise.all([
    apiCollectionDetail(route.params.id),
    apiWalletBalance()
  ])
  collection.value = {
    id: collectionData.id,
    name: collectionData.name,
    cover: collectionData.cover,
    seriesName: collectionData.Series?.name || '-',
    creator: collectionData.Series?.Creator?.name || '未知创作者',
    price: Number(collectionData.price || 0),
    totalSupply: Number(collectionData.totalSupply || 0),
    currentNo: Number(collectionData.currentNo || 0),
    tokenId: Number(collectionData.currentNo || 0) + 1
  }
  wallet.value = {
    address: walletData.address || '',
    balance: Number(walletData.balance || 0)
  }
}

/** 确认购买 */
const handlePurchase = async () => {
  if (!canAfford.value || !agreedTerms.value) return
  buyState.value = 'paying'
  try {
    const orderData = await apiCreateOrder({ collectionId: collection.value.id })
    orderId.value = orderData.orderId
    const payData = await apiPayOrder(orderData.orderId)
    wallet.value.balance -= collection.value.price
    orderResult.value = {
      orderId: payData.orderNo || String(payData.orderId),
      tokenId: payData.tokenId,
      chainHash: payData.chainHash,
      payTime: payData.paidAt
    }
    buyState.value = 'success'
  } catch {
    buyState.value = 'confirm'
  }
}

onMounted(() => {
  fetchCheckoutData()
})
</script>

<template>
  <div class="buy-page">
    <div class="buy-container">
      <!-- 返回 -->
      <button class="back-btn" @click="router.back()">
        <ArrowLeft :size="16" />
        返回藏品详情
      </button>

      <!-- 确认 & 支付中 状态 -->
      <template v-if="buyState === 'confirm' || buyState === 'paying'">
        <h1 class="page-title"><ShoppingCart :size="28" /> 确认购买</h1>

        <!-- 藏品信息卡 -->
        <div class="section">
          <h3 class="section-title">藏品信息</h3>
          <div class="item-card">
            <img :src="collection.cover" :alt="collection.name" class="item-img" />
            <div class="item-info">
              <div class="item-series">{{ collection.seriesName }}</div>
              <h2 class="item-name">{{ collection.name }}</h2>
              <p class="item-creator">创作者：{{ collection.creator }}</p>
              <div class="item-token">
                <Hash :size="13" /> 即将获得编号 #{{ collection.tokenId }}
              </div>
            </div>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="section">
          <h3 class="section-title">支付方式</h3>
          <div class="pay-method active">
            <div class="pay-left">
              <div class="pay-icon"><Wallet :size="22" /></div>
              <div>
                <div class="pay-name">钱包余额</div>
                <div class="pay-addr">{{ wallet.address.slice(0, 8) }}...{{ wallet.address.slice(-6) }}</div>
              </div>
            </div>
            <div class="pay-balance">¥{{ wallet.balance.toFixed(2) }}</div>
          </div>
          <div v-if="!canAfford" class="balance-warn">
            <AlertCircle :size="14" />
            余额不足，请先充值
          </div>
        </div>

        <!-- 金额明细 -->
        <div class="section">
          <h3 class="section-title">金额明细</h3>
          <div class="price-detail">
            <div class="price-row">
              <span>藏品价格</span>
              <span>¥{{ collection.price.toFixed(2) }}</span>
            </div>
            <div class="price-row">
              <span>平台服务费</span>
              <span class="free">免费</span>
            </div>
            <div class="price-row total">
              <span>应付金额</span>
              <span class="total-price">¥{{ collection.price.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- 购买条款 -->
        <label class="terms">
          <input v-model="agreedTerms" type="checkbox" class="terms-check" />
          <span>我已阅读并同意 <a href="#" @click.prevent>《数字藏品购买协议》</a> 和 <a href="#" @click.prevent>《用户服务协议》</a></span>
        </label>

        <!-- 底部操作 -->
        <div class="bottom-bar">
          <div class="bottom-price">
            <span class="bottom-label">应付金额</span>
            <span class="bottom-value">¥{{ collection.price.toFixed(2) }}</span>
          </div>
          <button
            class="btn-purchase"
            :class="{ disabled: !canAfford || !agreedTerms || buyState === 'paying' }"
            :disabled="!canAfford || !agreedTerms || buyState === 'paying'"
            @click="handlePurchase"
          >
            <template v-if="buyState === 'paying'">
              <Loader2 :size="18" class="spin" />
              支付中...
            </template>
            <template v-else>
              <Lock :size="16" />
              确认支付
            </template>
          </button>
        </div>

        <!-- 安全提示 -->
        <div class="security-note">
          <ShieldCheck :size="14" />
          <span>支付过程采用加密传输，资金安全有保障</span>
        </div>
      </template>

      <!-- 支付成功 -->
      <template v-if="buyState === 'success'">
        <div class="result-card success">
          <div class="result-icon">
            <CheckCircle :size="56" />
          </div>
          <h2 class="result-title">购买成功！</h2>
          <p class="result-desc">恭喜你获得 <strong>{{ collection.name }}</strong></p>

          <div class="result-info">
            <div class="result-row">
              <span class="result-label">订单编号</span>
              <span class="result-value mono">{{ orderResult.orderId }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">Token ID</span>
              <span class="result-value">#{{ orderResult.tokenId }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">链上哈希</span>
              <span class="result-value mono small">{{ orderResult.chainHash }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">支付时间</span>
              <span class="result-value">{{ orderResult.payTime }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">支付金额</span>
              <span class="result-value price">¥{{ collection.price.toFixed(2) }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">钱包余额</span>
              <span class="result-value">¥{{ remainBalance }}</span>
            </div>
          </div>

          <div class="result-actions">
            <router-link :to="`/collection/${collection.id}`" class="btn-view">查看藏品</router-link>
            <router-link to="/my-collections" class="btn-secondary">我的藏品</router-link>
            <router-link to="/market" class="btn-outline">继续逛逛</router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.buy-page {
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
  --radius: 16px;

  min-height: 100vh;
  padding: 32px 20px 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.buy-container {
  max-width: 640px;
  margin: 0 auto;
}

/* 返回 */
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

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 26px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 28px;
}
.page-title svg {
  color: var(--accent);
}

/* 区块 */
.section {
  margin-bottom: 24px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 12px;
}

/* 藏品卡 */
.item-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.item-img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: contain;
  background: var(--bg-soft);
  flex-shrink: 0;
}
.item-info {
  flex: 1;
  min-width: 0;
}
.item-series {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 4px;
}
.item-name {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 6px;
}
.item-creator {
  font-size: 13px;
  color: var(--text-light);
  margin: 0 0 10px;
}
.item-token {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  font-family: monospace;
}

/* 支付方式 */
.pay-method {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: var(--card-bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.pay-method.active {
  border-color: var(--accent);
  background: var(--accent-bg);
}
.pay-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.pay-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pay-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-h);
}
.pay-addr {
  font-size: 12px;
  color: var(--text-light);
  font-family: monospace;
  margin-top: 2px;
}
.pay-balance {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent);
}

.balance-warn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fff5f5;
  color: #e03131;
  font-size: 13px;
  font-weight: 500;
}

/* 金额明细 */
.price-detail {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  font-size: 14px;
  color: var(--text);
}
.price-row:not(:last-child) {
  border-bottom: 1px solid var(--border);
}
.free {
  color: #20C997;
  font-weight: 600;
}
.price-row.total {
  background: var(--bg-soft);
}
.total-price {
  font-size: 22px;
  font-weight: 800;
  color: var(--accent);
}

/* 条款 */
.terms {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 24px;
  cursor: pointer;
  line-height: 1.6;
}
.terms-check {
  margin-top: 4px;
  accent-color: var(--accent);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.terms a {
  color: var(--accent);
  text-decoration: none;
}
.terms a:hover {
  text-decoration: underline;
}

/* 底部栏 */
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 16px;
}
.bottom-label {
  font-size: 13px;
  color: var(--text-light);
}
.bottom-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent);
  display: block;
  margin-top: 2px;
}

.btn-purchase {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 40px;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}
.btn-purchase:hover:not(.disabled) {
  background: var(--accent-dark);
  box-shadow: 0 6px 20px rgba(198, 137, 63, 0.35);
  transform: translateY(-1px);
}
.btn-purchase.disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
}

/* 旋转动画 */
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 安全提示 */
.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-light);
}
.security-note svg {
  color: #20C997;
}

/* ===== 成功结果 ===== */
.result-card {
  text-align: center;
  padding: 48px 32px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.result-icon {
  color: #20C997;
  margin-bottom: 20px;
}

.result-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 8px;
}

.result-desc {
  font-size: 15px;
  color: var(--text);
  margin: 0 0 32px;
}
.result-desc strong {
  color: var(--accent);
}

.result-info {
  text-align: left;
  background: var(--bg-soft);
  border-radius: 12px;
  padding: 4px 0;
  margin-bottom: 32px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 20px;
}
.result-row:not(:last-child) {
  border-bottom: 1px solid var(--border);
}
.result-label {
  font-size: 13px;
  color: var(--text-light);
  flex-shrink: 0;
}
.result-value {
  font-size: 13px;
  color: var(--text-h);
  font-weight: 600;
  text-align: right;
  word-break: break-all;
  max-width: 65%;
}
.result-value.mono {
  font-family: 'SF Mono', 'Fira Code', monospace;
}
.result-value.small {
  font-size: 11px;
}
.result-value.price {
  color: var(--accent);
  font-size: 16px;
  font-weight: 800;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.btn-view {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-view:hover {
  background: var(--accent-dark);
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  border-radius: 10px;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--accent);
  color: #fff;
}
.btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 11px 28px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  color: var(--text);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 640px) {
  .item-card { flex-direction: column; align-items: center; text-align: center; }
  .item-img { width: 100%; height: auto; max-width: 200px; }
  .bottom-bar { flex-direction: column; gap: 16px; text-align: center; }
  .btn-purchase { width: 100%; justify-content: center; }
}
</style>
