<!-- src/components/Player/FullScreenPlayer.vue -->
<template>
  <transition name="fullscreen-fade">
    <div v-if="visible" class="fullscreen-player" @click="handleClose">
      <!-- 背景 -->
      <div class="background">
        <div
          class="bg-image"
          :style="{ backgroundImage: currentSong?.cover ? `url(${currentSong.cover})` : 'none' }"
        ></div>
        <div class="bg-overlay"></div>
      </div>

      <!-- 内容区域 -->
      <div class="player-content" @click.stop>
        <!-- 顶部操作栏 -->
        <div class="top-bar">
          <button class="close-btn" @click="handleClose">
            <Icon name="down" size="lg" color="#fff" />
          </button>
          <div class="song-header">
            <h2 class="song-title">{{ currentSong?.name || '未播放' }}</h2>
            <p class="song-subtitle">{{ currentSong?.artist || '-' }}</p>
          </div>
          <div class="top-actions">
            <Icon name="share" size="lg" color="#fff" class="action-icon" title="分享" />
          </div>
        </div>

        <!-- 中间区域 -->
        <div class="middle-section">
          <!-- 左侧：专辑封面 -->
          <div class="album-section">
            <div class="album-wrapper">
              <div class="album-cover" :class="{ rotating: isPlaying }">
                <img v-if="currentSong?.cover" :src="currentSong.cover" :alt="currentSong.name" />
                <Icon v-else name="music" size="2xl" color="#fff" />
              </div>
              <div class="album-needle" :class="{ playing: isPlaying }"></div>
            </div>
          </div>

          <!-- 右侧：歌词 -->
          <div class="lyric-section">
            <InteractiveLyric
              :lyric="currentSong?.lyric || ''"
              :current-time="currentTime"
              :is-playing="isPlaying"
              @seek="handleSeek"
            />
          </div>
        </div>

        <!-- 底部控制区 -->
        <div class="bottom-section">
          <!-- 操作按钮 -->
          <div class="song-actions">
            <Icon
              :name="isSongLiked ? 'heart' : 'heart-outline'"
              size="lg"
              :color="isSongLiked ? '#ff4757' : '#fff'"
              class="action-icon"
              @click="handleToggleLike"
              title="收藏"
            />
            <Icon name="download" size="lg" color="#fff" class="action-icon" title="下载" />
            <Icon name="comment" size="lg" color="#fff" class="action-icon" title="评论" />
            <Icon name="more" size="lg" color="#fff" class="action-icon" title="更多" />
          </div>

          <!-- 进度条 -->
          <div class="progress-section">
            <span class="time-text">{{ formatTime(currentTime) }}</span>
            <ProgressBar
              v-model="localCurrentTime"
              :max="duration"
              @change="handleSeek"
              class="progress-bar"
            />
            <span class="time-text">{{ formatTime(duration) }}</span>
          </div>

          <!-- 控制按钮 -->
          <div class="control-section">
            <Icon
              :name="playModeIcon"
              size="lg"
              color="#fff"
              class="control-icon"
              @click="handleTogglePlayMode"
              :title="playModeText"
            />

            <Icon
              name="prev"
              size="xl"
              color="#fff"
              class="control-icon"
              @click="handlePrev"
              title="上一曲"
            />

            <div class="play-button" @click="handleTogglePlay">
              <Icon :name="isPlaying ? 'pause' : 'play'" size="2xl" color="#fff" />
            </div>

            <Icon
              name="next"
              size="xl"
              color="#fff"
              class="control-icon"
              @click="handleNext"
              title="下一曲"
            />

            <Icon
              name="list"
              size="lg"
              color="#fff"
              class="control-icon"
              @click="handleShowPlaylist"
              title="播放列表"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore, PlayMode } from '@/stores/modules/player'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import ProgressBar from '@/components/Player/ProgressBar.vue'
import InteractiveLyric from '@/components/Lyric/InteractiveLyric.vue'
import { formatTime } from '@/utils/format'

interface Props {
  visible: boolean
  duration: number
}

const _props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  seek: [time: number]
  'show-playlist': []
}>()

const playerStore = usePlayerStore()
const userStore = useUserStore()

const { currentSong, isPlaying, currentTime, playMode, playModeIcon } = storeToRefs(playerStore)

const localCurrentTime = ref(0)

watch(currentTime, (newTime) => {
  localCurrentTime.value = newTime
})

const isSongLiked = computed(() => {
  if (!currentSong.value) return false
  return userStore.isSongLiked(currentSong.value.id)
})

const playModeText = computed(() => {
  switch (playMode.value) {
    case PlayMode.SINGLE_LOOP:
      return '单曲循环'
    case PlayMode.RANDOM:
      return '随机播放'
    default:
      return '列表循环'
  }
})

const handleClose = () => {
  emit('update:visible', false)
}

const handleTogglePlay = () => {
  playerStore.togglePlay()
}

const handlePrev = () => {
  playerStore.playPrev()
}

const handleNext = () => {
  playerStore.playNext()
}

const handleSeek = (time: number) => {
  emit('seek', time)
}

const handleTogglePlayMode = () => {
  playerStore.togglePlayMode()
}

const handleToggleLike = () => {
  if (!currentSong.value) return

  if (isSongLiked.value) {
    userStore.unlikeSong(currentSong.value.id)
  } else {
    userStore.likeSong(currentSong.value.id)
  }
}

const handleShowPlaylist = () => {
  emit('show-playlist')
}
</script>

<style scoped>
.fullscreen-player {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 背景 */
.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.bg-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: blur(60px);
  transform: scale(1.2);
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

/* 内容区域 */
.player-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 顶部栏 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
}

.close-btn {
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.song-header {
  text-align: center;
  flex: 1;
}

.song-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.song-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.top-actions {
  width: 48px;
}

/* 中间区域 */
.middle-section {
  flex: 1;
  display: flex;
  gap: 60px;
  overflow: hidden;
  padding: 40px 0;
}

/* 专辑封面区 */
.album-section {
  flex: 0 0 45%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
}

.album-cover {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-cover.rotating img {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 唱针 */
.album-needle {
  position: absolute;
  top: -60px;
  right: 45%;
  width: 120px;
  height: 180px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.6) 40%,
    rgba(255, 255, 255, 0.4) 100%
  );
  clip-path: polygon(48% 0%, 52% 0%, 52% 75%, 60% 75%, 50% 100%, 40% 75%, 48% 75%);
  transform-origin: 50% 0%;
  transform: rotate(-20deg);
  transition: transform 0.5s ease;
  z-index: 10;
}

.album-needle.playing {
  transform: rotate(0deg);
}

/* 歌词区 */
.lyric-section {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* 底部控制区 */
.bottom-section {
  padding: 20px 0;
}

.song-actions {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 30px;
}

.action-icon {
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.action-icon:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.time-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 45px;
  text-align: center;
}

.progress-bar {
  flex: 1;
}

.control-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}

.control-icon {
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.control-icon:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.play-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.play-button:active {
  transform: scale(0.95);
}

/* 过渡动画 */
.fullscreen-fade-enter-active,
.fullscreen-fade-leave-active {
  transition: opacity 0.3s ease;
}

.fullscreen-fade-enter-from,
.fullscreen-fade-leave-to {
  opacity: 0;
}
</style>
