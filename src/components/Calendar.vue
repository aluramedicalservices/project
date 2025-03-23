<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import { es } from 'date-fns/locale'

const props = defineProps<{
  selectedDate: Date
}>()

const emit = defineEmits<{
  (e: 'update:selectedDate', date: Date): void
}>()

const currentMonth = ref(new Date())

const days = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value))
  const end = endOfWeek(endOfMonth(currentMonth.value))
  return eachDayOfInterval({ start, end })
})

const nextMonth = () => {
  currentMonth.value = addMonths(currentMonth.value, 1)
}

const previousMonth = () => {
  currentMonth.value = subMonths(currentMonth.value, 1)
}

const selectDate = (date: Date) => {
  emit('update:selectedDate', date)
}

const isSelected = (date: Date) => {
  return format(date, 'yyyy-MM-dd') === format(props.selectedDate, 'yyyy-MM-dd')
}
</script>

<template>
  <div class="calendar bg-white rounded-lg shadow p-4">
    <div class="flex justify-between items-center mb-4">
      <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded">
        &lt;
      </button>
      <h2 class="text-lg font-semibold">
        {{ format(currentMonth, 'MMMM yyyy', { locale: es }) }}
      </h2>
      <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded">
        &gt;
      </button>
    </div>
    
    <div class="grid grid-cols-7 gap-1">
      <div v-for="weekDay in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" 
           class="text-center text-sm font-medium text-gray-500">
        {{ weekDay }}
      </div>
      
      <button v-for="day in days" 
              :key="day.toISOString()"
              @click="selectDate(day)"
              :class="[
                'p-2 text-center rounded hover:bg-blue-50',
                {
                  'bg-blue-500 text-white hover:bg-blue-600': isSelected(day),
                  'text-gray-300': !isSameMonth(day, currentMonth),
                  'font-bold': isToday(day)
                }
              ]">
        {{ format(day, 'd') }}
      </button>
    </div>
  </div>
</template>