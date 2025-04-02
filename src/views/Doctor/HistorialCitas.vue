<template>
  <div id="vista_historial_citas" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
    <NavTopD />
    <div id="contenedor_historial" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto pt-20 pb-32">
      <!-- Encabezado -->
      <div class="text-center mb-8">
        <TituloH2 texto="Historial de Consultas" />
        <p class="text-gray-600">Consulta el historial de tus citas atendidas</p>
      </div>

      <!-- Filtros -->
      <div class="flex flex-wrap gap-4 mb-6 justify-center">
        <select v-model="filtroTipo" class="border border-gray-300 rounded-lg px-4 py-2">
          <option value="todos">Todos los tipos</option>
          <option value="online">Online</option>
          <option value="domicilio">A domicilio</option>
          <option value="especialista">Especialista</option>
        </select>
        
        <input 
          type="date" 
          v-model="filtroFecha" 
          class="border border-gray-300 rounded-lg px-4 py-2"
        >
        
        <button 
          @click="aplicarFiltros"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Aplicar
        </button>
        
        <button 
          @click="resetearFiltros"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Limpiar
        </button>
      </div>

      <!-- Listado de citas completadas -->
      <div v-if="citasCompletadas.length > 0" class="space-y-4">
        <div 
          v-for="cita in citasCompletadas" 
          :key="cita.id"
          class="border border-gray-200 rounded-xl shadow-2xs p-4 bg-white hover:shadow-xs transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-lg text-medblue">
              {{ obtenerTipoCita(cita.appointment_type) }}
            </h3>
            <span class="text-sm text-gray-500">
              {{ formatearFechaHora(cita.fin_consulta) }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p class="text-gray-600">Paciente:</p>
              <p class="font-medium">{{ cita.paciente_nombre }}</p>
            </div>
            
            <div>
              <p class="text-gray-600">Duración:</p>
              <p class="font-medium">{{ cita.duracion_consulta }} minutos</p>
            </div>
            
            <div v-if="cita.diagnostico">
              <p class="text-gray-600">Diagnóstico:</p>
              <p class="font-medium">{{ cita.diagnostico }}</p>
            </div>
            
            <div v-if="cita.especialidad">
              <p class="text-gray-600">Especialidad:</p>
              <p class="font-medium">{{ cita.especialidad }}</p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              @click="verDetallesCita(cita.id)"
              class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Ver detalles
            </button>
            
            <button 
              v-if="cita.pdf_url"
              @click="descargarPDF(cita.pdf_url)"
              class="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Descargar PDF
            </button>
          </div>
        </div>
        
        <!-- Paginación -->
        <div class="flex justify-center mt-8">
          <button 
            @click="cargarMasCitas"
            :disabled="!hayMasCitas"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Cargar más
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-500">No tienes citas completadas registradas</p>
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
/* Estilos específicos para esta vista */
#contenedor_historial {
  min-height: calc(100vh - 120px);
}
</style>