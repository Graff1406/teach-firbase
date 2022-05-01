<script setup lang="ts">
import { ElButton, ElContainer } from "element-plus";

// firebase
import { signOutUser } from "@/firebase/auth";

// Router
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

// Methods
const logout = async () => {
  await signOutUser();
  router.replace({ name: "home" });
};
</script>

<template>
  <el-container>
    <div>
      <h1 v-if="route.query.guest">
        Welcome <span style="color: green; font-weight: 800">Guest</span>! You
        just created an account
      </h1>
      <h1 v-else>
        Welcome back <span style="color: green; font-weight: 800">Guest</span>
      </h1>
      <div class="m-y-2">
        <el-button type="primary" @click="logout">log Out</el-button>
      </div>
    </div>
  </el-container>
</template>
