<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="player-container">
    <!-- 隐藏的音频元素 -->
    <audio
      ref="audioRef"
      @timeupdate="handleTimeUpdate"
      @ended="handleEnded"
      @loadedmetadata="handleLoadedMetadata"
      @canplay="handleCanPlay"
      @error="handleError"
      @pause="handleAudioPause"
      @play="handleAudioPlay"
    />

    <div class="player-content">
      <!-- 左侧：歌曲信息 -->
      <div class="player-left">
        <div class="song-cover" @click="handleShowFullScreen" :class="{ rotating: isPlaying }">
          <img v-if="currentSong?.cover" :src="currentSong.cover" :alt="currentSong.name" />
          <Icon v-else name="music" size="lg" color="#999" />
        </div>

        <div v-if="currentSong" class="song-info">
          <div class="song-name">{{ currentSong.name }}</div>
          <div class="song-artist">{{ currentSong.artist }}</div>
        </div>

        <div v-else class="song-info">
          <div class="song-name">暂无播放</div>
          <div class="song-artist">选择歌曲开始播放</div>
        </div>

        <div class="song-actions">
          <Icon
            :name="isSongLiked ? 'heart' : 'heart-outline'"
            size="md"
            :color="isSongLiked ? '#ff4757' : '#999'"
            class="action-icon"
            @click="handleToggleLike"
            title="收藏"
          />
        </div>
      </div>

      <!-- 中间：播放控制 -->
      <div class="player-center">
        <div class="control-buttons">
          <!-- 播放模式 -->
          <Icon
            :name="playModeIcon"
            size="lg"
            color="#666"
            class="control-icon"
            @click="handleTogglePlayMode"
            :title="playModeText"
          />

          <!-- 上一曲 -->
          <Icon
            name="prev"
            size="lg"
            color="#666"
            class="control-icon"
            @click="handlePrev"
            title="上一曲"
          />

          <!-- 播放/暂停 -->
          <div class="play-button" @click="handleTogglePlay">
            <Icon :name="isPlaying ? 'pause' : 'play'" size="xl" color="#fff" />
          </div>

          <!-- 下一曲 -->
          <Icon
            name="next"
            size="lg"
            color="#666"
            class="control-icon"
            @click="handleNext"
            title="下一曲"
          />

          <!-- 播放列表 -->
          <div class="playlist-btn" @click="showPlaylist = !showPlaylist">
            <Icon name="list" size="lg" color="#666" class="control-icon" />
            <span v-if="playlist.length > 0" class="playlist-count">
              {{ playlist.length }}
            </span>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="progress-container">
          <span class="time-text">{{ formatTime(currentTime) }}</span>
          <ProgressBar
            v-model="currentTime"
            :max="duration"
            @change="handleSeek"
            class="progress"
          />
          <span class="time-text">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 右侧：音量控制 -->
      <div class="player-right">
        <VolumeControl
          :volume="volume"
          :is-muted="isMuted"
          @update:volume="handleVolumeChange"
          @update:is-muted="handleMuteChange"
        />
      </div>
    </div>

    <!-- 播放列表面板 -->
    <PlaylistPanel v-model:visible="showPlaylist" />

    <!-- 全屏播放器 -->
    <FullScreenPlayer
      v-model:visible="showFullScreen"
      :duration="duration"
      @seek="handleSeek"
      @show-playlist="showPlaylist = true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore, PlayMode } from '@/stores/modules/player'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import ProgressBar from '@/components/Player/ProgressBar.vue'
import VolumeControl from '@/components/Player/VolumeControl.vue'
import PlaylistPanel from '@/components/Player/PlaylistPanel.vue'
import FullScreenPlayer from '@/components/Player/FullScreenPlayer.vue'
import { formatTime } from '@/utils/format'

const playerStore = usePlayerStore()
const userStore = useUserStore()

const { currentSong, isPlaying, currentTime, volume, isMuted, playMode, playlist, playModeIcon } =
  storeToRefs(playerStore)

const audioRef = ref<HTMLAudioElement | null>(null)
const duration = ref(0)
const showPlaylist = ref(false)
const showFullScreen = ref(false)
const isAudioReady = ref(false)
const isLoadingAudio = ref(false)

