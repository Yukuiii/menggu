import request from './request'

/** 上传封面图 */
export const apiUploadCover = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/** 上传藏品原始文件 */
export const apiUploadFile = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  })
}
