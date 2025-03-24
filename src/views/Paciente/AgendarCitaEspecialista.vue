<template>
  <NavTop />
  <div id="Schedule_appointment" class="p-4 max-w-2xl mx-auto pb-32"> <!-- Añade pb-32 -->
    <button 
      @click="router.push('/dashboard-paciente')"
      class="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
    >
      ← Volver
    </button>
    <Titulo texto="Cita con Especialista" />

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

const router = useRouter();
const selectedDate = ref(new Date());
const selectedTime = ref('');
const doctorId = ref(null); 

// Formatear la fecha seleccionada
const formattedSelectedDate = computed(() => {
  return format(selectedDate.value, "d 'de' MMMM 'de' yyyy", { locale: es });
});

// Manejar selección de fecha
const handleDateSelect = (date) => {
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

// Obtener el ID del doctor
const obtenerDoctor = async () => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('id')
      .eq('nombre_completo', 'Dra. Amy Saraí Moreno Ramírez')
      .single();

    if (error || !data) {
      alert('Error al asignar doctor. Contacte al administrador.');
      throw new Error('Doctor no encontrado');
    }

    doctorId.value = data.id; 
  } catch (error) {
    console.error('Error al obtener doctor:', error);
    router.push('/dashboard-paciente');
  }
};

// Redirigir a confirmar cita
const irAConfirmarCita = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Obtener el ID del doctor
  if (!doctorId.value) {
    await obtenerDoctor();
  }

  // Redirigir a la vista de confirmación
  router.push({
    path: '/confirmar-cita',
    query: {
      modalidad: 'domicilio', // Tipo de cita
      fecha: format(selectedDate.value, 'yyyy-MM-dd'),
      hora: selectedTime.value,
      doctorId: doctorId.value, 
    },
  });
};
</script>

<style scoped>
#Schedule_appointment {
  min-height: calc(100vh - 128px);
}
</style>