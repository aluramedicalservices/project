<template>
  <div id="vista_agendar_cita_enfermeria" class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTop />
    <div id="Schedule_appointment" class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
      <div class="mt-12">
        <Titulo texto="Agendar cita a Domicilio" />

        <!-- Selector de fecha -->
        <div class="mb-8">
          <label class="block text-lg font-medium mb-2">Fecha de la cita</label>
          <Calendar :selected-date="selectedDate" @date-selected="handleDateSelect" />
          <p class="mt-2 text-gray-600">
            Fecha seleccionada: {{ formattedSelectedDate || 'Selecciona una fecha' }}
          </p>
        </div>

        <!-- Selector de hora -->
        <div class="mb-8">
          <label class="block text-lg font-medium mb-2">Hora de la cita</label>
          <TimeSelector :selected-time="selectedTime" @time-selected="handleTimeSelect" />
          <p class="mt-2 text-gray-600">
            Hora seleccionada: {{ selectedTime || 'Selecciona una hora' }}
          </p>
        </div>

        <!-- Selector de ubicación -->
        <div class="mb-8">
          <label class="block text-lg font-medium mb-2">Ubicación de la consulta</label>
          <MapSelector @location-selected="handleLocationSelect" />
          <p v-if="selectedLocation" class="mt-2 text-gray-600">
            Ubicación seleccionada: {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}
          </p>
        </div>

        <!-- Método de pago -->
        <div class="mb-8">
          <label class="block text-lg font-medium mb-2">Método de pago</label>
          <select v-model="metodoPago" class="w-full p-2 border border-gray-300 rounded-lg" required
            @change="handlePaymentMethodChange">
            <option value="" disabled selected>Selecciona un método de pago</option>
            <option value="online">Pagar en línea</option>
            <option value="efectivo">Pagar en efectivo</option>
          </select>
          
          <!-- Botón de continuar para pago en efectivo -->
          <button 
            v-if="metodoPago === 'efectivo'"
            @click="irAConfirmarCita"
            class="mt-4 w-full py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>

      <!-- Modal de PayPal -->
      <div v-if="showPaypalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div class="text-center">
            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal"
              class="mx-auto mb-4 h-16">
            <h2 class="text-xl font-bold mb-4 text-gray-800">Pago con PayPal</h2>
            <div class="bg-gray-100 p-4 rounded-lg mb-4">
              <p class="text-lg font-semibold text-gray-800">Total a pagar:</p>
              <p class="text-2xl font-bold text-blue-600">$600 MXN</p>
            </div>
            <p class="text-sm text-gray-600 mb-4">Consulta a domicilio con enfermero profesional</p>
            <div class="flex space-x-3">
              <button @click="procesarPago"
                class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Confirmar pago
              </button>
              <button @click="cancelarPago"
                class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
                Cancelar
              </button>
            </div>
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
import { supabase } from '@/config/supabase';
import MapSelector from '@/components/MapSelector.vue';

const router = useRouter();
const selectedDate = ref(new Date());
const selectedTime = ref('');
const metodoPago = ref('');
const doctorId = ref(null); // ID del enfermero asignado
const selectedLocation = ref(null);
const showPaypalModal = ref(false);
const pagoCompletado = ref(false);

// Formatear la fecha seleccionada
const formattedSelectedDate = computed(() => {
  return format(selectedDate.value, "d 'de' MMMM 'de' yyyy", { locale: es });
});

// Manejar selección de fecha
const handleDateSelect = (date) => {
  // Validar que la fecha no sea anterior a hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    alert('No se pueden agendar citas en fechas pasadas');
    return;
  }

  selectedDate.value = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

// Manejar selección de hora
const handleTimeSelect = (time) => {
  selectedTime.value = time;
};

// Manejar selección de ubicación
const handleLocationSelect = (location) => {
  selectedLocation.value = location;
};

// Manejar cambio de método de pago
const handlePaymentMethodChange = (event) => {
  if (event.target.value === 'online') {
    showPaypalModal.value = true;
  }
  // No es necesario hacer nada especial para efectivo, el botón se mostrará automáticamente
};

// Simular procesamiento de pago
const procesarPago = () => {
  setTimeout(() => {
    pagoCompletado.value = true;
    showPaypalModal.value = false;
    alert('¡Pago procesado con éxito!');
    irAConfirmarCita();
  }, 1500);
};

// Cancelar pago
const cancelarPago = () => {
  showPaypalModal.value = false;
  metodoPago.value = '';
};

// Obtener el ID del enfermero "Juan José Moreno Argueta"
const obtenerEnfermero = async () => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('id')
      .eq('nombre_completo', 'Juan José Moreno Argueta')
      .single();

    if (error || !data) {
      alert('Error al asignar enfermero. Contacte al administrador.');
      throw new Error('Enfermero no encontrado');
    }
    doctorId.value = data.id;
  } catch (error) {
    console.error('Error al obtener enfermero:', error);
    router.push('/dashboard-paciente');
  }
};

// Redirigir a confirmar cita, incluyendo la ubicación seleccionada
const irAConfirmarCita = async () => {
  if (!selectedDate.value || !selectedTime.value || !metodoPago.value || !selectedLocation.value) {
    alert('Por favor, completa todos los campos, incluyendo la ubicación.');
    return;
  }

  if (metodoPago.value === 'online' && !pagoCompletado.value) {
    alert('Por favor, completa el pago antes de continuar.');
    showPaypalModal.value = true;
    return;
  }

  if (!doctorId.value) {
    await obtenerEnfermero();
  }

  // Convertir la ubicación a string para pasarla como query parameter
  const ubicacion = JSON.stringify(selectedLocation.value);

  router.push({
    path: '/confirmar-cita',
    query: {
      modalidad: 'domicilio',
      fecha: format(selectedDate.value, 'yyyy-MM-dd'),
      hora: selectedTime.value,
      metodoPago: metodoPago.value,
      doctorId: doctorId.value,
      ubicacion,
      pagado: metodoPago.value === 'online'
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
  background-color: #F0F9FE;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

label {
  color: #5B5EA7;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

select {
  background-color: white;
  border: 2px solid #76C7D0;
  border-radius: 0.5rem;
  padding: 0.75rem;
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

.back-button {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #F0F9FE;
  color: #5B5EA7;
  font-weight: 500;
  z-index: 10;
}

.back-button:hover {
  background-color: #76C7D0;
}

.content-container {
  padding-top: 3.5rem;
}

.mt-12 {
  margin-top: 3rem;
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

.mt-4 {
  margin-top: 1rem;
}
</style>
