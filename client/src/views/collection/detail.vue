<script setup>
/**
 * 藏品详情页 - 展示藏品完整信息、链上存证、流转记录、购买操作
 */
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home, ChevronRight, ArrowLeft, Gem, Clock, ShieldCheck,
  Hash, FileCode, Layers, Calendar, User, Award,
  ArrowRight, Share2, Heart, ExternalLink, Copy, CheckCircle,
  Flame, ShoppingCart, Gift, UserPlus, UserCheck
} from 'lucide-vue-next'
import { apiFollow, apiUnfollow, apiCheckFollow } from '../../api/follow'
import { apiCollectionDetail } from '../../api/collection'
import { useUserStore } from '../../stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 复制成功提示
const copied = ref('')

// 关注状态
const followed = ref(false)
const followLoading = ref(false)

const collection = ref({
  id: route.params.id,
  name: '',
  cover: '',
  category: 'image',
  status: 'selling',
  price: 0,
  totalSupply: 0,
  currentNo: 0,
  description: '这件蒙古长袍以辽阔草原的天空为灵感，采用传统手工缝制工艺，选用上等天蓝色绸缎为主体面料。袍身绣有精美的蒙古族传统云纹与卷草纹，每一针每一线都凝聚着非遗匠人的心血与智慧。\n\n长袍腰间饰以银质腰带扣，搭配传统蒙古族纹样的刺绣腰封，展现出蒙古族服饰特有的英武与优雅。此数字藏品完整记录了这件长袍从设计、裁剪到成衣的全过程。',
  creator: {
    id: null,
    name: '',
    avatar: '',
    bio: '',
    totalWorks: 0,
    totalSales: 0
  },
  seriesName: '',

  chain: {
    hash: '',
    contractAddress: '',
    blockHeight: 0,
    chainTime: '',
    tokenId: 0
  },
  transfers: []
})

const fetchCollectionDetail = async () => {
  const data = await apiCollectionDetail(route.params.id)
  collection.value = {
    id: data.id,
    name: data.name,
    cover: data.cover,
    category: data.fileType,
    status: data.status === 5 ? 'selling' : 'soldout',
    price: Number(data.price || 0),
    totalSupply: Number(data.totalSupply || 0),
    currentNo: Number(data.currentNo || 0),
    description: data.description || '',
    creator: {
      id: data.Series?.Creator?.id || null,
      name: data.Series?.Creator?.name || '未知创作者',
      avatar: data.Series?.Creator?.avatar || '',
      bio: data.Series?.Creator?.intro || '',
      totalWorks: data.Series?.Creator?.worksCount || 0,
      totalSales: data.Series?.Creator?.totalSales || 0
    },
    seriesName: data.Series?.name || '-',

    chain: {
      hash: data.chainHash || '-',
      contractAddress: data.contractAddress || '-',
      blockHeight: data.blockHeight || 0,
      chainTime: data.chainTime || '',
      tokenId: data.currentNo || 0
    },
    transfers: (data.transfers || []).map((t) => ({
      type: t.type,
      from: t.fromUser?.nickname || '平台铸造',
      to: t.toUser?.nickname || '-',
      time: t.createdAt,
      hash: t.chainHash || '-'
    }))
  }
}

/** 获取状态信息 */
const statusInfo = computed(() => {
  const map = {
    selling: { label: '发售中', class: 'status-selling', icon: Flame },
    soldout: { label: '已售罄', class: 'status-soldout', icon: CheckCircle }
  }
  return map[collection.value.status] || map.selling
})

/** 销售进度 */
const saleProgress = computed(() => {
  const c = collection.value
  if (c.totalSupply === 0) return 0
  return Math.round((c.currentNo / c.totalSupply) * 100)
})

/** 剩余数量 */
const remaining = computed(() => {
  return collection.value.totalSupply - collection.value.currentNo
})

/** 复制到剪贴板 */
const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = label
    setTimeout(() => { copied.value = '' }, 1500)
  } catch { /* 忽略 */ }
}

