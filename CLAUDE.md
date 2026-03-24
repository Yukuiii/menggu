# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

蒙古服饰非遗数字藏品平台 — 前后端分离的全栈 Web 应用。前端 Vue 3 + Vite，后端 Express.js + Sequelize ORM + MySQL。

## 常用命令

```bash
# 前端开发（端口3000，API代理到3001）
cd client && npm run dev

# 后端开发（端口3001，--watch自动重启）
cd server && npm run dev

# 前端生产构建
cd client && npm run build

# 数据库初始化
mysql -u root -p < docs/menggu.sql
```

无测试框架，无 lint 配置。

## 架构

### 前后端通信
- 前端 Axios 实例 (`client/src/api/request.js`) 统一拦截请求/响应，401 自动跳转登录
- Vite 开发服务器将 `/api` 代理到 `http://localhost:3001`
- 后端统一响应格式通过 `server/utils/response.js` 的 `success()`/`fail()`

### 前端 (client/src/)
- **Vue 3 `<script setup>` + Composition API**，纯 JavaScript（无 TypeScript）
- **路由** (`router/index.js`): 无认证页面（首页/登录/注册）全屏渲染；认证页面嵌套在 `AppLayout`（顶部导航+页脚）
- **状态管理** (`stores/index.js`): Pinia 单 store 管理用户认证（token + userInfo），token 持久化到 localStorage
- **API 模块** (`api/`): 按业务域拆分，目前仅 `user.js` 完整实现
- **页面** (`views/`): 按业务域组织 — `user/`, `collection/`, `order/`, `creator/`, `market/`, `admin/`, `home/`
- **UI**: Element Plus 组件库 + Lucide Vue Next 图标

### 后端 (server/)
- **Express.js 5 + CommonJS 模块**
- **分层**: routes → controllers → models（标准 MVC）
- **认证**: JWT 中间件 (`middlewares/auth.js`) 验证 token，挂载 `req.userId` / `req.userEmail`
- **ORM**: Sequelize 模型在 `models/` 下一文件一模型，`models/index.js` 建立关联关系并导出
- **配置**: `config/index.js` 支持环境变量覆盖数据库连接和 JWT 密钥

### 数据模型关系
```
User 1──1 Creator    User 1──N Order    User 1──N UserCollection
Creator 1──N Series    Series 1──N Collection
Collection 1──N Order    Collection 1──N UserCollection
```

### 关键业务状态
- **Creator status**: 0待审核 / 1通过 / 2拒绝
- **Collection status**: 0草稿 / 1审核中 / 2已通过 / 3已拒绝 / 4待发售 / 5发售中 / 6已售罄 / 7已下架
- **Order status**: 0待支付 / 1已支付 / 2已取消 / 3已退款

## 编码规范

- 注释语言：**中文**
- 方法/类必须包含 doc 中文注释，复杂逻辑包含行级注释
- 变量/函数: camelCase；模型/类: PascalCase
- Vue 文件用 `<script setup>` 语法
- 后端 async/await + try-catch，统一使用 `response.success()` / `response.fail()` 返回
- 路径使用相对导入（未配置别名）
