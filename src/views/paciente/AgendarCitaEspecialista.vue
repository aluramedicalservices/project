<template>
  <div id="vista_agendar_cita_especialista" class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
  <NavTop />
  <div id="Schedule_appointment"  class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
    <button 
      @click="router.push('/dashboard-paciente')"
      class="volver-btn"
    >
      ← Volver
    </button>
    <div class="mt-12">
      <Titulo texto="Cita con Especialista" />

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

  <!-- Modal de confirmación -->
  <Transition name="fade">
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black bg-opacity-40" @click="showModal = false"></div>
      <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-11/12 p-6 m-4 transform transition-all">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-4">¡Gracias por preferir Alura Medical Services!</h3>
          <p class="text-gray-600 mb-8">Como miembro premium, nos complace atender tus necesidades de salud.</p>
          <div class="flex space-x-4 justify-center">
            <button 
              @click="confirmarCita" 
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Continuar
            </button>
            <button 
              @click="showModal = false"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <NavBottom class="lg:hidden"/>
  </div>
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
const showModal = ref(false);

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
const irAConfirmarCita = () => {
  if (!formularioValido.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }
  showModal.value = true;
};

// Confirmar cita
const confirmarCita = () => {
  showModal.value = false;
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
  background-color: #F0F9FE !important;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.transform {
  transition: transform 0.3s ease;
}

.fade-enter-from .transform,
.fade-leave-to .transform {
  transform: scale(0.95);
}
</style>