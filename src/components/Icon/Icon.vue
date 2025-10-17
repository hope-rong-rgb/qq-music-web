<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <span :class="['icon', `icon-${size}`, className]" :style="computedStyle" @click="handleClick">
    {{ iconChar }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconMap } from './iconMap'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  color?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor',
  className: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const iconChar = computed(() => {
  return iconMap[props.name] || '●'
})

const computedStyle = computed(() => {
  return {
    color: props.color,
  }
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-xs {
  font-size: 12px;
  width: 12px;
  height: 12px;
}

.icon-sm {
  font-size: 16px;
  width: 16px;
  height: 16px;
}

.icon-md {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

.icon-lg {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

.icon-xl {
  font-size: 32px;
  width: 32px;
  height: 32px;
}

.icon-2xl {
  font-size: 40px;
  width: 40px;
  height: 40px;
}

.icon:hover {
  opacity: 0.8;
}
</style>
