const express = require('express')
const cors = require('cors')
const path = require('path')
const routes = require('./routes')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件服务（上传文件访问）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 注册路由
app.use('/api', routes)

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ code: 1, message: '服务器内部错误', data: null })
})

app.listen(PORT, () => {
  console.log(`服务已启动: http://localhost:${PORT}`)
})

module.exports = app
