<template>
  <div id="next_appointments" class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTop />
    <div id="detalles_citas_agendadas"  class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
      <Titulo texto="Detalles de cita" />
      <!-- Detalles de la cita -->
      <div id="appointment-container-info" class="space-y-3">
        <div id="appointment-info" class="border border-vitalblue rounded-xl shadow-2xs py-4 px-6 bg-vitalblue w-full text-center space-y-4">
          <!-- Titulo e info general -->
          <TituloH3 :texto="tituloCita" />
          <ul>
            <li>Modalidad: {{ modalidad }}</li>
            <li>Fecha: {{ formatearFecha(cita.appointment_date) }}</li>
            <li>Hora: {{ horaEscogida }}</li>
            <li>Ubicación: {{ ubicacionPaciente }}</li>
          </ul>

          <!-- Personal asignado -->
          <div id="a-d-personal" class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
            <h3 class="font-montserrat font-bold text-center">Personal asignado</h3>
            <Info class="absolute top-4 right-4" />
            <hr>
            <div id="a-d-p-card" class="flex space-x-4 justify-center">
              <img :src="avatar" alt="perfil_usuario" class="w-16 h-auto" />
              <div id="a-d-p-card-info" class="text-left">
                <h4 class="font-bold">{{ NombrePersonalQueAtiende }}</h4>
                <p>{{ TituloPersonal }}</p>
              </div>
            </div>
          </div>

          <!-- Instrucciones -->
          <div id="a-d-instructions" class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
            <h3 class="font-montserrat font-bold text-center">Instrucciones</h3>
            <Info class="absolute top-4 right-4" />
            <hr>
            <p>{{ mensajeInstrucciones }}</p>
          </div>

          <!-- Estado de la cita -->
          <div id="a-d-state" class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
            <h3 class="font-montserrat font-bold text-center">Estado</h3>
            <Info class="absolute top-4 right-4" />
            <hr>
            <i>Imagen sobre el estado</i>
            <p>{{ mensajeEstado }}</p>
          </div>

          <!-- Botón de cancelar -->
          <button 
            v-if="cita.status === 'agendada'"
            @click="mostrarConfirmacion = true"
            class="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Cancelar Cita
          </button>

          <!-- Modal de confirmación mejorado -->
          <Transition name="fade">
            <div v-if="mostrarConfirmacion" 
                 class="fixed inset-0 z-50 overflow-y-auto"
                 aria-labelledby="modal-title" 
                 role="dialog" 
                 aria-modal="true">
              <!-- Overlay con efecto blur -->
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>

              <!-- Modal container -->
              <div class="flex items-center justify-center min-h-screen p-4">
                <div class="relative bg-white rounded-xl shadow-xl transform transition-all max-w-lg w-full p-6">
                  <!-- Icono de advertencia -->
                  <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  
                  <!-- Contenido del modal -->
                  <div class="text-center">
                    <h3 class="text-xl font-semibold text-gray-900 mb-2" id="modal-title">
                      ¿Está seguro de cancelar la cita?
                    </h3>
                    <p class="text-gray-500 mb-6">
                      Esta acción no se puede deshacer y la fecha quedará disponible para otros pacientes.
                    </p>
                  </div>

                  <!-- Botones -->
                  <div class="flex justify-center space-x-4">
                    <button 
                      @click="mostrarConfirmacion = false"
                      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                    >
                      No, mantener cita
                    </button>
                    <button 
                      @click="cancelarCita"
                      class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                    >
                      Sí, cancelar cita
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <NavBottom class="lg:hidden"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';
import TituloH3 from '../../components/TituloH3.vue';
import { Info } from 'lucide-vue-next';
import avatar from '../../assets/imagenes/avatar.png';

const route = useRoute();
const citaId = route.params.id;

const cita = ref({});
const tituloCita = ref('');
const modalidad = ref('');
const horaEscogida = ref('');
const ubicacionPaciente = ref('Guardada correctamente');
const mensajeEstado = ref('');
const NombrePersonalQueAtiende = ref('');
const TituloPersonal = ref('');
const mensajeInstrucciones = ref('Por favor, confirme su asistencia a la cita 1 hora antes.');

const router = useRouter();
const mostrarConfirmacion = ref(false);

// Función corregida para formatear la fecha con manejo de UTC
const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';

  try {
    // Convertir la fecha UTC a fecha local
    const fechaUTC = new Date(fecha + 'T00:00:00Z');
    const offset = fechaUTC.getTimezoneOffset() * 60000; // offset en milisegundos
    const fechaLocal = new Date(fechaUTC.getTime() + offset);
    
    return format(fechaLocal, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return 'Fecha inválida';
  }
};

// Función para formatear la hora
const formatearHora = (hora) => {
  if (!hora) return '--:--';
  try {
    const fechaHora = new Date(`1970-01-01T${hora}`);
    return format(fechaHora, 'HH:mm');
  } catch (error) {
    console.error('Error al formatear la hora:', error);
    return '--:--';
  }
};

const cancelarCita = async () => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelada' })
      .eq('id', citaId);

    if (error) throw error;

    alert('Cita cancelada exitosamente');
    router.push('/dashboard-paciente'); // Redirige al listado de citas
  } catch (error) {
    console.error('Error al cancelar la cita:', error);
    alert('Error al cancelar la cita. Por favor, inténtelo de nuevo.');
  } finally {
    mostrarConfirmacion.value = false;
  }
};

onMounted(async () => {
  try {
    // Obtener los detalles de la cita
    const { data, error } = await supabase
      .from('appointments')
      .select('*, doctors:doctor_id(nombre_completo, especialidad)')
      .eq('id', citaId)
      .single();

    if (error) throw error;

    cita.value = data;

    // Asignar valores a las variables reactivas
    modalidad.value = data.appointment_type === 'online' ? 'Cita Online' : 'Cita a Domicilio';
    horaEscogida.value = formatearHora(data.appointment_time);
    mensajeEstado.value = data.status === 'agendada' ? 'Cita agendada' : 'Cita confirmada';

    if (data.doctors) {
      NombrePersonalQueAtiende.value = data.doctors.nombre_completo;
      TituloPersonal.value = data.doctors.especialidad;
    }

  } catch (error) {
    console.error('Error al cargar los detalles de la cita:', error);
    alert('Error al cargar los detalles de la cita. Inténtalo de nuevo.');
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>