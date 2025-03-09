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
      <h2>Solicitar cita</h2>
      <button @click="irAAgendarCitas">Agendar cita</button> <!-- Botón para agendar cita -->
      <button @click="irAAgendarCitaOnline">Agendar cita Online</button>
      <button @click="irAAgendarCitaEnfermeria">Agendar cita con Enfermería</button>
      <button v-if="esPremium" @click="irAAgendarCitaEspecialista">Agendar cita con Especialista</button>
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
const citas = ref([]); // Variable para almacenar las citas del paciente
const router = useRouter();

// Obtener el nombre del paciente y las citas al cargar la vista
onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Obtener el nombre del paciente desde la tabla `users`
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('nombre')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;
      nombrePaciente.value = userData.nombre;

      // Obtener las citas del paciente con los datos del doctor
      const { data: citasData, error: citasError } = await supabase
        .from('appointments')
        .select('*, doctors:doctor_id(nombre)') // Obtener el nombre del doctor
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true }); // Ordenar por fecha ascendente

      if (citasError) throw citasError;

      // Mapear los datos para incluir el nombre del doctor
      citas.value = citasData.map(cita => ({
        ...cita,
        doctor_nombre: cita.doctors?.nombre || 'No asignado',
      }));
    }

    // Obtener la fecha actual
    const hoy = new Date();
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaActual.value = hoy.toLocaleDateString('es-ES', opcionesFecha); // Formato: "martes, 11 de febrero de 2025"
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
  }
});

// Función para redirigir a AgendarCitas.vue
const irAAgendarCitas = () => {
  router.push('/agendar-citas');
};

// Función para redirigir a AgendarCitaOnline.vue
const irAAgendarCitaOnline = () => {
  router.push('/agendar-cita-online');
};

// Función para redirigir a AgendarCitaEnfermeria.vue
const irAAgendarCitaEnfermeria = () => {
  router.push('/agendar-cita-enfermeria');
};

// Función para redirigir a AgendarCitaEspecialista.vue
const irAAgendarCitaEspecialista = () => {
  router.push('/agendar-cita-especialista');
};

// Función para formatear la fecha
const formatearFecha = (fecha) => {
  const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opcionesFecha);
};

// Función para obtener el tipo de cita
const obtenerTipoCita = (tipo) => {
  switch (tipo) {
    case 'asesoria':
      return 'Asesoría Médica';
    case 'enfermeria':
      return 'Cita con Enfermería';
    case 'especialista':
      return 'Cita con Especialista';
    default:
      return 'Cita';
  }
};

// Función para ver la ubicación del doctor
const verUbicacionDoctor = () => {
  // Aquí puedes integrar la API de Google Maps
  alert('Integrar API de Google Maps aquí.');
};
</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>