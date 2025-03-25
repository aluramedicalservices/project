<template>
  <div id="vista_inicio_doctores" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
    <NavTopD />
    <div id="contenedor_inicio" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20">

      <!-- Bienvenida y nombre del doctor -->
      <div id="s-welcome-card" class="flex justify-center font-nunito gap-4">
        <div>
          <img :src="avatar" alt="perfil_usuario" class="w-16 h-16 rounded-full" />
        </div>
        <div>
          <p id="plan-label" class="text-healingblue bg-healingbluelight rounded-b-full inline-block px-3 py-1 text-center">
            {{ especialidadDoctor }}
          </p>
          <p class="text-noxgrey mb-1">Bienvenido/a de nuevo,</p>
          <p class="text-medblue mb-1 text-xl font-semibold">{{ nombreDoctor }}</p>
        </div>
      </div>

      <!-- Próximas citas -->
      <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

      <div id="s-upcoming-appointments" class="font-nunito flex flex-col items-center space-y-3" v-if="citasPendientes.length > 0">
        <div class="text-center">
          <TituloH2 texto="Citas Agendadas" />
          <p>Hoy es {{ fechaActual }}</p>
        </div>

        <!-- Citas agendadas -->
        <div id="appointments-container" class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
          <div v-for="cita in citasPendientes" :key="cita.id" class="border border-vitalblue rounded-xl shadow-2xs py-2 px-3 bg-white w-full">
            <h2 class="font-bold text-medblue">{{ obtenerTipoCita(cita.appointment_type) }}</h2>
            <div class="flex items-center space-x-2">
              <Calendar class="w-5 h-5 text-gray-600" />
              <p>{{ formatearFecha(cita.appointment_date) }}</p>
              <span v-if="esHoy(cita.appointment_date)" class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Hoy</span>
            </div>
            <div class="flex items-center space-x-2">
              <Clock class="w-5 h-5 text-gray-600" />
              <p>{{ formatearHora(cita.appointment_time) }}</p>
            </div>
            <p>Paciente: {{ cita.paciente_nombre || 'No asignado' }}</p>
            <p>Estado: <span class="text-blue-600">{{ cita.status }}</span></p>
            <div class="flex justify-end space-x-2 mt-2">
              <button @click="aceptarCita(cita.id)" 
                      class="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors">
                Aceptar
              </button>
              <button @click="rechazarCita(cita.id)" 
                      class="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200 transition-colors">
                Rechazar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-gray-500">No tienes citas agendadas pendientes</p>
      </div>
    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format, parseISO, isToday, toDate } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import NavTopD from '../../components/comp_doctor/NavTopD.vue';
import NavBottomD from '../../components/comp_doctor/NavBottomD.vue';
import TituloH2 from '../../components/TituloH2.vue';

// Icons
import { Calendar, Clock } from 'lucide-vue-next';
import avatar from '../../assets/imagenes/avatar.png';

const nombreDoctor = ref(localStorage.getItem('doctorNombre') || 'Doctor');
const especialidadDoctor = ref(localStorage.getItem('doctorEspecialidad') || 'Especialidad');
const fechaActual = ref('');
const citasPendientes = ref([]);
const router = useRouter();

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

// Cargar citas del doctor
const cargarCitasDoctor = async () => {
  try {
    const doctorId = localStorage.getItem('doctorId');
    
    if (!doctorId) {
      router.push('/dashboard-doctor');
      return;
    }

    const hoy = format(new Date(), 'yyyy-MM-dd');
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
        especialidad
      `)
      .eq('doctor_id', doctorId)
      .eq('status', 'agendada')
      .gte('appointment_date', hoy)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) throw error;

    // Procesar las citas para incluir nombre completo
    citasPendientes.value = citas.map(cita => ({
      ...cita,
      paciente_nombre: cita.patients 
        ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
        : 'No asignado'
    }));

    fechaActual.value = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });

  } catch (error) {
    console.error('Error al cargar citas:', error);
    alert('Error al cargar las citas. Inténtalo nuevamente.');
  }
};

// Acciones sobre citas
const aceptarCita = async (citaId) => {
  try {
    await supabase
      .from('appointments')
      .update({ status: 'aceptada' })
      .eq('id', citaId);
    
    await cargarCitasDoctor();
  } catch (error) {
    console.error('Error al aceptar cita:', error);
  }
};

const rechazarCita = async (citaId) => {
  try {
    await supabase
      .from('appointments')
      .update({ status: 'rechazada' })
      .eq('id', citaId);
    
    await cargarCitasDoctor();
  } catch (error) {
    console.error('Error al rechazar cita:', error);
  }
};

onMounted(() => {
  cargarCitasDoctor();
});
</script>

<style scoped>
/* Tus estilos existentes */
</style>