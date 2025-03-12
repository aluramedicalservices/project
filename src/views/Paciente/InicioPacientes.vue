<template>
  <NavTop />
  <div id="p-patients-home">
    <!-- Bienvenida y nombre del paciente -->
    <div id="s-welcome-card">
      <div>
        <img id="patient-profile-p" src="" alt="foto-paciente">
      </div>
      <div>
        <p id="plan-label">Premium</p><br>
        <p>Bienvenid@ de nuevo,</p><br>
        <p>{{ nombrePaciente }}</p>
      </div>
    </div>

    <!-- Próximas citas (solo si hay citas agendadas) -->
    <div id="s-upcoming-appointments" v-if="citas.length > 0">
      <div>
        <h1>Próximas citas</h1>
        <p>Hoy es {{ fechaActual }}</p>
      </div>
      <div class="appointments-container">
        <div class="appointment-info" v-for="cita in citas" :key="cita.id">
          <h2>{{ obtenerTipoCita(cita.appointment_type) }}</h2>
          <p>{{ formatearFecha(cita.appointment_date) }}</p>
          <p>{{ cita.appointment_time }}</p>
          <p>Estado: {{ cita.status }}</p>
          <p v-if="cita.doctor_id">Doctor: {{ cita.doctor_nombre }}</p>
          <button v-if="cita.status === 'accepted'" @click="verUbicacionDoctor">Ver ubicación del doctor</button>
        </div>
      </div>
    </div>

    <!-- Solicitar cita -->
    <div id="s-request-appointment">
      <h2 class="text-3xl font-bold underline">Solicitar cita</h2>
      <button @click="irAAgendarCitas">Agendar cita</button>
      <button @click="irAAgendarCitaOnline">Agendar cita Online</button>
      <button @click="irAAgendarCitaEnfermeria">Agendar cita con Enfermería</button>
      <button v-if="esPremium" @click="irAAgendarCitaEspecialista">Agendar cita con Especialista</button>
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
import NavTop from '../../components/Paciente/NavTop.vue';
import NavBottom from '../../components/Paciente/NavBottom.vue';

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
const verUbicacionDoctor = () => alert('Integrar API de Google Maps aquí.');
</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>