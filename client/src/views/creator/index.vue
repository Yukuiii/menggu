<script setup>
/**
 * 创作者工作台 - 申请入驻、管理藏品发布、审核状态、收益统计
 */
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Palette, Plus, Clock, CheckCircle,
  XCircle, Edit3, TrendingUp, DollarSign, Package,
  ShoppingBag, Send, UserPlus
} from 'lucide-vue-next'
import { apiCreatorProfile, apiCreatorStats, apiCreatorWorks, apiCreatorApply } from '../../api/creator'

const router = useRouter()
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'pending', label: '审核中' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已拒绝' }
]

const stats = ref({
  totalWorks: 0,
  totalSales: 0,
  totalRevenue: 0,
  avgPrice: 0
})

const works = ref([])

/** 创作者状态：null未申请 / 0审核中 / 1已通过 / 2已拒绝 */
const creatorStatus = ref(null)
const applying = ref(false)
const pageLoading = ref(true)

/** 入驻申请表单 */
const applyForm = ref({
  name: '',
  intro: '',
  portfolio: '',
  contact: '',
  certifiedType: 'individual'
})

const getFileTypeLabel = (type) => {
  if (type === 'image') return '服饰图鉴'
  if (type === 'audio') return '音频'
  if (type === 'video') return '工艺视频'
  if (type === '3d') return '3D 模型'
  return '-'
}

/** 加载创作者信息 */
const fetchCreatorData = async () => {
  try {
    const profile = await apiCreatorProfile()

    // 未申请过创作者
    if (!profile) {
      creatorStatus.value = null
      return
    }

    creatorStatus.value = profile.status

    // 只有审核通过才加载统计和作品
    if (profile.status === 1) {
      const [statsData, worksData] = await Promise.all([
        apiCreatorStats(),
        apiCreatorWorks({ page: 1, limit: 100 })
      ])
      stats.value = {
        totalWorks: Number(statsData.worksCount || 0),
        totalSales: Number(statsData.totalSales || 0),
        totalRevenue: Number(statsData.totalRevenue || 0),
        avgPrice: Number(statsData.totalSales || 0) > 0
          ? (Number(statsData.totalRevenue || 0) / Number(statsData.totalSales || 0)).toFixed(2)
          : 0
      }
      works.value = (worksData.list || []).map((item) => ({
        id: item.id,
        name: item.name,
        cover: item.cover || '',
        status: item.status === 0 ? 'draft' : item.status === 1 ? 'pending' : item.status === 2 ? 'approved' : 'rejected',
        category: getFileTypeLabel(item.fileType),
        seriesName: item.Series?.name || '-',
        price: Number(item.price || 0),
        totalSupply: Number(item.totalSupply || 0),
        sold: Number(item.currentNo || 0),
        createTime: item.createdAt ? item.createdAt.slice(0, 10) : '',
        approveTime: item.updatedAt ? item.updatedAt.slice(0, 10) : '',
        rejectReason: item.rejectReason || ''
      }))
    }
  } catch {
    // 加载失败保持默认状态
  } finally {
    pageLoading.value = false
  }
}

/** 提交入驻申请 */
const handleApply = async () => {
  if (!applyForm.value.name) {
    ElMessage.warning('请填写创作者名称')
    return
  }
  applying.value = true
  try {
    await apiCreatorApply(applyForm.value)
    ElMessage.success('申请已提交，请等待审核')
    creatorStatus.value = 0
  } catch (e) {
    // 拦截器已处理
  } finally {
    applying.value = false
  }
}

