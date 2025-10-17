<template>
  <div
    class="progress-bar"
    @mousedown="handleMouseDown"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    ref="progressBarRef"
  >
    <div class="progress-track">
      <div class="progress-filled" :style="{ width: `${percentage}%` }">
        <div v-show="isHovering || isDragging" class="progress-thumb"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: number // 当前值
  max: number // 最大值
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const progressBarRef = ref<HTMLElement | null>(null)
const isHovering = ref(false)
const isDragging = ref(false)

const percentage = computed(() => {
  if (props.max === 0) return 0
  return (props.modelValue / props.max) * 100
})

const updateProgress = (clientX: number) => {
  if (!progressBarRef.value || props.disabled) return

  const rect = progressBarRef.value.getBoundingClientRect()
  const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width))
  const percentage = offsetX / rect.width
  const newValue = percentage * props.max

  emit('update:modelValue', newValue)
}

const handleMouseDown = (event: MouseEvent) => {
  if (props.disabled) return

  event.preventDefault()
  isDragging.value = true
  updateProgress(event.clientX)

  const handleMouseMove = (e: MouseEvent) => {
    updateProgress(e.clientX)
  }

  const handleMouseUp = () => {
    isDragging.value = false
    emit('change', props.modelValue)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  position: relative;
  overflow: visible;
}

.progress-filled {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  position: relative;
  transition: height 0.2s;
}

.progress-bar:hover .progress-filled {
  height: 6px;
}

.progress-thumb {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #fff;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.progress-bar:active .progress-thumb {
  transform: translateY(-50%) scale(1.2);
}
</style>
