<template>
  <div id="next_appointments" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
    <NavTop />
    <div id="detalles_citas_agendadas" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20 pb-32">
      <Titulo texto="Detalles de cita" />
      <!-- Detalles de la cita -->
      <div id="appointment-container-info" class="space-y-3">
        <div id="appointment-info"
          class="border border-vitalblue rounded-xl shadow-2xs py-4 px-6 bg-vitalblue w-full text-center space-y-4">

          <!--Titulo e info general-->
          <TituloH3 :texto="tituloCita" />
          <ul>
            <li><span class="font-bold">Modalidad: </span> {{ modalidad }}</li>
            <li><span class="font-bold">Hora: </span> {{ horaEscogida }}</li>
            <li><span class="font-bold">Ubicación: </span> {{ ubicacionPaciente }}</li>
          </ul>

          <!--Personal asignado-->
          <div id="a-d-personal"
            class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
            <h3 class="font-montserrat font-bold text-center">Personal asignado</h3>
            <Info class="absolute top-4 right-4" />
            <hr class="w-full h-[1px] my-4 bg-gray-300 border-0">
            <div id="a-d-p-card" class="flex space-x-4 justify-center">
              <img :src="avatar" alt="perfil_usuario" class="w-16 h-auto" />
              <div id="a-d-p-card-info" class="text-left">
                <h4 class="font-bold">{{ NombrePersonalQueAtiende }}</h4>
                <p>{{ TituloPersonal }}</p>
              </div>
            </div>
          </div>

          <!--Instrucciones-->
          <div id="a-d-instructions"
            class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
            <h3 class="font-montserrat font-bold text-center">Instrucciones</h3>
            <Info class="absolute top-4 right-4" />
            <hr class="w-full h-[1px] my-4 bg-gray-300 border-0">
            <p>{{ mensajeInstrucciones }}</p>
          </div>

          <!--Estado de la cita-->
          <div id="a-d-state" class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
            <h3 class="font-montserrat font-bold text-center">Estado</h3>
            <Info class="absolute top-4 right-4" />
            <hr class="w-full h-[1px] my-4 bg-gray-300 border-0">
            <div class="flex">
              <i>Icono sobre el estado</i>
              <p class="text-start">{{ mensajeEstado }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
    <NavBottom />
  </div>
</template>

<script setup>
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/config/supabase';
import Titulo from '../../components/Titulo.vue';
import TituloH3 from '../../components/TituloH3.vue';
import { Info } from 'lucide-vue-next';
import avatar from '../../assets/imagenes/avatar.png';

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