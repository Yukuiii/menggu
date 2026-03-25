<script setup>
/**
 * 我的藏品详情页
 * 仅用于展示用户已经拥有的藏品，包含下载、转赠及链上凭证等所有者功能
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Download, Send, CheckCircle,
  Hash, Layers, ArrowRight, Copy, ShieldCheck, User, Gem, ShoppingCart, Gift
} from 'lucide-vue-next'
import { ElMessage, ElMessageBox } from 'element-plus'
import { apiMyCollectionDetail, apiTransfer, getDownloadUrl } from '../../api/userCollection'

const route = useRoute()
const router = useRouter()
const copied = ref('')

const userCol = ref({
  id: route.params.id || '',
  tokenId: 0,
  acquireType: 'purchase',
  acquireTime: '',
  isTransferable: false,
  transferCooldownAt: null,
  chainHash: '',
  collection: {
    id: '',
    name: '',
    cover: '',

    creator: '',
    description: '',
    contractAddress: '',
    blockHeight: '',
    fileType: 'image',
    fileUrl: ''
  }
})

const transfers = ref([])

/** 获取流转类型图标与文案 */
const getTransferInfo = (type) => {
  const map = {
    mint: { label: '铸造', icon: Gem, color: '#C6893F' },
    purchase: { label: '购买', icon: ShoppingCart, color: '#20C997' },
    gift: { label: '转赠', icon: Gift, color: '#FD7E14' }
  }
  return map[type] || map.purchase
}

const fetchMyCollectionDetail = async () => {
  const data = await apiMyCollectionDetail(route.params.id)
  userCol.value = {
    id: data.id,
    tokenId: data.tokenId,
    acquireType: data.acquireType,
    acquireTime: data.acquireTime ? new Date(data.acquireTime).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '-',
    isTransferable: data.isTransferable,
    transferCooldownAt: data.transferCooldownAt,
    chainHash: data.chainHash,
    collection: {
      id: data.Collection?.id,
      name: data.Collection?.name || '',
      cover: data.Collection?.cover || '',
      creator: data.Collection?.Creator?.name || '未知创作者',
      description: data.Collection?.description || '',
      contractAddress: data.Collection?.contractAddress || '',
      blockHeight: data.Collection?.blockHeight || '',
      fileType: data.Collection?.fileType || 'image',
      fileUrl: data.Collection?.fileUrl || ''
    }
  }
  transfers.value = (data.transfers || []).map((item) => ({
    id: item.id,
    type: item.type,
    from: item.fromUser?.nickname || '',
    to: item.toUser?.nickname || '我',
    time: item.createdAt ? new Date(item.createdAt).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) : '-',
    hash: item.chainHash ? `${item.chainHash.slice(0, 10)}...${item.chainHash.slice(-8)}` : '-'
  }))
}

/** 复制文本 */
const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text);
    copied.value = label;
    setTimeout(() => copied.value = '', 1500)
  } catch {}
}

/** 下载原文件 */
const handleDownload = () => {
  window.open(getDownloadUrl(route.params.id), '_blank')
}

/** 转赠操作 */
const handleGift = async () => {
  if (!userCol.value.isTransferable) {
    ElMessage.warning('该藏品还在冷却期，暂不可转赠')
    return
  }
  try {
    const { value: recipientAddress } = await ElMessageBox.prompt(
      '请输入接收方的钱包地址',
      '转赠藏品',
      {
        confirmButtonText: '确认转赠',
        cancelButtonText: '取消',
        inputPlaceholder: '0x...',
        inputPattern: /^0x[a-fA-F0-9]{40}$/,
        inputErrorMessage: '请输入有效的钱包地址（0x 开头的 42 位字符）'
      }
    )
    if (!recipientAddress) return
    await apiTransfer(route.params.id, recipientAddress)
    ElMessage.success('转赠成功！')
    // 转赠成功后，该藏品已不属于当前用户，跳转回我的藏品列表
    router.push('/my-collections')
  } catch {
    // 用户取消，不做处理
  }
}

onMounted(() => {
  fetchMyCollectionDetail()
})
</script>

