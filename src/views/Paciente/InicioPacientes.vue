<template>
  <NavTop />
  <div id="p-patients-home" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-4">

    <!-- Bienvenida y nombre del paciente -->
    <div id="s-welcome-card" class="flex justify-center font-nunito gap-4">
      <div>
        <img :src="avatar" alt="perfil_usuario" />
      </div>
      <div>
        <p id="plan-label"
          class="text-healingblue bg-healingbluelight rounded-b-full inline-block px-3 py-1 text-center">Premium</p>
        <p class="text-noxgrey mb-1">Bienvenido/a de nuevo,</p>
        <p class="text-medblue mb-1 text-xl font-semibold">{{ nombrePaciente }}</p>
      </div>
    </div>


    <!-- Próximas citas (solo si hay citas agendadas) -->
    <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

    <div id="s-upcoming-appointments" class="font-nunito flex flex-col items-center space-y-3" v-if="citas.length > 0">
      <div class="text-center">
        <TituloH2 texto="Próximas citas" />
        <p>Hoy es {{ fechaActual }}</p>
      </div>

      <!-- Citas agendadas -->
      <div id="appointments-container" class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
        <div id="appointment-info" class="border border-vitalblue rounded-xl shadow-2xs py-2 px-3 bg-vitalblue w-full"
          v-for="cita in citas" :key="cita.id">
          <h2 class="font-bold text-medblue">{{ obtenerTipoCita(cita.appointment_type) }}</h2>
          <div class="flex space-x-2 space-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
            <p>{{ formatearFecha(cita.appointment_date) }}</p>
          </div>
          <div class="flex space-x-2 space-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <p>{{ cita.appointment_time }}</p>
          </div>
          <p>Estado: {{ cita.status }}</p>
          <p v-if="cita.doctor_id">Doctor: {{ cita.doctor_nombre }}</p>
          <button v-if="cita.status === 'accepted'" @click="verUbicacionDoctor(cita.id)">Ver ubicación del
            doctor</button>
          <button @click="verDetallesCita(cita.id)">Ver detalles</button>
        </div>
        <button @click="CitasProximas">Ver todas las citas</button>
      </div>
    </div>

    <!-- Solicitar citas -->
    <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

    <div id="s-request-appointment" class="space-y-3">
  <TituloH2 texto="Solicitar cita" class="text-center" />

  <div class="flex space-x-2 justify-center">
    <!-- Agendar cita -->
    <div @click="irAAgendarCitas" class="bg-medbluelight rounded-lg flex flex-col justify-center items-center w-28 p-3 cursor-pointer">
      <span>Especialista</span>
    </div>

    <!-- Agendar cita Online -->
    <div @click="irAAgendarCitaOnline" class="bg-medbluelight rounded-lg flex flex-col justify-center items-center w-28 p-3 cursor-pointer">
      <img :src="screen" alt="cita_online" class="w-12 h-12 object-contain mx-auto" />
      <span>Online</span>
    </div>

    <!-- Agendar cita con Enfermería -->
    <div @click="irAAgendarCitaEnfermeria" class="bg-medbluelight rounded-lg flex flex-col justify-center items-center w-28 p-3 cursor-pointer">
      <img :src="nurse" alt="cita_enfermeria" class="w-12 h-12 object-contain mx-auto" />
      <span>Enfermería</span>
    </div>
  </div>
</div>

    <div id="s-logout">
      <button @click="cerrarSesion">Cerrar sesión</button>
    </div>
  </div>
  <NavBottom />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import TituloH2 from '../../components/TituloH2.vue';
import nurse from '../../assets/imagenes/nurse.png';
import screen from '../../assets/imagenes/screen.png';
import avatar from '../../assets/imagenes/avatar.png';
import CitasProximas from '../../views/paciente/ProximasCitas.vue';


const nombrePaciente = ref('');
const fechaActual = ref('');
const citas = ref([]);
const router = useRouter();


onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('nombre')
      .eq('id', user.id)
      .single();

    if (userError || !userData || !userData.nombre) {
      router.push('/cuestionario-1');
      return;
    }

    nombrePaciente.value = userData.nombre;

    const { data: citasData, error: citasError } = await supabase
      .from('appointments')
      .select('*, doctors:doctor_id(nombre)')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: true });

    if (citasError) throw citasError;

    citas.value = citasData.map(cita => ({
      ...cita,
      doctor_nombre: cita.doctors?.nombre || 'No asignado',
    }));

    const hoy = new Date();
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaActual.value = hoy.toLocaleDateString('es-ES', opcionesFecha);
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
  }
});

const cerrarSesion = async () => {
  try {
    await supabase.auth.signOut();
    sessionStorage.clear();
    router.push('/apertura');
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
};

const irAAgendarCitas = () => router.push('/agendar-citas');
const irAAgendarCitaOnline = () => router.push('/agendar-cita-online');
const irAAgendarCitaEnfermeria = () => router.push('/agendar-cita-enfermeria');
const irAAgendarCitaEspecialista = () => router.push('/agendar-cita-especialista');
const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
const obtenerTipoCita = (tipo) => tipo === 'asesoria' ? 'Asesoría Médica' : tipo === 'enfermeria' ? 'Cita con Enfermería' : tipo === 'especialista' ? 'Cita con Especialista' : 'Cita';
const verUbicacionDoctor = (citaId) => {
  // Integrar API de Google Maps aquí.
  alert(`Ver ubicación del doctor para la cita con ID: ${citaId}`);
};
const verDetallesCita = (citaId) => {
  router.push(`/detalles-de-cita/${citaId}`);
};

</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>