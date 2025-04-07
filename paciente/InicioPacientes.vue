<template>
  <div id="vista_agendar_cita" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-[#FCFEFF]">
    <NavTop />
    <div class="flex-1 py-20"> <!-- Added padding to prevent overlap -->
      <div id="p-patients-home" class="bg-white rounded-2xl shadow-lg text-noxgrey w-11/12 md:w-4/5 max-w-[1200px] mx-auto py-8 md:py-12 px-4 md:px-8">
        
        <!-- Bienvenida y nombre del paciente -->
        <div id="s-welcome-card" class="flex flex-row items-start gap-6 md:gap-10 mb-8 md:mb-12">
          <div class="shadow-lg rounded-full flex-shrink-0">
            <img :src="userAvatar" alt="perfil_usuario" class="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#5B5EA7] object-cover" />
          </div>
          <div class="flex-grow pt-2">
            <p id="plan-label" class="text-[#76C7D0] bg-[#F0F9FE] rounded-full inline-block px-6 md:px-8 py-2 md:py-2.5 text-base md:text-lg font-semibold shadow-sm mb-3 md:mb-4">
              Premium
            </p>
            <p class="text-noxgrey mb-2 md:mb-3 text-lg md:text-xl">Bienvenido/a de nuevo,</p>
            <p class="text-[#5B5EA7] text-2xl md:text-4xl font-bold tracking-tight">{{ nombrePaciente }}</p>
          </div>
        </div>

        <!-- Solicitar citas -->
        <hr class="w-full h-[1px] my-6 md:my-8 bg-gray-200 border-0" />
        <div id="s-request-appointment" class="mb-8 md:mb-12">
          <TituloH2 texto="Solicitar cita" class="text-center mb-6 md:mb-8" />
          <div class="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-6">
            <div v-for="(item, index) in appointmentTypes" 
                :key="index"
                @click="item.action" 
                class="bg-[#F0F9FE] rounded-lg md:rounded-xl flex flex-col justify-center items-center w-full md:w-[180px] p-3 md:p-6 cursor-pointer hover:bg-[#ABBAF0] transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-[#5B5EA7]/20">
              <component :is="item.icon" class="w-8 h-8 md:w-16 md:h-16 text-[#5B5EA7] mb-1 md:mb-4" />
              <span class="font-medium text-[#5B5EA7] text-xs md:text-lg text-center">{{ item.text }}</span>
            </div>
          </div>
        </div>

        <!-- Próximas citas -->
        <hr class="w-full h-[1px] my-6 md:my-8 bg-gray-200 border-0" />
        <div id="s-upcoming-appointments" class="font-nunito flex flex-col items-center space-y-2 md:space-y-3" v-if="citasLimitadas.length > 0">
          <!-- Título con flecha -->
          <div class="text-center cursor-pointer group" @click="irAProximasCitas">
            <div class="flex items-center justify-center gap-2">
              <TituloH2 texto="Próximas citas" />
              <ArrowRight class="w-6 h-6 text-[#5B5EA7] transform group-hover:translate-x-1 transition-transform" />
            </div>
            <p class="text-sm md:text-base">Hoy es {{ fechaActual }}</p>
          </div>

          <!-- Citas container -->
          <div id="appointments-container" class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
            <div
              v-for="cita in citasLimitadas"
              :key="cita.id"
              @click="verDetallesCita(cita.id)"
              class="cursor-pointer border border-vitalblue rounded-xl shadow-2xs py-2 px-3 bg-[#F0F9FE] w-full"
            >
              <h2 class="font-bold text-medblue">{{ obtenerTipoCita(cita.appointment_type) }}</h2>
              <div class="flex items-center space-x-2">
                <Calendar class="w-5 h-5 text-gray-600" />
                <p>{{ formatearFecha(cita.appointment_date) }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <Clock class="w-5 h-5 text-gray-600" />
                <p>{{ formatearHora(cita.appointment_time) }}</p>
              </div>
              <p v-if="cita.doctor_id">Doctor: {{ cita.doctor_nombre }}</p>
              <!-- El botón de ver ubicación se mantiene y detiene la propagación del click -->
              <button
                v-if="cita.status === 'accepted'"
                @click.stop="verUbicacionDoctor(cita.id)"
                class="text-blue-500 underline"
              >
                Ver ubicación del doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NavBottom />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format, toDate } from 'date-fns-tz';
import { es } from 'date-fns/locale';

// Components
import NavTop from '@/components/comp_paciente/NavTop.vue';
import NavBottom from '@/components/comp_paciente/NavBottom.vue';
import TituloH2 from '@/components/TituloH2.vue';

// Icons
import { Calendar, Clock, Stethoscope, Monitor, UserRound, ArrowRight } from 'lucide-vue-next';
import avatar from '@/assets/imagenes/avatar.png';

const nombrePaciente = ref('');
const userAvatar = ref(avatar);
const fechaActual = ref('');
const citas = ref([]);
const citasLimitadas = ref([]); // Se tomarán las 3 más próximas
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
  return tipo === 'online'
    ? 'Cita Online'
    : tipo === 'domicilio'
    ? 'Cita a Domicilio'
    : 'Cita con Especialista';
};