onMounted(() => {
  fetchCreatorData()
})

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

        <!-- 加载中 -->
        <div v-if="pageLoading" class="status-card">
          <Clock :size="40" style="color: var(--accent); animation: spin 1.5s linear infinite;" />
          <h2>加载中...</h2>
        </div>

        <!-- ========== 未申请：入驻申请表单 ========== -->
        <template v-else-if="creatorStatus === null">
          <div class="apply-section">
            <div class="apply-header">
              <UserPlus :size="48" class="apply-icon" />
              <h1>申请成为创作者</h1>
              <p>加入我们，发行属于你的蒙古服饰非遗数字藏品</p>
            </div>

            <form class="apply-form" @submit.prevent="handleApply">
              <div class="form-group">
                <label class="form-label">创作者名称 *</label>
                <input v-model="applyForm.name" type="text" class="form-input" placeholder="您的创作者名称或工作室名" required />
              </div>
              <div class="form-group">
                <label class="form-label">简介</label>
                <textarea v-model="applyForm.intro" class="form-input textarea" placeholder="介绍您的创作背景和风格..."
                  rows="4"></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">作品集链接</label>
                  <input v-model="applyForm.portfolio" type="text" class="form-input" placeholder="个人网站或作品集链接" />
                </div>
                <div class="form-group">
                  <label class="form-label">联系方式</label>
                  <input v-model="applyForm.contact" type="text" class="form-input" placeholder="邮箱或手机号" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">认证类型</label>
                <div class="type-options">
                  <label :class="['type-option', { active: applyForm.certifiedType === 'individual' }]">
                    <input type="radio" v-model="applyForm.certifiedType" value="individual" />
                    <span class="type-dot"></span>
                    <span class="type-text">个人创作者</span>
                  </label>
                  <label :class="['type-option', { active: applyForm.certifiedType === 'studio' }]">
                    <input type="radio" v-model="applyForm.certifiedType" value="studio" />
                    <span class="type-dot"></span>
                    <span class="type-text">工作室</span>
                  </label>
                  <label :class="['type-option', { active: applyForm.certifiedType === 'institution' }]">
                    <input type="radio" v-model="applyForm.certifiedType" value="institution" />
                    <span class="type-dot"></span>
                    <span class="type-text">机构</span>
                  </label>
                </div>
              </div>
              <button type="submit" class="btn-apply" :disabled="applying">
                <Send :size="16" />
                {{ applying ? '提交中...' : '提交申请' }}
              </button>
            </form>
          </div>
        </template>

        <!-- ========== 审核中 ========== -->
        <template v-else-if="creatorStatus === 0">
          <div class="status-card pending-card">
            <Clock :size="56" class="status-icon" />
            <h2>申请审核中</h2>
            <p>您的创作者入驻申请已提交，我们会尽快完成审核，请耐心等待。</p>
          </div>
        </template>

        <!-- ========== 已拒绝 ========== -->
        <template v-else-if="creatorStatus === 2">
          <div class="status-card rejected-card">
            <XCircle :size="56" class="status-icon" />
            <h2>申请未通过</h2>
            <p>很抱歉，您的入驻申请未通过审核。您可以修改信息后重新申请。</p>
            <button class="btn-apply" @click="creatorStatus = null">重新申请</button>
          </div>
        </template>

        <!-- ========== 已通过：正常工作台 ========== -->
        <template v-else>
          <!-- 欢迎区 -->
          <div class="welcome">
            <div class="welcome-text">
              <h1>
                <Palette :size="32" /> 创作者工作台
              </h1>
              <p>管理你的数字藏品，查看审核状态与收益数据</p>
            </div>
            <button class="btn-create" @click="router.push('/publish')">
              <Plus :size="18" /> 发布新藏品
            </button>
          </div>

          <!-- 统计卡片 -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(198,137,63,0.1);">
                <Package :size="22" style="color: #C6893F;" />
              </div>
              <div class="stat-body">
                <span class="stat-value">{{ stats.totalWorks }}</span>
                <span class="stat-label">发布作品</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(32,201,151,0.1);">
                <ShoppingBag :size="22" style="color: #20C997;" />
              </div>
              <div class="stat-body">
                <span class="stat-value">{{ stats.totalSales.toLocaleString() }}</span>
                <span class="stat-label">总销量</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(253,126,20,0.1);">
                <DollarSign :size="22" style="color: #FD7E14;" />
              </div>
              <div class="stat-body">
                <span class="stat-value">¥{{ stats.totalRevenue.toLocaleString() }}</span>
                <span class="stat-label">总收益</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon" style="background: rgba(132,94,247,0.1);">
                <TrendingUp :size="22" style="color: #845EF7;" />
              </div>
              <div class="stat-body">
                <span class="stat-value">¥{{ stats.avgPrice }}</span>
                <span class="stat-label">均价</span>
              </div>
            </div>
          </div>

          <!-- 标签页 -->
          <div class="tabs-bar">
            <div class="tabs">
              <button v-for="t in tabs" :key="t.key" :class="['tab', { active: activeTab === t.key }]"
                @click="activeTab = t.key">
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
                  <button class="btn-edit">
                    <Edit3 :size="14" /> 继续编辑
                  </button>
                </template>
                <template v-else-if="work.status === 'pending'">
                  <span class="pending-text">
                    <Clock :size="14" /> 等待审核
                  </span>
                </template>
                <template v-else>
                  <button class="btn-edit">
                    <Edit3 :size="14" /> 重新提交
                  </button>
                </template>
              </div>
            </div>
          </div>

          <div v-else class="empty">
            <Palette :size="48" class="empty-icon" />
            <h3>暂无作品</h3>
            <p>开始发布你的第一件数字藏品吧</p>
            <button class="btn-create-sm" @click="router.push('/publish')">
              <Plus :size="14" /> 发布藏品
            </button>
          </div>
        </template>

      </div>
    </main>
  </div>
