<script setup>
/**
 * 发布新藏品页
 */
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, Upload, Image as ImageIcon,
  CheckCircle, AlertCircle, Loader2, Info, Hash, Clock
} from 'lucide-vue-next'
import { apiCreatorPublish } from '../../api/creator'
import { apiAdminSeriesList } from '../../api/admin'
import { apiUploadCover, apiUploadFile } from '../../api/upload'

const router = useRouter()

const seriesOptions = ref([])
const coverInputRef = ref(null)
const fileInputRef = ref(null)
const uploading = ref({ cover: false, file: false })

const form = ref({
  seriesId: '',
  name: '',
  category: '',
  price: '',
  totalSupply: '',
  limitPerUser: '1',
  saleTime: '',
  description: '',
  coverUrl: '',
  fileUrl: '',
  fileType: 'image'
})

const submitting = ref(false)
const submitSuccess = ref(false)

/** 触发文件选择 */
const triggerUpload = (type) => {
  if (type === 'cover') {
    coverInputRef.value?.click()
  } else {
    fileInputRef.value?.click()
  }
}

/** 处理封面图上传 */
const handleCoverChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value.cover = true
  try {
    const data = await apiUploadCover(file)
    form.value.coverUrl = data.url
    ElMessage.success('封面上传成功')
  } catch {
    ElMessage.error('封面上传失败')
  } finally {
    uploading.value.cover = false
    e.target.value = ''
  }
}

/** 处理原文件上传 */
const handleFileChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value.file = true
  try {
    const data = await apiUploadFile(file)
    form.value.fileUrl = data.url
    ElMessage.success('文件上传成功')
  } catch {
    ElMessage.error('文件上传失败')
  } finally {
    uploading.value.file = false
    e.target.value = ''
  }
}

/** 提交审核 */
const handleSubmit = async () => {
  if (!form.value.name || !form.value.price || !form.value.totalSupply || !form.value.seriesId || !form.value.saleTime) return
  submitting.value = true
  try {
    await apiCreatorPublish({
      seriesId: form.value.seriesId,
      name: form.value.name,
      cover: form.value.coverUrl,
      fileUrl: form.value.fileUrl,
      fileType: form.value.fileType,
      price: form.value.price,
      totalSupply: form.value.totalSupply,
      limitPerUser: form.value.limitPerUser || 1,
      saleTime: form.value.saleTime,
      description: form.value.description
    })
    submitting.value = false
    submitSuccess.value = true
  } finally {
    submitting.value = false
  }
}

const fetchSeriesOptions = async () => {
  const data = await apiAdminSeriesList({ page: 1, limit: 100 })
  seriesOptions.value = data.list || []
}

onMounted(() => {
  fetchSeriesOptions()
})
</script>

