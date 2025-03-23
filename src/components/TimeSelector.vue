<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  selectedTime: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedTime', time: string): void
}>()

const timeSlots = ref([
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00'
])

const selectTime = (time: string) => {
  emit('update:selectedTime', time)
}
</script>

<template>
  <div class="time-selector grid grid-cols-4 gap-2">
    <button
      v-for="time in timeSlots"
      :key="time"
      @click="selectTime(time)"
      :class="[
        'p-2 rounded text-sm',
        selectedTime === time
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 hover:bg-gray-200'
      ]"
    >
      {{ time }}
    </button>
  </div>
</template>