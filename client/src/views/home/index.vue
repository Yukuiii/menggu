<script setup>
/**
 * 首页 Landing Page - 蒙古服饰非遗数字藏品平台主页
 */
import { ref, onMounted } from 'vue'
import {
  Gem, ShieldCheck, Repeat, Palette,
  Image, Video, Box,
  Users, FileText, TrendingUp, Award,
  Menu, X, ArrowRight,
  MousePointerClick, CreditCard, Link, Trophy
} from 'lucide-vue-next'

const navOpen = ref(false)
const activeSection = ref('features')

// 页面滚动检测，用于导航栏样式切换
const scrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })

  // 使用 IntersectionObserver 监听滚动位置，更新当前导航激活状态
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, {
    rootMargin: '-50% 0px -50% 0px'
  })

  const sections = ['features', 'categories', 'how-it-works', 'stats']
  sections.forEach(id => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

/** 平滑滚动到指定区块 */
const scrollToSection = (sectionId) => {
  activeSection.value = sectionId
  navOpen.value = false
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// 功能特性数据
const features = [
  {
    iconComponent: Gem,
    title: '非遗数字藏品',
    desc: '蒙古族传统服饰数字化呈现，每件藏品拥有唯一链上凭证，永久保存民族文化瑰宝。',
    bg: '#fff0f0',
    iconBg: '#ffe0e0',
    iconColor: '#FF6B6B'
  },
  {
    iconComponent: ShieldCheck,
    title: '链上存证保障',
    desc: '模拟区块链存证机制，为每件藏品生成唯一哈希值与合约地址，确保藏品真实可溯。',
    bg: '#f0f0ff',
    iconBg: '#e0e0ff',
    iconColor: '#845EF7'
  },
  {
    iconComponent: Repeat,
    title: '自由转赠流通',
    desc: '实名用户间可自由转赠藏品，完整记录每一次流转历史，让文化在传递中延续。',
    bg: '#f0fff0',
    iconBg: '#e0ffe0',
    iconColor: '#20C997'
  },
  {
    iconComponent: Palette,
    title: '创作者入驻',
    desc: '非遗传承人与文化创作者可入驻发行数字藏品，让传统工艺走进数字时代。',
    bg: '#fff8f0',
    iconBg: '#ffeed8',
    iconColor: '#FD7E14'
  }
]

// 平台数据统计
const stats = [
  { value: '1,000+', label: '数字藏品', iconComponent: Gem },
  { value: '200+', label: '非遗纹样', iconComponent: FileText },
  { value: '10,000+', label: '注册用户', iconComponent: Users },
  { value: '4.9/5', label: '用户评分', iconComponent: Award }
]

// 藏品分类数据
const categories = [
  { name: '服饰图鉴', icon: Image, color: '#FF6B6B', bg: '#FFF0F0', desc: '蒙古族传统袍服、腰带、靴帽等精美服饰高清数字图鉴' },
  { name: '纹样艺术', icon: Palette, color: '#845EF7', bg: '#F3F0FF', desc: '卷草纹、犄纹、云纹等经典蒙古族装饰纹样数字藏品' },
  { name: '工艺视频', icon: Video, color: '#20C997', bg: '#F0FFF8', desc: '非遗传承人手工制作过程记录，感受精湛传统工艺' },
  { name: '3D 模型', icon: Box, color: '#FD7E14', bg: '#FFF8F0', desc: '蒙古族服饰三维数字化还原，360° 沉浸式鉴赏体验' }
]

// 购买流程步骤
const steps = [
  { num: '01', title: '浏览藏品', desc: '在藏品市场发现心仪的蒙古服饰非遗数字藏品', iconComponent: MousePointerClick },
  { num: '02', title: '钱包支付', desc: '使用平台钱包余额轻松完成支付', iconComponent: CreditCard },
  { num: '03', title: '链上存证', desc: '系统自动生成唯一链上哈希与区块凭证', iconComponent: Link },
  { num: '04', title: '收藏鉴赏', desc: '在「我的藏品」中查看、鉴赏或转赠好友', iconComponent: Trophy }
]
</script>

<template>
  <div class="landing-page">
    <!-- 导航栏 -->
    <nav :class="['nav-bar', { 'nav-scrolled': scrolled }]">
      <div class="nav-inner">
        <a href="/" class="nav-logo">
          <span class="logo-icon">蒙</span>
          <span class="logo-text">蒙古非遗藏品</span>
        </a>

        <!-- 桌面端菜单 -->
        <div class="nav-links">
          <a href="#features" @click.prevent="scrollToSection('features')"
            :class="['nav-link', { active: activeSection === 'features' }]">平台特色</a>
          <a href="#categories" @click.prevent="scrollToSection('categories')"
            :class="['nav-link', { active: activeSection === 'categories' }]">藏品分类</a>
          <a href="#how-it-works" @click.prevent="scrollToSection('how-it-works')"
            :class="['nav-link', { active: activeSection === 'how-it-works' }]">购买流程</a>
          <a href="#stats" @click.prevent="scrollToSection('stats')"
            :class="['nav-link', { active: activeSection === 'stats' }]">平台数据</a>
        </div>

        <div class="nav-actions">
          <button class="btn-nav-outline">登录</button>
          <button class="btn-nav-primary">免费注册</button>
        </div>

        <!-- 移动端汉堡按钮 -->
        <button class="nav-toggle" @click="navOpen = !navOpen">
          <Menu v-if="!navOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>

      <!-- 移动端菜单 -->
      <div v-if="navOpen" class="nav-mobile">
        <a href="#features" @click.prevent="scrollToSection('features')"
          :class="{ active: activeSection === 'features' }">平台特色</a>
        <a href="#categories" @click.prevent="scrollToSection('categories')"
          :class="{ active: activeSection === 'categories' }">藏品分类</a>
        <a href="#how-it-works" @click.prevent="scrollToSection('how-it-works')"
          :class="{ active: activeSection === 'how-it-works' }">购买流程</a>
        <a href="#stats" @click.prevent="scrollToSection('stats')"
          :class="{ active: activeSection === 'stats' }">平台数据</a>
        <button class="btn-nav-primary" style="width:100%;margin-top:8px;">免费注册</button>
      </div>
    </nav>

    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">蒙古服饰 · 非物质文化遗产 · 数字藏品</div>
          <h1 class="hero-title">
            让民族瑰宝
            <span class="hero-highlight">在数字世界永恒绽放</span>
          </h1>
          <p class="hero-desc">
            蒙古族服饰国家级非遗数字藏品平台，链上存证 · 限量发行 · 永久收藏，用数字技术守护千年民族文化
          </p>
          <div class="hero-actions">
            <button class="btn-primary">
              <span>探索藏品市场</span>
              <ArrowRight :size="16" />
            </button>
            <button class="btn-outline">了解更多</button>
          </div>
        </div>

        <div class="hero-visual">
          <!-- 手机 mockup -->
          <div class="phone-mockup">
            <div class="phone-screen">
              <div class="mock-header">
                <div class="mock-status-bar">
                  <span>9:41</span>
                  <div class="mock-notch"></div>
                  <span style="display:flex;align-items:center;gap:4px;">
                    <TrendingUp :size="12" color="rgba(255,255,255,0.8)" />
                  </span>
                </div>
                <div class="mock-app-bar">
                  <span class="mock-app-title">蒙古非遗藏品</span>
                </div>
              </div>
              <div class="mock-content">
                <div class="mock-card" style="background: linear-gradient(135deg, #C6893F, #E2B97F);">
                  <div class="mock-card-label">热门发售中</div>
                  <div class="mock-card-value">蒙古族婚礼头饰</div>
                  <div class="mock-progress">
                    <div class="mock-progress-bar" style="width: 68%"></div>
                  </div>
                  <div class="mock-card-sub">已售 680 / 1000 份</div>
                </div>
                <div class="mock-list">
                  <div class="mock-list-item" v-for="c in categories.slice(0, 3)" :key="c.name">
                    <div class="mock-list-dot" :style="{ background: c.color }"></div>
                    <div>
                      <div class="mock-list-title">{{ c.name }}</div>
                      <div class="mock-list-sub">{{ c.desc.slice(0, 12) }}...</div>
                    </div>
                    <div class="mock-list-arrow">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 浮动装饰元素 -->
          <div class="float-dot dot-1"></div>
          <div class="float-dot dot-2"></div>
          <div class="float-dot dot-3"></div>
          <div class="float-icon icon-1">
            <Gem :size="24" color="var(--accent)" />
          </div>
          <div class="float-icon icon-2">
            <Palette :size="24" color="#FF6B6B" />
          </div>
        </div>
      </div>

      <!-- Hero 底部统计条 -->
      <div class="hero-stats-bar">
        <div class="hero-stat-item" v-for="s in stats" :key="s.label">
          <span class="hero-stat-icon">
            <component :is="s.iconComponent" :size="24" color="var(--accent)" />
          </span>
          <div>
            <div class="hero-stat-value">{{ s.value }}</div>
            <div class="hero-stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特性 - PART.1 -->
    <section id="features" class="section">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-tag">PART.1</div>
          <h2 class="section-title">为什么选择我们？</h2>
          <p class="section-desc">以数字技术赋能非遗保护，打造可信赖的蒙古服饰数字藏品平台</p>
        </div>

        <div class="features-grid">
          <div v-for="(feature, i) in features" :key="i" class="feature-card" :style="{ backgroundColor: feature.bg }">
            <div class="feature-icon" :style="{ backgroundColor: feature.iconBg }">
              <component :is="feature.iconComponent" :size="26" :color="feature.iconColor" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 藏品分类 - PART.2 -->
    <section id="categories" class="section section-white">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-tag">PART.2</div>
          <h2 class="section-title">藏品分类</h2>
          <p class="section-desc">涵盖蒙古族服饰文化的多种数字化呈现形式</p>
        </div>

        <div class="papers-grid">
          <div v-for="cat in categories" :key="cat.name" class="paper-card" :style="{ backgroundColor: cat.bg }">
            <div class="paper-badge" :style="{ backgroundColor: cat.color }">
              <component :is="cat.icon" :size="20" color="#fff" />
            </div>
            <h3 class="paper-name" :style="{ color: cat.color }">{{ cat.name }}</h3>
            <p class="paper-desc">{{ cat.desc }}</p>
            <div class="paper-arrow" :style="{ color: cat.color }">
              浏览藏品 →
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 购买流程 - PART.3 -->
    <section id="how-it-works" class="section">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-tag">PART.3</div>
          <h2 class="section-title">四步拥有非遗藏品</h2>
          <p class="section-desc">简单流程，轻松收藏蒙古族服饰文化瑰宝</p>
        </div>

        <div class="steps-grid">
          <div v-for="step in steps" :key="step.num" class="step-card">
            <div class="step-num">
              <component :is="step.iconComponent" :size="28" color="#fff" />
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计 - PART.4 -->
    <section id="stats" class="section section-white">
      <div class="section-inner">
        <div class="section-header">
          <div class="section-tag">PART.4</div>
          <h2 class="section-title">值得信赖的非遗藏品平台</h2>
          <p class="section-desc">用数据说话，持续守护与传承蒙古族服饰文化</p>
        </div>

        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
            <div class="stat-icon">
              <component :is="stat.iconComponent" :size="32" color="var(--accent)" />
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA 横幅 -->
    <section class="cta-banner">
      <div class="cta-inner">
        <div class="cta-decoration">
          <div class="cta-circle cta-circle-1"></div>
          <div class="cta-circle cta-circle-2"></div>
          <div class="cta-circle cta-circle-3"></div>
        </div>
        <h2 class="cta-title">开启你的非遗数字藏品之旅</h2>
        <p class="cta-desc">注册即可浏览全部藏品，用数字方式收藏千年民族文化</p>
        <div class="cta-actions">
          <button class="btn-cta">立即注册，免费体验</button>
          <button class="btn-cta-outline">了解更多</button>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="/" class="nav-logo" style="margin-bottom: 16px;">
              <span class="logo-icon">蒙</span>
              <span class="logo-text">蒙古非遗藏品</span>
            </a>
            <p class="footer-desc">蒙古族服饰非物质文化遗产数字藏品平台，以数字技术守护民族文化瑰宝。</p>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">平台功能</h4>
            <ul>
              <li><a href="#">藏品市场</a></li>
              <li><a href="#">我的藏品</a></li>
              <li><a href="#">创作者入驻</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">藏品分类</h4>
            <ul>
              <li><a href="#">服饰图鉴</a></li>
              <li><a href="#">纹样艺术</a></li>
              <li><a href="#">工艺视频</a></li>
              <li><a href="#">3D 模型</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-col-title">关于</h4>
            <ul>
              <li><a href="#">关于我们</a></li>
              <li><a href="#">联系我们</a></li>
              <li><a href="#">隐私政策</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2026 蒙古服饰非遗数字藏品平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* ===== 全局变量 ===== */
:root {
  --accent: #C6893F;
  --accent-dark: #A97030;
  --accent-bg: #FFF8EE;
  --text-h: #1a1a2e;
  --text: #555;
  --text-light: #999;
  --bg-soft: #FFFAF4;
  --border: #f0ebe4;
  --shadow: 0 4px 20px rgba(198, 137, 63, 0.08);
  --shadow-lg: 0 12px 40px rgba(198, 137, 63, 0.12);
}

/* ===== 基础重置 ===== */
.landing-page {
  --accent: #C6893F;
  --accent-dark: #A97030;
  --accent-bg: #FFF8EE;
  --text-h: #1a1a2e;
  --text: #555;
  --text-light: #999;
  --bg-soft: #FFFAF4;
  --border: #f0ebe4;
  --shadow: 0 4px 20px rgba(198, 137, 63, 0.08);
  --shadow-lg: 0 12px 40px rgba(198, 137, 63, 0.12);
}

a {
  text-decoration: none;
  color: inherit;
}

/* ===== 导航栏 ===== */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.nav-scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-h);
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #C6893F, #E2B97F);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 36px;
}

