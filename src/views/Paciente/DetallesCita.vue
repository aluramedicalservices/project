<template>
  <NavTop />
  <div id="next_appointments">
    <Titulo texto="Próximas citas" />
    <div id="appointment-description">
      <h2>{{ tituloCita }}</h2>
      <ul>
        <li>Modalidad: {{ modalidad }}</li>
        <li>Hora: {{ horaEscogida }}</li>
        <li>Ubicación: {{ ubicacionPaciente }}</li>
      </ul>
      <div id="a-d-personal">
        <h3>Personal asignado</h3>
        <i>Icono info</i>
        <hr>
        <div id="a-d-p-card">
          <img src="">
          <h4>{{ NombrePersonalQueAtiende }}</h4>
          <p>{{ TituloPersonal }}</p>
        </div>
      </div>
      <div id="a-d-instrcutions">
        <h3>Instrucciones</h3>
        <i>Icono info</i>
        <hr>
        <p>{{ mensajeInstrucciones }}</p>
      </div>
      <div id="a-d-state">
        <h3>Estado</h3>
        <i>Icono info</i>
        <hr>
        <i>Icono estado</i>
        <p>{{ mensajeEstado }}</p>
      </div>
      <a href="#">Ver más información de la cita</a>
    </div>
  </div>
  <NavBottom />
</template>

<script setup>
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/config/supabase';
import Titulo from '../../components/Titulo.vue';

const route = useRoute();
const citaId = route.params.id;

const tituloCita = ref('Consulta Médica');
const modalidad = ref('Presencial');
const horaEscogida = ref('10:00 AM');
const ubicacionPaciente = ref('Clínica Central');
const mensajeEstado = ref('La cita está confirmada');
const NombrePersonalQueAtiende = ref('Dr. Juan Pérez');
const TituloPersonal = ref('Cardiólogo');
const mensajeInstrucciones = ref('Por favor, llegue 15 minutos antes de su cita.');

onMounted(async () => {
  try {
    const { data: cita, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', citaId)
      .single();

    if (error) throw error;

    tituloCita.value = cita.appointment_type;
    modalidad.value = cita.appointment_type;
    horaEscogida.value = cita.appointment_time;
    mensajeEstado.value = cita.status;

    if (cita.doctor_id) {
      const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .select('nombre, especialidad')
        .eq('id', cita.doctor_id)
        .single();

      if (!doctorError) {
        NombrePersonalQueAtiende.value = doctor.nombre;
        TituloPersonal.value = doctor.especialidad;
      }
    }
  } catch (error) {
    console.error('Error al cargar los detalles de la cita:', error);
  }
});
</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>