<template>
  <div class="publish-page">
    <div class="publish-container">
      <!-- 返回 -->
      <button class="back-btn" @click="router.back()">
        <ArrowLeft :size="16" />
        返回工作台
      </button>

      <!-- 成功提示 -->
      <div v-if="submitSuccess" class="success-card">
        <CheckCircle :size="56" class="success-icon" />
        <h2 class="result-title">提交成功！</h2>
        <p class="result-desc">您的藏品《{{ form.name }}》已提交审核，我们会尽快完成审核，请留意审核状态。</p>
        <div class="result-actions">
          <button class="btn-primary" @click="router.push('/creator')">返回工作台</button>
          <button class="btn-outline" @click="submitSuccess = false; form.name=''; form.coverUrl=''">继续发布</button>
        </div>
      </div>

      <!-- 表单区域 -->
      <template v-else>
        <h1 class="page-title">发布新藏品</h1>
        <p class="page-desc">填写以下信息，发布您的蒙古流传数字纪念品</p>

        <form class="publish-form" @submit.prevent="handleSubmit">
          
          <!-- 上传区 -->
          <div class="form-section">
            <h3 class="section-title">藏品文件</h3>
            <div class="upload-grid">
              <!-- 隐藏的文件输入 -->
              <input ref="coverInputRef" type="file" accept="image/*" style="display:none" @change="handleCoverChange" />
              <input ref="fileInputRef" type="file" style="display:none" @change="handleFileChange" />

              <!-- 封面图 -->
              <div class="upload-box" @click="triggerUpload('cover')">
                <template v-if="uploading.cover">
                  <Loader2 :size="32" class="upload-icon spin" />
                  <span class="upload-text">上传中...</span>
                </template>
                <template v-else-if="form.coverUrl">
                  <img :src="form.coverUrl" alt="cover" class="preview-img" />
                  <div class="upload-hover">更换封面图</div>
                </template>
                <template v-else>
                  <ImageIcon :size="32" class="upload-icon" />
                  <span class="upload-text">点击上传封面图</span>
                  <span class="upload-hint">建议尺寸 800x800，不超过 5MB</span>
                </template>
              </div>

              <!-- 原文件 -->
              <div class="upload-box" @click="triggerUpload('file')">
                <template v-if="uploading.file">
                  <Loader2 :size="32" class="upload-icon spin" />
                  <span class="upload-text">上传中...</span>
                </template>
                <template v-else-if="form.fileUrl">
                  <div class="file-ready">
                    <CheckCircle :size="32" class="success-icon" />
                    <span>源文件已就绪</span>
                  </div>
                  <div class="upload-hover">重新上传</div>
                </template>
                <template v-else>
                  <Upload :size="32" class="upload-icon" />
                  <span class="upload-text">上传高清原文件</span>
                  <span class="upload-hint">用户购买后可下载的高清内容，支持 JPG/PNG/MP4/GLB</span>
                </template>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">文件类型</label>
                <select v-model="form.fileType" class="form-input select">
                  <option value="image">图片 (JPG, PNG)</option>
                  <option value="video">视频 (MP4)</option>
                  <option value="audio">音频 (MP3, WAV)</option>
                  <option value="3d">3D 模型 (GLB, GLTF)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 基本信息 -->
          <div class="form-section">
            <h3 class="section-title">基本信息</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">所属系列</label>
                <select v-model="form.seriesId" class="form-input select" required>
                  <option value="" disabled>请选择所属系列</option>
                  <option v-for="s in seriesOptions" :key="s.id" :value="s.id">{{ s.name }}</option>
                </select>
                <p class="help-text">每个藏品必须从属于一个系列</p>
              </div>
              
              <div class="form-group">
                <label class="form-label">所属分类</label>
                <select v-model="form.category" class="form-input select" required>
                  <option value="" disabled>请选择所属分类</option>
                  <option value="服饰图鉴">服饰图鉴</option>
                  <option value="纹样艺术">纹样艺术</option>
                  <option value="工艺实拍">工艺实拍</option>
                  <option value="3D模型">3D模型</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">藏品名称</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="例如：蒙古长袍·苍穹蓝" required maxlength="30" />
            </div>

            <div class="form-group">
              <label class="form-label">藏品描述</label>
              <textarea v-model="form.description" class="form-input textarea" placeholder="描述藏品的背景故事、文化内涵、工艺特点等..." rows="5" required></textarea>
            </div>
          </div>

          <!-- 发售设置 -->
          <div class="form-section">
            <h3 class="section-title">发售设置</h3>
            
            <div class="form-row three-cols">
              <div class="form-group">
                <label class="form-label">单价 (¥)</label>
                <input v-model.number="form.price" type="number" class="form-input" placeholder="0.00" min="0" step="0.01" required />
              </div>
              
              <div class="form-group">
                <label class="form-label">发行总量 (份)</label>
                <input v-model.number="form.totalSupply" type="number" class="form-input" placeholder="输入整数" min="1" required />
              </div>
              
              <div class="form-group">
                <label class="form-label">每人限购</label>
                <input v-model.number="form.limitPerUser" type="number" class="form-input" placeholder="单人最多购买份数" min="1" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">发售时间</label>
              <input v-model="form.saleTime" type="datetime-local" class="form-input" required />
              <p class="help-text">到达发售时间后，用户才可进行购买</p>
            </div>
          </div>

          <!-- 上链说明 -->
          <div class="info-banner">
            <Hash :size="20" class="info-icon" />
            <div class="info-content">
              <h4>上链说明</h4>
              <p>藏品审核通过后，平台将自动为您生成上链哈希、智能合约地址等区块链凭证信息，确保藏品的唯一性和可溯源性。</p>
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="bottom-actions">
            <button type="button" class="btn-draft">保存草稿</button>
            <button 
              type="submit" 
              class="btn-submit" 
              :disabled="submitting || !form.coverUrl"
              :class="{ disabled: submitting || !form.coverUrl }"
            >
              <template v-if="submitting">
                <Loader2 :size="18" class="spin" />
                提交中...
              </template>
              <template v-else>
                提交审核
              </template>
            </button>
          </div>

        </form>
      </template>

    </div>
  </div>
