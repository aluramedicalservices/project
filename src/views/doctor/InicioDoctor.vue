<template>
  <div id="vista_inicio_doctores"
    class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTopD />
    <div id="contenedor_inicio" class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">

      <div id="primera-fila" class="flex flex-col lg:flex-row items-center pb-3">
        <!-- Bienvenida y nombre del doctor -->
        <div id="welcome-card"
          class="lg:w-5/12 border-gray-200 shadow-lg bg-white flex items-center justify-center gap-4 p-6 rounded-xl lg:mr-2 my-4">
          <div class="w-24 aspect-square overflow-hidden rounded-full border border-gray-200">
            <img :src="avatar" alt="perfil_usuario" class="w-full h-full object-cover" />
          </div>

          <div>
            <p id="plan-label"
              class="text-healingblue text-xs bg-healingbluelight rounded-b-full inline-block px-3 py-1 text-center font-semibold">
              {{ especialidadDoctor }}
            </p>
            <p class="text-noxgrey mb-1">Bienvenido/a de nuevo,</p>
            <p class="text-medblue mb-1 text-lg font-montserrat font-semibold">{{ nombreDoctor }}</p>
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
            CUIDARNOS TAMBIÉN ES PRIORIDAD: <br>
            <span class="font-bold text-xl">INVITACIÓN AL CURSO DE SALUD MENTAL PARA EL PERSONAL MÉDICO</span>
          </h4>
        </div>
      </div>


      <hr class="w-full h-[1px] my-4 bg-gray-200 border-0">

      <!-- Próximas citas -->
      <div id="s-upcoming-appointments" class="font-nunito py-2" v-if="citasPendientes.length > 0">
        <div id="titulo_y_fecha" @click="irAProximasCitas" class="text-center mb-8">
          <div class="flex items-center justify-center gap-2 cursor-pointer">
            <TituloH2 texto="Agenda" class="text-2xl font-bold mb-2 text-noxgrey" />
            <ChevronRight class="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
          </div>
          <p>Hoy es {{ fechaActual }}</p>
        </div>

        <!-- Contenedor de citas proximas -->
        <div id="contenedor_proximas_citas" class="space-y-3 p-3 bg-white border border-gray-200 shadow-lg rounded-xl">

          <div id="contenedor_cita" v-for="cita in citasPendientes.slice(0, 4)" :key="cita.id"
            class="p-5 rounded-xl text-noxgrey bg-healingbluelight lg:flex lg:flex-col">

            <!-- CONTENIDO DE LA CITA -->
            <div id="contenido_cita" class="lg:flex lg:space-x-16 justify-between items-center">
              <!-- Nombre del paciente -->
              <div>
                <div class="flex items-center gap-2">
                  <User class="w-4 h-4 text-medblue" />
                  <h3 class="text-md font-montserrat font-semibold text-medblue">
                    {{ cita.paciente_nombre || 'No asignado' }}
                  </h3>
                  <!-- Badges en la parte superior -->
                  <div class="mx-4 bg-healingblue text-white py-1 px-2 rounded-full">
                    <span v-if="esHoy(cita.appointment_date)">Hoy</span>
                    <span v-if="cita.estaPorComenzar">Próxima</span>
                  </div>
                </div>

              </div>
              <button v-if="cita.status === 'agendada'" @click="iniciarConsulta(cita.id, cita.appointment_type)"
                :disabled="hayConsultaEnProceso"
                class="w-full my-2 lg:my-0 lg:w-1/4 font-nunito bg-medblue text-white py-3 px-4 rounded-full inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-medbluehover transition focus:outline-hidden focus:border-medbluelight disabled:opacity-50 disabled:pointer-events-none">
                <Play class="w-3 h-3" />
                {{ cita.appointment_type === 'online' ? 'Iniciar' : 'Iniciar viaje' }}
              </button>

              <button v-if="cita.status === 'en_proceso'" @click="continuarConsulta(cita.id)"
                class="w-full my-2 lg:my-0 lg:w-1/4 font-nunito bg-medblue text-white py-3 px-4 rounded-full inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-medbluehover transition focus:outline-hidden focus:border-medbluelight disabled:opacity-50 disabled:pointer-events-none">
                Continuar
              </button>
            </div>

            <hr class="w-full h-[1px] my-2 bg-gray-300 border-0">

            <!-- Lista de informacion de la cita  -->
            <div class="lg:flex items-center justify-between py-2">
              <!-- Estado-->
              <div v-if="cita.status !== 'en_proceso'" class="flex items-center gap-2">
                <ActivitySquare class="w-4 h-4" />
                <span :class="claseEstado(cita.status)" class="text-sm text-noxgrey!">
                  {{ formatearEstado(cita.status) }}
                </span>
              </div>

              <!-- Tipo de consulta -->
              <div class="flex items-center gap-2">
                <Stethoscope class="w-4 h-4" />
                <p class="text-sm">
                  {{ obtenerTipoCita(cita.appointment_type) }}
                </p>
              </div>

              <!-- Fecha-->
              <div class="flex items-center gap-2">
                <Calendar class="w-4 h-4" />
                <p class="text-sm text-gray-700">{{ formatearFecha(cita.appointment_date) }}</p>
              </div>

              <!-- Hora -->
              <div class="flex items-center gap-2">
                <Clock class="w-4 h-4" />
                <p class="text-sm text-gray-700">{{ formatearHora(cita.appointment_time) }}</p>
              </div>
              <!--FIN CONTENIDO-->

            </div>
          </div>
        </div>

        <!-- Botón ver todas -->
        <div class="flex justify-center mt-8">
          <button @click="verTodasLasCitas"
            class="px-8 py-3 text-white rounded-lg transition-all hover:opacity-90 hover:scale-105">
            Ver todas las citas
          </button>
        </div>
      </div>

      <div v-else class="text-center py-8 rounded-xl">
        <p>No tienes citas agendadas pendientes</p>
      </div>
    </div>
    <NavBottomD class="lg:hidden" />
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
import TituloH2 from '@/components/TituloH2.vue';

