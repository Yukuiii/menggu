import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/user/register.vue')
  },
  // 以下路由共用 AppLayout（导航栏 + 页脚）
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'market',
        name: 'Market',
        component: () => import('../views/market/index.vue')
      },
      {
        path: 'collection/:id',
        name: 'CollectionDetail',
        component: () => import('../views/collection/detail.vue')
      },
      {
        path: 'my-collections',
        name: 'MyCollections',
        meta: { requiresAuth: true },
        component: () => import('../views/collection/my.vue')
      },
      {
        path: 'my-collection/:id',
        name: 'MyCollectionDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/collection/my-detail.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        meta: { requiresAuth: true },
        component: () => import('../views/user/profile.vue')
      },
      {
        path: 'follows',
        name: 'MyFollows',
        meta: { requiresAuth: true },
        component: () => import('../views/user/follows.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        meta: { requiresAuth: true },
        component: () => import('../views/order/index.vue')
      },
      {
        path: 'order/:id',
        name: 'OrderDetail',
        meta: { requiresAuth: true },
        component: () => import('../views/order/detail.vue')
      },
      {
        path: 'checkout/:id',
        name: 'Checkout',
        meta: { requiresAuth: true },
        component: () => import('../views/order/checkout.vue')
      },
      {
        path: 'creator',
        name: 'CreatorDashboard',
        meta: { requiresAuth: true },
        component: () => import('../views/creator/index.vue')
      },
      {
        path: 'publish',
        name: 'PublishCollection',
        meta: { requiresAuth: true },
        component: () => import('../views/creator/publish.vue')
      },
      {
        path: 'admin',
        name: 'AdminDashboard',
        meta: { requiresAuth: true, requiresAdmin: true },
        component: () => import('../views/admin/index.vue')
      }
    ]
  }
]

/** 创建路由实例 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/** 路由守卫 */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null')

  // 需要登录的页面
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // 需要管理员权限的页面
  if (to.meta.requiresAdmin && (!userInfo || userInfo.role !== 'admin')) {
    return next({ name: 'Market' })
  }

  // 已登录用户访问登录/注册页，跳转到市场
  if ((to.name === 'Login' || to.name === 'Register') && token) {
    return next({ name: 'Market' })
  }

  next()
})

export default router
