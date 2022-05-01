<script setup lang="ts">
import { reactive, ref, computed } from "vue";

// Element UI
import { ElInput, ElButton, ElCheckbox } from "element-plus";
import { Key, Check, ArrowLeft } from "@element-plus/icons-vue";

// TS
type Form = { psw: string; rePsw: string };

// Props
const props = defineProps({
  isLoading: Boolean,
  isUserExist: { type: Boolean, required: true },
});

// Emits
const emit = defineEmits<{
  (e: "confirm-psw", password: string): void;
  (e: "back"): void;
}>();

// Data
const form = reactive<Form>({ psw: "", rePsw: "" });
const agreeWithRules = ref(false);

// Computed
const isValidPsw = computed(
  () =>
    (props.isUserExist && form.psw.length >= 6) ||
    (form.psw === form.rePsw && form.psw.length >= 6 && agreeWithRules.value)
);
</script>

<template>
  <div class="m-y-2">
    <el-input
      v-model="form.psw"
      :prefix-icon="Key"
      size="large"
      placeholder="Password"
      type="password"
    />
  </div>

  <div v-if="!isUserExist" class="m-y-2">
    <el-input
      v-model="form.rePsw"
      :prefix-icon="Key"
      size="large"
      placeholder="Re - password"
      type="password"
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
      :disabled="!isValidPsw"
      :loading="props.isLoading"
      :icon="Check"
      @click="emit('confirm-psw', form.psw)"
    >
      {{ props.isUserExist ? "Confirm User" : "Add New User" }}
    </el-button>
  </div>

  <div v-if="isUserExist" class="d-flex justify-end m-t-2">
    <el-button type="text" @click="emit('psw-recovery')"
      >Password recovery</el-button
    >
  </div>
</template>
