<template>
  <div id="vista_agendar_cita"
    class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTop />
    <div class="flex-1 py-20"> <!-- Added padding to prevent overlap -->
      <div id="p-patients-home" class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto">

        <!--NUEVA PRIMERA FILA-->
        <div id="primera-fila" class="flex flex-col lg:flex-row items-center pb-3">
          <!-- Bienvenida y nombre del paciente -->
          <div id="welcome-card"
            class="lg:w-5/12 border-gray-200 shadow-lg bg-white flex items-center justify-center gap-4 p-6 rounded-xl lg:mr-2 my-4">
            <div class="w-24 aspect-square overflow-hidden rounded-full border border-gray-200">
              <img :src="avatar" alt="perfil_usuario" class="w-full h-full object-cover" />
            </div>

            <div>
              <p id="plan-label"
                class="text-healingblue text-xs bg-healingbluelight rounded-b-full inline-block px-3 py-1 text-center font-semibold">
                {{ tipoMembresia }}Premium
              </p>
              <p class="text-noxgrey mb-1">Bienvenido/a de nuevo,</p>
              <p class="text-medblue mb-1 text-lg font-montserrat font-semibold">{{ nombrePaciente }}</p>
            </div>
          </div>

          <!-- Noticias -->
          <div id="news-card"
            class="lg:w-7/12 border-gray-200 shadow-lg py-8 lg:ml-2 flex items-start relative bg-gradient-to-r from-[#3E3A99] to-medblue rounded-xl h-auto cursor-pointer">

            <!-- Imagen de fondo -->
            <img :src="medicoAnuncio1" alt="anuncios"
              class="absolute inset-0 w-full h-full object-cover object-right rounded-xl z-0" />

            <!-- Capa oscura solo en mobile -->
            <div class="absolute inset-0 bg-medblue/50 z-0 lg:hidden rounded-xl"></div>

            <!-- Texto -->
            <h4 class="text-white font-montserrat text-base w-full lg:w-2/3 z-10 px-4 lg:pl-5">
              CURSO DE AUTORREGULACIÓN: <br>
              <span class="font-bold text-xl">INVITACIÓN AL CURSO DE AUTORREGULACIÓN RESPIRATORIA</span>
            </h4>
          </div>
        </div>
        <!--FIN PRIMER FILA-->

        <hr class="w-full h-[1px] my-6 md:my-8 bg-gray-200 border-0" />

        <!-- Próximas citas -->
        <div id="s-upcoming-appointments" class="font-nunito py-2 space-y-4" v-if="citasLimitadas.length > 0">
          <!-- Título y fecha -->
          <div id="titulo_y_fecha" class="text-center cursor-pointer" @click="irAProximasCitas">
            <div class="flex items-center justify-center gap-2">
              <TituloH2 texto="Próximas citas" />
              <ChevronRight class="w-6 h-6 text-[#5B5EA7] transform group-hover:translate-x-1 transition-transform" />
            </div>
            <p class="text-sm md:text-base">Hoy es {{ fechaActual }}</p>
          </div>

          <!-- Citas container -->
          <div id="contenedor_proximas_citas"
            class="space-y-3 p-3 bg-white border border-gray-200 shadow-lg rounded-xl">

            <!-- Contenedor de una cita -->
            <div id="appointments-container"
              class="p-5 rounded-xl text-noxgrey bg-healingbluelight lg:flex lg:flex-col cursor-pointer"
              v-for="cita in citasLimitadas" :key="cita.id" @click="verDetallesCita(cita.id)">

              <div id="informacion_cita">

                <h2 class="font-semibold text-medblue font-montserrat  py-2">{{ obtenerTipoCita(cita.appointment_type)
                }}</h2>
                <hr class="w-full h-[1px] my-2 bg-gray-300 border-0">

                <div id="lista-informacion-cita"
                  class="lg:flex lg:space-x-16 py-2 justify-between items-center text-sm">
                  <div class="flex items-center space-x-2 lg:w-1/3">
                    <Calendar class="w-5 h-5 text-gray-600" />
                    <p>{{ formatearFecha(cita.appointment_date) }}</p>
                  </div>

                  <div class="flex items-center space-x-2 lg:w-1/3">
                    <Clock class="w-5 h-5 text-gray-600" />
                    <p>{{ formatearHora(cita.appointment_time) }}</p>
                  </div>

                  <div class="flex items-center space-x-2 lg:w-1/3">
                    <Stethoscope class="w-5 h-5 text-gray-600" />
                    <p v-if="cita.doctor_id">{{ cita.doctor_nombre }}</p>
                  </div>
                </div>

                <!-- El botón de ver ubicación se mantiene y detiene la propagación del click -->
                <button v-if="cita.status === 'accepted'" @click.stop="verUbicacionDoctor(cita.id)"
                  class="text-blue-500 underline">
                  Ver ubicación del doctor
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr class="w-full h-[1px] my-6 md:my-8 bg-gray-200 border-0" />

        <!-- Solicitar citas -->
        <div id="s-request-appointment" class="mb-8 md:mb-12 space-y-4 pb-10">
          <div class="flex items-center justify-center gap-2">
            <TituloH2 texto="Solicitar cita" />
            <ChevronRight class="w-6 h-6 text-[#5B5EA7] transform group-hover:translate-x-1 transition-transform" />
          </div>

          <div class="grid grid-cols-3 gap-2 md:flex md:justify-center md:gap-6">
            <div v-for="(item, index) in appointmentTypes" :key="index" @click="item.action"
              class="bg-medbluelight! rounded-lg md:rounded-xl flex flex-col justify-center items-center w-full md:w-[180px] p-3 md:p-6 cursor-pointer hover:bg-[#ABBAF0] transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-[#5B5EA7]/20">
              <component :is="item.icon" class="w-8 h-8 md:w-16 md:h-16 text-[#5B5EA7] mb-1 md:mb-4" />
              <span class="font-medium text-noxgrey text-xs md:text-lg text-center">{{ item.text }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    <NavBottom class="lg:hidden" />
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
import { Calendar, Clock, Stethoscope, Monitor, UserRound, ChevronRight } from 'lucide-vue-next';
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

@media (max-width: 768px) {
  .bg-medbluelight {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  #appointments-container>div {
    padding: 0.75rem;
  }
}
</style>