<template>
  <div class="my-detail-page">
    <div class="detail-container">
      
      <!-- 返回与面包屑区 -->
      <div class="header-actions">
        <button class="back-btn" @click="router.back()">
          <ArrowLeft :size="16" />
          返回我的藏品
        </button>
        <span class="owner-badge"><ShieldCheck :size="14" /> 您是该藏品的合法持有者</span>
      </div>

      <!-- 核心信息卡片 -->
      <div class="hero-card">
        <div class="hero-left">
          <div class="cover-wrapper">
            <img :src="userCol.collection.cover" :alt="userCol.collection.name" class="hero-img" />
            <div class="token-stamp">#{{ userCol.tokenId }}</div>
          </div>
        </div>
        
        <div class="hero-right">
          <p class="h-series">{{ userCol.collection.creator }}</p>
          <h1 class="h-title">{{ userCol.collection.name }}</h1>
          <p class="h-creator">由 <strong>{{ userCol.collection.creator }}</strong> 发行</p>
          
          <div class="h-tags">
            <span class="tag-item">3D数字服饰</span>
            <span class="tag-item">版权品</span>
          </div>

          <p class="h-desc">{{ userCol.collection.description }}</p>

          <!-- 持有者专属操作 -->
          <div class="owner-actions">
            <button class="btn-primary" @click="handleDownload">
              <Download :size="18" /> 获取高清原文件
            </button>
            <button 
              class="btn-outline" 
              :class="{ disabled: !userCol.isTransferable }"
              @click="handleGift"
            >
              <Send :size="18" /> 
              {{ userCol.isTransferable ? '转赠朋友' : '冷却期中' }}
            </button>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <!-- 链上凭证区块 -->
        <section class="info-section">
          <h3 class="section-title"><Hash :size="20" class="sec-icon" /> 链上存证</h3>
          <ul class="cert-list">
            <li>
              <span>获取方式</span>
              <strong>{{ userCol.acquireType === 'purchase' ? '购买获取' : (userCol.acquireType === 'gift' ? '好友转赠' : '空投/铸造') }}</strong>
            </li>
            <li>
              <span>获取时间</span>
              <span>{{ userCol.acquireTime }}</span>
            </li>
            <li>
              <span>合约地址</span>
              <span class="mono">
                {{ userCol.collection.contractAddress.slice(0, 10) }}...{{ userCol.collection.contractAddress.slice(-8) }}
                <button class="btn-copy" @click="copyText(userCol.collection.contractAddress, 'contract')">
                  <CheckCircle v-if="copied === 'contract'" :size="14" class="copied" />
                  <Copy v-else :size="14" />
                </button>
              </span>
            </li>
            <li>
              <span>交易哈希</span>
              <span class="mono">
                {{ userCol.chainHash.slice(0, 10) }}...{{ userCol.chainHash.slice(-8) }}
                <button class="btn-copy" @click="copyText(userCol.chainHash, 'hash')">
                  <CheckCircle v-if="copied === 'hash'" :size="14" class="copied" />
                  <Copy v-else :size="14" />
                </button>
              </span>
            </li>
            <li>
              <span>最后确认区块</span>
              <span>#{{ userCol.collection.blockHeight }}</span>
            </li>
          </ul>
        </section>

        <!-- 流转记录区块 -->
        <section class="info-section">
          <h3 class="section-title"><Layers :size="20" class="sec-icon" /> 流转记录</h3>
          <div class="timeline">
            <div v-for="tf in transfers" :key="tf.id" class="timeline-item">
              <div class="timeline-dot" :style="{ background: getTransferInfo(tf.type).color }">
                <component :is="getTransferInfo(tf.type).icon" :size="14" color="#fff" />
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-type" :style="{ color: getTransferInfo(tf.type).color }">
                    {{ getTransferInfo(tf.type).label }}
                  </span>
                  <span class="timeline-time">{{ tf.time }}</span>
                </div>
                <div class="timeline-detail">
                  <User :size="12" />
                  <span v-if="tf.from">{{ tf.from }}</span>
                  <span v-else class="text-light">首发铸造</span>
                  <ArrowRight :size="12" class="timeline-arrow" />
                  <span>{{ tf.to }}</span>
                </div>
                <div class="timeline-hash">
                  <Hash :size="11" />
                  {{ tf.hash }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  </div>
</template>

<style scoped>
.my-detail-page {
  --accent: #C6893F; --accent-dark: #A97030; --accent-bg: #FFF8EE;
  --text-h: #1a1a2e; --text: #555; --text-light: #999;
  --bg: #FFFCF8; --bg-soft: #FFFAF4; --border: #f0ebe4;
  --card-bg: #fff; --radius: 20px;
  
  min-height: 100vh;
  padding: 32px 0 80px;
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 40px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
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
}
.back-btn:hover { color: var(--accent); }
.owner-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(to right, #f0fdf4, #dcfce7);
  color: #10B981;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

/* 核心英雄区 */
.hero-card {
  display: flex;
  gap: 48px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(198,137,63,0.05);
}
.hero-left {
  flex-shrink: 0;
  width: 360px;
}
.cover-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  background: var(--bg-soft);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.cover-wrapper:hover .hero-img {
  transform: scale(1.03);
}
.token-stamp {
  position: absolute;
  top: 16px; left: 16px;
  background: rgba(26,26,46,0.85);
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-family: "SF Mono", monospace;
  font-weight: 700;
  font-size: 14px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
}

.hero-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.h-series {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  margin: 0 0 8px;
  letter-spacing: 1px;
}
.h-title {
  font-size: 32px;
  font-weight: 900;
  color: var(--text-h);
  margin: 0 0 12px;
  line-height: 1.3;
}
.h-creator {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 20px;
}
.h-creator strong { color: var(--text); }
.h-tags {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}
.tag-item {
  padding: 4px 10px;
  background: var(--bg-soft);
  color: var(--text);
  font-size: 12px;
  border-radius: 6px;
  font-weight: 500;
}
.h-desc {
  font-size: 15px;
  color: var(--text);
  line-height: 1.6;
  flex: 1;
}

/* 操作按群 */
.owner-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(198,137,63,0.3);
  transition: all 0.2s;
}
.btn-primary:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(198,137,63,0.35);
}
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  background: #fff;
  color: var(--text-h);
  font-size: 16px;
  font-weight: 700;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover:not(.disabled) {
  border-color: var(--accent);
  color: var(--accent);
}
.btn-outline.disabled {
  background: #f9fafb;
  color: #d1d5db;
  border-color: #f3f4f6;
  cursor: not-allowed;
}

