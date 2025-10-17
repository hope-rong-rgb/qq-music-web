<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div
    class="carousel-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="carousel-wrapper">
      <!-- 轮播项容器 -->
      <div class="carousel-track" :style="trackStyle" @transitionend="handleTransitionEnd">
        <!-- 克隆最后一张（用于无缝循环）-->
        <div v-if="items.length > 1" class="carousel-item clone" :style="itemStyle">
          <slot name="item" :item="items[items.length - 1]" :index="items.length - 1">
            <img :src="items[items.length - 1].image" :alt="items[items.length - 1].title" />
          </slot>
        </div>

        <!-- 实际轮播项 -->
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel-item"
          :style="itemStyle"
          @click="handleItemClick(item, index)"
        >
          <slot name="item" :item="item" :index="index">
            <img :src="item.image" :alt="item.title" />
            <div v-if="showCaption && (item.title || item.description)" class="carousel-caption">
              <h3 v-if="item.title">{{ item.title }}</h3>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </slot>
        </div>

        <!-- 克隆第一张（用于无缝循环）-->
        <div v-if="items.length > 1" class="carousel-item clone" :style="itemStyle">
          <slot name="item" :item="items[0]" :index="0">
            <img :src="items[0].image" :alt="items[0].title" />
          </slot>
        </div>
      </div>

      <!-- 左右箭头 -->
      <button
        v-if="showArrows && items.length > 1"
        class="carousel-arrow prev"
        @click="prev"
        :disabled="isTransitioning"
      >
        <Icon name="left" size="lg" color="#fff" />
      </button>
      <button
        v-if="showArrows && items.length > 1"
        class="carousel-arrow next"
        @click="next"
        :disabled="isTransitioning"
      >
        <Icon name="right" size="lg" color="#fff" />
      </button>

      <!-- 指示器 -->
      <div v-if="showIndicators && items.length > 1" class="carousel-indicators">
        <button
          v-for="(_item, index) in items"
          :key="index"
          :class="['indicator', { active: index === realIndex }]"
          @click="goTo(index)"
          :aria-label="`跳转到第 ${index + 1} 张`"
        >
          <span v-if="indicatorType === 'number'">{{ index + 1 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import Icon from '@/components/Icon/Icon.vue'

export interface CarouselItem {
  image: string
  title?: string
  description?: string
  link?: string
  [key: string]: unknown
}

interface Props {
  items: CarouselItem[]
  autoPlay?: boolean
  interval?: number
  showArrows?: boolean
  showIndicators?: boolean
  showCaption?: boolean
  indicatorType?: 'dot' | 'number'
  transition?: 'slide' | 'fade'
  height?: string
  pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoPlay: true,
  interval: 4000,
  showArrows: true,
  showIndicators: true,
  showCaption: true,
  indicatorType: 'dot',
  transition: 'slide',
  height: '400px',
  pauseOnHover: true,
})

const emit = defineEmits<{
  'item-click': [item: CarouselItem, index: number]
  change: [index: number]
}>()

// 状态管理
const currentIndex = ref(1) // 从1开始，因为0是克隆的最后一张
const isTransitioning = ref(false)
const isPaused = ref(false)
const isHovering = ref(false)
let autoPlayTimer: number | null = null

// 触摸相关
const touchStartX = ref(0)
const touchEndX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)

// 计算属性
const realIndex = computed(() => {
  if (currentIndex.value === 0) {
    return props.items.length - 1
  } else if (currentIndex.value === props.items.length + 1) {
    return 0
  }
  return currentIndex.value - 1
})

const trackStyle = computed(() => {
  if (props.transition === 'fade') {
    return {}
  }

  return {
    transform: `translateX(-${currentIndex.value * 100}%)`,
    transition: isTransitioning.value ? 'transform 0.5s ease-in-out' : 'none',
  }
})

const itemStyle = computed(() => {
  return {
    minWidth: '100%',
    height: props.height,
  }
})

// 自动播放
const startAutoPlay = () => {
  if (!props.autoPlay || props.items.length <= 1) return

  stopAutoPlay()
  autoPlayTimer = window.setInterval(() => {
    if (!isPaused.value && !isHovering.value) {
      next()
    }
  }, props.interval)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const resetAutoPlay = () => {
  stopAutoPlay()
  startAutoPlay()
}

// 切换方法
const next = () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  currentIndex.value++
  resetAutoPlay()
}

