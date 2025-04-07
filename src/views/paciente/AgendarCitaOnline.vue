<template>
  <div id="vista_agendar_cita_online" class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
  <NavTop />
  <div id="Schedule_appointment"  class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
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

    <!-- Modal de PayPal -->
    <div v-if="showPaypalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
               alt="PayPal" 
               class="mx-auto mb-4 h-16">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Pago con PayPal</h2>
          <div class="bg-gray-100 p-4 rounded-lg mb-4">
            <p class="text-lg font-semibold text-gray-800">Total a pagar:</p>
            <p class="text-2xl font-bold text-blue-600">$350 MXN</p>
          </div>
          <p class="text-sm text-gray-600 mb-4">Consulta en línea con enfermero profesional</p>
          <div class="flex space-x-3">
            <button 
              @click="procesarPago"
              class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Confirmar pago
            </button>
            <button 
              @click="cancelarPago"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de éxito de pago -->
    <div v-if="showSuccessModal" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform scale-100 animate-success-modal">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg class="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
          <p class="text-lg text-gray-600 mb-6">Tu pago de $350 MXN ha sido procesado correctamente</p>
          <button 
            @click="continuarDespuesDelPago"
            class="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  </div>
  <NavBottom class="lg:hidden"/>
  </div>
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
const showPaypalModal = ref(false);
const pagoCompletado = ref(false);
const showSuccessModal = ref(false);

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

  showPaypalModal.value = true;
};

const procesarPago = () => {
  setTimeout(() => {
    pagoCompletado.value = true;
    showPaypalModal.value = false;
    showSuccessModal.value = true;
  }, 1500);
};

const cancelarPago = () => {
  showPaypalModal.value = false;
};

const confirmarCita = () => {
  router.push({
    path: '/confirmar-cita',
    query: {
      modalidad: 'online',
      fecha: format(selectedDate.value, 'yyyy-MM-dd'),
      hora: selectedTime.value,
      pagado: true
    },
  });
};

const continuarDespuesDelPago = () => {
  showSuccessModal.value = false;
  confirmarCita();
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
  background-color: #F0F9FE;
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
  background-color: #F0F9FE !important;
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
  background-color: #F0F9FE;
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

.animate-success-modal {
  animation: modalPop 0.3s ease-out;
}

@keyframes modalPop {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.fixed {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>