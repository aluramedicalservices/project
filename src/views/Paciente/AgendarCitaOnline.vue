<template>
  <NavTop />
  <div id="Schedule_appointment" class="p-4 max-w-2xl mx-auto pb-32">
    <button 
      @click="router.push('/dashboard-paciente')"
      class="volver-btn"
    >
      ← Volver
    </button>
    <div class="mt-12">
      <Titulo texto="Agendar cita online" />

      <!-- Selector de fecha -->
      <div class="mb-8">
        <label class="block text-lg font-medium mb-2">Fecha de la cita</label>
        <Calendar 
          :selected-date="selectedDate"
          @date-selected="handleDateSelect"
        />
        <p class="mt-2 text-gray-600">
          Fecha seleccionada: {{ formattedSelectedDate || 'Selecciona una fecha' }}
        </p>
      </div>

      <!-- Selector de hora -->
      <div class="mb-8">
        <label class="block text-lg font-medium mb-2">Hora de la cita</label>
        <TimeSelector 
          :selected-time="selectedTime"
          @time-selected="handleTimeSelect"
        />
        <p class="mt-2 text-gray-600">
          Hora seleccionada: {{ selectedTime || 'Selecciona una hora' }}
        </p>
      </div>

      <!-- Botón de confirmación -->
      <button 
        @click="irAConfirmarCita"
        class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Continuar
      </button>
    </div>
  </div>
  <NavBottom />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from '@/components/Calendar.vue';
import TimeSelector from '@/components/TimeSelector.vue';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';

const router = useRouter();
const selectedDate = ref(new Date());
const selectedTime = ref('');

const formattedSelectedDate = computed(() => {
  return format(selectedDate.value, "d 'de' MMMM 'de' yyyy", { locale: es });
});

const handleDateSelect = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
    alert('No se pueden agendar citas en fechas pasadas');
    return;
  }
  
  selectedDate.value = date;
};

const handleTimeSelect = (time) => {
  selectedTime.value = time;
};

const irAConfirmarCita = () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Por favor selecciona fecha y hora');
    return;
  }

  // Validar formato de hora (HH:mm)
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(selectedTime.value)) {
    alert('Formato de hora inválido. Usa HH:mm (ejemplo: 09:00)');
    return;
  }

  router.push({
    path: '/confirmar-cita',
    query: {
      modalidad: 'online',
      fecha: format(selectedDate.value, 'yyyy-MM-dd'),
      hora: selectedTime.value,
    },
  });
};
</script>

<style scoped>
#Schedule_appointment {
  min-height: calc(100vh - 128px);
  background-color: #F0F9FE;
}

button {
  transition: all 0.3s ease;
}

button:not(.mb-4) {
  background-color: #5B5EA7 !important;
}

button:hover:not(.mb-4) {
  background-color: #4a4d8c !important;
}

.mb-8 {
  background-color: #E0F9FC;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

label {
  color: #5B5EA7;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.text-gray-600 {
  color: #5B5EA7;
  font-weight: 500;
}

.mb-4 {
  margin-bottom: 2rem !important;
  background-color: #E0F9FC !important;
  color: #5B5EA7;
  font-weight: 500;
}

.mb-4:hover {
  background-color: #76C7D0 !important;
}

.relative {
  position: relative;
}

.volver-btn {
  display: block;
  padding: 0.5rem 1rem;
  background-color: #E0F9FC;
  color: #5B5EA7;
  font-weight: 500;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.volver-btn:hover {
  background-color: #76C7D0;
}

.mt-12 {
  margin-top: 3rem;
}

.content-container {
  padding-top: 3.5rem;
}
</style>