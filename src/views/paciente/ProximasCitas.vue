<template>
  <div id="vista_citas_agendadas" class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTop />
    <div id="next_appointments"  class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
      <div class="flex flex-col items-center gap-3 mb-12">
        <CalendarIcon class="w-12 h-12 text-[#5B5EA7]"/>
        <h1 class="text-4xl font-bold text-[#5B5EA7] text-center">Próximas citas</h1>
      </div>

      <!-- Mensaje si no hay citas -->
      <div v-if="citas.length === 0" class="text-center py-10">
        <ClipboardIcon class="w-16 h-16 mx-auto text-gray-400 mb-4"/>
        <p class="text-gray-500 text-lg">No tienes citas programadas</p>
      </div>

      <!-- Grid de citas -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="cita in citas" 
             :key="cita.id" 
             class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#76C7D0]/20">
          
          <!-- Cabecera de la cita -->
          <div :class="[
            'p-4 rounded-t-xl flex items-center gap-2',
            getTipoCitaStyle(cita.appointment_type)
          ]">
            <component :is="getTipoCitaIcon(cita.appointment_type)" class="w-5 h-5"/>
            <TituloH3 :texto="obtenerTipoCita(cita.appointment_type)" class="text-white"/>
          </div>

          <!-- Contenido de la cita -->
          <div class="p-6 space-y-4">
            <div class="flex items-center gap-3">
              <CalendarIcon class="w-5 h-5 text-[#5B5EA7]"/>
              <span class="text-[#5B5EA7]">{{ formatearFecha(cita.appointment_date) }}</span>
            </div>
            
            <div class="flex items-center gap-3">
              <ClockIcon class="w-5 h-5 text-[#5B5EA7]"/>
              <span class="text-[#5B5EA7]">{{ formatearHora(cita.appointment_time) }}</span>
            </div>

            <div class="flex items-center gap-3">
              <UserMdIcon class="w-5 h-5 text-[#5B5EA7]"/>
              <span class="font-medium text-[#5B5EA7]">{{ cita.doctor_nombre }}</span>
            </div>

            <div class="flex items-center gap-3">
              <component :is="getStatusIcon(cita.status)" 
                        :class="['w-5 h-5', getStatusColor(cita.status)]"/>
              <span :class="getStatusColor(cita.status)">{{ cita.status }}</span>
            </div>

            <button @click="verDetallesCita(cita.id)" 
                    class="mt-4 w-full bg-[#5B5EA7] text-white py-2.5 px-4 rounded-lg
                           hover:bg-[#76C7D0] active:bg-[#5B5EA7] transition-colors
                           flex items-center justify-center gap-2 font-medium">
              <EyeIcon class="w-5 h-5"/>
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    </div>
    <NavBottom class="lg:hidden"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format, toDate } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import TituloH3 from '../../components/TituloH3.vue';
import { 
  CalendarIcon, ClockIcon, UserIcon as UserMdIcon, 
  VideoCameraIcon, HomeIcon, BuildingOfficeIcon,
  CheckCircleIcon, ClockIcon as PendingIcon, 
  XCircleIcon, EyeIcon, ClipboardIcon
} from '@heroicons/vue/24/outline';

const citas = ref([]);
const router = useRouter();

// Formateadores con zona horaria de Tijuana
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
    const [horas, minutos] = hora.split(':');
    const horaTijuana = toDate(`1970-01-01T${horas.padStart(2, '0')}:${minutos}:00`, { timeZone: 'America/Tijuana' });
    return format(horaTijuana, 'HH:mm');
  } catch {
    return 'Hora inválida';
  }
};

const obtenerTipoCita = (tipo) => {
  return tipo === 'online' ? 'Cita Online' : tipo === 'domicilio' ? 'Cita a Domicilio' : 'Cita con Especialista';
};

// Función para ver detalles de la cita
const verDetallesCita = (citaId) => {
  router.push(`/detalles-de-cita/${citaId}`);
};

// Funciones de estilo
const getTipoCitaStyle = (tipo) => {
  switch(tipo) {
    case 'online': return 'bg-gradient-to-r from-[#5B5EA7] to-[#76C7D0]';
    case 'domicilio': return 'bg-gradient-to-r from-[#76C7D0] to-[#5B5EA7]';
    default: return 'bg-gradient-to-r from-[#5B5EA7] via-[#76C7D0] to-[#5B5EA7]';
  }
};

const getTipoCitaIcon = (tipo) => {
  switch(tipo) {
    case 'online': return VideoCameraIcon;
    case 'domicilio': return HomeIcon;
    default: return BuildingOfficeIcon;
  }
};

const getStatusIcon = (status) => {
  switch(status.toLowerCase()) {
    case 'confirmada': return CheckCircleIcon;
    case 'pendiente': return PendingIcon;
    case 'cancelada': return XCircleIcon;
    default: return CheckCircleIcon;
  }
};

const getStatusColor = (status) => {
  switch(status.toLowerCase()) {
    case 'confirmada': return 'text-[#5B5EA7]';
    case 'pendiente': return 'text-[#76C7D0]';
    case 'cancelada': return 'text-red-500';
    default: return 'text-[#5B5EA7]';
  }
};

onMounted(async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      router.push('/login');
      return;
    }

    // Obtener citas FUTURAS con datos de doctores
    const hoy = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    const { data: citasData, error: citasError } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_type,
        appointment_date,
        appointment_time,
        status,
        doctors!fk_doctor_id (nombre_completo)
      `)
      .eq('user_id', user.id)
      .gte('appointment_date', hoy) // Solo citas futuras
      .not('status', 'eq', 'completada') // Excluir citas completadas
      .order('appointment_date', { ascending: true });

    if (citasError) throw citasError;

    citas.value = citasData?.map(cita => ({
      ...cita,
      doctor_nombre: cita.doctors?.nombre_completo || 'No asignado',
      appointment_time: cita.appointment_time?.slice(0, 5) || '--:--'
    })) || []; // Si no hay citas, asignar un array vacío

  } catch (error) {
    console.error('Error al cargar datos:', error);
    alert('Error al cargar citas. Inténtalo de nuevo.');
  }
});
</script>

<style scoped>
.bg-gradient-to-r {
  background-size: 200% auto;
  transition: background-position 0.5s ease-in-out;
}

.bg-gradient-to-r:hover {
  background-position: right center;
  filter: brightness(1.1);
}

/* Animación de entrada para las tarjetas */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.grid > div {
  animation: fadeInUp 0.3s ease-out forwards;
}

.grid > div:nth-child(2) { animation-delay: 0.1s; }
.grid > div:nth-child(3) { animation-delay: 0.2s; }
.grid > div:nth-child(4) { animation-delay: 0.3s; }
.grid > div:nth-child(5) { animation-delay: 0.4s; }
.grid > div:nth-child(6) { animation-delay: 0.5s; }
</style>