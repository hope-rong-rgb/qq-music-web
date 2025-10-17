<!-- src/components/Search/SearchPanel.vue -->
<template>
  <transition name="search-fade">
    <div v-if="visible" class="search-panel-overlay" @click="handleClose">
      <div class="search-panel" @click.stop>
        <!-- 搜索框 -->
        <div class="search-header">
          <div class="search-input-wrapper">
            <Icon name="search" size="md" color="#999" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="搜索歌曲、歌手、专辑"
              class="search-input"
              @input="handleSearch"
            />
            <Icon
              v-if="searchQuery"
              name="close"
              size="sm"
              color="#999"
              class="clear-btn"
              @click="handleClear"
            />
          </div>
          <button class="close-btn" @click="handleClose">
            <Icon name="close" size="lg" color="#666" />
          </button>
        </div>

        <!-- 搜索内容 -->
        <div class="search-content">
          <!-- 热门搜索 -->
          <div v-if="!searchQuery && !hasSearched" class="hot-searches">
            <h3 class="content-title">热门搜索</h3>
            <div class="hot-tags">
              <span
                v-for="(tag, index) in hotSearches"
                :key="index"
                class="hot-tag"
                @click="searchQuery = tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- 搜索历史 -->
          <div v-if="!searchQuery && searchHistory.length > 0" class="search-history">
            <div class="history-header">
              <h3 class="content-title">搜索历史</h3>
              <button class="clear-history-btn" @click="handleClearHistory">
                <Icon name="close" size="sm" color="#999" />
                <span>清空</span>
              </button>
            </div>
            <div class="history-list">
              <div
                v-for="(item, index) in searchHistory"
                :key="index"
                class="history-item"
                @click="searchQuery = item"
              >
                <Icon name="clock" size="sm" color="#999" />
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <!-- 搜索结果 -->
          <div v-if="searchQuery && hasSearched" class="search-results">
            <!-- 歌曲结果 -->
            <div v-if="searchResults.songs.length > 0" class="result-section">
              <h3 class="content-title">歌曲</h3>
              <div class="song-list">
                <div
                  v-for="song in searchResults.songs"
                  :key="song.id"
                  class="song-item"
                  @dblclick="handlePlaySong(song)"
                >
                  <div class="song-cover" @click="handlePlaySong(song)">
                    <img :src="song.cover" :alt="song.name" />
                    <div class="cover-overlay">
                      <Icon name="play" size="sm" color="#fff" />
                    </div>
                  </div>
                  <div class="song-info">
                    <div class="song-name" v-html="highlightText(song.name)"></div>
                    <div class="song-artist" v-html="highlightText(song.artist)"></div>
                  </div>
                  <div class="song-actions">
                    <Icon
                      :name="isSongLiked(song.id) ? 'heart' : 'heart-outline'"
                      size="sm"
                      :color="isSongLiked(song.id) ? '#ff4757' : '#999'"
                      class="action-icon"
                      @click="handleToggleLike(song.id)"
                    />
                    <Icon
                      name="plus"
                      size="sm"
                      color="#999"
                      class="action-icon"
                      @click="handleAddToPlaylist(song)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 无结果 -->
            <div v-if="isNoResults" class="no-results">
              <Icon name="search" size="2xl" color="#ccc" />
              <p>没有找到相关结果</p>
              <span>试试其他关键词吧</span>
            </div>
          </div>

          <!-- 搜索中 -->
          <div v-if="isSearching" class="searching-state">
            <Icon name="loading" size="xl" color="#ccc" class="animate-spin" />
            <p>搜索中...</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/modules/player'
import { useUserStore } from '@/stores/modules/user'
import Icon from '@/components/Icon/Icon.vue'
import { getAllSongs } from '@/data/mockData'
import type { Song } from '@/type'
import { debounce } from '@/utils/format'

