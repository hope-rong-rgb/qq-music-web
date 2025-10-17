/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/modules/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, Playlist } from '@/type'

export const useUserStore = defineStore(
  'user',
  () => {
    // 是否已登录
    const isLoggedIn = ref(false)

    // 用户信息
    const userInfo = ref<UserInfo | null>(null)

    // 收藏的歌曲ID列表
    const likedSongs = ref<number[]>([])

    // 创建的歌单
    const createdPlaylists = ref<Playlist[]>([])

    // 收藏的歌单
    const collectedPlaylists = ref<Playlist[]>([])

    // 计算属性
    const username = computed(() => userInfo.value?.username || '游客')
    const avatar = computed(() => userInfo.value?.avatar || '')

    // Actions

    // 登录
    const login = (user: UserInfo): void => {
      isLoggedIn.value = true
      userInfo.value = user
    }

    // 退出登录
    const logout = (): void => {
      isLoggedIn.value = false
      userInfo.value = null
      likedSongs.value = []
      createdPlaylists.value = []
      collectedPlaylists.value = []
    }

    // 收藏歌曲
    const likeSong = (songId: number): void => {
      if (!likedSongs.value.includes(songId)) {
        likedSongs.value.push(songId)
      }
    }

    // 取消收藏歌曲
    const unlikeSong = (songId: number): void => {
      const index = likedSongs.value.indexOf(songId)
      if (index > -1) {
        likedSongs.value.splice(index, 1)
      }
    }

    // 检查歌曲是否已收藏
    const isSongLiked = (songId: number): boolean => {
      return likedSongs.value.includes(songId)
    }

    // 创建歌单
    const createPlaylist = (playlist: Playlist): void => {
      createdPlaylists.value.push(playlist)
    }

    // 删除歌单
    const deletePlaylist = (playlistId: number): void => {
      const index = createdPlaylists.value.findIndex((p: { id: number }) => p.id === playlistId)
      if (index > -1) {
        createdPlaylists.value.splice(index, 1)
      }
    }

    // 收藏歌单
    const collectPlaylist = (playlist: Playlist): void => {
      const exists = collectedPlaylists.value.some((p: { id: any }) => p.id === playlist.id)
      if (!exists) {
        collectedPlaylists.value.push(playlist)
      }
    }

    // 取消收藏歌单
    const uncollectPlaylist = (playlistId: number): void => {
      const index = collectedPlaylists.value.findIndex((p: { id: number }) => p.id === playlistId)
      if (index > -1) {
        collectedPlaylists.value.splice(index, 1)
      }
    }

    // 更新用户信息
    const updateUserInfo = (info: Partial<UserInfo>): void => {
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...info }
      }
    }

    return {
      // State
      isLoggedIn,
      userInfo,
      likedSongs,
      createdPlaylists,
      collectedPlaylists,

      // Computed
      username,
      avatar,

      // Actions
      login,
      logout,
      likeSong,
      unlikeSong,
      isSongLiked,
      createPlaylist,
      deletePlaylist,
      collectPlaylist,
      uncollectPlaylist,
      updateUserInfo,
    }
  },
  {
    persist: {
      key: 'qq-music-user',
      storage: localStorage,
    },
  },
)