/** 查询关注状态 */
const checkFollowStatus = async () => {
  if (!userStore.token || !collection.value.creator?.id) return
  try {
    const data = await apiCheckFollow(collection.value.creator.id)
    followed.value = data.followed
  } catch { /* 未登录或其他异常忽略 */ }
}

/** 关注 / 取消关注 */
const toggleFollow = async () => {
  if (!userStore.token) {
    router.push('/login')
    return
  }
  if (followLoading.value) return
  followLoading.value = true
  try {
    if (followed.value) {
      await apiUnfollow(collection.value.creator.id)
      followed.value = false
    } else {
      await apiFollow(collection.value.creator.id)
      followed.value = true
    }
  } catch { /* 错误已由拦截器处理 */ }
  followLoading.value = false
}

onMounted(() => {
  fetchCollectionDetail()
  checkFollowStatus()
})

/** 流转类型图标与文案 */
const getTransferInfo = (type) => {
  const map = {
    mint: { label: '铸造', icon: Gem, color: '#C6893F' },
    list: { label: '上架', icon: ShoppingCart, color: '#845EF7' },
    buy: { label: '购买', icon: ShoppingCart, color: '#20C997' },
    gift: { label: '转赠', icon: Gift, color: '#FD7E14' }
  }
  return map[type] || map.buy
}
</script>

