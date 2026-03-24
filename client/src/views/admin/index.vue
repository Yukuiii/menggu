<script setup>
/**
 * 管理后台 - 数据看板 + 藏品审核 + 创作者审核
 */
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Users, ShoppingBag, DollarSign, Gem, Clock, CheckCircle,
  XCircle, UserPlus, Eye, ChevronDown, ChevronUp
} from 'lucide-vue-next'
import {
  apiAdminDashboard,
  apiAdminCollectionList,
  apiAdminCreatorList,
  apiAdminAuditCollection,
  apiAdminAuditCreator
} from '../../api/admin'

const dashboard = ref({ users: 0, orders: 0, revenue: 0, collections: 0 })
const pendingCollections = ref([])
const pendingCreators = ref([])

// 审核操作状态
const auditingId = ref(null)

// 拒绝弹窗
const rejectTarget = ref(null) // { type: 'collection' | 'creator', id, name }
const rejectReason = ref('')

/** 拉取后台数据 */
const fetchAdminData = async () => {
  const [dash, collections, creators] = await Promise.all([
    apiAdminDashboard(),
    apiAdminCollectionList({ status: 1, page: 1, limit: 50 }),
    apiAdminCreatorList({ status: 0, page: 1, limit: 50 })
  ])
  dashboard.value = dash
  pendingCollections.value = collections.list || []
  pendingCreators.value = creators.list || []
}

/** 通过藏品 */
const approveCollection = async (id) => {
  auditingId.value = id
  try {
    await apiAdminAuditCollection(id, { action: 'approve' })
    ElMessage.success('藏品审核已通过')
    pendingCollections.value = pendingCollections.value.filter(c => c.id !== id)
  } finally { auditingId.value = null }
}

/** 通过创作者 */
const approveCreator = async (id) => {
  auditingId.value = id
  try {
    await apiAdminAuditCreator(id, { action: 'approve' })
    ElMessage.success('创作者入驻已通过')
    pendingCreators.value = pendingCreators.value.filter(c => c.id !== id)
  } finally { auditingId.value = null }
}

/** 打开拒绝弹窗 */
const openReject = (type, item) => {
  rejectTarget.value = { type, id: item.id, name: item.name }
  rejectReason.value = ''
}

/** 确认拒绝 */
const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    ElMessage.warning('请填写拒绝原因')
    return
  }
  const { type, id } = rejectTarget.value
  auditingId.value = id
  try {
    if (type === 'collection') {
      await apiAdminAuditCollection(id, { action: 'reject', rejectReason: rejectReason.value })
      pendingCollections.value = pendingCollections.value.filter(c => c.id !== id)
    } else {
      await apiAdminAuditCreator(id, { action: 'reject', rejectReason: rejectReason.value })
      pendingCreators.value = pendingCreators.value.filter(c => c.id !== id)
    }
    ElMessage.success('已拒绝')
    rejectTarget.value = null
  } finally { auditingId.value = null }
}

// 展开详情
const expandedCreator = ref(null)
const toggleCreatorExpand = (id) => {
  expandedCreator.value = expandedCreator.value === id ? null : id
}

onMounted(() => {
  fetchAdminData()
})
</script>

