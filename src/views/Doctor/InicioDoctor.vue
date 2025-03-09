<template>
  <NavTopD />
  <!-- Profile -->
  <div class="flex items-center gap-x-3">
    <div class="shrink-0">
      <img class="shrink-0 size-16 rounded-full"
           src="https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
           alt="Avatar">
    </div>

    <div class="grow">
      <h1 class="text-lg font-medium text-gray-800 dark:text-neutral-200">
        Eliana Garcia
      </h1>
      <p class="text-sm text-gray-600 dark:text-neutral-400">
        Graphic Designer, Web designer/developer
      </p>
    </div>
  </div>
  <!-- End Profile -->

  <!-- Citas Pendientes -->
  <div id="p-patients-home">
    <div id="s-upcoming-appointments">
      <div>
        <h1 class="font-mono text-3xl font-bold underline">Citas Pendientes</h1>
      </div>
      <div class="appointments-container">
        <div class="appointment-info" v-for="cita in citasPendientes" :key="cita.id">
          <h2>{{ obtenerTipoCita(cita.appointment_type) }}</h2>
          <p>{{ formatearFecha(cita.appointment_date) }}</p>
          <p>{{ cita.appointment_time }}</p>
          <p>Paciente: {{ cita.paciente_nombre }}</p>
          <button @click="aceptarCita(cita.id)">Aceptar Cita</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/config/supabase';
import NavTopD from '../../components/Doctor/NavTopD.vue';

const citasPendientes = ref([]);

// Obtener citas pendientes al cargar la vista
onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Obtener citas pendientes con los datos del paciente
      const { data: citasData, error } = await supabase
        .from('appointments')
        .select('*, users:user_id(nombre)') // Obtener el nombre del paciente
        .eq('status', 'scheduled'); // Solo citas pendientes

      if (error) throw error;

      // Mapear los datos para incluir el nombre del paciente
      citasPendientes.value = citasData.map(cita => ({
        ...cita,
        paciente_nombre: cita.users.nombre,
      }));
    }
  } catch (error) {
    console.error('Error al obtener citas pendientes:', error.message);
  }
});

// Función para aceptar una cita
const aceptarCita = async (citaId) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Debes iniciar sesión para aceptar una cita.');
      return;
    }

    // Actualizar la cita con el ID del doctor
    const { error } = await supabase
      .from('appointments')
      .update({ doctor_id: user.id, status: 'accepted' }) // Asignar el doctor y cambiar el estado
      .eq('id', citaId);

    if (error) throw error;

    alert('Cita aceptada.');
    // Actualizar la lista de citas pendientes
    citasPendientes.value = citasPendientes.value.filter(cita => cita.id !== citaId);
  } catch (error) {
    console.error('Error al aceptar la cita:', error.message);
    alert('Error al aceptar la cita.');
  }
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
</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>