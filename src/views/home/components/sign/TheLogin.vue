<script setup lang="ts">
// import GoogleAuthForm from "./GoogleAuthForm.vue";
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
import { Key, Lock, Plus, SwitchButton } from "@element-plus/icons-vue";

// Firebase
import "firebaseui/dist/firebaseui.css";
import { signInUser } from "@/firebase/auth";

type Login = { type: string };

const emit = defineEmits(["login", "join", "psw-recovery"]);

// Props
const props = defineProps({ alert: String, isLoading: Boolean });

// Data
const form = reactive({ login: "", psw: "", verified: false });

// Computed
const login = computed((): Login => {
  if (emailValidator.validate(form.login)) return { type: "email" };
  else if (isValidPhoneNumber(form.login, "UA")) return { type: "phone" };
  return { type: "" };
});

// Methods
const runLogin = async () => {
  const callEmit = (type: string) =>
    emit(`login-by-${type}`, form.login, form.psw);
  if (login.value.type === "email") callEmit("email");
  else if (login.value.type === "phone") callEmit("phone");
};
</script>

<template>
  <el-form :model="form" label-width="120px">
    <el-space direction="vertical" alignment="start" :size="20">
      <el-input
        v-if="!form.verified"
        v-model="form.login"
        :prefix-icon="Lock"
        size="large"
        placeholder="Email or Phone"
      />
      <el-input
        v-else
        v-model="form.psw"
        :prefix-icon="Key"
        size="large"
        placeholder="Password"
        type="password"
      />

      <el-row :gutter="24">
        <el-col :span="12">
          <el-button
            type="primary"
            style="width: 100px"
            :disabled="!login.type.length"
            :loading="isLoading"
            :icon="SwitchButton"
            @click="runLogin"
          >
            Log In
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            :icon="Plus"
            style="width: 100px"
            type="warning"
            plain
            @click="emit('join')"
          >
            Join
          </el-button>
        </el-col>
      </el-row>

      <el-button type="text" @click="emit('psw-recovery')"
        >Password recovery</el-button
      >

      <el-alert
        v-if="alert"
        :title="alert"
        type="success"
        center
        show-icon
        :closable="false"
      />
    </el-space>
  </el-form>
</template>
