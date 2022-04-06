<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import emailValidator from "email-validator";

// Element UI
import {
  ElRow,
  ElCol,
  ElForm,
  ElInput,
  ElSpace,
  ElButton,
  ElCheckbox,
} from "element-plus";
import { Key, Lock, Plus, SwitchButton } from "@element-plus/icons-vue";

const emit = defineEmits(["join", "login"]);

// Props
const props = defineProps({ alert: String, isLoading: Boolean });

// Data
const form = reactive({ email: "", psw: "", rePsw: "" });
const agreeWithRules = ref(false);

// Computed
const isInvalidForm = computed(
  () =>
    !(
      emailValidator.validate(form.email) &&
      form.psw?.length >= 6 &&
      form.rePsw?.length >= 6 &&
      form.psw === form.rePsw &&
      agreeWithRules.value
    )
);
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-space direction="vertical" alignment="start" :size="20">
      <el-input
        v-model="form.email"
        :prefix-icon="Lock"
        size="large"
        placeholder="Email"
        type="email"
      />
      <el-input
        v-model="form.psw"
        :prefix-icon="Key"
        size="large"
        placeholder="Password"
        type="password"
      />
      <el-input
        v-model="form.rePsw"
        :prefix-icon="Key"
        size="large"
        placeholder="Re - password"
        type="password"
      />
      <el-checkbox v-model="agreeWithRules">I'm agree with rules</el-checkbox>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-button
            type="primary"
            style="width: 100px"
            :disabled="isInvalidForm"
            :loading="isLoading"
            :icon="Plus"
            @click="emit('join', form.email, form.psw)"
          >
            Join
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
