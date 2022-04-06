<script setup lang="ts">
import { ElButton } from "element-plus";

// firebase
import { signOutUser } from "@/firebase/auth";

// Router
import { useRouter } from "vue-router";
const router = useRouter();

// Methods
const logout = async () => {
  await signOutUser();
  router.replace({ name: "home" });
};
</script>

<template>
  <h1>dashboard</h1>
  <el-button type="primary" @click="logout">log Out</el-button>
</template>
