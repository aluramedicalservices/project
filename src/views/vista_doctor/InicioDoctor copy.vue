<template>
  <div id="vista_inicio_doctores" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
  <NavTopD />
  <div id="contenedor_inicio" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20">
  
    <!-- Bienvenida y nombre del paciente -->
    <div id="s-welcome-card" class="flex justify-center font-nunito gap-4">
        <div>
          <img :src="avatar" alt="perfil_usuario" />
        </div>
        <div>
          <p class="text-noxgrey mb-1">Bienvenido/a de nuevo,</p>
          <p class="text-medblue mb-1 text-xl font-semibold">{{ nombrePersonal }}</p> <!--Agregar el nombre del doctor aqui-->
        </div>
      </div>

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
  
</div>
<NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/config/supabase';
import NavTopD from '../../components/comp_doctor/NavTopD.vue';
import NavBottomD from '../../components/comp_doctor/NavBottomD.vue';

import TituloH2 from '../../components/TituloH2.vue';

import nurse from '../../assets/imagenes/nurse.png';
import screen from '../../assets/imagenes/screen.png';
import avatar from '../../assets/imagenes/avatar.png';

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