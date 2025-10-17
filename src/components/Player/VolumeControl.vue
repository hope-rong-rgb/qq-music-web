<template>
  <div class="volume-control">
    <div class="volume-icon" @click="handleToggleMute">
      <Icon :name="volumeIcon" size="lg" :color="iconColor" />
    </div>

    <div class="volume-slider" @mouseenter="showSlider = true" @mouseleave="showSlider = false">
      <transition name="slider-fade">
        <div v-show="showSlider" class="slider-container">
          <div class="slider-track" @mousedown="handleMouseDown" ref="sliderRef">
            <div class="slider-filled" :style="{ height: `${percentage}%` }">
              <div class="slider-thumb"></div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '@/components/Icon/Icon.vue'

interface Props {
  volume: number // 0-1
  isMuted: boolean
}

const props = withDefaults(defineProps<Props>(), {
  volume: 0.7,
  isMuted: false,
})

const emit = defineEmits<{
  'update:volume': [volume: number]
  'update:isMuted': [isMuted: boolean]
}>()

const showSlider = ref(false)
const sliderRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)

const percentage = computed(() => {
  return props.isMuted ? 0 : props.volume * 100
})

const volumeIcon = computed(() => {
  if (props.isMuted || props.volume === 0) {
    return 'volume-mute'
  } else if (props.volume < 0.3) {
    return 'volume-low'
  } else if (props.volume < 0.7) {
    return 'volume-medium'
  } else {
    return 'volume-high'
  }
})

const iconColor = computed(() => {
  return props.isMuted ? '#999' : '#666'
})

const handleToggleMute = () => {
  emit('update:isMuted', !props.isMuted)
}

const updateVolume = (clientY: number) => {
  if (!sliderRef.value) return

  const rect = sliderRef.value.getBoundingClientRect()
  const offsetY = Math.max(0, Math.min(rect.bottom - clientY, rect.height))
  const volume = offsetY / rect.height

  emit('update:volume', volume)
  if (volume > 0 && props.isMuted) {
    emit('update:isMuted', false)
  }
}

const handleMouseDown = (event: MouseEvent) => {
  event.preventDefault()
  isDragging.value = true
  showSlider.value = true
  updateVolume(event.clientY)

  const handleMouseMove = (e: MouseEvent) => {
    updateVolume(e.clientY)
  }

  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.volume-control {
  position: relative;
  display: flex;
  align-items: center;
}

.volume-icon {
  cursor: pointer;
  padding: 4px;
  transition: opacity 0.2s;
}

.volume-icon:hover {
  opacity: 0.8;
}

.volume-slider {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 12px;
}

.slider-container {
  background: #fff;
  border-radius: 8px;
  padding: 12px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.slider-track {
  width: 4px;
  height: 100px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  position: relative;
  cursor: pointer;
}

.slider-filled {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width 0.1s;
}

.slider-thumb {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #fff;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider-fade-enter-active,
.slider-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.slider-fade-enter-from,
.slider-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
