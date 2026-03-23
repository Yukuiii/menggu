import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/market',
    name: 'Market',
    component: () => import('../views/market/index.vue')
  },
  {
    path: '/collection/:id',
    name: 'CollectionDetail',
    component: () => import('../views/collection/detail.vue')
  },
  {
    path: '/my-collections',
    name: 'MyCollections',
    component: () => import('../views/collection/my.vue')
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
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/user/profile.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/order/index.vue')
  },
  {
    path: '/order/:id',
    name: 'OrderDetail',
    component: () => import('../views/order/detail.vue')
  },
  {
    path: '/creator',
    name: 'CreatorDashboard',
    component: () => import('../views/creator/index.vue')
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/index.vue')
  }
]

/** 创建路由实例 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