onMounted(async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      router.push('/login');
      return;
    }

    // Obtener nombre y foto del paciente
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('nombre, foto_url')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      alert('Error al cargar datos del usuario');
      return;
    }

    nombrePaciente.value = userData.nombre || 'Usuario';
    // Actualizar avatar si existe
    if (userData.foto_url) {
      userAvatar.value = userData.foto_url;
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
        doctor_id,
        doctors!fk_doctor_id (nombre_completo)
      `)
      .eq('user_id', user.id)
      .gte('appointment_date', hoy) // Solo citas futuras
      .order('appointment_date', { ascending: true });

    if (citasError) throw citasError;

    // Se filtran las citas completadas
    citas.value =
      citasData
        ?.filter((cita) => cita.status !== 'completada')
        .map((cita) => ({
          ...cita,
          doctor_nombre: cita.doctors?.nombre_completo || 'No asignado',
          appointment_time: cita.appointment_time?.slice(0, 5) || '--:--'
        })) || [];

    // Limitar a las 3 citas más próximas
    citasLimitadas.value = citas.value.slice(0, 3);

    // Fecha actual en Tijuana
    fechaActual.value = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    console.error('Error al cargar datos:', error);
    alert('Error al cargar citas. Inténtalo de nuevo.');
  }
});

// Navegación
const irAProximasCitas = () => router.push('/proximas-citas');
const verUbicacionDoctor = (citaId) => {
  alert(`Ver ubicación del doctor para la cita con ID: ${citaId}`);
};
const verDetallesCita = (citaId) => {
  router.push(`/detalles-de-cita/${citaId}`);
};

// Add appointment types configuration
const appointmentTypes = [
  {
    text: 'Especialista',
    icon: Stethoscope,
    action: () => router.push('/agendar-cita-especialista')
  },
  {
    text: 'Online',
    icon: Monitor,
    action: () => router.push('/agendar-cita-online')
  },
  {
    text: 'Domicilio',
    icon: UserRound,
    action: () => router.push('/agendar-cita-enfermeria')
  }
];
</script>

<style scoped>
.bg-medbluelight {
  background-color: #F0F9FE;
}
.hover\:bg-blue-50:hover {
  background-color: #ABBAF0;
}
.transition-all {
  transition: all 0.3s ease;
}

/* Card hover effect */
#appointments-container > div:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(91, 94, 167, 0.1), 0 2px 4px -1px rgba(91, 94, 167, 0.06);
  background-color: #ABBAF0;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .bg-medbluelight {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  #appointments-container > div {
    padding: 0.75rem;
  }
}
</style>