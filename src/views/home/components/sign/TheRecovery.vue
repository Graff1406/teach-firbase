<script setup lang="ts">
import { reactive, computed } from "vue";
import emailValidator from "email-validator";

// Element UI
import {
  ElRow,
  ElCol,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElSpace,
  ElButton,
  ElContainer,
  ElAlert,
  ElLink,
} from "element-plus";
import { Key, Lock, Plus, SwitchButton } from "@element-plus/icons-vue";

// Events
const emit = defineEmits(["recovery"]);

// Props
const props = defineProps({ isPswField: Boolean, isLoading: Boolean });

// Data
const form = reactive({ email: "", psw: "" });

// Computed
const isInvalidForm = computed(
  () => !((props.isPswField && form.psw) || emailValidator.validate(form.email))
);
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-space direction="vertical" alignment="start" :size="20">
      <el-input
        v-if="false"
        v-model="form.psw"
        :prefix-icon="Key"
        size="large"
        placeholder="Password"
        type="password"
      />
      <el-input
        v-else
        v-model="form.email"
        :prefix-icon="Lock"
        size="large"
        placeholder="Email"
      />
      <el-row :gutter="24">
        <el-col :span="12">
          <el-button
            type="primary"
            style="width: 100px"
            :disabled="isInvalidForm"
            :loading="isLoading"
            :icon="Plus"
            @click="emit('recovery', form.email)"
          >
            Recovery
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            :icon="SwitchButton"
            style="width: 100px"
            type="warning"
            plain
            @click="emit('login')"
          >
            Login
          </el-button>
        </el-col>
      </el-row>
    </el-space>
  </el-form>
</template>