// Icons
import { Calendar, Clock, User, Stethoscope, ActivitySquare, Play, ChevronRight } from 'lucide-vue-next';
import avatar from '@/assets/imagenes/avatar.png';
import medicoAnuncio1 from '@/assets/imagenes/noticias/medico-anuncio1.png';

const nombreDoctor = ref(localStorage.getItem('doctorNombre') || 'Doctor');
const especialidadDoctor = ref(localStorage.getItem('doctorEspecialidad') || 'Especialidad');
const fechaActual = ref('');
const citasPendientes = ref([]);
const router = useRouter();
const irAProximasCitas = () => router.push('/citas-agendadas');

// Computado para saber si hay alguna consulta en proceso
const hayConsultaEnProceso = computed(() => {
  return citasPendientes.value.some(cita => cita.status === 'en_proceso');
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

// Cargar citas del doctor con verificación de tiempo
const cargarCitasDoctor = async () => {
  try {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) {
      router.push('/dashboard-doctor');
      return;
    }

    const hoy = format(new Date(), 'yyyy-MM-dd');
    const ahora = new Date();

    const { data: citas, error } = await supabase
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
        ubicacion
      `)
      .eq('doctor_id', doctorId)
      .in('status', ['agendada', 'en_proceso'])
      .gte('appointment_date', hoy)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) throw error;

    citasPendientes.value = citas.map(cita => {
      const fechaCita = new Date(`${cita.appointment_date}T${cita.appointment_time}`);
      const minutosRestantes = differenceInMinutes(fechaCita, ahora);
      const mostrarMeetLink = cita.appointment_type === 'online' && minutosRestantes <= 10 && minutosRestantes > 0;
      const estaPorComenzar = minutosRestantes <= 30 && minutosRestantes > 0;

      return {
        ...cita,
        paciente_nombre: cita.patients
          ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
          : 'No asignado',
        mostrarMeetLink,
        estaPorComenzar
      };
    });

    fechaActual.value = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });

  } catch (error) {
    console.error('Error al cargar citas:', error);
    alert('Error al cargar las citas. Inténtalo nuevamente.');
  }
};

const iniciarConsulta = async (citaId, tipoCita) => {
  try {
    if (hayConsultaEnProceso.value) return;

    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'en_proceso',
        inicio_consulta: new Date().toISOString()
      })
      .eq('id', citaId);

    if (error) throw error;

    // Redirigir según el tipo de cita
    if (tipoCita === 'domicilio') {
      router.push({ name: 'Viaje', params: { id: citaId } });
    } else {
      router.push({ name: 'RegistroCita', params: { id: citaId } });
    }

  } catch (error) {
    console.error('Error al iniciar consulta:', error);
    alert('Error al iniciar la consulta. Verifica la consola para más detalles.');
  }
};

const continuarConsulta = async (citaId) => {
  try {
    router.push({
      name: 'RegistroCita',
      params: { id: citaId }
    });
  } catch (error) {
    console.error('Error al continuar consulta:', error);
  }
};

const iniciarViaje = async (citaId) => {
  try {
    // Solo se permite iniciar el viaje si no hay otra consulta en proceso
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

// Navegar a la vista de "Próximas citas" donde se muestran todas las citas completas
const verTodasLasCitas = () => {
  router.push({ name: 'CitasAgendadas' });
};

// Suscripción a cambios en tiempo real y verificación periódica
onMounted(() => {
  cargarCitasDoctor();

  // Verificar cada minuto para mostrar notificaciones
  const intervalo = setInterval(cargarCitasDoctor, 60000);

  const channel = supabase
    .channel('appointments_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'appointments',
      filter: `doctor_id=eq.${localStorage.getItem('doctorId')}`
    }, () => cargarCitasDoctor())
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
    clearInterval(intervalo);
  };
});
</script>

<style scoped>
.rounded-xl {
  border-radius: 1rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05),
    0 4px 6px -2px rgba(0, 0, 0, 0.03);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08),
    0 10px 10px -5px rgba(0, 0, 0, 0.03);
}

.transition-all {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-1px);
}

.transform {
  transition: transform 0.2s ease-in-out;
}

/* Estado colors */
.text-yellow-600 {
  color: #76C7D0;
}

.text-green-600 {
  color: #4A90E2;
}

.text-red-600 {
  color: #E74C3C;
}

.text-blue-600 {
  color: #76C7D0;
}

hr {
  border-color: rgba(118, 199, 208, 0.2);
}
</style>
