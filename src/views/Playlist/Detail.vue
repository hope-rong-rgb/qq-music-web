<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/views/Playlist/Detail.vue -->
<template>
  <div class="playlist-detail-page">
    <div v-if="playlistDetail" class="page-container">
      <!-- 歌单头部 -->
      <div class="playlist-header">
        <div class="cover-wrapper">
          <img :src="playlistDetail.cover" :alt="playlistDetail.name" class="playlist-cover" />
          <div class="cover-overlay">
            <Icon name="play" size="2xl" color="#fff" @click="handlePlayAll" />
          </div>
        </div>

        <div class="playlist-info">
          <h1 class="playlist-name">{{ playlistDetail.name }}</h1>
          <div class="playlist-meta">
            <div class="meta-item">
              <Icon name="user" size="sm" color="#999" />
              <span>创建者</span>
            </div>
            <div class="meta-item">
              <Icon name="calendar" size="sm" color="#999" />
              <span>{{ formatDate(playlistDetail.createTime, 'YYYY-MM-DD') }}</span>
            </div>
            <div class="meta-item">
              <Icon name="music" size="sm" color="#999" />
              <span>{{ playlistDetail.trackCount }}首</span>
            </div>
            <div class="meta-item">
              <Icon name="headphone" size="sm" color="#999" />
              <span>{{ formatPlayCount(playlistDetail.playCount) }}</span>
            </div>
          </div>
          <p class="playlist-desc">{{ playlistDetail.description }}</p>

          <div class="playlist-actions">
            <button class="primary-btn" @click="handlePlayAll">
              <Icon name="play" size="md" color="#fff" />
              <span>播放全部</span>
            </button>
            <button class="secondary-btn">
              <Icon name="heart-outline" size="md" color="#31c27c" />
              <span>收藏</span>
            </button>
            <button class="secondary-btn">
              <Icon name="share" size="md" color="#999" />
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 歌曲列表 -->
      <div class="songs-section">
        <div class="section-header">
          <h2 class="section-title">歌曲列表</h2>
          <span class="song-count">共 {{ songList.length }} 首</span>
        </div>

        <div class="songs-table">
          <div class="table-header">
            <div class="col col-index">#</div>
            <div class="col col-title">歌曲</div>
            <div class="col col-artist">歌手</div>
            <div class="col col-album">专辑</div>
            <div class="col col-duration">时长</div>
            <div class="col col-actions">操作</div>
          </div>

          <div class="table-body">
            <div
              v-for="(song, index) in songList"
              :key="song.id"
              :class="['table-row', { playing: currentSong?.id === song.id }]"
              @dblclick="handlePlaySong(song, index)"
            >
              <div class="col col-index">
                <span v-if="currentSong?.id !== song.id">{{ index + 1 }}</span>
                <Icon
                  v-else
                  name="music"
                  size="sm"
                  :color="isPlaying ? '#31c27c' : '#999'"
                  class="playing-icon"
                />
              </div>
              <div class="col col-title">
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
                <span class="song-name">{{ song.name }}</span>
              </div>
              <div class="col col-artist">{{ song.artist }}</div>
              <div class="col col-album">{{ song.album }}</div>
              <div class="col col-duration">{{ formatTime(song.duration) }}</div>
              <div class="col col-actions">
                <Icon
                  :name="isSongLiked(song.id) ? 'heart' : 'heart-outline'"
                  size="sm"
                  :color="isSongLiked(song.id) ? '#ff4757' : '#999'"
                  class="action-icon"
                  @click="handleToggleLike(song.id)"
                  title="收藏"
                />
                <Icon
                  name="plus"
                  size="sm"
                  color="#999"
                  class="action-icon"
                  @click="handleAddToPlaylist(song)"
                  title="添加到播放列表"
                />
                <Icon name="download" size="sm" color="#999" class="action-icon" title="下载" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading-state">
      <Icon name="loading" size="2xl" color="#ccc" class="animate-spin" />
      <p>加载中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/modules/player'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import { formatTime, formatPlayCount, formatDate } from '@/utils/format'
import { getPlaylistDetail } from '@/data/mockData'
import type { Song } from '@/type'

const route = useRoute()
const playerStore = usePlayerStore()
const userStore = useUserStore()

const { currentSong, isPlaying } = storeToRefs(playerStore)

const playlistDetail = ref<any>(null)
const songList = computed(() => playlistDetail.value?.songList || [])

const isSongLiked = (songId: number) => {
  return userStore.isSongLiked(songId)
}

const handlePlayAll = () => {
  if (songList.value.length > 0) {
    playerStore.setPlaylist(songList.value, 0)
  }
}

const handlePlaySong = (song: Song, index: number) => {
  if (currentSong.value?.id === song.id) {
    playerStore.togglePlay()
  } else {
    playerStore.setPlaylist(songList.value, index)
  }
}

const handleToggleLike = (songId: number) => {
  if (isSongLiked(songId)) {
    userStore.unlikeSong(songId)
  } else {
    userStore.likeSong(songId)
  }
}

const handleAddToPlaylist = (song: Song) => {
  playerStore.addToPlaylist(song)
  console.log('已添加到播放列表:', song.name)
}

onMounted(() => {
  const playlistId = parseInt(route.params.id as string)
  if (playlistId) {
    // 模拟异步加载
    setTimeout(() => {
      playlistDetail.value = getPlaylistDetail(playlistId)
    }, 500)
  }
})
</script>

<style scoped>
.playlist-detail-page {
  min-height: 100%;
  background: #f5f5f5;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 歌单头部 */
.playlist-header {
  display: flex;
  gap: 40px;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cover-wrapper {
  position: relative;
  width: 250px;
  height: 250px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.playlist-cover {
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

.cover-wrapper:hover .cover-overlay {
  opacity: 1;
}

.playlist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.playlist-name {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.playlist-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.playlist-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  margin-bottom: 24px;
}

.playlist-actions {
  display: flex;
  gap: 12px;
}

.primary-btn,
.secondary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background: #31c27c;
  color: #fff;
}

.primary-btn:hover {
  background: #2bb56f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(49, 194, 124, 0.3);
}

.secondary-btn {
  background: #fff;
  color: #666;
  border: 1px solid #e5e5e5;
}

.secondary-btn:hover {
  border-color: #31c27c;
  color: #31c27c;
}

/* 歌曲列表 */
.songs-section {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.song-count {
  font-size: 14px;
  color: #999;
}

/* 表格 */
.songs-table {
  width: 100%;
}

.table-header,
.table-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.table-header {
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.table-row {
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;
  cursor: pointer;
}

.table-row:hover {
  background: #f5f5f5;
}

.table-row.playing {
  background: #f0fdf7;
}

.col {
  padding: 0 12px;
}

.col-index {
  flex: 0 0 50px;
  text-align: center;
}

.col-title {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.col-artist {
  flex: 0 0 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666;
}

.col-album {
  flex: 0 0 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #999;
}

.col-duration {
  flex: 0 0 60px;
  text-align: right;
  color: #999;
}

.col-actions {
  flex: 0 0 120px;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity 0.2s;
}

.table-row:hover .col-actions {
  opacity: 1;
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
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-cover .cover-overlay {
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

.song-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-row.playing .song-name {
  color: #31c27c;
  font-weight: 500;
}

.action-icon {
  cursor: pointer;
  transition: all 0.2s;
}

.action-icon:hover {
  transform: scale(1.1);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #999;
  gap: 16px;
}
</style>
