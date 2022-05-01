<script setup lang="ts">
// import GoogleAuthForm from "./GoogleAuthForm.vue";
import { ref, computed } from "vue";
import emailValidator from "email-validator";
import { isValidPhoneNumber } from "libphonenumber-js";

// Element UI
import { ElInput, ElButton, ElDivider } from "element-plus";
import { User, SwitchButton } from "@element-plus/icons-vue";

// TS
type Login = { type: string };
type Event = string;

const emit = defineEmits<{
  (e: "sign-in-by-email", payload: Event): void;
  (e: "sign-in-by-otp", payload: Event): void;
  (e: "sign-in-by-google"): void;
}>();

// Props
const props = defineProps({ isLoading: Boolean });

// Data
const field = ref("");

// Computed
const login = computed((): Login => {
  if (emailValidator.validate(field.value)) return { type: "email" };
  else if (isValidPhoneNumber(field.value, "UA")) return { type: "phone" };
  return { type: "" };
});

// Methods
const runLogin = async () => {
  const callEmit = (type: string) => emit(`sign-in-by-${type}`, field.value);
  if (login.value.type === "email") callEmit("email");
  else if (login.value.type === "phone") callEmit("otp");
};
</script>

<template>
  <div class="m-y-2">
    <el-input
      v-model="field"
      :prefix-icon="User"
      size="large"
      placeholder="Email or Phone"
      @keyup.enter="runLogin"
    />
  </div>

  <div class="m-y-2">
    <el-button
      type="primary"
      id="sign-in-button"
      style="width: 100%"
      :disabled="!login.type.length"
      :loading="props.isLoading"
      :icon="SwitchButton"
      @click="runLogin"
    >
      Sign In / Join
    </el-button>
  </div>

  <div class="m-y-2">
    <el-divider>
      <h3>OR</h3>
    </el-divider>
  </div>

  <div class="m-t-2">
    <div class="google-btn" @click="emit('sign-in-by-google')">
      <div class="google-btn__icon">
        <img
          src="../../../../assets/images/2993685_brand_brands_google_logo_logos_icon.png"
          alt=""
          class="google-btn__icon-img"
        />
      </div>
      <div class="google-btn__text">Sign In with Google</div>
    </div>
  </div>

  <!-- <div class="form-psw-recovery">
      <el-button
        type="text"
        style="margin-left: 0"
        @click="emit('psw-recovery')"
        >Password recovery</el-button
      >
    </div> -->
</template>
<style lang="scss" scoped>
.google-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 32px;
  border: 1px solid;
  border-radius: 4px;
  justify-content: center;
  transition: 0.2s;

  &:hover {
    background-color: rgb(241, 241, 241);
  }

  &__icon {
    margin-right: 8px;
    display: flex;
    align-items: center;

    &-img {
      width: 16px;
    }
  }
}
</style>
