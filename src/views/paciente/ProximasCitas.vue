<template>
  <div id="vista_citas_agendadas" class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-white ">
    <NavTop />
    <div id="next_appointments"  class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32 py-20">
      <Titulo texto="Próximas citas"/>

      <!-- Mensaje si no hay citas -->
      <div v-if="citas.length === 0" class="text-center py-10">
        <ClipboardIcon class="w-16 h-16 mx-auto text-gray-400 mb-4"/>
        <p class="text-gray-500 text-lg">No tienes citas programadas</p>
      </div>

      <!-- Citas agendadas -->
      <!-- Citas agendadas -->
<div id="citas_agendadas" class="py-2 space-y-4">
  <div
    id="appointments-container"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-3 border border-gray-200 rounded-xl shadow-2xs w-full"
  >
    <div
      id="cita_individual"
      v-for="cita in citas"
      :key="cita.id"
      class="border-2 border-vitalblue rounded-xl shadow-2xs py-4 px-3 bg-vitalblue text-center space-y-4 hover:border-healingblue hover:bg-healingbluelight"
    >
      <TituloH3 :texto="obtenerTipoCita(cita.appointment_type)" />
      <ul>
        <li><span class="font-bold">Modalidad: </span>{{ modalidad }}</li>
        <li><span class="font-bold">Fecha: </span>{{ formatearFecha(cita.appointment_date) }}</li>
        <li><span class="font-bold">Hora: </span>{{ formatearHora(cita.appointment_time) }}</li>
        <li><span class="font-bold">Personal: </span>{{ cita.doctor_nombre }}</li>
      </ul>
      <div
        id="a-d-state"
        class="bg-white border text-noxgrey border-gray-100 rounded-xl relative p-4 space-y-4 drop-shadow-xs"
      >
        <h3 class="font-montserrat font-bold text-center">Estado</h3>
        <Info class="absolute top-4 right-4 text-gray-400 w-5" />
        <hr class="w-full h-[1px] bg-gray-300 border-0" />
        <div class="flex space-x-4 justify-center">
          <i>Imagen sobre el estado</i>
          <p>{{ cita.status }}</p>
        </div>
      </div>
      <button
        @click="verDetallesCita(cita.id)"
        class="bg-[#5B5EA7] hover:bg-[#4a4d92] text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300 text-center inline-block w-2/3 cursor-pointer"
      >
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
import Titulo from '../../components/Titulo.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import TituloH3 from '../../components/TituloH3.vue';
import { Info } from 'lucide-vue-next';


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
    const hoy = new Date().toISOString().split('T')[0];
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
      .neq('status', 'cancelada') // Excluir citas canceladas
      .gte('appointment_date', hoy)
      .not('status', 'eq', 'completada')
      .order('appointment_date', { ascending: true });

    if (citasError) throw citasError;

    // Filtrar adicionalmente para asegurar que no se muestren citas canceladas
    citas.value = citasData
      ?.filter(cita => cita.status !== 'cancelada')
      .map(cita => ({
        ...cita,
        doctor_nombre: cita.doctors?.nombre_completo || 'No asignado',
        appointment_time: cita.appointment_time?.slice(0, 5) || '--:--'
      })) || [];

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