<template>
  <div class="admin-page">
    <div class="admin-container">
      <h1 class="page-title">管理后台</h1>

      <!-- 数据看板 -->
      <div class="dash-grid">
        <div class="dash-card">
          <div class="dash-icon" style="background:rgba(198,137,63,0.1)"><Users :size="22" style="color:#C6893F" /></div>
          <div><span class="dash-value">{{ dashboard.users }}</span><span class="dash-label">用户总数</span></div>
        </div>
        <div class="dash-card">
          <div class="dash-icon" style="background:rgba(32,201,151,0.1)"><ShoppingBag :size="22" style="color:#20C997" /></div>
          <div><span class="dash-value">{{ dashboard.orders }}</span><span class="dash-label">订单总数</span></div>
        </div>
        <div class="dash-card">
          <div class="dash-icon" style="background:rgba(253,126,20,0.1)"><DollarSign :size="22" style="color:#FD7E14" /></div>
          <div><span class="dash-value">¥{{ Number(dashboard.revenue || 0).toFixed(2) }}</span><span class="dash-label">累计交易额</span></div>
        </div>
        <div class="dash-card">
          <div class="dash-icon" style="background:rgba(132,94,247,0.1)"><Gem :size="22" style="color:#845EF7" /></div>
          <div><span class="dash-value">{{ dashboard.collections }}</span><span class="dash-label">在售藏品</span></div>
        </div>
      </div>

      <!-- 待审核创作者 -->
      <section class="section">
        <div class="section-header">
          <h2><UserPlus :size="20" class="sec-icon" /> 待审核创作者</h2>
          <span class="badge">{{ pendingCreators.length }}</span>
        </div>

        <div v-if="pendingCreators.length" class="audit-list">
          <div v-for="creator in pendingCreators" :key="creator.id" class="audit-card">
            <div class="audit-main" @click="toggleCreatorExpand(creator.id)">
              <div class="audit-info">
                <div class="audit-name">{{ creator.name }}</div>
                <div class="audit-meta">
                  <span>{{ creator.User?.nickname || '-' }}</span>
                  <span>{{ creator.contact || '未填写联系方式' }}</span>
                  <span>{{ creator.certifiedType === 'individual' ? '个人' : creator.certifiedType === 'studio' ? '工作室' : '机构' }}</span>
                </div>
              </div>
              <div class="audit-actions">
                <button class="btn-approve" :disabled="auditingId === creator.id" @click.stop="approveCreator(creator.id)">
                  <CheckCircle :size="14" /> 通过
                </button>
                <button class="btn-reject" :disabled="auditingId === creator.id" @click.stop="openReject('creator', creator)">
                  <XCircle :size="14" /> 拒绝
                </button>
                <button class="btn-expand" @click.stop="toggleCreatorExpand(creator.id)">
                  <ChevronDown v-if="expandedCreator !== creator.id" :size="14" />
                  <ChevronUp v-else :size="14" />
                </button>
              </div>
            </div>
            <!-- 展开详情 -->
            <div v-if="expandedCreator === creator.id" class="audit-detail">
              <div class="detail-row"><span class="dl">简介</span><span class="dv">{{ creator.intro || '未填写' }}</span></div>
              <div class="detail-row"><span class="dl">作品集</span><span class="dv">{{ creator.portfolio || '未填写' }}</span></div>
              <div class="detail-row"><span class="dl">申请时间</span><span class="dv">{{ creator.createdAt }}</span></div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state"><Clock :size="24" /><span>暂无待审核创作者</span></div>
      </section>

      <!-- 待审核藏品 -->
      <section class="section">
        <div class="section-header">
          <h2><Gem :size="20" class="sec-icon" /> 待审核藏品</h2>
          <span class="badge">{{ pendingCollections.length }}</span>
        </div>

        <div v-if="pendingCollections.length" class="audit-list">
          <div v-for="col in pendingCollections" :key="col.id" class="audit-card">
            <div class="audit-main">
              <img v-if="col.cover" :src="col.cover" :alt="col.name" class="col-thumb" />
              <div class="audit-info">
                <div class="audit-name">{{ col.name }}</div>
                <div class="audit-meta">
                  <span>{{ col.Series?.name || '-' }}</span>
                  <span>{{ col.Series?.Creator?.name || '-' }}</span>
                  <span>¥{{ Number(col.price || 0).toFixed(2) }}</span>
                  <span>共{{ col.totalSupply }}份</span>
                </div>
              </div>
              <div class="audit-actions">
                <button class="btn-approve" :disabled="auditingId === col.id" @click="approveCollection(col.id)">
                  <CheckCircle :size="14" /> 通过
                </button>
                <button class="btn-reject" :disabled="auditingId === col.id" @click="openReject('collection', col)">
                  <XCircle :size="14" /> 拒绝
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state"><Clock :size="24" /><span>暂无待审核藏品</span></div>
      </section>

    </div>

    <!-- 拒绝弹窗 -->
    <div v-if="rejectTarget" class="modal-mask" @click.self="rejectTarget = null">
      <div class="modal-box">
        <h3>拒绝{{ rejectTarget.type === 'collection' ? '藏品' : '创作者' }}：{{ rejectTarget.name }}</h3>
        <textarea v-model="rejectReason" class="modal-textarea" placeholder="请输入拒绝原因（将通知申请人）..." rows="4"></textarea>
        <div class="modal-actions">
          <button class="btn-cancel" @click="rejectTarget = null">取消</button>
          <button class="btn-confirm-reject" @click="confirmReject" :disabled="auditingId">确认拒绝</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page {
  --accent: #C6893F; --accent-dark: #A97030; --accent-bg: #FFF8EE;
  --text-h: #1a1a2e; --text: #555; --text-light: #999;
  --bg: #FFFCF8; --bg-soft: #FFFAF4; --border: #f0ebe4;
  --card-bg: #fff; --radius: 16px;
  min-height: 100vh; background: var(--bg); padding: 32px 0 60px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.admin-container { max-width: 1000px; margin: 0 auto; padding: 0 40px; }
.page-title { font-size: 28px; font-weight: 800; color: var(--text-h); margin: 0 0 28px; }

/* 看板 */
.dash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
.dash-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; }
.dash-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dash-value { display: block; font-size: 22px; font-weight: 800; color: var(--text-h); }
.dash-label { display: block; font-size: 12px; color: var(--text-light); margin-top: 2px; }

