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
      <Titulo texto="Agendar cita con Especialista" />

      <!-- Selector de especialista -->
      <div class="mb-8">
        <label class="block text-lg font-medium mb-2">Seleccione el especialista</label>
        <select 
          v-model="selectedSpecialist"
          class="w-full p-2 border border-gray-300 rounded-lg"
          required
          @change="cargarEspecialista"
        >
          <option value="" disabled selected>Seleccione un especialista</option>
          <option 
            v-for="doctor in listaEspecialistas" 
            :key="doctor.id"
            :value="doctor.id"
          >
            {{ doctor.especialidad }} - {{ doctor.nombre_completo }}
          </option>
        </select>
      </div>

      <!-- Información del especialista -->
      <div v-if="doctorInfo" class="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 class="font-bold text-lg text-blue-800">{{ doctorInfo.nombre }}</h2>
        <p class="text-blue-600">Especialidad: {{ doctorInfo.especialidad }}</p>
        <p class="text-blue-600">Horario: {{ doctorInfo.horario }}</p>
      </div>

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
          :disabled-hours="disabledHours"
        />
        <p class="mt-2 text-gray-600">
          Hora seleccionada: {{ selectedTime || 'Selecciona una hora' }}
        </p>
      </div>

      <!-- Botón de confirmación -->
      <button 
        @click="irAConfirmarCita"
        :disabled="!formularioValido"
        class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        Continuar
      </button>
    </div>
  </div>
  <NavBottom />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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
const selectedSpecialist = ref('');
const doctorInfo = ref(null);
const listaEspecialistas = ref([]);
const loading = ref(false);

// Horas deshabilitadas (comida)
const disabledHours = ref([12, 13]);

// Formatear la fecha seleccionada
const formattedSelectedDate = computed(() => {
  return format(selectedDate.value, "d 'de' MMMM 'de' yyyy", { locale: es });
});

// Validación del formulario
const formularioValido = computed(() => {
  return selectedDate.value && selectedTime.value && selectedSpecialist.value;
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

// Cargar lista de especialistas disponibles
const cargarEspecialistas = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('doctors')
      .select('id, nombre_completo, especialidad')
      .or('especialidad.ilike.%Cardióloga%,especialidad.ilike.%Neumóloga%')
      .order('nombre_completo', { ascending: true });

    if (error) throw error;
    
    listaEspecialistas.value = data || [];
  } catch (error) {
    console.error('Error al cargar especialistas:', error);
    alert('Error al cargar la lista de especialistas');
  } finally {
    loading.value = false;
  }
};

// Cargar información del especialista seleccionado
const cargarEspecialista = async () => {
  if (!selectedSpecialist.value) {
    doctorInfo.value = null;
    return;
  }

  try {
    loading.value = true;
    const { data, error } = await supabase
      .from('doctors')
      .select('id, nombre_completo, especialidad')
      .eq('id', selectedSpecialist.value)
      .single();

    if (error || !data) throw new Error('Especialista no encontrado');

    // Asignar información del doctor
    doctorInfo.value = {
      id: data.id,
      nombre: data.nombre_completo,
      especialidad: data.especialidad,
      horario: data.especialidad.includes('Cardióloga') 
        ? 'Lunes a Viernes, 8:00 - 13:00 y 15:00 - 18:00' 
        : 'Martes a Sábado, 8:00 - 13:00 y 14:00 - 17:00'
    };

  } catch (error) {
    console.error('Error al cargar especialista:', error);
    alert('Error al cargar información del especialista');
    doctorInfo.value = null;
  } finally {
    loading.value = false;
  }
};

// Redirigir a confirmar cita
const irAConfirmarCita = async () => {
  if (!formularioValido.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  router.push({
    path: '/confirmar-cita',
    query: {
      modalidad: 'especialista',
      especialidad: doctorInfo.value.especialidad,
      fecha: format(selectedDate.value, 'yyyy-MM-dd'),
      hora: selectedTime.value,
      doctorId: doctorInfo.value.id,
      doctorNombre: doctorInfo.value.nombre
    },
  });
};

// Cargar datos al montar el componente
onMounted(() => {
  cargarEspecialistas();
});
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

button:disabled {
  background-color: #76C7D0 !important;
  cursor: not-allowed;
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

.bg-blue-50 {
  background-color: #E0F9FC !important;
  border: 2px solid #76C7D0;
}

.text-blue-800 {
  color: #5B5EA7;
}

.text-blue-600 {
  color: #76C7D0;
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