.nav-link {
  font-size: 15px;
  color: var(--text);
  transition: color 0.2s;
  position: relative;
  padding: 4px 0;
}

.nav-link:hover,
.nav-link.active {
  color: var(--accent);
  font-weight: 500;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-nav-outline {
  padding: 8px 20px;
  border-radius: 8px;
  background: transparent;
  color: var(--text-h);
  font-size: 14px;
  font-weight: 500;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nav-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn-nav-primary {
  padding: 10px 28px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-nav-primary:hover {
  background: var(--accent-dark);
  box-shadow: 0 4px 15px rgba(198, 137, 63, 0.3);
}

.nav-toggle {
  display: none;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-h);
}

.nav-mobile {
  display: none;
  padding: 20px 40px;
  border-top: 1px solid var(--border);
  background: #fff;
  flex-direction: column;
  gap: 16px;
}

.nav-mobile a {
  font-size: 15px;
  color: var(--text);
  padding: 8px 0;
}

@media (max-width: 768px) {

  .nav-links,
  .nav-actions {
    display: none;
  }

  .nav-toggle {
    display: block;
  }

  .nav-mobile {
    display: flex;
  }

  .nav-inner {
    padding: 0 20px;
  }
}

/* ===== Hero 区域 ===== */
.hero {
  padding: 120px 40px 0;
  background: #fff;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(198, 137, 63, 0.06), transparent 70%);
  pointer-events: none;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 80px;
  padding: 60px 0 80px;
}

.hero-content {
  flex: 1;
  min-width: 0;
}

.hero-badge {
  display: inline-block;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--accent);
  background: var(--accent-bg);
  border-radius: 4px;
  margin-bottom: 28px;
}

.hero-title {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-h);
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.hero-highlight {
  color: var(--accent);
  display: block;
}

.hero-desc {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text);
  margin-bottom: 40px;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 36px;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: var(--accent-dark);
  box-shadow: 0 8px 25px rgba(198, 137, 63, 0.35);
  transform: translateY(-1px);
}