<template>
  <div class="detail-page">

    <!-- 面包屑 -->
    <div class="breadcrumb-bar">
      <div class="breadcrumb-inner">
        <router-link to="/" class="breadcrumb-item">
          <Home :size="14" /><span>首页</span>
        </router-link>
        <ChevronRight :size="14" class="breadcrumb-sep" />
        <router-link to="/market" class="breadcrumb-item">藏品市场</router-link>
        <ChevronRight :size="14" class="breadcrumb-sep" />
        <span class="breadcrumb-current">{{ collection.name }}</span>
      </div>
    </div>

    <!-- 主体内容 -->
    <main class="detail-main">
      <div class="detail-inner">
        <!-- 返回 -->
        <button class="back-btn" @click="router.back()">
          <ArrowLeft :size="16" />
          返回上一页
        </button>

        <!-- 上半区：左图 + 右信息 -->
        <div class="detail-top">
          <!-- 左侧大图 -->
          <div class="detail-cover">
            <div class="cover-wrap">
              <img :src="collection.cover" :alt="collection.name" class="cover-img" />
              <div :class="['cover-status', statusInfo.class]">
                <component :is="statusInfo.icon" :size="14" />
                <span>{{ statusInfo.label }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧信息 -->
          <div class="detail-info">
            <!-- 系列标签 -->
            <div class="info-series">{{ collection.seriesName }}</div>
            <h1 class="info-title">{{ collection.name }}</h1>

            <!-- 创作者 -->
            <div class="info-creator">
              <div class="creator-avatar">
                <User :size="18" />
              </div>
              <div class="creator-text">
                <div class="creator-name">{{ collection.creator.name }}</div>
                <div class="creator-label">创作者</div>
              </div>
              <button
                :class="['btn-follow-sm', { 'btn-followed-sm': followed }]"
                :disabled="followLoading"
                @click="toggleFollow"
              >
                <UserCheck v-if="followed" :size="13" />
                <UserPlus v-else :size="13" />
                {{ followed ? '已关注' : '关注' }}
              </button>
            </div>

            <!-- 价格区 -->
            <div class="info-price-card">
              <div class="price-label">当前价格</div>
              <div class="price-row">
                <span class="price-symbol">¥</span>
                <span class="price-value">{{ collection.price.toFixed(2) }}</span>
              </div>
              <!-- 销售进度 -->
              <div class="sale-info">
                <div class="sale-progress-bar">
                  <div class="sale-progress-fill" :style="{ width: saleProgress + '%' }"></div>
                </div>
                <div class="sale-stats">
                  <span>已售 <strong>{{ collection.currentNo }}</strong> / {{ collection.totalSupply }}</span>
                  <span>剩余 <strong>{{ remaining }}</strong> 件</span>
                </div>
              </div>
              <!-- 购买按钮 -->
              <button
                class="btn-buy"
                :class="{ disabled: collection.status === 'soldout' }"
                :disabled="collection.status === 'soldout'"
                @click="collection.status === 'selling' && router.push(`/checkout/${collection.id}`)"
              >
                <template v-if="collection.status === 'soldout'">
                  <CheckCircle :size="18" />
                  已售罄
                </template>
                <template v-else>
                  <ShoppingCart :size="18" />
                  立即购买
                </template>
              </button>
            </div>

            <!-- 快捷操作 -->
            <div class="info-actions">
              <button class="action-btn">
                <Heart :size="16" />
                <span>收藏</span>
              </button>
              <button class="action-btn">
                <Share2 :size="16" />
                <span>分享</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 下半区：标签页内容 -->
        <div class="detail-bottom">
          <!-- 藏品描述 -->
          <section class="section-card">
            <h2 class="section-title">
              <Gem :size="20" />
              藏品描述
            </h2>
            <div class="section-body desc-text">
              <p v-for="(para, i) in collection.description.split('\n\n')" :key="i">{{ para }}</p>
            </div>
          </section>

          <!-- 链上信息 -->
          <section class="section-card">
            <h2 class="section-title">
              <ShieldCheck :size="20" />
              链上存证信息
            </h2>
            <div class="section-body">
              <div class="chain-grid">
                <div class="chain-item">
                  <div class="chain-label">
                    <Hash :size="14" />
                    链上哈希
                  </div>
                  <div class="chain-value">
                    <span class="hash-text">{{ collection.chain.hash }}</span>
                    <button class="copy-btn" @click="copyText(collection.chain.hash, 'hash')">
                      <Copy v-if="copied !== 'hash'" :size="14" />
                      <CheckCircle v-else :size="14" class="copied" />
                    </button>
                  </div>
                </div>
                <div class="chain-item">
                  <div class="chain-label">
                    <FileCode :size="14" />
                    合约地址
                  </div>
                  <div class="chain-value">
                    <span class="hash-text">{{ collection.chain.contractAddress }}</span>
                    <button class="copy-btn" @click="copyText(collection.chain.contractAddress, 'contract')">
                      <Copy v-if="copied !== 'contract'" :size="14" />
                      <CheckCircle v-else :size="14" class="copied" />
                    </button>
                  </div>
                </div>
                <div class="chain-item">
                  <div class="chain-label">
                    <Layers :size="14" />
                    区块高度
                  </div>
                  <div class="chain-value">
                    <span>{{ collection.chain.blockHeight.toLocaleString() }}</span>
                  </div>
                </div>
                <div class="chain-item">
                  <div class="chain-label">
                    <Calendar :size="14" />
                    上链时间
                  </div>
                  <div class="chain-value">
                    <span>{{ new Date(collection.chain.chainTime).toLocaleString('zh-CN') }}</span>
                  </div>
                </div>
                <div class="chain-item">
                  <div class="chain-label">
                    <Award :size="14" />
                    Token ID
                  </div>
                  <div class="chain-value">
                    <span>#{{ collection.chain.tokenId }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 流转记录 -->
          <section class="section-card">
            <h2 class="section-title">
              <ArrowRight :size="20" />
              流转记录
            </h2>
            <div class="section-body">
              <div class="timeline">
                <div v-for="(t, i) in collection.transfers" :key="i" class="timeline-item">
                  <div class="timeline-dot" :style="{ background: getTransferInfo(t.type).color }">
                    <component :is="getTransferInfo(t.type).icon" :size="14" color="#fff" />
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <span class="timeline-type" :style="{ color: getTransferInfo(t.type).color }">
                        {{ getTransferInfo(t.type).label }}
                      </span>
                      <span class="timeline-time">{{ t.time }}</span>
                    </div>
                    <div class="timeline-detail">
                      <span>{{ t.from }}</span>
                      <ArrowRight :size="12" class="timeline-arrow" />
                      <span>{{ t.to }}</span>
                    </div>
                    <div class="timeline-hash">
                      <Hash :size="11" />
                      {{ t.hash }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 创作者信息 -->
          <section class="section-card">
            <h2 class="section-title">
              <User :size="20" />
              关于创作者
            </h2>
            <div class="section-body">
              <div class="creator-card">
                <div class="creator-card-avatar">
                  <User :size="28" />
                </div>
                <div class="creator-card-info">
                  <div class="creator-card-header">
                    <h3 class="creator-card-name">{{ collection.creator.name }}</h3>
                    <button
                      :class="['btn-follow', { 'btn-followed': followed }]"
                      :disabled="followLoading"
                      @click="toggleFollow"
                    >
                      <UserCheck v-if="followed" :size="14" />
                      <UserPlus v-else :size="14" />
                      {{ followed ? '已关注' : '关注' }}
                    </button>
                  </div>
                  <p class="creator-card-bio">{{ collection.creator.bio }}</p>
                  <div class="creator-card-stats">
                    <div class="creator-stat">
                      <span class="creator-stat-value">{{ collection.creator.totalWorks }}</span>
                      <span class="creator-stat-label">作品</span>
                    </div>
                    <div class="creator-stat">
                      <span class="creator-stat-value">{{ collection.creator.totalSales.toLocaleString() }}</span>
                      <span class="creator-stat-label">总销量</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>


  </div>
</template>

<style scoped>
/* ===== 变量 ===== */
.detail-page {
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
  background: var(--bg);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ===== 导航栏 ===== */
.detail-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 252, 248, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo { display: flex; align-items: center; }
.logo-image { width: 120px; height: 120px; object-fit: contain; }

.nav-links { display: flex; gap: 32px; }
.nav-link {
  font-size: 14px; color: var(--text); text-decoration: none;
  font-weight: 500; transition: color 0.2s;
}
.nav-link:hover, .nav-link.active { color: var(--accent); }

.nav-actions { display: flex; gap: 10px; }
.btn-nav-outline {
  display: inline-flex; align-items: center; padding: 7px 18px;
  border-radius: 8px; background: transparent; color: var(--text-h);
  font-size: 13px; font-weight: 500; border: 1.5px solid var(--border);
  text-decoration: none; transition: all 0.2s;
}
.btn-nav-outline:hover { border-color: var(--accent); color: var(--accent); }

.btn-nav-primary {
  display: inline-flex; align-items: center; padding: 8px 22px;
  border-radius: 8px; background: var(--accent); color: #fff;
  font-size: 13px; font-weight: 600; border: none;
  text-decoration: none; transition: all 0.2s;
}
.btn-nav-primary:hover { background: var(--accent-dark); }

/* ===== 面包屑 ===== */
.breadcrumb-bar {
  border-bottom: 1px solid var(--border);
  background: var(--card-bg);
}
.breadcrumb-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 40px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.breadcrumb-item {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 13px; color: var(--text-light); text-decoration: none;
  transition: color 0.2s;
}
.breadcrumb-item:hover { color: var(--accent); }
.breadcrumb-sep { color: var(--text-light); opacity: 0.4; }
.breadcrumb-current { font-size: 13px; color: var(--text-h); font-weight: 500; }

/* ===== 主体 ===== */
.detail-main { padding: 40px 0 60px; }
.detail-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

.back-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 0; border: none; background: none; font-size: 14px; color: var(--text-light); cursor: pointer; transition: color 0.2s; font-family: inherit; margin-bottom: 24px; }
.back-btn:hover { color: var(--accent); }

/* ===== 上半区 ===== */
.detail-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

/* 左侧封面 */
.detail-cover { position: relative; }
.cover-wrap {
  position: sticky;
  top: 100px;
  background: var(--card-bg);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  padding: 16px;
}
.cover-img {
  width: 100%;
  border-radius: 12px;
  display: block;
}
.cover-status {
  position: absolute;
  top: 28px; left: 28px;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px;
  font-size: 13px; font-weight: 700; color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.status-upcoming { background: rgba(253, 126, 20, 0.9); }
.status-selling { background: rgba(32, 201, 151, 0.9); }
.status-soldout { background: rgba(153, 153, 153, 0.85); }

/* 右侧信息 */
.detail-info { display: flex; flex-direction: column; gap: 20px; }

.info-series {
  display: inline-block;
  width: fit-content;
  padding: 4px 14px;
  border-radius: 6px;
  background: var(--accent-bg);
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
}

.info-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-h);
  line-height: 1.35;
  letter-spacing: -0.5px;
  margin: 0;
}

/* 创作者 */
.info-creator {
  display: flex;
  align-items: center;
  gap: 12px;
}
.creator-avatar {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: var(--accent-bg);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
}
.creator-text { flex: 1; }
.creator-name { font-size: 14px; font-weight: 600; color: var(--text-h); }
.creator-label { font-size: 12px; color: var(--text-light); }

/* 价格卡片 */
.info-price-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}
.price-label { font-size: 13px; color: var(--text-light); margin-bottom: 8px; }
.price-row { display: flex; align-items: baseline; margin-bottom: 20px; }
.price-symbol { font-size: 18px; font-weight: 700; color: var(--accent); margin-right: 4px; }
.price-value { font-size: 36px; font-weight: 800; color: var(--accent); letter-spacing: -1px; }

