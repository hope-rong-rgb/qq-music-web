<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="profile-page">
    <div v-if="userStore.isLoggedIn" class="page-container">
      <!-- 用户信息卡片 -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <img :src="userStore.avatar || defaultAvatar" alt="头像" class="user-avatar" />
          <button class="edit-avatar-btn">
            <Icon name="image" size="sm" color="#fff" />
          </button>
        </div>

        <div class="user-info">
          <h1 class="username">{{ userStore.username }}</h1>
          <p v-if="userStore.userInfo?.email" class="user-email">
            {{ userStore.userInfo.email }}
          </p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ userStore.likedSongs.length }}</span>
              <span class="stat-label">收藏的歌曲</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ userStore.createdPlaylists.length }}</span>
              <span class="stat-label">创建的歌单</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ playerStore.playHistory.length }}</span>
              <span class="stat-label">播放记录</span>
            </div>
          </div>
        </div>

        <div class="profile-actions">
          <button class="action-btn edit-btn">
            <Icon name="settings" size="md" color="#666" />
            <span>编辑资料</span>
          </button>
          <button class="action-btn logout-btn" @click="handleLogout">
            <Icon name="close" size="md" color="#ff4757" />
            <span>退出登录</span>
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="profile-content">
        <!-- 我喜欢的音乐 -->
        <section v-if="likedSongsList.length > 0" class="content-section">
          <div class="section-header">
            <h2 class="section-title">我喜欢的音乐</h2>
            <button class="play-all-btn" @click="handlePlayAllLiked">
              <Icon name="play" size="sm" color="#31c27c" />
              <span>播放全部</span>
            </button>
          </div>

          <div class="songs-list">
            <div
              v-for="(song, index) in likedSongsList"
              :key="song.id"
              :class="['song-item', { playing: currentSong?.id === song.id }]"
              @dblclick="handlePlaySong(song, index)"
            >
              <div class="song-index">
                <span v-if="currentSong?.id !== song.id">{{ index + 1 }}</span>
                <Icon
                  v-else
                  name="music"
                  size="sm"
                  :color="isPlaying ? '#31c27c' : '#999'"
                  class="playing-icon"
                />
              </div>
              <div class="song-cover" @click="handlePlaySong(song, index)">
                <img :src="song.cover" :alt="song.name" />
                <div class="cover-overlay">
                  <Icon
                    :name="currentSong?.id === song.id && isPlaying ? 'pause' : 'play'"
                    size="sm"
                    color="#fff"
                  />
                </div>
              </div>
              <div class="song-info">
                <div class="song-name">{{ song.name }}</div>
                <div class="song-artist">{{ song.artist }}</div>
              </div>
              <div class="song-album">{{ song.album }}</div>
              <div class="song-duration">{{ formatTime(song.duration) }}</div>
              <div class="song-actions">
                <Icon
                  name="heart"
                  size="sm"
                  color="#ff4757"
                  class="action-icon"
                  @click="handleUnlike(song.id)"
                  title="取消收藏"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- 最近播放 -->
        <section v-if="playerStore.playHistory.length > 0" class="content-section">
          <div class="section-header">
            <h2 class="section-title">最近播放</h2>
            <button class="clear-btn" @click="handleClearHistory">
              <Icon name="close" size="sm" color="#999" />
              <span>清空</span>
            </button>
          </div>

          <div class="history-grid">
            <div
              v-for="song in playerStore.playHistory.slice(0, 10)"
              :key="song.id"
              class="history-card"
              @click="handlePlaySong(song, 0)"
            >
              <div class="history-cover">
                <img :src="song.cover" :alt="song.name" />
                <div class="cover-overlay">
                  <Icon name="play" size="lg" color="#fff" />
                </div>
              </div>
              <div class="history-info">
                <div class="history-name">{{ song.name }}</div>
                <div class="history-artist">{{ song.artist }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 创建的歌单 -->
        <section v-if="userStore.createdPlaylists.length > 0" class="content-section">
          <div class="section-header">
            <h2 class="section-title">创建的歌单</h2>
            <button class="create-btn">
              <Icon name="plus" size="sm" color="#31c27c" />
              <span>新建歌单</span>
            </button>
          </div>

          <div class="playlist-grid">
            <div
              v-for="playlist in userStore.createdPlaylists"
              :key="playlist.id"
              class="playlist-card"
            >
              <div class="playlist-cover">
                <img :src="playlist.cover" :alt="playlist.name" />
                <div class="cover-overlay">
                  <Icon name="play" size="lg" color="#fff" />
                </div>
              </div>
              <div class="playlist-info">
                <div class="playlist-name">{{ playlist.name }}</div>
                <div class="playlist-count">{{ playlist.trackCount }}首</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 空状态 -->
        <div v-if="isEmpty" class="empty-state">
          <Icon name="music" size="2xl" color="#ccc" />
          <p>暂无内容</p>
          <span>去发现页面找找喜欢的音乐吧～</span>
          <button class="goto-btn" @click="$router.push('/discover')">去发现音乐</button>
        </div>
      </div>
    </div>

    <!-- 未登录状态 -->
    <div v-else class="not-logged-in">
      <Icon name="user" size="2xl" color="#ccc" />
      <h2>请先登录</h2>
      <p>登录后可以收藏喜欢的音乐、创建歌单等</p>
      <button class="login-btn" @click="showLoginDialog = true">立即登录</button>
    </div>

    <!-- 登录对话框 -->
    <LoginDialog v-model:visible="showLoginDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/modules/player'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import LoginDialog from '@/components/Auth/LoginDialog.vue'
import { formatTime } from '@/utils/format'
import { message } from '@/utils/message'
import { getSongById } from '@/data/mockData'
import type { Song } from '@/type'

const router = useRouter()
const playerStore = usePlayerStore()
const userStore = useUserStore()

const { currentSong, isPlaying } = storeToRefs(playerStore)

const showLoginDialog = ref(false)
const defaultAvatar = 'https://picsum.photos/200/200?random=999'

// 获取收藏的歌曲列表
const likedSongsList = computed(() => {
  return userStore.likedSongs
    .map((songId: number) => getSongById(songId))
    .filter((song: unknown): song is Song => song !== undefined)
})

// 判断是否为空状态
const isEmpty = computed(() => {
  return (
    userStore.likedSongs.length === 0 &&
    playerStore.playHistory.length === 0 &&
    userStore.createdPlaylists.length === 0
  )
})

// 播放歌曲
const handlePlaySong = (song: Song, _p0: number): void => {
  if (currentSong.value?.id === song.id) {
    playerStore.togglePlay()
  } else {
    playerStore.playSong(song)
  }
}

// 播放全部收藏
const handlePlayAllLiked = (): void => {
  if (likedSongsList.value.length > 0) {
    playerStore.setPlaylist(likedSongsList.value, 0)
    message.success('开始播放我喜欢的音乐')
  }
}

// 取消收藏
const handleUnlike = (songId: number): void => {
  userStore.unlikeSong(songId)
  message.success('已取消收藏')
}

// 清空播放历史
const handleClearHistory = (): void => {
  if (confirm('确定要清空播放历史吗？')) {
    playerStore.playHistory = []
    message.success('已清空播放历史')
  }
}

// 退出登录
const handleLogout = (): void => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    message.success('已退出登录')
    router.push('/discover')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100%;
  background: #f5f5f5;
  padding: 40px 0;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 用户信息卡片 */
.profile-header {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.edit-avatar-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.edit-avatar-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.username {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.user-email {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.user-stats {
  display: flex;
  gap: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #31c27c;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.edit-btn {
  background: #f5f5f5;
  color: #666;
}

.edit-btn:hover {
  background: #ebebeb;
}

.logout-btn {
  background: #fff;
  border: 1px solid #ff4757;
  color: #ff4757;
}

.logout-btn:hover {
  background: #fff5f6;
}

/* 内容区域 */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.content-section {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.play-all-btn,
.clear-btn,
.create-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s;
}

.play-all-btn {
  background: #fff;
  border: 1px solid #31c27c;
  color: #31c27c;
}

.play-all-btn:hover {
  background: #f0fdf7;
}

.clear-btn {
  background: #fff;
  border: 1px solid #e5e5e5;
  color: #999;
}

.clear-btn:hover {
  background: #f5f5f5;
  border-color: #ff4757;
  color: #ff4757;
}

.create-btn {
  background: #fff;
  border: 1px solid #31c27c;
  color: #31c27c;
}

.create-btn:hover {
  background: #f0fdf7;
}

/* 歌曲列表 */
.songs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.song-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.song-item:hover {
  background: #f5f5f5;
}

.song-item.playing {
  background: #f0fdf7;
}

.song-index {
  width: 30px;
  text-align: center;
  color: #999;
  font-size: 14px;
  flex-shrink: 0;
}

.playing-icon {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.song-cover {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.song-cover:hover .cover-overlay {
  opacity: 1;
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-item.playing .song-name {
  color: #31c27c;
  font-weight: 500;
}

.song-artist {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-album {
  flex: 0 0 150px;
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-duration {
  flex: 0 0 50px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

.song-actions {
  display: flex;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.2s;
}

.song-item:hover .song-actions {
  opacity: 1;
}

.action-icon {
  cursor: pointer;
  transition: all 0.2s;
}

.action-icon:hover {
  transform: scale(1.1);
}

/* 播放历史网格 */
.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
}

.history-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.history-card:hover {
  transform: translateY(-4px);
}

.history-cover {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.history-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.history-card:hover .cover-overlay {
  opacity: 1;
}

.history-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-artist {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 歌单网格 */
.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
}

.playlist-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.playlist-card:hover {
  transform: translateY(-4px);
}

.playlist-cover {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}

.playlist-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-card:hover .cover-overlay {
  opacity: 1;
}

.playlist-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-count {
  font-size: 12px;
  color: #999;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
  gap: 12px;
}

.empty-state span {
  font-size: 14px;
}

.goto-btn {
  margin-top: 20px;
  padding: 10px 24px;
  background: #31c27c;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s;
}

.goto-btn:hover {
  background: #2bb56f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(49, 194, 124, 0.3);
}

/* 未登录状态 */
.not-logged-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  color: #999;
  gap: 16px;
}

.not-logged-in h2 {
  font-size: 24px;
  color: #333;
}

.not-logged-in p {
  font-size: 14px;
}

.login-btn {
  margin-top: 20px;
  padding: 12px 32px;
  background: #31c27c;
  color: #fff;
  border-radius: 24px;
  font-size: 16px;
  transition: all 0.2s;
}

.login-btn:hover {
  background: #2bb56f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(49, 194, 124, 0.3);
}
</style>
