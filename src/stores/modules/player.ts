/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Song } from '@/type'

// 播放模式枚举
export enum PlayMode {
  LIST_LOOP = 'list-loop', // 列表循环
  SINGLE_LOOP = 'single-loop', // 单曲循环
  RANDOM = 'random', // 随机播放
}

export const usePlayerStore = defineStore(
  'player',
  () => {
    // 当前播放歌曲
    const currentSong = ref<Song | null>(null)

    // 播放状态
    const isPlaying = ref(false)

    // 当前播放进度（秒）
    const currentTime = ref(0)

    // 音量 (0-1)
    const volume = ref(0.7)

    // 是否静音
    const isMuted = ref(false)

    // 播放模式
    const playMode = ref<PlayMode>(PlayMode.LIST_LOOP)

    // 播放列表
    const playlist = ref<Song[]>([])

    // 当前播放索引
    const currentIndex = ref(-1)

    // 播放历史
    const playHistory = ref<Song[]>([])

    // 计算属性
    const hasCurrentSong = computed(() => currentSong.value !== null)

    const playModeIcon = computed(() => {
      switch (playMode.value) {
        case PlayMode.SINGLE_LOOP:
          return 'repeat-one'
        case PlayMode.RANDOM:
          return 'shuffle'
        default:
          return 'repeat'
      }
    })

    // Actions

    // 播放歌曲
    const playSong = (song: Song): void => {
      currentSong.value = song
      isPlaying.value = true
      currentTime.value = 0

      // 查找歌曲在播放列表中的索引
      const index = playlist.value.findIndex((s: { id: any }) => s.id === song.id)
      if (index !== -1) {
        currentIndex.value = index
      } else {
        // 如果歌曲不在播放列表中，添加到列表
        playlist.value.push(song)
        currentIndex.value = playlist.value.length - 1
      }

      // 添加到播放历史
      addToHistory(song)
    }

    // 暂停/继续
    const togglePlay = (): void => {
      isPlaying.value = !isPlaying.value
    }

    // 上一曲
    const playPrev = (): void => {
      if (playlist.value.length === 0) return

      let newIndex: number

      if (playMode.value === PlayMode.RANDOM) {
        newIndex = Math.floor(Math.random() * playlist.value.length)
      } else {
        newIndex = currentIndex.value - 1
        if (newIndex < 0) {
          newIndex = playlist.value.length - 1
        }
      }

      currentIndex.value = newIndex
      playSong(playlist.value[newIndex])
    }

    // 下一曲
    const playNext = (): void => {
      if (playlist.value.length === 0) return

      let newIndex: number

      if (playMode.value === PlayMode.RANDOM) {
        newIndex = Math.floor(Math.random() * playlist.value.length)
      } else {
        newIndex = currentIndex.value + 1
        if (newIndex >= playlist.value.length) {
          newIndex = 0
        }
      }

      currentIndex.value = newIndex
      playSong(playlist.value[newIndex])
    }

    // 设置播放进度
    const setCurrentTime = (time: number): void => {
      currentTime.value = time
    }

    // 设置音量
    const setVolume = (val: number): void => {
      volume.value = Math.max(0, Math.min(1, val))
      if (val > 0) {
        isMuted.value = false
      }
    }

    // 切换静音
    const toggleMute = (): void => {
      isMuted.value = !isMuted.value
    }

    // 切换播放模式
    const togglePlayMode = (): void => {
      const modes = [PlayMode.LIST_LOOP, PlayMode.SINGLE_LOOP, PlayMode.RANDOM]
      const currentModeIndex = modes.indexOf(playMode.value)
      playMode.value = modes[(currentModeIndex + 1) % modes.length]
    }

    // 添加歌曲到播放列表
    const addToPlaylist = (song: Song): void => {
      const exists = playlist.value.some((s: { id: any }) => s.id === song.id)
      if (!exists) {
        playlist.value.push(song)
      }
    }

    // 从播放列表删除歌曲
    const removeFromPlaylist = (songId: number): void => {
      const index = playlist.value.findIndex((s: { id: number }) => s.id === songId)
      if (index !== -1) {
        playlist.value.splice(index, 1)
        // 如果删除的是当前播放歌曲
        if (currentIndex.value === index) {
          if (playlist.value.length > 0) {
            currentIndex.value = Math.min(index, playlist.value.length - 1)
            playSong(playlist.value[currentIndex.value])
          } else {
            currentSong.value = null
            currentIndex.value = -1
          }
        } else if (currentIndex.value > index) {
          currentIndex.value--
        }
      }
    }

    // 清空播放列表
    const clearPlaylist = (): void => {
      playlist.value = []
      currentIndex.value = -1
      currentSong.value = null
      isPlaying.value = false
    }

    // 设置播放列表
    const setPlaylist = (songs: Song[], startIndex = 0): void => {
      playlist.value = songs
      if (songs.length > 0) {
        currentIndex.value = startIndex
        playSong(songs[startIndex])
      }
    }

    // 添加到播放历史
    const addToHistory = (song: Song): void => {
      // 移除重复的
      playHistory.value = playHistory.value.filter((s: { id: any }) => s.id !== song.id)
      // 添加到开头
      playHistory.value.unshift(song)
      // 限制历史记录数量
      if (playHistory.value.length > 100) {
        playHistory.value = playHistory.value.slice(0, 100)
      }
    }

    return {
      // State
      currentSong,
      isPlaying,
      currentTime,
      volume,
      isMuted,
      playMode,
      playlist,
      currentIndex,
      playHistory,

      // Computed
      hasCurrentSong,
      playModeIcon,

      // Actions
      playSong,
      togglePlay,
      playPrev,
      playNext,
      setCurrentTime,
      setVolume,
      toggleMute,
      togglePlayMode,
      addToPlaylist,
      removeFromPlaylist,
      clearPlaylist,
      setPlaylist,
      addToHistory,
    }
  },
  {
    persist: {
      key: 'qq-music-player',
      storage: localStorage,
    },
  },
)
