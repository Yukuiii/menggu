<template>
  <div class="admin-page">
    <div class="admin-container">
      <h1 class="page-title">管理后台</h1>

      <div class="cards">
        <div class="card">
          <p class="label">用户总数</p>
          <p class="value">{{ dashboard.users }}</p>
        </div>
        <div class="card">
          <p class="label">订单总数</p>
          <p class="value">{{ dashboard.orders }}</p>
        </div>
        <div class="card">
          <p class="label">交易额</p>
          <p class="value">¥{{ Number(dashboard.revenue || 0).toFixed(2) }}</p>
        </div>
        <div class="card">
          <p class="label">在售藏品</p>
          <p class="value">{{ dashboard.collections }}</p>
        </div>
      </div>

      <div class="section">
        <h2>待审核藏品</h2>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>系列</th>
              <th>价格</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pendingCollections" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.Series?.name || '-' }}</td>
              <td>¥{{ Number(item.price || 0).toFixed(2) }}</td>
              <td>审核中</td>
            </tr>
            <tr v-if="pendingCollections.length === 0">
              <td colspan="5" class="empty">暂无待审核藏品</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>待审核创作者</h2>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>联系方式</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in pendingCreators" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.contact || '-' }}</td>
              <td>待审核</td>
            </tr>
            <tr v-if="pendingCreators.length === 0">
              <td colspan="4" class="empty">暂无待审核创作者</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiAdminDashboard, apiAdminCollectionList, apiAdminCreatorList } from '../../api/admin'

const dashboard = ref({ users: 0, orders: 0, revenue: 0, collections: 0 })
const pendingCollections = ref([])
const pendingCreators = ref([])

const fetchAdminData = async () => {
  const [dash, collections, creators] = await Promise.all([
    apiAdminDashboard(),
    apiAdminCollectionList({ status: 1, page: 1, limit: 10 }),
    apiAdminCreatorList({ status: 0, page: 1, limit: 10 })
  ])
  dashboard.value = dash
  pendingCollections.value = collections.list || []
  pendingCreators.value = creators.list || []
}

onMounted(() => {
  fetchAdminData()
})
</script>

<style scoped>
.admin-page { min-height: 100vh; background: #fffcf8; padding: 24px 0; }
.admin-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.page-title { margin: 0 0 16px; color: #1a1a2e; }
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.card { background: #fff; border: 1px solid #f0ebe4; border-radius: 12px; padding: 14px; }
.label { margin: 0; color: #999; font-size: 12px; }
.value { margin: 8px 0 0; color: #c6893f; font-weight: 700; font-size: 20px; }
.section { background: #fff; border: 1px solid #f0ebe4; border-radius: 12px; padding: 14px; margin-bottom: 14px; }
.section h2 { margin: 0 0 12px; font-size: 16px; color: #1a1a2e; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { border-bottom: 1px solid #f5f1eb; padding: 10px 8px; text-align: left; font-size: 13px; color: #555; }
.table th { color: #888; font-weight: 600; }
.empty { text-align: center; color: #aaa; }
@media (max-width: 768px) { .cards { grid-template-columns: repeat(2, 1fr); } }
</style>