.sale-info { margin-bottom: 20px; }
.sale-progress-bar {
  height: 8px; background: var(--border); border-radius: 4px;
  overflow: hidden; margin-bottom: 10px;
}
.sale-progress-fill {
  height: 100%; background: var(--accent); border-radius: 4px;
  transition: width 0.6s ease;
}
.sale-stats {
  display: flex; justify-content: space-between;
  font-size: 13px; color: var(--text-light);
}
.sale-stats strong { color: var(--text-h); font-weight: 700; }

/* 购买按钮 */
.btn-buy {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 16px; border: none; border-radius: 12px;
  background: var(--accent); color: #fff;
  font-size: 16px; font-weight: 700; cursor: pointer;
  transition: all 0.3s; font-family: inherit;
}
.btn-buy:hover:not(.disabled) {
  background: var(--accent-dark);
  box-shadow: 0 8px 25px rgba(198, 137, 63, 0.35);
  transform: translateY(-1px);
}
.btn-buy.disabled {
  background: #ddd; color: #999; cursor: not-allowed;
}

/* 快捷操作 */
.info-actions { display: flex; gap: 12px; }
.action-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 20px; border-radius: 10px;
  border: 1.5px solid var(--border); background: var(--card-bg);
  font-size: 13px; font-weight: 500; color: var(--text);
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}
.action-btn:hover {
  border-color: var(--accent); color: var(--accent); background: var(--accent-bg);
}