interface Props {
  visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const playerStore = usePlayerStore()
const userStore = useUserStore()

const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const searchResults = ref<{
  songs: Song[]
}>({
  songs: [],
})
const searchHistory = ref<string[]>([])
const isSearching = ref(false)
const hasSearched = ref(false)

const hotSearches = [
  '周杰伦',
  '晴天',
  '七里香',
  '稻香',
  '青花瓷',
  '告白气球',
  '等你下课',
  '说好不哭',
]

const isNoResults = computed(() => {
  return hasSearched.value && searchQuery.value && searchResults.value.songs.length === 0
})

// 监听面板显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      nextTick(() => {
        searchInputRef.value?.focus()
      })
      loadSearchHistory()
    }
  },
)

// 执行搜索
const performSearch = () => {
  if (!searchQuery.value.trim()) {
    hasSearched.value = false
    return
  }

  isSearching.value = true
  hasSearched.value = false

  // 模拟搜索延迟
  setTimeout(() => {
    const allSongs = getAllSongs()
    const query = searchQuery.value.toLowerCase()

    // 简单的关键词匹配
    const filteredSongs = allSongs.filter(
      (song) =>
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query),
    )

    searchResults.value.songs = filteredSongs
    isSearching.value = false
    hasSearched.value = true

    // 保存搜索历史
    if (searchQuery.value.trim()) {
      saveSearchHistory(searchQuery.value.trim())
    }
  }, 500)
}

// 防抖搜索
const handleSearch = debounce(performSearch, 300)

const isSongLiked = (songId: number) => {
  return userStore.isSongLiked(songId)
}

const handlePlaySong = (song: Song) => {
  playerStore.playSong(song)
  handleClose()
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

const handleClear = () => {
  searchQuery.value = ''
  hasSearched.value = false
}

const handleClose = () => {
  emit('update:visible', false)
  // 延迟清空，避免关闭动画时内容消失
  setTimeout(() => {
    searchQuery.value = ''
    hasSearched.value = false
  }, 300)
}

// 高亮搜索关键词
const highlightText = (text: string) => {
  if (!searchQuery.value) return text

  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 搜索历史管理
const loadSearchHistory = () => {
  const history = localStorage.getItem('search-history')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
}

const saveSearchHistory = (query: string) => {
  // 移除重复项
  const filtered = searchHistory.value.filter((item) => item !== query)
  // 添加到开头
  searchHistory.value = [query, ...filtered].slice(0, 10)
  // 保存到 localStorage
  localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
}

const handleClearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('search-history')
}
</script>

<style scoped>
.search-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 500;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 60px;
}

.search-panel {
  width: 100%;
  max-width: 800px;
  max-height: calc(100vh - 120px);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 搜索头部 */
.search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f5f5f5;
  padding: 12px 16px;
  border-radius: 24px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #333;
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  cursor: pointer;
  padding: 4px;
  transition: opacity 0.2s;
}

.clear-btn:hover {
  opacity: 0.7;
}

.close-btn {
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
}

/* 搜索内容 */
.search-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.content-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

/* 热门搜索 */
.hot-searches {
  margin-bottom: 30px;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hot-tag {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.hot-tag:hover {
  background: #f0fdf7;
  color: #31c27c;
}

/* 搜索历史 */
.search-history {
  margin-bottom: 30px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.clear-history-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  color: #999;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-history-btn:hover {
  background: #f5f5f5;
  color: #666;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  color: #666;
}

.history-item:hover {
  background: #f5f5f5;
}

/* 搜索结果 */
.result-section {
  margin-bottom: 30px;
}

.song-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.song-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.song-item:hover {
  background: #f5f5f5;
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

.song-artist {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-name :deep(.highlight),
.song-artist :deep(.highlight) {
  color: #31c27c;
  font-weight: 500;
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

/* 无结果 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  gap: 12px;
}

.no-results span {
  font-size: 12px;
}

/* 搜索中 */
.searching-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  gap: 16px;
}

/* 过渡动画 */
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.3s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-fade-enter-active .search-panel,
.search-fade-leave-active .search-panel {
  transition: transform 0.3s ease;
}

.search-fade-enter-from .search-panel {
  transform: translateY(-20px);
}

.search-fade-leave-to .search-panel {
  transform: translateY(-20px);
}
</style>