// 计算属性
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

// 加载音频（带超时控制）
const loadAudio = async (url: string): Promise<void> => {
  if (!audioRef.value || isLoadingAudio.value) return

  isLoadingAudio.value = true
  isAudioReady.value = false

  try {
    // 设置超时
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Audio load timeout')), 10000) // 10秒超时
    })

    // 加载音频
    const loadPromise = new Promise<void>((resolve, reject) => {
      if (!audioRef.value) {
        reject(new Error('Audio element not found'))
        return
      }

      const handleCanPlay = () => {
        cleanup()
        resolve()
      }

      const handleError = () => {
        cleanup()
        reject(new Error('Audio load failed'))
      }

      const cleanup = () => {
        audioRef.value?.removeEventListener('canplay', handleCanPlay)
        audioRef.value?.removeEventListener('error', handleError)
      }

      audioRef.value.addEventListener('canplay', handleCanPlay)
      audioRef.value.addEventListener('error', handleError)

      audioRef.value.src = url
      audioRef.value.load()
    })

    await Promise.race([loadPromise, timeoutPromise])
    isAudioReady.value = true
  } catch (error) {
    console.error('音频加载失败:', error)
    isAudioReady.value = false
    // 可以在这里显示错误提示
  } finally {
    isLoadingAudio.value = false
  }
}

// 播放音频（带错误处理）
const playAudio = async (): Promise<void> => {
  if (!audioRef.value || !isAudioReady.value) return

  try {
    // 清除所有待处理的播放请求
    await audioRef.value.pause()
    await audioRef.value.play()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('播放失败:', error)

    // 处理常见错误
    if (error.name === 'AbortError') {
      // 播放被中断，忽略
      return
    } else if (error.name === 'NotAllowedError') {
      // 用户未授权播放
      console.warn('需要用户交互才能播放')
      playerStore.isPlaying = false
    } else {
      // 其他错误
      playerStore.isPlaying = false
    }
  }
}

// 暂停音频
const pauseAudio = (): void => {
  if (!audioRef.value) return
  audioRef.value.pause()
}

// 监听当前歌曲变化
watch(currentSong, async (newSong, oldSong) => {
  if (!newSong || newSong.id === oldSong?.id) return

  // 暂停当前播放
  if (audioRef.value) {
    audioRef.value.pause()
  }

  // 加载新音频
  await loadAudio(newSong.url)

  // 如果应该播放，则播放
  if (isPlaying.value && isAudioReady.value) {
    await playAudio()
  }
})

// 监听播放状态
watch(isPlaying, async (playing) => {
  if (!currentSong.value || !audioRef.value) return

  if (playing) {
    // 如果音频未就绪，先加载
    if (!isAudioReady.value) {
      await loadAudio(currentSong.value.url)
    }

    if (isAudioReady.value) {
      await playAudio()
    }
  } else {
    pauseAudio()
  }
})

// 监听音量变化
watch(volume, (newVolume) => {
  if (audioRef.value) {
    audioRef.value.volume = newVolume
  }
})

// 监听静音状态
watch(isMuted, (muted) => {
  if (audioRef.value) {
    audioRef.value.muted = muted
  }
})

// 事件处理
const handleTimeUpdate = () => {
  if (audioRef.value && !isNaN(audioRef.value.currentTime)) {
    playerStore.setCurrentTime(parseFloat(audioRef.value.currentTime.toFixed(2)))
  }
}

const handleLoadedMetadata = () => {
  if (audioRef.value && !isNaN(audioRef.value.duration)) {
    duration.value = audioRef.value.duration
  }
}

const handleCanPlay = () => {
  isAudioReady.value = true
}

const handleError = (event: Event) => {
  console.error('音频错误:', event)
  isAudioReady.value = false
  playerStore.isPlaying = false
}

const handleAudioPause = () => {
  // 音频实际暂停时同步状态
  if (isPlaying.value && audioRef.value && audioRef.value.paused) {
    playerStore.isPlaying = false
  }
}

const handleAudioPlay = () => {
  // 音频实际播放时同步状态
  if (!isPlaying.value && audioRef.value && !audioRef.value.paused) {
    playerStore.isPlaying = true
  }
}

