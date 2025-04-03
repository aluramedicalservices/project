<template>
  <div id="vista_historial_citas" class="flex flex-col justify-between min-h-screen font-nunito text-[#5B5EA7]">
    <NavTopD />
    <div id="contenedor_historial" class="bg-[#F0F9FE] w-4/5 max-w-[1200px] mx-auto pt-20 pb-32 px-4">
      <!-- Encabezado -->
      <div class="text-center mb-12">
        <TituloH2 texto="Historial de Consultas" class="text-[#5B5EA7]" />
        <p class="text-[#5B5EA7]/70">Consulta el historial de tus citas atendidas</p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-4 mb-8 justify-center bg-white p-6 rounded-xl shadow-sm">
        <select v-model="filtroTipo" class="border border-[#76C7D0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#76C7D0]/50">
          <option value="todos">Todos los tipos</option>
          <option value="online">Online</option>
          <option value="domicilio">A domicilio</option>
          <option value="especialista">Especialista</option>
        </select>
        
        <input 
          type="date" 
          v-model="filtroFecha" 
          class="border border-[#76C7D0] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#76C7D0]/50"
        >
        
        <button 
          @click="aplicarFiltros"
          class="px-6 py-2 bg-[#76C7D0] text-white rounded-lg hover:bg-[#5B5EA7] transition-colors duration-300"
        >
          Aplicar
        </button>
        
        <button 
          @click="resetearFiltros"
          class="px-6 py-2 bg-[#E0F9FC] text-[#5B5EA7] rounded-lg hover:bg-[#76C7D0] hover:text-white transition-colors duration-300"
        >
          Limpiar
        </button>
      </div>

      <!-- Listado de citas completadas -->
      <div v-if="citasCompletadas.length > 0" class="space-y-6">
        <div 
          v-for="cita in citasCompletadas" 
          :key="cita.id"
          class="border border-[#E0F9FC] rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition-all duration-300"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-bold text-lg text-[#5B5EA7]">
              {{ obtenerTipoCita(cita.appointment_type) }}
            </h3>
            <span class="text-sm text-[#76C7D0] bg-[#F0F9FE] px-3 py-1 rounded-full">
              {{ formatearFechaHora(cita.fin_consulta) }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <p class="text-[#5B5EA7]/70">Paciente:</p>
              <p class="font-medium">{{ cita.paciente_nombre }}</p>
            </div>
            
            <div>
              <p class="text-[#5B5EA7]/70">Hora de la cita:</p>
              <p class="font-medium">{{ cita.appointment_time }}</p>
            </div>
            
            <div v-if="cita.diagnostico">
              <p class="text-[#5B5EA7]/70">Diagnóstico:</p>
              <p class="font-medium">{{ cita.diagnostico }}</p>
            </div>
            
            <div v-if="cita.especialidad">
              <p class="text-[#5B5EA7]/70">Especialidad:</p>
              <p class="font-medium">{{ cita.especialidad }}</p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="verDetallesCita(cita.id)"
              class="px-4 py-2 bg-[#76C7D0] text-white rounded-lg text-sm hover:bg-[#5B5EA7] transition-colors duration-300"
            >
              Ver detalles
            </button>
            
            <button 
              v-if="cita.pdf_url"
              @click="descargarPDF(cita.pdf_url)"
              class="px-4 py-2 bg-[#E0F9FC] text-[#5B5EA7] rounded-lg text-sm hover:bg-[#76C7D0] hover:text-white transition-colors duration-300"
            >
              Descargar PDF
            </button>
          </div>
        </div>
        
        <!-- Paginación -->
        <div class="flex justify-center mt-10">
          <button 
            @click="cargarMasCitas"
            :disabled="!hayMasCitas"
            class="px-6 py-2 bg-[#76C7D0] text-white rounded-lg hover:bg-[#5B5EA7] transition-colors duration-300 disabled:opacity-50 disabled:hover:bg-[#76C7D0]"
          >
            Cargar más
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-16 bg-white rounded-xl shadow-sm">
        <p class="text-[#5B5EA7]/70">No tienes citas completadas registradas</p>
      </div>
    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import TituloH2 from '@/components/TituloH2.vue';

const router = useRouter();
const citasCompletadas = ref([]);
const filtroTipo = ref('todos');
const filtroFecha = ref('');
const paginaActual = ref(1);
const totalCitas = ref(0);
const LIMITE_POR_PAGINA = 10;

// Computed
const hayMasCitas = computed(() => {
  return citasCompletadas.value.length < totalCitas.value;
});

// Formateadores
const formatearFechaHora = (fechaHora) => {
  if (!fechaHora) return 'No registrada';
  try {
    const fecha = parseISO(fechaHora);
    return format(fecha, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

const obtenerTipoCita = (tipo) => {
  const tipos = {
    'online': 'Consulta Online',
    'domicilio': 'Visita a Domicilio',
    'especialista': 'Consulta Especializada'
  };
  return tipos[tipo] || tipo;
};

// Funciones para cargar datos
const cargarCitasCompletadas = async () => {
  try {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) {
      router.push('/dashboard-doctor');
      return;
    }

    let query = supabase
      .from('appointments')
      .select(`
        id,
        appointment_type,
        appointment_date,
        appointment_time,
        user_id,
        patients:user_id(nombre, apellido_paterno, apellido_materno),
        especialidad,
        diagnostico,
        notas_medicas,
        receta,
        inicio_consulta,
        fin_consulta,
        duracion_consulta,
        pdf_url,
        status
      `, { count: 'exact' })
      .eq('doctor_id', doctorId)
      .eq('status', 'completada')
      .order('fin_consulta', { ascending: false })
      .range((paginaActual.value - 1) * LIMITE_POR_PAGINA, paginaActual.value * LIMITE_POR_PAGINA - 1);

    // Aplicar filtros
    if (filtroTipo.value !== 'todos') {
      query = query.eq('appointment_type', filtroTipo.value);
    }

    if (filtroFecha.value) {
      query = query.eq('appointment_date', filtroFecha.value);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    if (paginaActual.value === 1) {
      citasCompletadas.value = data.map(cita => ({
        ...cita,
        paciente_nombre: cita.patients 
          ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
          : 'No asignado'
      }));
    } else {
      citasCompletadas.value = [
        ...citasCompletadas.value,
        ...data.map(cita => ({
          ...cita,
          paciente_nombre: cita.patients 
            ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
            : 'No asignado'
        }))
      ];
    }

    totalCitas.value = count;

  } catch (error) {
    console.error('Error al cargar citas completadas:', error);
    alert('Error al cargar el historial de citas. Inténtalo nuevamente.');
  }
};

const aplicarFiltros = () => {
  paginaActual.value = 1;
  cargarCitasCompletadas();
};

const resetearFiltros = () => {
  filtroTipo.value = 'todos';
  filtroFecha.value = '';
  paginaActual.value = 1;
  cargarCitasCompletadas();
};

const cargarMasCitas = () => {
  paginaActual.value += 1;
  cargarCitasCompletadas();
};

const verDetallesCita = (citaId) => {
  router.push({
    name: 'DetallesCitaD',
    params: { id: citaId },
    query: { from: 'historial' }
  });
};

const descargarPDF = (url) => {
  window.open(url, '_blank');
};

// Inicialización
onMounted(() => {
  cargarCitasCompletadas();
});
</script>

<style scoped>
#contenedor_historial {
  min-height: calc(100vh - 120px);
  box-shadow: 0 0 20px rgba(118, 199, 208, 0.1);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: invert(60%) sepia(11%) saturate(1000%) hue-rotate(155deg) brightness(90%) contrast(90%);
}
</style>