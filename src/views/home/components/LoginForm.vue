<script setup lang="ts">
import { reactive } from "vue";
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
} from "element-plus";

import { Key, Lock } from "@element-plus/icons-vue";

import { getDocById } from "@/firebase/CRUD";
import { USERS } from "@/firebase/collectionName";

const form = reactive({ email: "", psw: "" });

const loginTo = async (id: string) => {
  const { email } = await getDocById(USERS, id);
  console.log(333, email);
};

const saveForm = async () => {
  const userRef = collection(db, "users");
  const user = await addDoc(userRef, {
    test: "Los Angeles-2",
    timestamp: serverTimestamp(),
    ...form,
  });
  console.log(111, form);
  loginTo(user.id);
};
</script>

<template>
  <el-container>
    <el-row>
      <el-col :span="24" :offset="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>Login Form</span>
            </div>
          </template>
          <el-form :model="form" label-width="120px">
            <el-space direction="vertical" alignment="start" :size="20">
              <el-input
                v-model="form.email"
                :prefix-icon="Lock"
                size="large"
                placeholder="Email"
              />
              <el-input
                v-model="form.psw"
                :prefix-icon="Key"
                size="large"
                placeholder="Password"
                type="password"
              />
              <el-button
                type="primary"
                @click="saveForm"
                :disabled="!form.login && !form.psw"
                >Login</el-button
              >
            </el-space>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>
