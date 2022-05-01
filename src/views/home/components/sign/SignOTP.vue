<script setup lang="ts">
import { computed, ref, reactive, watch, nextTick } from "vue";

// Props
const props = defineProps({
  isLoading: Boolean,
  isUserExist: Boolean,
});

// Element UI
import { ElInput, ElButton, ElCheckbox } from "element-plus";
import { Check, ArrowLeft } from "@element-plus/icons-vue";

// Emits
const emit = defineEmits<{
  (e: "confirm-otp", password: string): void;
  (e: "back"): void;
}>();

// Data
const otp = ref<string>("");
const agreeWithRules = ref<boolean>(false);

// Computed
const isValidOtp = computed(
  () =>
    (otp.value.length >= 6 && props.isUserExist) ||
    (otp.value.length >= 6 && !props.isUserExist && agreeWithRules.value)
);

// Methods
const onKeydown = (e: KeyboardEvent) => {
  if (
    (e.which < 96 && e.which !== 8 && e.which !== 86 && !e.ctrlKey) ||
    (e.which > 105 && e.which !== 8 && e.which !== 86 && !e.ctrlKey)
  )
    e.preventDefault();
};
</script>

<template>
  <div class="m-y-2">
    <el-input
      v-model="otp"
      maxlength="6"
      placeholder="Code from SMS"
      show-word-limit
      type="text"
      @keydown="onKeydown"
    />
  </div>

  <div v-if="!isUserExist" class="m-t-2">
    <el-checkbox v-model="agreeWithRules">I'm agree with rules</el-checkbox>
  </div>

  <div class="d-flex m-y-2">
    <el-button type="text" :icon="ArrowLeft" @click="emit('back')">
      Back
    </el-button>
    <el-button
      type="primary"
      style="width: 100%"
      :disabled="!isValidOtp"
      :loading="props.isLoading"
      :icon="Check"
      @click="emit('confirm-otp', otp)"
    >
      {{ props.isUserExist ? "Confirm User" : "Add New User" }}
    </el-button>
  </div>
  <div id="recaptcha-container"></div>
</template>