/* 区块 */
.section { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; margin-bottom: 24px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.section-header h2 { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0; }
.sec-icon { color: var(--accent); }
.badge { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; border-radius: 12px; background: var(--accent); color: #fff; font-size: 12px; font-weight: 700; padding: 0 8px; }

/* 审核列表 */
.audit-list { display: flex; flex-direction: column; gap: 12px; }
.audit-card { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; transition: box-shadow 0.2s; }
.audit-card:hover { box-shadow: 0 4px 16px rgba(198,137,63,0.06); }
.audit-main { display: flex; align-items: center; gap: 16px; padding: 16px 20px; cursor: pointer; }
.col-thumb { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.audit-info { flex: 1; min-width: 0; }
.audit-name { font-size: 15px; font-weight: 700; color: var(--text-h); margin-bottom: 4px; }
.audit-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--text-light); }

.audit-actions { display: flex; gap: 8px; flex-shrink: 0; }
.btn-approve {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 8px 16px; border-radius: 8px;
  background: #f0fdf4; color: #16a34a;
  font-size: 13px; font-weight: 600;
  border: 1px solid #bbf7d0; cursor: pointer;
  transition: all 0.2s; font-family: inherit;
}
.btn-approve:hover:not(:disabled) { background: #16a34a; color: #fff; }
.btn-approve:disabled { opacity: 0.5; cursor: wait; }

.btn-reject {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 8px 16px; border-radius: 8px;
  background: #fff5f5; color: #e03131;
  font-size: 13px; font-weight: 600;
  border: 1px solid #fecaca; cursor: pointer;
  transition: all 0.2s; font-family: inherit;
}
.btn-reject:hover:not(:disabled) { background: #e03131; color: #fff; }
.btn-reject:disabled { opacity: 0.5; cursor: wait; }

.btn-expand {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid var(--border); background: transparent;
  color: var(--text-light); cursor: pointer; transition: all 0.2s;
}
.btn-expand:hover { border-color: var(--accent); color: var(--accent); }

/* 展开详情 */
.audit-detail { padding: 0 20px 16px; border-top: 1px dashed var(--border); margin-top: 0; }
.detail-row { display: flex; padding: 10px 0; font-size: 13px; border-bottom: 1px solid rgba(240,235,228,0.5); }
.detail-row:last-child { border-bottom: none; }
.dl { color: var(--text-light); min-width: 80px; flex-shrink: 0; }
.dv { color: var(--text-h); flex: 1; word-break: break-all; }

/* 空状态 */
.empty-state { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 40px; color: var(--text-light); font-size: 14px; }

/* 拒绝弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-box { background: #fff; border-radius: var(--radius); padding: 32px; width: 100%; max-width: 480px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-box h3 { font-size: 18px; font-weight: 700; color: var(--text-h); margin: 0 0 20px; }
.modal-textarea {
  width: 100%; padding: 14px; border: 1.5px solid var(--border); border-radius: 10px;
  font-size: 14px; color: var(--text-h); background: var(--bg-soft);
  outline: none; resize: vertical; font-family: inherit; box-sizing: border-box;
}
.modal-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(198,137,63,0.1); }
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.btn-cancel {
  padding: 10px 24px; border-radius: 8px;
  border: 1px solid var(--border); background: #fff;
  color: var(--text); font-size: 14px; cursor: pointer; font-family: inherit;
}
.btn-confirm-reject {
  padding: 10px 24px; border-radius: 8px;
  background: #e03131; color: #fff; border: none;
  font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
}
.btn-confirm-reject:hover { background: #c92a2a; }
.btn-confirm-reject:disabled { opacity: 0.5; cursor: wait; }

@media (max-width: 768px) {
  .admin-container { padding: 0 20px; }
  .dash-grid { grid-template-columns: repeat(2, 1fr); }
  .audit-main { flex-wrap: wrap; }
  .audit-actions { width: 100%; justify-content: flex-end; margin-top: 8px; }
}
</style>