/* ===== 下半区 section 卡片 ===== */
.detail-bottom {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.section-title {
  display: flex; align-items: center; gap: 10px;
  font-size: 17px; font-weight: 700; color: var(--text-h);
  margin: 0; padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.section-title svg { color: var(--accent); }

.section-body { padding: 24px; }

/* 描述 */
.desc-text p {
  font-size: 15px; line-height: 1.9; color: var(--text);
  margin: 0 0 16px;
}
.desc-text p:last-child { margin-bottom: 0; }

/* 链上信息 */
.chain-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.chain-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--bg-soft);
}
.chain-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--text-light);
  white-space: nowrap; min-width: 100px;
}
.chain-label svg { color: var(--accent); }
.chain-value {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--text-h); font-weight: 500;
  word-break: break-all; flex: 1;
  font-family: 'SF Mono', 'Fira Code', monospace;
}
.hash-text {
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 400px;
}
.copy-btn {
  flex-shrink: 0; width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: var(--card-bg); border-radius: 6px;
  cursor: pointer; color: var(--text-light); transition: all 0.2s;
}
.copy-btn:hover { color: var(--accent); background: var(--accent-bg); }
.copied { color: #20C997; }

/* 流转记录时间线 */
.timeline { position: relative; padding-left: 48px; }
.timeline::before {
  content: ''; position: absolute; left: 15px; top: 20px; bottom: 20px;
  width: 2px; background: var(--border);
}

.timeline-item {
  position: relative; display: flex; gap: 16px;
  padding: 16px 0;
}
.timeline-item:first-child { padding-top: 0; }
.timeline-item:last-child { padding-bottom: 0; }

.timeline-dot {
  position: absolute; left: -48px;
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; z-index: 1;
  box-shadow: 0 0 0 4px var(--card-bg);
}

.timeline-content { flex: 1; min-width: 0; }
.timeline-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 6px;
}
.timeline-type { font-size: 14px; font-weight: 700; }
.timeline-time { font-size: 12px; color: var(--text-light); }
.timeline-detail {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--text);
}
.timeline-arrow { color: var(--text-light); }
.timeline-hash {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--text-light); margin-top: 4px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