const prev = () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  currentIndex.value--
  resetAutoPlay()
}

const goTo = (index: number) => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  currentIndex.value = index + 1
  resetAutoPlay()
}

// 处理过渡结束
const handleTransitionEnd = () => {
  isTransitioning.value = false

  // 无缝循环处理
  if (currentIndex.value === 0) {
    // 到达克隆的最后一张，跳到真实的最后一张
    currentIndex.value = props.items.length
  } else if (currentIndex.value === props.items.length + 1) {
    // 到达克隆的第一张，跳到真实的第一张
    currentIndex.value = 1
  }

  emit('change', realIndex.value)
}

// 鼠标事件
const handleMouseEnter = () => {
  if (props.pauseOnHover) {
    isHovering.value = true
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
}

// 触摸事件
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = false
  isPaused.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value) {
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.value)
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.value)

    // 判断是横向滑动还是纵向滚动
    if (deltaX > deltaY && deltaX > 10) {
      isSwiping.value = true
      e.preventDefault()
    }
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value) {
    isPaused.value = false
    return
  }

  touchEndX.value = e.changedTouches[0].clientX
  const deltaX = touchStartX.value - touchEndX.value

  // 滑动距离超过50px才触发切换
  if (Math.abs(deltaX) > 50) {
    if (deltaX > 0) {
      next()
    } else {
      prev()
    }
  }

  isPaused.value = false
  isSwiping.value = false
}

// 点击事件
const handleItemClick = (item: CarouselItem, index: number) => {
  emit('item-click', item, index)
}

// 键盘事件
const handleKeyboard = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    prev()
  } else if (e.key === 'ArrowRight') {
    next()
  }
}

// 监听项目变化
watch(
  () => props.items.length,
  () => {
    currentIndex.value = 1
    resetAutoPlay()
  },
)

// 生命周期
onMounted(() => {
  startAutoPlay()
  document.addEventListener('keydown', handleKeyboard)
})

onBeforeUnmount(() => {
  stopAutoPlay()
  document.removeEventListener('keydown', handleKeyboard)
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.carousel-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-track {
  display: flex;
  height: 100%;
  will-change: transform;
}

.carousel-item {
  position: relative;
  flex-shrink: 0;
  overflow: hidden;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.carousel-item.clone {
  pointer-events: none;
}

/* 标题 */
.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: #fff;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.carousel-item:hover .carousel-caption {
  transform: translateY(0);
}

.carousel-caption h3 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-caption p {
  font-size: 14px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
}

/* 箭头 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0;
  z-index: 10;
  border: none;
}

.carousel-wrapper:hover .carousel-arrow {
  opacity: 1;
}

.carousel-arrow:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.carousel-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-arrow.prev {
  left: 20px;
}

.carousel-arrow.next {
  right: 20px;
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 4px;
}

/* 点状指示器 */
.indicator:not(:has(span)) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.indicator:not(:has(span)):hover {
  background: rgba(255, 255, 255, 0.8);
}

.indicator:not(:has(span)).active {
  width: 24px;
  border-radius: 4px;
  background: #fff;
}

/* 数字指示器 */
.indicator:has(span) {
  min-width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
}

.indicator:has(span):hover {
  background: rgba(255, 255, 255, 0.8);
  color: #333;
}

.indicator:has(span).active {
  background: #fff;
  color: #31c27c;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .carousel-arrow {
    width: 36px;
    height: 36px;
    opacity: 0.8;
  }

  .carousel-arrow.prev {
    left: 10px;
  }

  .carousel-arrow.next {
    right: 10px;
  }

  .carousel-caption {
    padding: 20px;
  }

  .carousel-caption h3 {
    font-size: 18px;
  }

  .carousel-caption p {
    font-size: 12px;
  }

  .carousel-indicators {
    bottom: 10px;
  }
}

@media (max-width: 480px) {
  .carousel-caption h3 {
    font-size: 16px;
  }

  .indicator:has(span) {
    min-width: 28px;
    height: 28px;
    font-size: 12px;
  }
}
</style>
