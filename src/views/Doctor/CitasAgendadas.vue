<template>
  <div id="vista_citas_agendadas" class="flex flex-col justify-between min-h-screen font-nunito text-[#5B5EA7]">
    <NavTopD />
    <div id="next_appointments" class="bg-[#F0F9FE] w-4/5 max-w-[1200px] mx-auto pt-20 pb-32 rounded-lg shadow-md">
      <Titulo texto="Todas tus citas" />
      
      <!-- Filtros -->
      <div class="flex flex-wrap gap-4 mb-6 justify-center">
        <select v-model="filtroEstado" class="border border-[#76C7D0] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#76C7D0]">
          <option value="todas">Todos los estados</option>
          <option value="agendada">Agendadas</option>
          <option value="en_proceso">En curso</option>
          <option value="completada">Completadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
        
        <select v-model="filtroTipo" class="border border-[#76C7D0] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#76C7D0]">
          <option value="todos">Todos los tipos</option>
          <option value="online">Online</option>
          <option value="domicilio">A domicilio</option>
          <option value="especialista">Especialista</option>
        </select>
        
        <input 
          type="date" 
          v-model="filtroFecha" 
          class="border border-[#76C7D0] rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#76C7D0]"
        >
        
        <button 
          @click="aplicarFiltros"
          class="px-4 py-2 bg-[#5B5EA7] text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Aplicar
        </button>
        
        <button 
          @click="resetearFiltros"
          class="px-4 py-2 bg-[#E0F9FC] text-[#5B5EA7] rounded-lg hover:bg-opacity-80 transition-colors"
        >
          Limpiar
        </button>
      </div>

      <!-- Citas agendadas -->
      <div v-if="cargando" class="text-center py-12">
        <p>Cargando citas...</p>
      </div>
      
      <div v-else-if="todasLasCitas.length > 0" id="citas_agendadas" class="space-y-4">
        <div 
          v-for="cita in todasLasCitas" 
          :key="cita.id"
          class="border border-[#76C7D0] rounded-xl shadow-md p-6 bg-white hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="font-bold text-lg text-[#5B5EA7]">
              {{ obtenerTipoCita(cita.appointment_type) }}
              <span v-if="esHoy(cita.appointment_date)" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">Hoy</span>
            </h3>
            <span class="text-sm" :class="claseEstado(cita.status)">
              {{ formatearEstado(cita.status) }}
            </span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <p class="text-gray-600">Fecha:</p>
              <p class="font-medium">{{ formatearFecha(cita.appointment_date) }}</p>
            </div>
            
            <div>
              <p class="text-gray-600">Hora:</p>
              <p class="font-medium">{{ formatearHora(cita.appointment_time) }}</p>
            </div>
            
            <div>
              <p class="text-gray-600">Paciente:</p>
              <p class="font-medium">{{ cita.paciente_nombre }}</p>
            </div>
            
            <div v-if="cita.especialidad">
              <p class="text-gray-600">Especialidad:</p>
              <p class="font-medium">{{ cita.especialidad }}</p>
            </div>
          </div>
          
          <!-- Mostrar link de Google Meet para citas online próximas -->
          <div v-if="cita.mostrarMeetLink" class="mt-2 p-3 bg-[#E0F9FC] rounded-lg border border-[#76C7D0]">
            <p class="text-[#5B5EA7] font-medium">La consulta comenzará pronto</p>
            <p class="text-sm">
              <a :href="cita.google_meet_link" target="_blank" class="text-[#5B5EA7] hover:text-[#76C7D0] underline">
                Unirse a Google Meet
              </a>
            </p>
          </div>

          <div class="flex justify-end space-x-3 mt-4">
            <!-- Botón Iniciar Consulta (sólo si la cita está agendada y no hay otra consulta en curso) -->
            <button 
              v-if="cita.status === 'agendada' && cita.appointment_type === 'online'"
              @click="iniciarConsulta(cita.id)" 
              :disabled="hayConsultaEnProceso"
              class="px-4 py-2 bg-[#5B5EA7] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              Iniciar consulta
            </button>
            
            <!-- Botón Iniciar Viaje (sólo si la cita está agendada y no hay otra consulta en curso) -->
            <button 
              v-if="cita.status === 'agendada' && cita.appointment_type !== 'online'"
              @click="iniciarViaje(cita.id)" 
              :disabled="hayConsultaEnProceso"
              class="px-4 py-2 bg-[#5B5EA7] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              Iniciar viaje
            </button>
            
            <!-- Botón Continuar Consulta si está en proceso -->
            <button 
              v-if="cita.status === 'en_proceso'"
              @click="continuarConsulta(cita.id)"
              class="px-4 py-2 bg-[#5B5EA7] text-white rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Continuar consulta
            </button>
            
            <button 
              @click="verDetallesCita(cita.id)"
              class="px-4 py-2 bg-[#E0F9FC] text-[#5B5EA7] rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Ver detalles
            </button>
          </div>
        </div>
        
        <!-- Paginación -->
        <div class="flex justify-center mt-8">
          <button 
            @click="cargarMasCitas"
            :disabled="!hayMasCitas"
            class="px-6 py-2 bg-[#76C7D0] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            Cargar más
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <p class="text-gray-500">No tienes citas agendadas</p>
      </div>
    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format, parseISO, isToday, toDate, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import Titulo from '@/components/Titulo.vue';

const router = useRouter();
const todasLasCitas = ref([]);
const filtroEstado = ref('todas');
const filtroTipo = ref('todos');
const filtroFecha = ref('');
const cargando = ref(true);
const paginaActual = ref(1);
const totalCitas = ref(0);
const LIMITE_POR_PAGINA = 10;

// Computed
const hayConsultaEnProceso = computed(() => {
  return todasLasCitas.value.some(cita => cita.status === 'en_proceso');
});

const hayMasCitas = computed(() => {
  return todasLasCitas.value.length < totalCitas.value;
});

// Formateadores
const formatearFecha = (fecha) => {
  try {
    const fechaTijuana = toDate(`${fecha}T00:00:00`, { timeZone: 'America/Tijuana' });
    return format(fechaTijuana, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

const formatearHora = (hora) => {
  try {
    const horaFormateada = hora.includes(':') ? hora : `${hora}:00`;
    const [horas, minutos] = horaFormateada.split(':');
    const horaTijuana = toDate(`1970-01-01T${horas.padStart(2, '0')}:${minutos}:00`, { timeZone: 'America/Tijuana' });
    return format(horaTijuana, 'HH:mm');
  } catch {
    return 'Hora inválida';
  }
};

const esHoy = (fecha) => {
  return isToday(parseISO(fecha));
};

const obtenerTipoCita = (tipo) => {
  const tipos = {
    'online': 'Consulta Online',
    'domicilio': 'Visita a Domicilio',
    'especialista': 'Consulta Especializada'
  };
  return tipos[tipo] || tipo;
};

const formatearEstado = (estado) => {
  const estados = {
    'agendada': 'Agendada',
    'aceptada': 'Aceptada',
    'rechazada': 'Rechazada',
    'en_proceso': 'En curso',
    'completada': 'Completada',
    'cancelada': 'Cancelada'
  };
  return estados[estado] || estado;
};

const claseEstado = (estado) => {
  const clases = {
    'agendada': 'text-yellow-600',
    'aceptada': 'text-green-600',
    'rechazada': 'text-red-600',
    'en_proceso': 'text-blue-600',
    'completada': 'text-gray-600',
    'cancelada': 'text-red-400'
  };
  return clases[estado] || 'text-gray-600';
};

// Funciones para cargar datos
const cargarTodasLasCitas = async () => {
  try {
    cargando.value = true;
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) {
      router.push('/dashboard-doctor');
      return;
    }

    const ahora = new Date();
    
    let query = supabase
      .from('appointments')
      .select(`
        id,
        appointment_type,
        appointment_date,
        appointment_time,
        status,
        user_id,
        patients:user_id(nombre, apellido_paterno, apellido_materno),
        especialidad,
        google_meet_link,
        ubicacion,
        inicio_consulta,
        fin_consulta
      `, { count: 'exact' })
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
      .range((paginaActual.value - 1) * LIMITE_POR_PAGINA, paginaActual.value * LIMITE_POR_PAGINA - 1);

    // Aplicar filtros
    if (filtroEstado.value !== 'todas') {
      query = query.eq('status', filtroEstado.value);
    }

    if (filtroTipo.value !== 'todos') {
      query = query.eq('appointment_type', filtroTipo.value);
    }

    if (filtroFecha.value) {
      query = query.eq('appointment_date', filtroFecha.value);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    if (paginaActual.value === 1) {
      todasLasCitas.value = data.map(cita => {
        const fechaCita = new Date(`${cita.appointment_date}T${cita.appointment_time}`);
        const minutosRestantes = differenceInMinutes(fechaCita, ahora);
        const mostrarMeetLink = cita.appointment_type === 'online' && minutosRestantes <= 10 && minutosRestantes > 0;
        
        return {
          ...cita,
          paciente_nombre: cita.patients 
            ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
            : 'No asignado',
          mostrarMeetLink
        };
      });
    } else {
      todasLasCitas.value = [
        ...todasLasCitas.value,
        ...data.map(cita => {
          const fechaCita = new Date(`${cita.appointment_date}T${cita.appointment_time}`);
          const minutosRestantes = differenceInMinutes(fechaCita, ahora);
          const mostrarMeetLink = cita.appointment_type === 'online' && minutosRestantes <= 10 && minutosRestantes > 0;
          
          return {
            ...cita,
            paciente_nombre: cita.patients 
              ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
              : 'No asignado',
            mostrarMeetLink
          };
        })
      ];
    }

    totalCitas.value = count;
    cargando.value = false;

  } catch (error) {
    console.error('Error al cargar todas las citas:', error);
    alert('Error al cargar las citas. Inténtalo nuevamente.');
    cargando.value = false;
  }
};

const aplicarFiltros = () => {
  paginaActual.value = 1;
  cargarTodasLasCitas();
};

const resetearFiltros = () => {
  filtroEstado.value = 'todas';
  filtroTipo.value = 'todos';
  filtroFecha.value = '';
  paginaActual.value = 1;
  cargarTodasLasCitas();
};

const cargarMasCitas = () => {
  paginaActual.value += 1;
  cargarTodasLasCitas();
};

const verDetallesCita = (citaId) => {
  router.push({
    name: 'DetallesCitaD',
    params: { id: citaId }
  });
};

const iniciarConsulta = async (citaId) => {
  try {
    // Solo se permite iniciar la consulta si no hay otra en proceso
    if (hayConsultaEnProceso.value) return;

    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'en_proceso',
        inicio_consulta: new Date().toISOString()
      })
      .eq('id', citaId);

    if (error) throw error;

    router.push({
      name: 'RegistroCita',
      params: { id: citaId }
    });

  } catch (error) {
    console.error('Error al iniciar consulta:', error);
    alert('Error al iniciar la consulta. Verifica la consola para más detalles.');
  }
};

const continuarConsulta = (citaId) => {
  router.push({
    name: 'RegistroCita',
    params: { id: citaId }
  });
};

const iniciarViaje = async (citaId) => {
  try {
    // Solo se permite iniciar el viaje si no hay otra consulta en curso
    if (hayConsultaEnProceso.value) return;

    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'en_proceso',
        inicio_consulta: new Date().toISOString()
      })
      .eq('id', citaId);

    if (error) throw error;

    router.push({
      name: 'Viaje',
      params: { id: citaId }
    });

  } catch (error) {
    console.error('Error al iniciar viaje:', error);
  }
};

// Inicialización
onMounted(() => {
  cargarTodasLasCitas();
  
  // Suscripción a cambios en tiempo real
  const channel = supabase
    .channel('appointments_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'appointments',
      filter: `doctor_id=eq.${localStorage.getItem('doctorId')}`
    }, () => cargarTodasLasCitas())
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
});
</script>

<style scoped>
#next_appointments {
  min-height: calc(100vh - 120px);
  background: linear-gradient(to bottom right, #F0F9FE, #E0F9FC);
}

.grid-cols-1 > div {
  padding: 1rem;
  background-color: rgba(240, 249, 254, 0.5);
  border-radius: 0.5rem;
}
</style>