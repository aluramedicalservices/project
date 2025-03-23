<template>
  <div id="vista_agendar_cita" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
    <NavTop />
    <div id="p-patients-home" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20">

      <!-- Bienvenida y nombre del paciente -->
      <div id="s-welcome-card" class="flex justify-center font-nunito gap-4">
        <div>
          <img :src="avatar" alt="perfil_usuario" />
        </div>
        <div>
          <p id="plan-label"
            class="text-healingblue bg-healingbluelight inline-block rounded-b-full px-1 text-sm/6">
            {{TipoPlan}}ponerPlan
          </p>
          <p class="text-noxgrey mb-1">Bienvenido/a de nuevo,</p>
          <p class="text-medblue mb-1 text-xl font-semibold">{{ nombrePaciente }}</p>
        </div>
      </div>

      <!-- Próximas citas (solo si hay citas agendadas) -->
      <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

      <div id="s-upcoming-appointments" class="font-nunito flex flex-col items-center space-y-3"
        v-if="citas.length > 0">
        <div class="text-center">
          <div @click="$router.push('/proximas-citas')" class="flex justify-center relative cursor-pointer">
            <TituloH2 texto="Próximas citas" class="text-center" />
            <ChevronRight class="absolute right-1 top-1/2 -translate-y-1/2 text-medblue" />
          </div>
          <p>Hoy es {{ fechaActual }}</p>
        </div>

        <!-- Citas agendadas -->
        <div id="appointments-container" class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
          <div id="appointment-info" class="border border-vitalblue rounded-xl shadow-2xs py-2 px-3 bg-vitalblue w-full"
            v-for="cita in citas" :key="cita.id">
            <h2 class="font-bold text-medblue">{{ obtenerTipoCita(cita.appointment_type) }}</h2>
            <div class="flex space-x-2 space-y-1">
              <Calendar class="w-5 h-5" />
              <p>{{ formatearFecha(cita.appointment_date) }}</p>
            </div>

            <div class="flex space-x-2 space-y-1">
              <Clock class="w-5 h-5" />
              <p>{{ cita.appointment_time }}</p>
            </div>

            <!--Esto no va en esta vista
            <p>Estado: {{ cita.status }}</p>
            <button @click="verDetallesCita(cita.id)">Ver detalles</button>
            -->

            <p v-if="cita.doctor_id">Doctor: {{ cita.doctor_nombre }}</p>

            <button v-if="cita.status === 'accepted'" @click="verUbicacionDoctor(cita.id)">Ver ubicación del
              doctor</button>
          </div>
        </div>

        <button @click="$router.push('/proximas-citas')" class="underline cursor-pointer">
          Ver todas las citas
        </button>
      </div>

      <!-- Solicitar citas -->
      <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

      <div id="s-request-appointment" class="space-y-3">
        <div @click="$router.push('/agendar-citas')" class="flex justify-center relative cursor-pointer">
          <TituloH2 texto="Solicitar cita" />
          <ChevronRight class="absolute right-1 top-1/2 -translate-y-1/2 text-medblue" />
        </div>

        <div class="flex space-x-2 justify-center pb-2">
          <!-- Agendar cita -->
          <div @click="irAAgendarCitas"
            class="bg-medbluelight rounded-lg flex flex-col justify-center items-center w-28 p-3 cursor-pointer">
            <span>Especialista</span>
          </div>
          <!-- Agendar cita Online -->
          <div @click="irAAgendarCitaOnline"
            class="bg-medbluelight rounded-lg flex flex-col justify-center items-center w-28 p-3 cursor-pointer">
            <img :src="screen" alt="cita_online" class="w-12 h-12 object-contain mx-auto" />
            <span>Online</span>
          </div>
          <!-- Agendar cita con Enfermería -->
          <div @click="irAAgendarCitaEnfermeria"
            class="bg-medbluelight rounded-lg flex flex-col justify-center items-center w-28 p-3 cursor-pointer">
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
  </div>
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

import { Calendar, Clock, ChevronRight } from 'lucide-vue-next';

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