<template>
  <transition name="panel-slide">
    <div v-if="visible" class="playlist-panel-overlay" @click="handleClose">
      <div class="playlist-panel" @click.stop>
        <div class="panel-header">
          <div class="header-left">
            <h3 class="panel-title">播放列表</h3>
            <span class="song-count">{{ playlist.length }}首</span>
          </div>
          <div class="header-actions">
            <button class="action-btn" @click="handleClearAll" title="清空列表">
              <Icon name="close" size="sm" />
            </button>
          </div>
        </div>

        <div class="panel-body">
          <div v-if="playlist.length === 0" class="empty-state">
            <Icon name="music" size="xl" color="#ccc" />
            <p>播放列表为空</p>
          </div>

          <div v-else class="playlist-content">
            <div
              v-for="(song, index) in playlist"
              :key="song.id"
              :class="['playlist-item', { active: index === currentIndex }]"
              @dblclick="handlePlaySong(index)"
            >
              <div class="item-left">
                <div class="item-index">
                  <span v-if="index !== currentIndex">{{ index + 1 }}</span>
                  <Icon v-else name="music" size="sm" color="#31c27c" class="playing-icon" />
                </div>
                <div class="item-info">
                  <div class="song-name">{{ song.name }}</div>
                  <div class="song-artist">{{ song.artist }}</div>
                </div>
              </div>

              <div class="item-right">
                <span class="song-duration">{{ formatTime(song.duration) }}</span>
                <div class="item-actions">
                  <Icon
                    name="heart-outline"
                    size="sm"
                    color="#999"
                    class="action-icon"
                    title="收藏"
                  />
                  <Icon
                    name="close"
                    size="sm"
                    color="#999"
                    class="action-icon"
                    @click="handleRemove(index)"
                    title="删除"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/modules/player'
import Icon from '@/components/Icon/Icon.vue'
import { formatTime } from '@/utils/format'

interface Props {
  visible: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const playerStore = usePlayerStore()
const { playlist, currentIndex } = storeToRefs(playerStore)

const handleClose = () => {
  emit('update:visible', false)
}

const handlePlaySong = (index: number) => {
  if (playlist.value[index]) {
    playerStore.playSong(playlist.value[index])
  }
}

const handleRemove = (index: number) => {
  const song = playlist.value[index]
  if (song) {
    playerStore.removeFromPlaylist(song.id)
  }
}

const handleClearAll = () => {
  if (confirm('确定要清空播放列表吗？')) {
    playerStore.clearPlaylist()
  }
}
</script>

<style scoped>
.playlist-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 80px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}

.playlist-panel {
  width: 400px;
  height: 500px;
  background: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  margin-bottom: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.song-count {
  font-size: 12px;
  color: #999;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px;
  border-radius: 4px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #f5f5f5;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  gap: 12px;
}

.playlist-content {
  padding: 8px 0;
}

.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.playlist-item:hover {
  background: #f5f5f5;
}

.playlist-item.active {
  background: #f0fdf7;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.item-index {
  width: 24px;
  text-align: center;
  font-size: 14px;
  color: #999;
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

.item-info {
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

.playlist-item.active .song-name {
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

.item-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.song-duration {
  font-size: 12px;
  color: #999;
}

.item-actions {
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.playlist-item:hover .item-actions {
  opacity: 1;
}

.action-icon {
  cursor: pointer;
  transition: color 0.2s;
}

.action-icon:hover {
  color: #31c27c !important;
}

/* 过渡动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.3s;
}

.panel-slide-enter-active .playlist-panel,
.panel-slide-leave-active .playlist-panel {
  transition: transform 0.3s;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}

.panel-slide-enter-from .playlist-panel {
  transform: translateY(100%);
}

.panel-slide-leave-to .playlist-panel {
  transform: translateY(100%);
}
</style>
