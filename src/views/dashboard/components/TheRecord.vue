<script setup lang="ts">
import { computed, ref } from "vue";
// Elements
import {
  ElCard,
  ElIcon,
  ElTooltip,
  ElButton,
  ElPopconfirm,
  ElTag,
} from "element-plus";
import {
  InfoFilled,
  Edit,
  Bell,
  Check,
  CircleCheckFilled,
  MuteNotification,
  Delete,
} from "@element-plus/icons-vue";

import format from "format-duration";
import dayjs from "dayjs";

import TinyTimer from "tiny-timer";
const timer = new TinyTimer();

// Interfaces
import type { Record, CreatedRecord, Options } from "@/ts/interfaces";

// Props
const props = defineProps<{
  record: Record;
  dataSetterSelectors: Options;
  // loadingSelectors: boolean;
}>();

// Events
const emit = defineEmits<{
  (e: "remove", payload: string): void;
  (e: "confirm", payload: CreatedRecord): void;
  (e: "edit", payload: CreatedRecord): void;
}>();

// Data
const time = ref<string>("00:00");

// Computed
const selectors = computed<Options>(
  () =>
    props.dataSetterSelectors || {
      days: [],
      reminds: [],
      repetitions: [],
      markers: [],
      statuses: [],
    }
);
const remindText = computed(() =>
  props.record.reminds
    .map((r: number) => selectors.value.reminds[r])
    .join(" | ")
);
const recordMarker = computed<string>(
  () =>
    selectors.value.markers.find(
      (m: string, i: number) => props.record?.marker === i
    ) || ""
);
// const recordStatus = computed<{ index: number; label: string }>(() => {
//   const currentTime = +dayjs().format("X");
//   const { start, end } = recordToMillsec.value;
//   console.log("start", start);
//   console.log("end", end);
//   console.log("currentTime", currentTime);
//   if (currentTime >= start && currentTime <= end)
//     return { index: 1, label: selectors.value.statuses[1] };
//   if (currentTime > end && !props.record.confirm)
//     return { index: 2, label: selectors.value.statuses[2] };
//   if (currentTime > end && props.record.confirm)
//     return { index: 3, label: selectors.value.statuses[3] };
//   return { index: 0, label: selectors.value.statuses[0] };
// });
const recordToMillsec = computed<{ start: number; end: number }>(() => {
  const today = dayjs().format("YYYY-DD-MM");
  const start = +dayjs(`${today} ${props.record.start}:00`).format("X");
  const end = +dayjs(`${today} ${props.record.end}:00`).format("X");
  return { start, end };
});

// Methods
const startTimer = () => {
  timer.start(2000000);
};

// Created
startTimer();
timer.on("tick", (ms) => {
  time.value = format(ms, { leading: true });
});
</script>

<template>
  <el-card shadow="never" class="card">
    <div class="record">
      <div class="record-title">
        <el-tooltip
          :content="record.title"
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          <span class="record-title__text">{{ record.title }}</span>
          <span v-if="record.title.length > 20" class="record-title__points"
            >...</span
          >
        </el-tooltip>
      </div>
      <div class="record-marker">
        <el-tooltip
          content="Marker"
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          <el-tag v-if="recordMarker.length" class="mx-1" size="small">{{
            recordMarker
          }}</el-tag>
        </el-tooltip>
      </div>
      <div class="record-timer">
        <el-tag
          v-if="
            timer.time <= recordToMillsec.start &&
            timer.time >= recordToMillsec.end
          "
          class="record-timer__time mx-1"
          size="small"
          type="danger"
          effect="plain"
          >{{ time }}</el-tag
        >
        <span v-else class="record-timer__time">
          {{ `${record.start} - ${record.end}` }}
        </span>
      </div>
      <!-- <div class="record__status">
        <el-tooltip
          content="Status"
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          {{ recordStatus.label }}
        </el-tooltip>
      </div> -->
      <div class="record__date">
        <el-tooltip
          content="Repetition"
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          {{ record.repetition ? "Each" : "Once" }}
        </el-tooltip>
      </div>
      <div class="record-info">
        <el-tooltip
          :content="`Was created: ${record.createdAt}`"
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          <el-icon><InfoFilled /></el-icon>
        </el-tooltip>
      </div>
      <div class="record-notification">
        <el-tooltip
          :content="`reminds: ${remindText}`"
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          <el-icon>
            <Bell v-if="record.reminds.length" />
            <MuteNotification v-else />
          </el-icon>
        </el-tooltip>
      </div>
      <!-- <div class="record-check">
        <el-tooltip
          :content="
            record.confirm ? 'Confirmed execution' : 'Confirm execution'
          "
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          <el-icon v-if="record.confirm" color="#4CAF50">
            <CircleCheckFilled />
          </el-icon>
          <el-button
            v-else
            :icon="Check"
            :disabled="recordStatus.index === 1"
            circle
            size="small"
            @click="emit('confirm', record)"
          />
        </el-tooltip>
      </div> -->
      <div class="record-action-remove">
        <el-popconfirm
          title="Are you sure to delete this?"
          @confirm="emit('remove', record.id)"
        >
          <template #reference>
            <el-button :icon="Delete" circle size="small" />
          </template>
        </el-popconfirm>
      </div>
      <div class="record-action-edit">
        <el-tooltip
          content="Edit"
          class="box-item"
          effect="dark"
          placement="top-start"
        >
          <el-button
            :icon="Edit"
            circle
            size="small"
            @click="emit('edit', record)"
          />
        </el-tooltip>
      </div>
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
.card {
  margin: 10px 0;
}
.record {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &-title {
    display: flex;
    align-items: center;
    min-width: 400px;

    &__text {
      max-width: 350px;
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
    }
  }
  // &-timer__is-first {
  //   color: #ff4040;
  // }
  &-marker {
    min-width: 75px;
  }
  &-marker,
  &-check,
  &-notification,
  &-info {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 3px;
  }
}

@media screen and (max-width: 768px) {
  .record {
    flex-direction: column;
    align-items: start;

    &-title {
      max-width: 100%;
      &__text {
        max-width: 100%;
      }
      &__points {
        display: none;
      }
    }
  }
}
</style>
