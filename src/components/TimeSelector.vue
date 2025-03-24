<template>
  <div class="time-selector">
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="time in timeSlots"
        :key="time"
        @click="selectTime(time)"
        :class="[ 
          'p-3 rounded-lg text-sm border transition-all',
          selectedTime === time
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white border-gray-300 hover:bg-blue-50'
        ]"
      >
        {{ time }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  selectedTime: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['time-selected']);

const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00'
];

const selectTime = (time) => {
  emit('time-selected', time);
};
</script>

<style scoped>
button {
  transition: background-color 0.2s ease, transform 0.1s ease;
}

button:active {
  transform: scale(0.98);
}
</style>