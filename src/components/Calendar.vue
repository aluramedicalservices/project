<template>
  <div class="calendar bg-white rounded-lg shadow p-4">
    <!-- Selector de Mes -->
    <div class="flex justify-between items-center mb-4">
      <button 
        @click="previousMonth"
        class="p-2 hover:bg-gray-100 rounded"
      >
        &lt;
      </button>
      <h2 class="text-lg font-semibold">
        {{ format(currentMonth, 'MMMM yyyy', { locale: es }) }}
      </h2>
      <button 
        @click="nextMonth"
        class="p-2 hover:bg-gray-100 rounded"
      >
        &gt;
      </button>
    </div>

    <!-- Días de la Semana -->
    <div class="grid grid-cols-7 gap-1 mb-4 text-gray-700">
      <div 
        v-for="weekDay in ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']" 
        class="text-center text-sm font-medium"
      >
        {{ weekDay }}
      </div>
    </div>

    <!-- Días del Mes -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in days"
        :key="day.toISOString()"
        @click="selectDate(day)"
        :class="[
          'p-2 text-center rounded-lg cursor-pointer',
          {
            'bg-blue-500 text-white': isSelected(day),
            'bg-gray-100 text-gray-400': !isSameMonth(day, currentMonth),
            'hover:bg-blue-100': isSameMonth(day, currentMonth),
            'font-bold border-2 border-blue-500': isToday(day),
          },
        ]"
        :disabled="!isSameMonth(day, currentMonth)"
      >
        {{ format(day, 'd') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, 
  isToday, isSameMonth, startOfWeek, endOfWeek 
} from 'date-fns';
import { es } from 'date-fns/locale';

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true
  }
});

const emit = defineEmits(['date-selected']);

const currentMonth = ref(startOfMonth(props.selectedDate));

const days = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
});

const nextMonth = () => currentMonth.value = addMonths(currentMonth.value, 1);
const previousMonth = () => currentMonth.value = subMonths(currentMonth.value, 1);
const selectDate = (date) => emit('date-selected', date);

const isSelected = (date) => 
  format(date, 'yyyy-MM-dd') === format(props.selectedDate, 'yyyy-MM-dd');
</script>

<style scoped>
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

button {
  transition: all 0.2s ease;
}
</style>