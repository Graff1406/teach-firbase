<script setup lang="ts">
import { computed, ref, reactive } from "vue";

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
import {
  createUser,
  signInUser,
  signInWithPhoneUser,
  signInWitGoogle,
  auth,
} from "@/firebase/auth";

// Components
import SignIn from "./SignIn.vue";
import SignOTP from "./SignOTP.vue";
import SignPws from "./SignPws.vue";

import { fetchSignInMethodsForEmail } from "firebase/auth";

// Router
import { useRouter } from "vue-router";
const router = useRouter();

// TS
type Callback = () => void;
type Spinner = {
  active: boolean;
  run: (callback: Callback) => Promise<void>;
  switch: () => void;
};
type LoginProcess = {
  type: string;
  isUserExist: boolean;
  login: string;
};

// Data
const alertText = ref<string>("");
const userPhone = ref<string>("");
const loginProcess = ref<LoginProcess>({
  type: "", // possible three viruses ['otp', 'password']
  isUserExist: false,
  login: "",
});
const spinner = reactive<Spinner>({
  active: false,
  switch() {
    this.active = !this.active;
  },
  async run(callback: Callback) {
    try {
      this.switch();
      await callback();
      this.switch();
    } catch (e) {
      this.switch();
    }
  },
});

// Computed
const headerTitle = computed<string>(() => {
  if (loginProcess.value.type === "password" && loginProcess.value.isUserExist)
    return "Confirm Password";
  else if (
    loginProcess.value.type === "password" &&
    !loginProcess.value.isUserExist
  )
    return "Add Password";
  else return "Sign In";
});

// Methods
const controlUserByPhoneSignIn = (savePhone = false): boolean => {
  const item = "firebase-sign-in-by-phone";
  const firebaseSignInByPhone = localStorage.getItem(item);
  const isUserExist = firebaseSignInByPhone === userPhone.value;
  if (savePhone && !isUserExist) localStorage.setItem(item, userPhone.value);
  return isUserExist;
};

const handleSignInEmail = (email: string) => {
  spinner.run(async () => {
    const [type] = await fetchSignInMethodsForEmail(auth, email);
    loginProcess.value = {
      type: "password",
      isUserExist: !!type,
      login: email,
    };
  });
};
const handleSignInOtp = (phone: string) => {
  spinner.run(async () => {
    const confirmationResult = await signInWithPhoneUser(phone);
    window.confirmationResult = confirmationResult;
    userPhone.value = phone;
    loginProcess.value = {
      type: "otp",
      isUserExist: controlUserByPhoneSignIn(),
      login: phone,
    };
  });
};
const confirmPsw = (psw: string) => {
  spinner.run(async () => {
    const email: string = loginProcess.value.login;
    const user = loginProcess.value.isUserExist
      ? await signInUser(email, psw)
      : await createUser(email, psw);
    if (user.uid)
      router.replace({
        name: "dashboard",
        query: { guest: loginProcess.value.isUserExist ? "0" : "1" },
      });
  });
};
const confirmOTP = (code: string) => {
  spinner.run(async () => {
    await window.confirmationResult.confirm(code);
    controlUserByPhoneSignIn(true);
  });
};
const handleSigInGoogle = () => spinner.run(() => signInWitGoogle());

const handleBackButton = () => {
  loginProcess.value = { type: "", isUserExist: false, login: "" };
};
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
              <el-form style="width: 100%" @submit.prevent>
                <SignPws
                  v-if="loginProcess.type === 'password'"
                  :is-loading="spinner.active"
                  :is-user-exist="loginProcess.isUserExist"
                  @back="handleBackButton"
                  @confirm-psw="confirmPsw"
                />
                <SignOTP
                  v-else-if="loginProcess.type === 'otp'"
                  :is-loading="spinner.active"
                  :is-user-exist="loginProcess.isUserExist"
                  @back="handleBackButton"
                  @confirm-otp="confirmOTP"
                />
                <SignIn
                  v-else
                  :is-loading="spinner.active"
                  @sign-in-by-email="handleSignInEmail"
                  @sign-in-by-otp="handleSignInOtp"
                  @sign-in-by-google="handleSigInGoogle"
                />
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </slot>
  </el-container>
</template>