</template>

<style scoped>
.creator-page {
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

.page-main {
  padding: 32px 0 60px;
}

.main-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

/* ===== 申请入驻 ===== */
.apply-section {
  max-width: 640px;
  margin: 0 auto;
}

.apply-header {
  text-align: center;
  margin-bottom: 36px;
}

.apply-icon {
  color: var(--accent);
  margin-bottom: 16px;
}

.apply-header h1 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 8px;
}

.apply-header p {
  font-size: 15px;
  color: var(--text);
  margin: 0;
}

.apply-form {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-h);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-h);
  background: var(--bg-soft);
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(198, 137, 63, 0.1);
  background: #fff;
}

.form-input.textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input.select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  cursor: pointer;
}

/* 认证类型单选组 */
.type-options {
  display: flex;
  gap: 12px;
}

.type-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: var(--bg-soft);
  cursor: pointer;
  transition: all 0.2s;
}

.type-option:hover {
  border-color: var(--accent);
  background: var(--accent-bg);
}

.type-option.active {
  border-color: var(--accent);
  background: var(--accent-bg);
  box-shadow: 0 0 0 3px rgba(198, 137, 63, 0.1);
}

.type-option input {
  display: none;
}

.type-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border);
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s;
}

.type-option.active .type-dot {
  border-color: var(--accent);
}

.type-option.active .type-dot::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
}

.type-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.btn-apply {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 36px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  width: 100%;
  justify-content: center;
}

.btn-apply:hover:not(:disabled) {
  background: var(--accent-dark);
}

.btn-apply:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== 状态卡片（审核中/已拒绝） ===== */
.status-card {
  text-align: center;
  padding: 80px 40px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  max-width: 560px;
  margin: 40px auto;
}

.status-icon {
  margin-bottom: 24px;
}

.pending-card .status-icon {
  color: #FD7E14;
}

.rejected-card .status-icon {
  color: #e03131;
}

.status-card h2 {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 12px;
}

.status-card p {
  font-size: 15px;
  color: var(--text);
  margin: 0 0 28px;
  line-height: 1.6;
}

.status-card .btn-apply {
  width: auto;
  display: inline-flex;
}

/* ===== 欢迎区 ===== */
.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.welcome h1 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 8px;
}

.welcome h1 svg {
  color: var(--accent);
}

.welcome p {
  font-size: 14px;
  color: var(--text);
  margin: 0;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-create:hover {
  background: var(--accent-dark);
  box-shadow: 0 4px 15px rgba(198, 137, 63, 0.3);
}

/* 统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-body {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-h);
}

.stat-label {
  font-size: 12px;
  color: var(--text-light);
}

/* 标签 */
.tabs-bar {
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab {
  padding: 10px 24px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-light);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  font-family: inherit;
}

.tab:hover {
  color: var(--text-h);
}

.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 600;
}

/* 作品列表 */
.works-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.work-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: all 0.2s;
}

.work-card:hover {
  box-shadow: 0 4px 20px rgba(198, 137, 63, 0.08);
  border-color: transparent;
}

.work-img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.work-info {
  flex: 1;
  min-width: 0;
}

.work-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.work-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}

.ws-draft {
  background: rgba(153, 153, 153, 0.1);
  color: #999;
}

.ws-pending {
  background: rgba(253, 126, 20, 0.1);
  color: #FD7E14;
}

.ws-approved {
  background: rgba(32, 201, 151, 0.1);
  color: #20C997;
}

.ws-rejected {
  background: rgba(224, 49, 49, 0.1);
  color: #e03131;
}

.work-cat {
  font-size: 11px;
  color: var(--text-light);
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg-soft);
}

.work-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.work-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-light);
}

.work-reject {
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff5f5;
  font-size: 12px;
  color: #e03131;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  line-height: 1.5;
}

.work-reject svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.work-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.ws-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.ws-value {
  font-size: 16px;
  font-weight: 800;
  color: var(--text-h);
}

.ws-label {
  font-size: 11px;
  color: var(--text-light);
}

.pending-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #FD7E14;
  font-weight: 600;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-edit:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: var(--border);
  margin-bottom: 16px;
}

.empty h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 8px;
}

.empty p {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 24px;
}

.btn-create-sm {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .main-inner {
    padding-left: 20px;
    padding-right: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .welcome {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .work-card {
    flex-wrap: wrap;
  }

  .work-stats {
    width: 100%;
    justify-content: flex-start;
    gap: 16px;
    margin-top: 8px;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
