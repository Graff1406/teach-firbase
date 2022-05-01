<script setup lang="ts">
import { reactive, computed } from "vue";
import emailValidator from "email-validator";
import { isValidPhoneNumber } from "libphonenumber-js";

// Element UI
import {
  ElRow,
  ElCol,
  ElForm,
  ElInput,
  ElSpace,
  ElButton,
  ElAlert,
  ElLink,
} from "element-plus";
import { Key, Check } from "@element-plus/icons-vue";
const emit = defineEmits(["login", "join", "psw-recovery"]);

// Props
const props = defineProps({ isLoading: Boolean });

// Data
const form = reactive({ psw: "" });

// Computed
const isValidPsw = computed(() => form.psw.length >= 6);
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-space direction="vertical" alignment="start" :size="20">
      <el-input
        v-model="form.psw"
        :prefix-icon="Key"
        size="large"
        placeholder="Password"
        type="password"
      />
      <el-button
        type="primary"
        style="width: 100px"
        :disabled="isValidPsw"
        :loading="isLoading"
        :icon="Check"
        @click="emit('save')"
      >
        Confirm
      </el-button>
    </el-space>
  </el-form>
</template>