/* 双列网格 */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.info-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
}
.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 24px;
}
.sec-icon {
  color: var(--accent);
}

/* 凭证列表 */
.cert-list {
  list-style: none;
  margin: 0; padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.cert-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text);
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--border);
}
.cert-list li:last-child {
  border-bottom: none; padding-bottom: 0;
}
.cert-list li span:first-child {
  color: var(--text-light);
}
.mono {
  font-family: "SF Mono", monospace;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-h);
}
.btn-copy {
  border: none;
  background: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 2px;
  display: inline-flex;
}
.btn-copy:hover { color: var(--accent); }
.copied { color: #10B981; }

/* 流转记录时间线 */
.timeline { position: relative; padding-left: 48px; }
.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background: var(--border);
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 16px;
  padding: 16px 0;
}
.timeline-item:first-child { padding-top: 0; }
.timeline-item:last-child { padding-bottom: 0; }

.timeline-dot {
  position: absolute;
  left: -48px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
  box-shadow: 0 0 0 4px var(--card-bg);
}

.timeline-content {
  flex: 1;
  min-width: 0;
}
.timeline-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.timeline-type {
  font-size: 14px;
  font-weight: 700;
}
.timeline-time { font-size: 12px; color: var(--text-light); }
.timeline-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text);
}
.text-light { color: var(--text-light); }
.timeline-arrow { color: var(--text-light); }
.timeline-hash {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-light);
  margin-top: 4px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

@media (max-width: 768px) {
  .detail-container { padding: 0 20px; }
  .hero-card { flex-direction: column; padding: 24px; gap: 24px; }
  .hero-left { width: 100%; max-width: 360px; margin: 0 auto; }
  .detail-grid { grid-template-columns: 1fr; }
  .owner-actions { flex-direction: column; }
}
</style>