/* 关注按钮（顶部小尺寸） */
.btn-follow-sm {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 16px; border-radius: 8px; margin-left: auto;
  background: var(--accent); color: #fff;
  font-size: 12px; font-weight: 600; border: none;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
}
.btn-follow-sm:hover { background: var(--accent-dark); }
.btn-followed-sm {
  background: transparent; color: var(--text-light);
  border: 1.5px solid var(--border);
}
.btn-followed-sm:hover { border-color: #e03131; color: #e03131; background: #fff5f5; }

/* 关注按钮（底部卡片） */
.btn-follow {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 22px; border-radius: 8px;
  background: var(--accent); color: #fff;
  font-size: 13px; font-weight: 600; border: none;
  cursor: pointer; transition: all 0.2s; font-family: inherit;
  flex-shrink: 0;
}
.btn-follow:hover { background: var(--accent-dark); box-shadow: 0 4px 12px rgba(198,137,63,0.25); }
.btn-followed {
  background: transparent; color: var(--text-light);
  border: 1.5px solid var(--border);
}
.btn-followed:hover { border-color: #e03131; color: #e03131; background: #fff5f5; }
.btn-follow:disabled, .btn-follow-sm:disabled { opacity: 0.6; cursor: wait; }

/* 创作者卡片 */
.creator-card {
  display: flex; gap: 20px; align-items: flex-start;
}
.creator-card-avatar {
  width: 60px; height: 60px; border-radius: 50%;
  background: var(--accent-bg);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent); flex-shrink: 0;
}
.creator-card-info { flex: 1; }
.creator-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.creator-card-name { font-size: 17px; font-weight: 700; color: var(--text-h); margin: 0; }
.creator-card-bio { font-size: 14px; line-height: 1.7; color: var(--text); margin: 0 0 16px; }
.creator-card-stats { display: flex; gap: 32px; }
.creator-stat { display: flex; flex-direction: column; }
.creator-stat-value { font-size: 22px; font-weight: 800; color: var(--text-h); }
.creator-stat-label { font-size: 12px; color: var(--text-light); }

/* ===== 页脚 ===== */
.detail-footer {
  text-align: center; padding: 32px 40px;
  border-top: 1px solid var(--border);
  font-size: 13px; color: var(--text-light);
}
.detail-footer p { margin: 0; }

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .nav-links, .nav-actions { display: none; }
  .nav-inner, .breadcrumb-inner, .detail-inner { padding-left: 20px; padding-right: 20px; }

  .detail-top {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .cover-wrap { position: static; }
  .info-title { font-size: 22px; }
  .price-value { font-size: 28px; }
  .hash-text { max-width: 200px; }
}
</style>
