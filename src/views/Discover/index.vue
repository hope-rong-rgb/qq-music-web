<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="discover-page">
    <div class="page-container">
      <!-- Banner 轮播区 -->
      <section class="banner-section">
        <Carousel
          :items="bannerItems"
          :auto-play="true"
          :interval="4000"
          :show-arrows="true"
          :show-indicators="true"
          :show-caption="true"
          indicator-type="dot"
          height="300px"
          @item-click="handleBannerClick"
          @change="handleBannerChange"
        >
        </Carousel>
      </section>
      <!-- 推荐歌单 -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">推荐歌单</h2>
          <a href="#" class="more-link">
            更多
            <Icon name="arrow-right" size="sm" />
          </a>
        </div>
        <div class="playlist-grid">
          <div
            v-for="playlist in mockPlaylists"
            :key="playlist.id"
            class="playlist-card"
            @click="handleViewPlaylist(playlist)"
          >
            <div class="playlist-cover">
              <img :src="playlist.cover" :alt="playlist.name" />
              <div class="play-btn">
                <Icon name="play" size="lg" color="#fff" />
              </div>
              <div class="play-count">
                <Icon name="headphone" size="xs" color="#fff" />
                <span>{{ formatPlayCount(playlist.playCount) }}</span>
              </div>
            </div>
            <div class="playlist-name">{{ playlist.name }}</div>
          </div>
        </div>
      </section>

      <!-- 新歌推荐 -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">新歌推荐</h2>
          <button class="play-all-btn" @click="handlePlayAll">
            <Icon name="play" size="sm" color="#31c27c" />
            <span>播放全部</span>
          </button>
        </div>
        <div class="song-list">
          <div
            v-for="(song, index) in recommendSongs"
            :key="song.id"
            class="song-item"
            :class="{ playing: currentSong?.id === song.id }"
            @dblclick="handlePlaySong(song)"
          >
            <div class="song-index">
              <span v-if="currentSong?.id !== song.id">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <Icon
                v-else
                name="music"
                size="sm"
                :color="isPlaying ? '#31c27c' : '#999'"
                class="playing-icon"
              />
            </div>
            <div class="song-cover" @click="handlePlaySong(song)">
              <img :src="song.cover" :alt="song.name" />
              <div class="cover-overlay">
                <Icon
                  :name="currentSong?.id === song.id && isPlaying ? 'pause' : 'play'"
                  size="md"
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
                :name="isSongLiked(song.id) ? 'heart' : 'heart-outline'"
                size="sm"
                :color="isSongLiked(song.id) ? '#ff4757' : '#999'"
                class="action-btn"
                @click="handleToggleLike(song.id)"
                title="收藏"
              />
              <Icon
                name="plus"
                size="sm"
                color="#999"
                class="action-btn"
                @click="handleAddToPlaylist(song)"
                title="添加到播放列表"
              />
              <Icon name="more" size="sm" color="#999" class="action-btn" title="更多" />
            </div>
          </div>
        </div>
      </section>

      <!-- 热门歌手 -->
      <section class="content-section">
        <div class="section-header">
          <h2 class="section-title">热门歌手</h2>
          <a href="#" class="more-link">
            更多
            <Icon name="arrow-right" size="sm" />
          </a>
        </div>
        <div class="singer-grid">
          <div v-for="i in 8" :key="i" class="singer-card">
            <div class="singer-avatar">
              <img :src="`https://picsum.photos/200/200?random=${20 + i}`" :alt="`歌手${i}`" />
            </div>
            <div class="singer-name">歌手 {{ i }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/modules/player'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import { Carousel, type CarouselItem } from '@/components/Carousel'
import { formatTime, formatPlayCount } from '@/utils/format'
import { getRecommendSongs, mockPlaylists } from '@/data/mockData'
import type { Song } from '@/type'
import { useRouter } from 'vue-router'
const playerStore = usePlayerStore()
const userStore = useUserStore()
const router = useRouter()
const { currentSong, isPlaying } = storeToRefs(playerStore)

// 推荐歌曲
const recommendSongs = getRecommendSongs(6)
// 轮播图数据
const bannerItems: CarouselItem[] = [
  {
    image: '/img/栞.png',
    title: '日系治愈音乐',
    description: '让心灵得到治愈的温柔旋律',
    link: '/playlist/2002',
  },
  {
    image: '/img/太聪明.png',
    title: '华语经典',
    description: '那些年我们一起听过的歌',
    link: '/playlist/2001',
  },
  {
    image: '/img/做个小孩.png',
    title: '做个小孩',
    description: '找回童年的纯真与快乐',
    link: '/discover',
  },
  {
    image: '/img/我也曾想过一了百了.png',
    title: '深夜电台',
    description: '在音乐中寻找共鸣',
    link: '/playlist/2002',
  },
  {
    image: '/img/呓语.png',
    title: '民谣时光',
    description: '用音乐讲述生活的故事',
    link: '/discover',
  },
]
// 检查歌曲是否已收藏
const isSongLiked = (songId: number) => {
  return userStore.isSongLiked(songId)
}

// 播放单曲
const handlePlaySong = (song: Song) => {
  if (currentSong.value?.id === song.id) {
    playerStore.togglePlay()
  } else {
    playerStore.playSong(song)
  }
}

// 播放全部
const handlePlayAll = () => {
  if (recommendSongs.length > 0) {
    playerStore.setPlaylist(recommendSongs, 0)
  }
}
interface Playlist {
  id: number
  name: string
  cover: string
  playCount: number
}
// 切换收藏
const handleToggleLike = (songId: number) => {
  if (isSongLiked(songId)) {
    userStore.unlikeSong(songId)
  } else {
    userStore.likeSong(songId)
  }
}

// 添加到播放列表
const handleAddToPlaylist = (song: Song) => {
  playerStore.addToPlaylist(song)
  // TODO: 显示提示消息
  console.log('已添加到播放列表:', song.name)
}
const handleViewPlaylist = (playlist: Playlist) => {
  router.push(`/playlist/${playlist.id}`)
}
const handleBannerClick = (item: CarouselItem, index: number) => {
  console.log('点击轮播图:', item, index)
  if (item.link) {
    router.push(item.link)
  }
}

const handleBannerChange = (index: number) => {
  console.log('轮播图切换到:', index)
}
</script>

<style scoped>
.discover-page {
  min-height: 100%;
  padding: 20px 0;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Banner */
.banner-section {
  margin-bottom: 40px;
  border-radius: 12px;
  overflow: hidden;
}

.banner-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 60px;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), transparent);
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  color: #fff;
}

