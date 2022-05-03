<script setup lang="ts">
// Elements
import { ElIcon, ElHeader, ElDivider } from "element-plus";
import { Timer } from "@element-plus/icons-vue";
</script>

<template>
  <div class="app-header-content">
    <div class="app-header-content-logo">
      <el-icon class="app-header-content-logo__icon"
        ><timer size="18"
      /></el-icon>
      <span class="app-header-content-logo__text">Smart Timer</span>
      <el-divider direction="vertical"></el-divider>
    </div>
    <slot name="right-side"></slot>
  </div>
</template>
<style lang="scss" scoped>
.app-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  &-logo {
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;

    &__text {
      margin-left: 5px;
    }
  }
}
</style>
