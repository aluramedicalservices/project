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
      <Titulo texto="Agendar cita a Domicilio" />

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
        <select 
          v-model="metodoPago"
          class="w-full p-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="" disabled selected>Selecciona un método de pago</option>
          <option value="online">Pagar en línea</option>
          <option value="efectivo">Pagar en efectivo</option>
        </select>
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
import { supabase } from '@/config/supabase';
import MapSelector from '@/components/MapSelector.vue';

const router = useRouter();
const selectedDate = ref(new Date());
const selectedTime = ref('');
const metodoPago = ref('');
const doctorId = ref(null); // ID del enfermero asignado
const selectedLocation = ref(null);

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
      ubicacion // Se incluye la ubicación en los parámetros
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

.back-button {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #E0F9FC;
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
</style>
