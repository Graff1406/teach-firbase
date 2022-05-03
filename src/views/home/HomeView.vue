<script setup lang="ts">
import { ref } from "vue";

// Components
import SignForm from "./components/sign/SignForm.vue";

// Elements
import { ElContainer, ElLoading } from "element-plus";

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
  if (user?.uid) await router.replace({ name: "dashboard" });
  isLoading.value = false;
  loadingInstance.close();
});

if (route.query.mode === "signIn") confirmEmailUser();
</script>
<template>
  <el-container>
    <SignForm v-if="!isLoading" />
  </el-container>
</template>
