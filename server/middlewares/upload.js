const multer = require('multer')
const path = require('path')
const fs = require('fs')

/** 确保上传目录存在 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/** 封面图上传配置（限5MB，仅图片） */
const coverStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../uploads/covers')
    ensureDir(dir)
    cb(null, dir)
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `cover_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`)
  }
})

/** 原文件上传配置（限50MB，支持多类型） */
const fileStorage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../uploads/files')
    ensureDir(dir)
    cb(null, dir)
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`)
  }
})

const uploadCover = multer({
  storage: coverStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('仅支持图片格式'), false)
    }
  }
})

const uploadFile = multer({
  storage: fileStorage,
  limits: { fileSize: 50 * 1024 * 1024 }
})

module.exports = { uploadCover, uploadFile }
