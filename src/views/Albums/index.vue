<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="page-placeholder">
    <Icon name="album" size="2xl" color="#ccc" />
    <h2>专辑</h2>
    <p>该页面待开发</p>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/Icon/Icon.vue'
</script>

<style scoped>
.page-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  color: #999;
  gap: 16px;
}
</style>