.banner-content h2 {
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.banner-content p {
  font-size: 18px;
  margin-bottom: 24px;
  opacity: 0.95;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.banner-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: rgba(49, 194, 124, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 24px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.banner-btn:hover {
  background: #31c27c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 194, 124, 0.4);
}

/* 内容区块 */
.content-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #999;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.more-link:hover {
  color: #31c27c;
}

.play-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #31c27c;
  border-radius: 20px;
  color: #31c27c;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.play-all-btn:hover {
  background: #f0fdf7;
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
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.playlist-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  background: rgba(49, 194, 124, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.playlist-card:hover .play-btn {
  opacity: 1;
}

.play-count {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
}

.playlist-name {
  margin-top: 8px;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 歌曲列表 */
.song-list {
  background: #fff;
  border-radius: 8px;
  padding: 12px 0;
}

.song-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  transition: background 0.2s;
  cursor: pointer;
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
  background: #f5f5f5;
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;
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

.action-btn {
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: scale(1.1);
}

/* 歌手网格 */
.singer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
}

.singer-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.singer-card:hover {
  transform: translateY(-4px);
}

.singer-avatar {
  width: 100px;
  height: 100px;
  background: #f5f5f5;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 12px;
}

.singer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.singer-name {
  font-size: 14px;
  color: #333;
}
/* 响应式设计 */
@media (max-width: 1024px) {
  .banner-content h2 {
    font-size: 32px;
  }

  .banner-content p {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 0 15px;
  }

  .banner-item {
    padding: 0 30px;
  }

  .banner-content h2 {
    font-size: 24px;
  }

  .banner-content p {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .banner-btn {
    padding: 10px 24px;
    font-size: 14px;
  }

  .song-album {
    display: none;
  }
}

@media (max-width: 480px) {
  .banner-content h2 {
    font-size: 20px;
  }

  .banner-content p {
    display: none;
  }

  .section-title {
    font-size: 18px;
  }

  .song-item {
    gap: 12px;
    padding: 10px 15px;
  }

  .song-cover {
    width: 40px;
    height: 40px;
  }
}
</style>