.btn-outline {
  padding: 14px 36px;
  border-radius: 8px;
  background: transparent;
  color: var(--text-h);
  font-size: 15px;
  font-weight: 500;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-bg);
}

/* 手机 mockup */
.hero-visual {
  flex: 0 0 380px;
  position: relative;
  display: flex;
  justify-content: center;
}

.phone-mockup {
  width: 280px;
  background: #fff;
  border-radius: 36px;
  box-shadow: 0 20px 60px rgba(198, 137, 63, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  position: relative;
  z-index: 2;
  animation: float 6s ease-in-out infinite;
}

.phone-screen {
  padding: 0;
}

.mock-header {
  background: linear-gradient(135deg, #C6893F, #E2B97F);
  padding: 20px 16px;
}

.mock-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.mock-notch {
  width: 80px;
  height: 6px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.mock-app-bar {
  display: flex;
  align-items: center;
}

.mock-app-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.mock-content {
  padding: 16px;
}

.mock-card {
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  color: #fff;
}

.mock-card-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.mock-card-value {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.mock-progress {
  height: 6px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 3px;
  margin-bottom: 8px;
}

.mock-progress-bar {
  height: 100%;
  background: #fff;
  border-radius: 3px;
}

.mock-card-sub {
  font-size: 12px;
  opacity: 0.85;
}

.mock-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mock-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f7f5f2;
  border-radius: 12px;
}

.mock-list-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mock-list-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-h);
}

.mock-list-sub {
  font-size: 11px;
  color: var(--text-light);
}

.mock-list-arrow {
  margin-left: auto;
  color: var(--text-light);
  font-size: 12px;
}

/* 浮动装饰元素 */
.float-dot {
  position: absolute;
  border-radius: 50%;
  z-index: 1;
}

.dot-1 {
  width: 14px;
  height: 14px;
  background: var(--accent);
  top: 30px;
  left: 20px;
  animation: float-slow 4s ease-in-out infinite;
}

.dot-2 {
  width: 8px;
  height: 8px;
  background: #FF6B6B;
  bottom: 100px;
  right: 20px;
  animation: float-slow 5s ease-in-out infinite 0.5s;
}

.dot-3 {
  width: 10px;
  height: 10px;
  background: #20C997;
  top: 50%;
  left: 0;
  animation: float-slow 3s ease-in-out infinite 1s;
}

.float-icon {
  position: absolute;
  z-index: 1;
  animation: float 5s ease-in-out infinite;
}

.icon-1 {
  top: 10px;
  right: 30px;
  animation-delay: 0.3s;
}

.icon-2 {
  bottom: 80px;
  left: 10px;
  animation-delay: 0.8s;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-slow {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* Hero 底部统计条 */
.hero-stats-bar {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 40px 0;
  border-top: 1px solid var(--border);
}

.hero-stat-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hero-stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-h);
  line-height: 1.2;
}

.hero-stat-label {
  font-size: 13px;
  color: var(--text-light);
}

/* ===== Section 通用样式 ===== */
.section {
  padding: 100px 40px;
  background: var(--bg-soft);
}

.section-white {
  background: #fff;
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 3px;
  color: var(--accent);
  opacity: 0.5;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.section-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--text-h);
  margin-bottom: 16px;
  letter-spacing: -0.3px;
}

