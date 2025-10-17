<!-- src/components/Lyric/InteractiveLyric.vue（新建）-->
<template>
  <div
    class="interactive-lyric-container"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @scroll="handleScroll"
  >
    <!-- 空状态 -->
    <div v-if="parsedLyrics.length === 0" class="empty-lyric">
      <Icon name="music" size="xl" color="#ccc" />
      <p>暂无歌词</p>
    </div>

    <!-- 歌词内容 -->
    <div v-else class="lyric-content">
      <!-- 顶部空白 -->
      <div class="lyric-blank before-blank"></div>

      <!-- 歌词列表 -->
      <div
        v-for="(line, index) in parsedLyrics"
        :key="index"
        :ref="(el) => setLineRef(el, index)"
        :class="[
          'lyric-line',
          {
            active: index === currentLineIndex,
            center: isNearCenter(index),
          },
        ]"
        :data-time="line.time"
        @click="handleLyricClick(line.time)"
      >
        <!-- 时间显示（鼠标悬停时） -->
        <span v-if="isHovering && isNearCenter(index)" class="lyric-time">
          {{ formatLyricTime(line.time) }}
        </span>

        <!-- 歌词文本 -->
        <span class="lyric-text">{{ line.text }}</span>
      </div>

      <!-- 底部空白 -->
      <div class="lyric-blank after-blank"></div>
    </div>

    <!-- 中心指示器（鼠标悬停时显示）-->
    <div v-show="isHovering" class="center-indicator">
      <div class="indicator-line"></div>
      <div class="indicator-icon">
        <Icon name="play" size="sm" color="#fff" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/components/Icon/Icon.vue'
import { parseLyric, findCurrentLyricIndex, formatLyricTime, type LyricLine } from '@/utils/lyric'

interface Props {
  lyric?: string
  currentTime: number
  isPlaying?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  lyric: '',
  currentTime: 0,
  isPlaying: false,
})

const emit = defineEmits<{
  seek: [time: number]
}>()

const containerRef = ref<HTMLElement | null>(null)
const lineRefs = new Map<number, HTMLElement>()
const isHovering = ref(false)
const isUserScrolling = ref(false)
let scrollTimeout: number | null = null

// 解析歌词
const parsedLyrics = computed<LyricLine[]>(() => {
  return parseLyric(props.lyric)
})

// 当前歌词索引
const currentLineIndex = computed(() => {
  return findCurrentLyricIndex(parsedLyrics.value, props.currentTime)
})

// 设置行引用
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setLineRef = (el: any, index: number) => {
  if (el) {
    lineRefs.set(index, el)
  }
}

// 判断是否在中心附近
const isNearCenter = (index: number) => {
  if (!containerRef.value || !isHovering.value) return false

  const line = lineRefs.get(index)
  if (!line) return false

  const containerRect = containerRef.value.getBoundingClientRect()
  const lineRect = line.getBoundingClientRect()

  const containerCenter = containerRect.top + containerRect.height / 2
  const lineCenter = lineRect.top + lineRect.height / 2

  // 在中心 ±50px 范围内
  return Math.abs(lineCenter - containerCenter) < 50
}

// 鼠标进入
const handleMouseEnter = () => {
  isHovering.value = true
}

// 鼠标离开
const handleMouseLeave = () => {
  isHovering.value = false
  isUserScrolling.value = false
}

// 滚动处理
const handleScroll = () => {
  if (!isHovering.value) return

  isUserScrolling.value = true

  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }

  scrollTimeout = window.setTimeout(() => {
    isUserScrolling.value = false
  }, 1000)
}

// 点击歌词跳转
const handleLyricClick = (time: number) => {
  emit('seek', time)
}

// 滚动到当前歌词
const scrollToCurrentLine = () => {
  if (!containerRef.value || currentLineIndex.value < 0) return
  if (isUserScrolling.value) return // 用户手动滚动时不自动滚动

  const currentLine = lineRefs.get(currentLineIndex.value)
  if (!currentLine) return

  const container = containerRef.value
  const containerHeight = container.clientHeight
  const lineOffsetTop = currentLine.offsetTop
  const lineHeight = currentLine.clientHeight

  // 计算目标滚动位置（将歌词滚动到容器中心）
  const targetScrollTop = lineOffsetTop - containerHeight / 2 + lineHeight / 2

  // 平滑滚动
  container.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth',
  })
}

// 监听当前歌词变化
watch(currentLineIndex, async () => {
  await nextTick()
  scrollToCurrentLine()
})

// 监听播放状态变化
watch(
  () => props.isPlaying,
  async (playing) => {
    if (playing && !isUserScrolling.value) {
      await nextTick()
      scrollToCurrentLine()
    }
  },
)

onMounted(() => {
  scrollToCurrentLine()
})

onBeforeUnmount(() => {
  lineRefs.clear()
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<style scoped>
.interactive-lyric-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.interactive-lyric-container::-webkit-scrollbar {
  display: none;
}

.empty-lyric {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  gap: 12px;
}

.lyric-content {
  width: 100%;
  padding: 0 20px;
}

.lyric-blank {
  width: 100%;
}

.before-blank {
  height: 50%;
}

.after-blank {
  height: 50%;
}

.lyric-line {
  position: relative;
  text-align: center;
  padding: 16px 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
  line-height: 1.8;
  user-select: none;
}

.lyric-line:hover {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

/* 中心附近的歌词 */
.lyric-line.center {
  color: rgba(255, 255, 255, 0.7);
}

/* 当前播放歌词 */
.lyric-line.active {
  font-size: 24px;
  font-weight: 600;
  color: transparent;
  background: linear-gradient(to right, #31c27c, #2ecc71, #27ae60, #2ecc71, #31c27c);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-flow 3s linear infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.lyric-time {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
  font-family: monospace;
}

.lyric-text {
  display: inline-block;
}

/* 中心指示器 */
.center-indicator {
  position: sticky;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  pointer-events: none;
  z-index: 10;
}

.indicator-line {
  width: 86%;
  height: 1px;
  background: rgba(255, 255, 255, 0.4);
  position: absolute;
  left: 8.5%;
  top: 0;
}

.indicator-icon {
  position: absolute;
  right: 4%;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(49, 194, 124, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(49, 194, 124, 0.4);
}
</style>