const handleEnded = () => {
  if (playMode.value === PlayMode.SINGLE_LOOP) {
    // 单曲循环：重新播放当前歌曲
    if (audioRef.value) {
      audioRef.value.currentTime = 0
      playAudio()
    }
  } else {
    // 列表循环或随机播放：播放下一曲
    playerStore.playNext()
  }
}

const handleTogglePlay = () => {
  if (!currentSong.value) {
    // 如果没有当前歌曲且播放列表不为空，播放第一首
    if (playlist.value.length > 0) {
      playerStore.playSong(playlist.value[0])
    }
    return
  }
  playerStore.togglePlay()
}

const handlePrev = () => {
  playerStore.playPrev()
}

const handleNext = () => {
  playerStore.playNext()
}

const handleSeek = (time: number) => {
  if (audioRef.value) {
    audioRef.value.currentTime = time
    playerStore.setCurrentTime(parseFloat(time.toFixed(2)))
  }
}

const handleVolumeChange = (newVolume: number) => {
  playerStore.setVolume(newVolume)
}

const handleMuteChange = () => {
  playerStore.toggleMute()
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

const handleShowFullScreen = () => {
  if (currentSong.value) {
    showFullScreen.value = true
  }
}

// 键盘快捷键
const handleKeyboard = (event: KeyboardEvent) => {
  // 空格键：播放/暂停
  if (event.code === 'Space' && event.target === document.body) {
    event.preventDefault()
    handleTogglePlay()
  }
  // 左箭头：后退5秒
  else if (event.code === 'ArrowLeft') {
    event.preventDefault()
    const newTime = Math.max(0, currentTime.value - 5)
    handleSeek(newTime)
  }
  // 右箭头：前进5秒
  else if (event.code === 'ArrowRight') {
    event.preventDefault()
    const newTime = Math.min(duration.value, currentTime.value + 5)
    handleSeek(newTime)
  }
  // 上箭头：增加音量
  else if (event.code === 'ArrowUp') {
    event.preventDefault()
    const newVolume = Math.min(1, volume.value + 0.1)
    playerStore.setVolume(newVolume)
  }
  // 下箭头：减少音量
  else if (event.code === 'ArrowDown') {
    event.preventDefault()
    const newVolume = Math.max(0, volume.value - 0.1)
    playerStore.setVolume(newVolume)
  }
}

onMounted(() => {
  // 初始化音频元素
  if (audioRef.value) {
    audioRef.value.volume = volume.value
    audioRef.value.muted = isMuted.value

    // 如果有当前歌曲，加载它
    if (currentSong.value) {
      loadAudio(currentSong.value.url)
    }
  }

  // 注册键盘事件
  document.addEventListener('keydown', handleKeyboard)
})

onBeforeUnmount(() => {
  // 移除键盘事件
  document.removeEventListener('keydown', handleKeyboard)

  // 清理音频
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})
</script>

<style scoped>
.player-container {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
}

.player-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左侧 */
.player-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 300px;
}

.song-cover {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.song-cover:hover {
  transform: scale(1.05);
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-cover.rotating img {
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

.song-info {
  flex: 1;
  min-width: 0;
}

.song-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-actions {
  display: flex;
  gap: 12px;
}

.action-icon {
  cursor: pointer;
  transition: transform 0.2s;
}

.action-icon:hover {
  transform: scale(1.1);
}

/* 中间 */
.player-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 600px;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-icon {
  cursor: pointer;
  transition: opacity 0.2s;
}

.control-icon:hover {
  opacity: 0.7;
}

.play-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(49, 194, 124, 0.3);
}

.play-button:hover {
  background: var(--primary-hover);
  transform: scale(1.05);
}

.play-button:active {
  transform: scale(0.95);
}

.playlist-btn {
  position: relative;
  cursor: pointer;
}

.playlist-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4757;
  color: #fff;
  font-size: 10px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.time-text {
  font-size: 12px;
  color: #999;
  min-width: 40px;
  text-align: center;
}

.progress {
  flex: 1;
}

/* 右侧 */
.player-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 0 0 150px;
  justify-content: flex-end;
}
</style>
