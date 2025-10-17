<!-- src/layouts/MainLayout.vue（完整替换）-->
<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <header class="layout-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <Icon name="music" size="xl" color="#31c27c" />
          <span class="logo-text">QQ音乐</span>
        </div>

        <nav class="main-nav">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            active-class="active"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="header-actions">
          <!-- 只保留一个搜索框 -->
          <div class="search-box" @click="showSearch = true">
            <Icon name="search" size="sm" color="#999" />
            <span class="search-placeholder">搜索音乐、歌手、专辑</span>
          </div>

          <div class="user-section" @click="handleUserClick">
            <Icon name="user" size="lg" color="#31c27c" />
            <span class="username">{{ userStore.username }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主体区域 -->
    <div class="layout-body">
      <!-- 侧边栏 -->
      <aside class="layout-sidebar">
        <div class="sidebar-section">
          <div class="section-title">在线音乐</div>
          <div
            v-for="item in sidebarItems"
            :key="item.path"
            class="sidebar-item"
            :class="{ active: $route.path === item.path }"
            @click="handleSidebarClick(item.path)"
          >
            <Icon :name="item.icon" size="sm" />
            <span>{{ item.label }}</span>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="section-title">我的音乐</div>
          <div class="sidebar-item" @click="handleMyLiked">
            <Icon name="heart" size="sm" />
            <span>我喜欢 ({{ userStore.likedSongs.length }})</span>
          </div>
          <div class="sidebar-item" @click="handleRecentPlay">
            <Icon name="clock" size="sm" />
            <span>最近播放 ({{ playerStore.playHistory.length }})</span>
          </div>
          <div class="sidebar-item">
            <Icon name="download" size="sm" />
            <span>本地音乐</span>
          </div>
        </div>

        <div class="sidebar-section" v-if="userStore.createdPlaylists.length > 0">
          <div class="section-title">创建的歌单</div>
          <div
            v-for="playlist in userStore.createdPlaylists"
            :key="playlist.id"
            class="sidebar-item"
          >
            <Icon name="list" size="sm" />
            <span>{{ playlist.name }}</span>
          </div>
        </div>
      </aside>

      <!-- 内容区域 -->
      <main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- 底部播放器 -->
    <footer class="layout-footer">
      <Player />
    </footer>

    <!-- 搜索面板 -->
    <SearchPanel v-model:visible="showSearch" />

    <!-- 登录对话框 -->
    <LoginDialog v-model:visible="showLoginDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/modules/player'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import Player from '@/components/Player/Player.vue'
import SearchPanel from '@/components/Search/SearchPanel.vue'
import LoginDialog from '@/components/Auth/LoginDialog.vue'

const router = useRouter()
const playerStore = usePlayerStore()
const userStore = useUserStore()

const showSearch = ref(false)
const showLoginDialog = ref(false)

const navItems = [
  { path: '/discover', label: '发现音乐' },
  { path: '/my-music', label: '我的音乐' },
  { path: '/ranking', label: '排行榜' },
  { path: '/singers', label: '歌手' },
  { path: '/albums', label: '专辑' },
]

const sidebarItems = [
  { path: '/discover', label: '推荐', icon: 'home' },
  { path: '/playlist', label: '歌单', icon: 'list' },
  { path: '/ranking', label: '排行榜', icon: 'trending' },
  { path: '/singers', label: '歌手', icon: 'microphone' },
  { path: '/albums', label: '专辑', icon: 'album' },
]

const handleSidebarClick = (path: string): void => {
  router.push(path)
}

const handleUserClick = (): void => {
  if (userStore.isLoggedIn) {
    router.push('/profile')
  } else {
    showLoginDialog.value = true
  }
}

const handleMyLiked = (): void => {
  router.push('/my-music')
}

const handleRecentPlay = (): void => {
  router.push('/my-music')
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

/* 头部导航 */
.layout-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 40px;
  cursor: pointer;
  user-select: none;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.main-nav {
  display: flex;
  gap: 30px;
  flex: 1;
}

.nav-item {
  color: #666;
  text-decoration: none;
  font-size: 15px;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.nav-item:hover {
  color: #31c27c;
}

.nav-item.active {
  color: #31c27c;
  border-bottom-color: #31c27c;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 20px;
  width: 260px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-box:hover {
  background: #ebebeb;
}

.search-placeholder {
  flex: 1;
  font-size: 14px;
  color: #999;
  user-select: none;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background 0.2s;
}

.user-section:hover {
  background: #f5f5f5;
}

.username {
  color: #333;
  font-size: 14px;
}

/* 主体布局 */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 侧边栏 */
.layout-sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-section {
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 12px;
  color: #999;
  padding: 0 20px 12px;
  font-weight: 500;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.sidebar-item:hover {
  background: #f5f5f5;
  color: #31c27c;
}

.sidebar-item.active {
  background: #f0fdf7;
  color: #31c27c;
  font-weight: 500;
}

/* 主内容区 */
.layout-main {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
}

/* 底部播放器 */
.layout-footer {
  height: 80px;
  background: #fff;
  border-top: 1px solid #e5e5e5;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