.section-desc {
  font-size: 16px;
  color: var(--text);
  max-width: 500px;
  margin: 0 auto;
}

/* ===== 功能特性 ===== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  padding: 36px 28px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-h);
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text);
}

/* ===== 藏品分类 ===== */
.papers-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.paper-card {
  padding: 32px 24px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.paper-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.paper-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.paper-name {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
}

.paper-desc {
  font-size: 13px;
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 20px;
}

.paper-arrow {
  font-size: 13px;
  font-weight: 600;
  transition: transform 0.2s;
}

.paper-card:hover .paper-arrow {
  transform: translateX(4px);
}

/* ===== 购买流程 ===== */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;
}

.steps-grid::before {
  content: '';
  position: absolute;
  top: 40px;
  left: 12%;
  right: 12%;
  height: 2px;
  background: linear-gradient(to right, var(--accent), rgba(198, 137, 63, 0.1));
  z-index: 0;
}

.step-card {
  text-align: center;
  padding: 32px 20px;
  position: relative;
  z-index: 1;
}

.step-num {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C6893F, #E2B97F);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 25px rgba(198, 137, 63, 0.3);
}

.step-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-h);
  margin-bottom: 8px;
}

.step-desc {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
}

/* ===== 数据统计 ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  text-align: center;
  padding: 40px 24px;
  background: var(--bg-soft);
  border-radius: 20px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.stat-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text);
}

/* ===== CTA 横幅 ===== */
.cta-banner {
  background: linear-gradient(135deg, #C6893F 0%, #E2B97F 50%, #C6893F 100%);
  padding: 80px 40px;
  position: relative;
  overflow: hidden;
}

.cta-inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.cta-decoration {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.cta-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.cta-circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.cta-circle-2 {
  width: 200px;
  height: 200px;
  bottom: -80px;
  right: -50px;
}

.cta-circle-3 {
  width: 120px;
  height: 120px;
  top: 50%;
  right: 20%;
  background: rgba(255, 255, 255, 0.04);
}

.cta-title {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
}

.cta-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 36px;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-cta {
  padding: 14px 40px;
  border-radius: 8px;
  background: #fff;
  color: var(--accent);
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-cta-outline {
  padding: 14px 40px;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cta-outline:hover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* ===== 页脚 ===== */
.footer {
  background: #FFFCF8;
  padding: 60px 40px;
  border-top: 1px solid var(--border);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-desc {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  margin-top: 8px;
}

.footer-col-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-h);
  margin-bottom: 20px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-col ul a {
  font-size: 14px;
  color: var(--text);
  transition: color 0.2s;
}

.footer-col ul a:hover {
  color: var(--accent);
}

.footer-bottom {
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
}

.footer-bottom p {
  font-size: 13px;
  color: var(--text-light);
}

/* ===== 响应式 ===== */
@media (max-width: 1024px) {
  .hero-inner {
    flex-direction: column;
    text-align: center;
    gap: 50px;
    padding: 40px 0 60px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-desc {
    margin: 0 auto 40px;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    flex: none;
  }

  .features-grid,
  .papers-grid,
  .steps-grid,
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps-grid::before {
    display: none;
  }

  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 90px 20px 0;
  }

  .hero-title {
    font-size: 28px;
  }

  .section {
    padding: 60px 20px;
  }

  .section-title {
    font-size: 26px;
  }

  .features-grid,
  .papers-grid,
  .steps-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats-bar {
    flex-wrap: wrap;
    gap: 24px;
    justify-content: space-around;
    padding: 30px 20px;
  }

  .cta-banner {
    padding: 60px 20px;
  }

  .cta-title {
    font-size: 24px;
  }

  .footer {
    padding: 40px 20px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
