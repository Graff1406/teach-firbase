<script setup lang="ts">
import { ref } from "vue";

// Compoenets
import AppHeader from "./components/AppHeader.vue";

// Elements
import { ElButton, ElContainer, ElHeader, ElMain } from "element-plus";

// firebase
import { signOutUser } from "@/firebase/auth";

// Router
import { useRouter, useRoute } from "vue-router";
import TheWeek from "./components/TheWeek.vue";

// // Firebase
// import { getDocList } from "@/firebase/CRUD";
// import { TASKS } from "@/firebase/collection-name";
// import catchIfAsyncError from "@/firebase/catchIfAsyncError";

// Interfaces
// import type { Records, CreatedRecord } from "@/ts/interfaces";

const router = useRouter();

const route = useRoute();

// Data
// const records = ref<Records>({
//   tuesday: [],
//   wednesday: [],
// });

// Methods
const logout = async () => {
  await signOutUser();
  router.replace({ name: "home" });
};

// catchIfAsyncError(async () => {
//   const tasks = await getDocList(TASKS);
//   console.log(
//     "🚀 ~ file: DashboardView.vue ~ line 43 ~ catchIfAsyncError ~ tasks",
//     tasks
//   );
//   // records.value = tasks
// });
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <app-header>
        <template #right-side>
          <el-button plain @click="logout">log Out</el-button>
        </template>
      </app-header>
    </el-header>
    <el-main class="app-main">
      <the-week></the-week>
    </el-main>
    <!-- <div>
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
    </div> -->
  </el-container>
</template>
<style lang="scss" scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  padding: 0;
}

.app-header {
  border-bottom: 1px solid rgb(220, 219, 219);
  width: 100%;
  position: sticky;
}

.app-main {
  /* height: 100vh; */
  // background-color: gray;
}
</style>
