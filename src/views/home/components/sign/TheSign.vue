<script setup lang="ts">
import TheIn from "./TheIn.vue";
import { computed, ref, reactive, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

// Element UI
import {
  ElRow,
  ElCol,
  ElCard,
  ElContainer,
  ElAlert,
  ElForm,
} from "element-plus";

// Firebase
import { createUser, signInUser, recoveryPswUser } from "@/firebase/auth";

// Components
import TheJoin from "./TheJoin.vue";
import TheLogin from "./TheLogin.vue";
import TheRecovery from "./TheRecovery.vue";

// Router
const route = useRoute();
const router = useRouter();

// Data
const isLoginForm = ref(true);
const isRecoveryPswForm = ref(false);
const alertText = ref("");
const spinner = reactive({
  active: false,
  async run(callback: () => void) {
    try {
      this.active = !this.active;
      await callback();
      this.active = !this.active;
    } catch (e) {
      this.active = !this.active;
    }
  },
});

// Computed
const headerTitle = computed(() => {
  if (isLoginForm.value) return "Login";
  else if (isRecoveryPswForm.value) return "Recovery";
  else return "Join";
});

// Watch
watch(isLoginForm, () => (alertText.value = ""));

// Methods
const addUser = async (email: string, psw: string) => {
  spinner.run(async () => {
    const isCreatedUser = await createUser(email, psw);
    if (isCreatedUser.uid) {
      isLoginForm.value = true;
      router.replace({ path: route.path, query: { joined: email } });
    }
  });
};
const loginTo = async (email: string, psw: string) => {
  spinner.run(async () => {
    const user = await signInUser(email, psw);
    if (user.uid) router.replace({ name: "dashboard" });
  });
};
const resetRecoveryForm = () => {
  isLoginForm.value = true;
  isRecoveryPswForm.value = !isRecoveryPswForm.value;
};
const recoveryPws = async (email: string) => {
  await spinner.run(async () => await recoveryPswUser(email));
  resetRecoveryForm();
  await nextTick();
  alertText.value = "We sent recovery link on your email. Check its please!";
};

// Utils
// function loadingSwitch(callback: Promise<any>) {
//   this.active = !this.active
// }
</script>

<template>
  <el-container>
    <slot>
      <el-row>
        <el-col :span="24" :offset="12">
          <el-card
            shadow="never"
            :body-style="{
              width: '300px',
            }"
          >
            <template #header>
              <h2 class="card-header">{{ headerTitle }} Form</h2>
            </template>
            <div v-if="alertText" class="p-b-3">
              <el-alert type="success" center show-icon :closable="false">{{
                alertText
              }}</el-alert>
            </div>
            <div class="d-flex justify-center">
              <el-form>
                <TheRecovery
                  v-if="isRecoveryPswForm"
                  :is-loading="spinner.active"
                  @login="resetRecoveryForm"
                  @recovery="recoveryPws"
                />
                <template v-else>
                  <!-- <TheLogin
                    v-if="isLoginForm"
                    :is-loading="spinner.active"
                    @login="loginTo"
                    @join="isLoginForm = !isLoginForm"
                    @psw-recovery="
                      (isLoginForm = !isLoginForm),
                        (isRecoveryPswForm = !isRecoveryPswForm)
                    "
                  /> -->
                  <TheIn
                    v-if="isLoginForm"
                    :is-loading="spinner.active"
                    @sign-in-by-email="spinner.active"
                    @sign-in-by-psw="spinner.active"
                  />
                  <TheJoin
                    v-else
                    :is-loading="spinner.active"
                    @join="addUser"
                    @login="isLoginForm = !isLoginForm"
                  />
                </template>
              </el-form>
            </div>
          </el-card>
        </el-col>
        <!-- <el-col :span="24" :offset="12" style="margin-top: 20px">
          <el-card shadow="never" class="d-flex justify-center">
            <el-button
              :type="!isLoginForm ? 'warning' : 'success'"
              @click="isLoginForm = !isLoginForm"
            >
              {{ isLoginForm ? "Join" : "Login" }}
            </el-button>
          </el-card>
        </el-col> -->
      </el-row>
    </slot>
  </el-container>
</template>
