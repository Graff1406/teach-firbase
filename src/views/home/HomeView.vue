<script setup lang="ts">
import { ref } from "vue";
import TheSign from "./components/sign/TheSign.vue";
import { ElContainer, ElMain, ElLoading } from "element-plus";

// firebase
import { auth, confirmEmailUser } from "@/firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

// Router
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const loadingInstance = ElLoading.service({ fullscreen: true });

// Data
const isLoading = ref(true);

// Auth user watcher
onAuthStateChanged(auth, async (user) => {
  console.log(
    "🚀 ~ file: HomeView.vue ~ line 22 ~ onAuthStateChanged ~ auth",
    auth
  );
  if (user?.uid) await router.replace({ name: "dashboard" });
  isLoading.value = false;
  loadingInstance.close();
});

if (route.query.mode === "signIn") confirmEmailUser();
</script>
<template>
  <el-container>
    <!-- <el-main> -->
    <TheSign v-if="!isLoading" />
    <!-- </el-main> -->
  </el-container>
</template>
