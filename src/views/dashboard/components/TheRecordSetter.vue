<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from "vue";

// Elements
import {
  ElRow,
  ElCol,
  ElInput,
  ElSelect,
  ElOption,
  ElButton,
  ElTimeSelect,
} from "element-plus";
import { Close } from "@element-plus/icons-vue";

// Firebase
import { getDocById, createTask, updateTask, removeDoc } from "@/firebase/CRUD";
import { RECORD_SELECT_OPTIONS, TASKS } from "@/firebase/collection-name";
import catchIfAsyncError from "@/firebase/catchIfAsyncError";

// Interfaces
import type { CreatedRecord, Options } from "@/ts/interfaces";

// Props
const props = defineProps<{
  record: CreatedRecord;
  dataSetterSelectors: Options;
  // loadingSelectors: boolean;
}>();

// Events
const emit = defineEmits<{
  (e: "update"): void;
  (e: "clear"): void;
  // (e: "update", payload: Record): void;
}>();

// Data
const spinner = reactive({
  save: false,
  remove: false,
  run(prop: string) {
    this[prop] = !this[prop];
  },
});
const form = ref(initFormData());

// Computed
const selectors = computed<Options>(
  () =>
    props.dataSetterSelectors || {
      days: [],
      reminds: [],
      repetitions: [],
      markers: [],
    }
);

// Computed
const disabled = computed<boolean>(
  () =>
    !!form.value.title &&
    !!form.value.start &&
    !!form.value.end &&
    !!form.value.days.length &&
    !!form.value.reminds.length &&
    !!form.value.repetition
);

// Watch
watch(
  () => props.record,
  (record: CreatedRecord) => {
    if (record?.id) {
      const chooseValuesByIndex = (prop: string) =>
        selectors.value[prop].filter((d: string, i: number) =>
          record[prop].includes(i)
        );
      const chooseValueByIndex = (prop: string) =>
        selectors.value[prop + "s"].find(
          (d: string, i: number) => i === record[prop]
        );
      form.value = {
        ...record,
        reminds: chooseValuesByIndex("reminds"),
        days: chooseValuesByIndex("days"),
        marker: chooseValueByIndex("marker"),
        repetition: chooseValueByIndex("repetition"),
      };
    } else form.value = initFormData();
  }
);

// Methods
const buildFormData = (record: CreatedRecord): CreatedRecord => {
  const getIndexes = (prop: string) =>
    form.value[prop].map((item: string) => selectors.value[prop].indexOf(item));
  return {
    ...record,
    days: getIndexes("days"),
    reminds: getIndexes("reminds"),
    marker: selectors.value.markers.indexOf(form.value.marker),
    repetition: selectors.value.repetitions.indexOf(form.value.repetition),
  };
};
const handleRecord = () =>
  catchIfAsyncError(async () => {
    spinner.run("save");
    if (props.record?.id)
      await updateTask(
        TASKS,
        buildFormData({ ...props.record, ...form.value })
      );
    else await createTask(TASKS, buildFormData(form.value));
    spinner.run("save");
    form.value = initFormData();
    emit("update");
  });
const onClear = async () => {
  emit("clear");
};

function initFormData(): {
  title: string;
  repetition: string;
  reminds: number[];
  days: number[];
  marker: string;
  start: string;
  end: string;
} {
  return JSON.parse(
    JSON.stringify({
      reminds: [],
      days: [],
      title: "",
      repetition: "",
      marker: "",
      start: "",
      end: "",
    })
  );
}
</script>

<template>
  <el-row :gutter="20" justify="center">
    <el-col :span="6">
      <el-input v-model="form.title" placeholder="Task name" />
    </el-col>
    <el-col :span="4">
      <el-row :gutter="20" justify="center">
        <el-col :span="12">
          <el-time-select
            v-model="form.start"
            :max-time="form.end"
            class="mr-4"
            placeholder="Start"
            start="08:00"
            step="00:10"
            end="20:00"
          />
        </el-col>
        <el-col :span="12">
          <el-time-select
            v-model="form.end"
            :min-time="form.start"
            placeholder="End"
            start="08:00"
            step="00:10"
            end="20:00"
          />
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="3">
      <el-select
        v-model="form.days"
        :loading="!selectors.days.length"
        class="m-2"
        placeholder="Day(s)"
        multiple
        collapse-tags
      >
        <el-option
          v-for="day in selectors.days"
          :key="day"
          :label="day"
          :value="day"
        /> </el-select
    ></el-col>
    <el-col :span="3">
      <el-select
        v-model="form.repetition"
        :loading="!selectors.repetitions.length"
        class="m-2"
        placeholder="Repetition"
      >
        <el-option
          v-for="repetition in selectors.repetitions"
          :key="repetition"
          :label="repetition"
          :value="repetition"
        />
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select
        v-model="form.reminds"
        :loading="!selectors.reminds.length"
        class="m-2"
        placeholder="Notification"
        multiple
        collapse-tags
      >
        <el-option
          v-for="remind in selectors.reminds"
          :key="remind"
          :label="remind"
          :value="remind"
        />
      </el-select>
    </el-col>
    <el-col :span="2">
      <el-select
        v-model="form.marker"
        :loading="!selectors.markers.length"
        class="m-2"
        placeholder="Marker"
      >
        <el-option
          v-for="marker in selectors.markers"
          :key="marker"
          :label="marker"
          :value="marker"
        />
      </el-select>
    </el-col>
    <el-col :span="3" class="save-wrap">
      <el-button
        v-if="record?.id"
        :loading="spinner.remove"
        :icon="Close"
        circle
        @click="onClear"
      ></el-button>
      <el-button
        type="primary"
        :disabled="!disabled"
        :loading="spinner.save"
        @click="handleRecord"
        >{{ record?.id ? "Save" : "Create" }}</el-button
      >
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.save-wrap {
  display: flex;
  justify-content: end;
}
</style>