</template>

<style scoped>
.publish-page {
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
  padding: 32px 20px 80px;
  background: var(--bg);
}

.publish-container {
  max-width: 800px;
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
  font-size: 28px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 8px;
}
.page-desc {
  font-size: 14px;
  color: var(--text-light);
  margin: 0 0 32px;
}

/* 表单区块 */
.publish-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--border);
}

.form-group {
  margin-bottom: 20px;
  flex: 1;
}
.form-group:last-child {
  margin-bottom: 0;
}
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.three-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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
  box-shadow: 0 0 0 3px rgba(198,137,63,0.1);
  background: #fff;
}
.form-input::placeholder {
  color: #ccc;
}
.form-input.select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  cursor: pointer;
}
.form-input.textarea {
  resize: vertical;
  min-height: 120px;
}

.help-text {
  font-size: 12px;
  color: var(--text-light);
  margin: 6px 0 0;
}

/* 上传区 */
.upload-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
  margin-bottom: 20px;
}
.upload-box {
  position: relative;
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: var(--bg-soft);
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}
.upload-box:hover {
  border-color: var(--accent);
  background: var(--accent-bg);
}
.upload-icon {
  color: var(--accent);
  margin-bottom: 12px;
}
.upload-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-h);
  margin-bottom: 4px;
}
.upload-hint {
  font-size: 12px;
  color: var(--text-light);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.file-ready {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #20C997;
  font-weight: 600;
}

.upload-hover {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s;
}
.upload-box:hover .upload-hover {
  opacity: 1;
}

/* 上链说明 */
.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius);
  color: #16a34a;
}
.info-icon {
  flex-shrink: 0;
  margin-top: 2px;
}
.info-content h4 {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
}
.info-content p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.5;
}

/* 底部操作 */
.bottom-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 12px;
}
.btn-draft {
  padding: 12px 28px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-draft:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 36px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-submit:hover:not(.disabled) {
  background: var(--accent-dark);
}
.btn-submit.disabled {
  background: #e2c09c;
  cursor: not-allowed;
}

/* 成功状态 */
.success-card {
  text-align: center;
  padding: 60px 40px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-top: 20px;
}
.success-icon {
  color: #20C997;
  margin-bottom: 24px;
}
.result-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-h);
  margin: 0 0 12px;
}
.result-desc {
  font-size: 15px;
  color: var(--text);
  margin: 0 auto 32px;
  max-width: 400px;
  line-height: 1.6;
}
.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.btn-primary {
  padding: 12px 28px;
  border-radius: 10px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.btn-outline {
  padding: 12px 28px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--card-bg);
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .upload-grid { grid-template-columns: 1fr; }
  .form-row, .three-cols { flex-direction: column; gap: 0; display: flex; }
  .form-group { margin-bottom: 20px; }
  .bottom-actions { flex-direction: column; }
  .bottom-actions button { width: 100%; }
}
</style>
