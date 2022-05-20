<script setup lang="ts">
import { computed, ref, reactive } from "vue";

// Components
import TheRecord from "./TheRecord.vue";
import TheRecordSetter from "./TheRecordSetter.vue";

// Elements
import { ElCollapse, ElCollapseItem, ElCard } from "element-plus";
// import { Timer } from "@element-plus/icons-vue";

// Interfaces
import type { CreatedRecord, Options } from "@/ts/interfaces";

// Firebase
import { getDocList, getDocById, removeDoc, updateTask } from "@/firebase/CRUD";
import { RECORD_SELECT_OPTIONS, TASKS } from "@/firebase/collection-name";
import catchIfAsyncError from "@/firebase/catchIfAsyncError";

// Props
// const props = defineProps<{
//   records: Records;
// }>();

// Emits
const emit = defineEmits<{
  (e: "change-day", payload: string): void;
}>();

// data
const records = ref<Records>({});
const daysOfWeek = ref<string[]>([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);
const recordForEdit = ref<CreatedRecord>({});
const currentDayIndex = ref<number>(new Date().getDay() - 1);
const selectors = ref<Options | null>(null);
const spinner = reactive({
  selectors: true,
  confirm: false,
  run(prop: string) {
    this[prop] = !this[prop];
  },
});

// Computed
const activeDay = computed<string>(
  () => daysOfWeek.value[currentDayIndex.value]
);

// Created
catchIfAsyncError(async () => {
  spinner.run("selectors");
  const en =
    (await getDocById(RECORD_SELECT_OPTIONS, "structure")) || selectors.value;
  selectors.value = en;
  spinner.run("selectors");
});

// Methods
const onChangeDay = () => emit("change-day", activeDay.value);
const getRecords = () =>
  catchIfAsyncError(async () => {
    const dataTasks = getDocList(TASKS);
    const dataDaysStructure = getDocById(RECORD_SELECT_OPTIONS, "structure");
    const tasks = await dataTasks;
    const structure = await dataDaysStructure;
    const allDays = structure.days;

    const isRecords = daysOfWeek.value.reduce((acc, cur, i) => {
      acc[cur] = {
        label: allDays[i],
        tasks: tasks.filter(({ days }) => days.includes(i)),
      };
      return acc;
    }, {});

    records.value = isRecords;
    if (recordForEdit.value?.id) recordForEdit.value = {};
  });
const handleTaskEdit = (record: CreatedRecord) => {
  recordForEdit.value = { ...record };
};
const handleRemove = async (id: string) => {
  recordForEdit.value = {};
  await removeDoc(TASKS, id);
  getRecords();
};
const onClear = () => {
  recordForEdit.value = {};
};
const handleConfirm = async (record: CreatedRecord) => {
  await updateTask(TASKS, { ...record, confirm: true });
  getRecords();
};

// Created
getRecords();
</script>

<template>
  <el-card shadow="always" class="record-setter-wrap">
    <TheRecordSetter
      :record="recordForEdit"
      :data-setter-selectors="selectors"
      :loading-selectors="spinner.selectors"
      @update="getRecords"
      @clear="onClear"
    />
  </el-card>
  <el-collapse v-model="activeDay" accordion @change="onChangeDay">
    <el-collapse-item
      v-for="({ label, tasks }, key, i) in records"
      :key="key"
      :title="`${i < currentDayIndex ? 'next' : ''} ${label} (${tasks.length})`"
      :name="key"
      :disabled="!tasks.length && i !== currentDayIndex"
      class="item-title"
    >
      <template v-if="tasks.length">
        <TheRecord
          v-for="record in tasks"
          :key="record.id"
          :record="record"
          :data-setter-selectors="selectors"
          :loading-selectors="spinner.selectors"
          @edit="handleTaskEdit"
          @remove="handleRemove"
          @confirm="handleConfirm"
        />
      </template>
      <h4 v-else class="d-flex justify-center">Absent any records for today</h4>
    </el-collapse-item>
  </el-collapse>
  <!-- <div>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
    <p>Some text</p>
  </div> -->
</template>
<style lang="scss" scoped>
.item-title {
  text-transform: capitalize;
}
.record-setter-wrap {
  margin-bottom: 20px;
  // padding: 20px;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #fbfbfb;
  // border: 1px solid #f4f4f4;
  // border-radius: 5px;
}
</style>
