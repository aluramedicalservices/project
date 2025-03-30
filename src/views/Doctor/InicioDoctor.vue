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
              <span v-if="cita.estaPorComenzar" class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Próxima</span>
            </div>
            <p>Paciente: {{ cita.paciente_nombre || 'No asignado' }}</p>
            <p>Estado: <span :class="claseEstado(cita.status)">{{ formatearEstado(cita.status) }}</span></p>
            
            <!-- Mostrar link de Google Meet para citas online cuando falten 10 min -->
            <div v-if="cita.mostrarMeetLink" class="mt-2 p-2 bg-blue-50 rounded-lg">
              <p class="text-blue-800">La consulta comenzará pronto</p>
              <p class="text-sm">
                <a :href="cita.google_meet_link" target="_blank" class="text-blue-600 underline">Unirse a Google Meet</a>
              </p>
            </div>

            <div class="flex justify-end space-x-2 mt-2">
              <!-- Botón Iniciar Consulta -->
              <button 
                v-if="cita.status === 'agendada' && cita.appointment_type === 'online'"
                @click="iniciarConsulta(cita.id)" 
                class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Iniciar consulta
              </button>
              
              <!-- Botón Continuar Consulta -->
              <button 
                v-if="cita.status === 'en_proceso' && cita.appointment_type === 'online'"
                @click="continuarConsulta(cita.id)" 
                class="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                Continuar consulta
              </button>
              
              <!-- Botón Iniciar Viaje -->
              <button 
                v-if="cita.status === 'agendada' && cita.appointment_type !== 'online'"
                @click="iniciarViaje(cita.id)" 
                class="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Iniciar viaje
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format, parseISO, isToday, toDate, differenceInMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

// Components
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import TituloH2 from '@/components/TituloH2.vue';

// Icons
import { Calendar, Clock } from 'lucide-vue-next';
import avatar from '@/assets/imagenes/avatar.png';

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

const formatearEstado = (estado) => {
  const estados = {
    'agendada': 'Agendada',
    'aceptada': 'Aceptada',
    'rechazada': 'Rechazada',
    'en_proceso': 'En proceso',
    'completada': 'Completada',
    'cancelada': 'Cancelada'
  };
  return estados[estado] || estado;
};

const claseEstado = (estado) => {
  const clases = {
    'agendada': 'text-yellow-600',
    'aceptada': 'text-green-600',
    'rechazada': 'text-red-600',
    'en_proceso': 'text-blue-600',
    'completada': 'text-gray-600',
    'cancelada': 'text-red-400'
  };
  return clases[estado] || 'text-gray-600';
};

// Cargar citas del doctor con verificación de tiempo
const cargarCitasDoctor = async () => {
  try {
    const doctorId = localStorage.getItem('doctorId');
    
    if (!doctorId) {
      router.push('/dashboard-doctor');
      return;
    }

    const hoy = format(new Date(), 'yyyy-MM-dd');
    const ahora = new Date();
    
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
        especialidad,
        google_meet_link,
        ubicacion
      `)
      .eq('doctor_id', doctorId)
      .in('status', ['agendada', 'en_proceso'])
      .gte('appointment_date', hoy)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (error) throw error;

    citasPendientes.value = citas.map(cita => {
      const fechaCita = new Date(`${cita.appointment_date}T${cita.appointment_time}`);
      const minutosRestantes = differenceInMinutes(fechaCita, ahora);
      const mostrarMeetLink = cita.appointment_type === 'online' && minutosRestantes <= 10 && minutosRestantes > 0;
      const estaPorComenzar = minutosRestantes <= 30 && minutosRestantes > 0;
      
      return {
        ...cita,
        paciente_nombre: cita.patients 
          ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
          : 'No asignado',
        mostrarMeetLink,
        estaPorComenzar
      };
    });

    fechaActual.value = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });

  } catch (error) {
    console.error('Error al cargar citas:', error);
    alert('Error al cargar las citas. Inténtalo nuevamente.');
  }
};

const iniciarConsulta = async (citaId) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'en_proceso',
        inicio_consulta: new Date().toISOString()
      })
      .eq('id', citaId);

    if (error) throw error;

    router.push({
      name: 'RegistroCita',
      params: { id: citaId }
    });

  } catch (error) {
    console.error('Error al iniciar consulta:', error);
    alert('Error al iniciar la consulta. Verifica la consola para más detalles.');
  }
};

const continuarConsulta = async (citaId) => {
  try {
    router.push({
      name: 'RegistroCita',
      params: { id: citaId }
    });
  } catch (error) {
    console.error('Error al continuar consulta:', error);
  }
};

const iniciarViaje = async (citaId) => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'en_proceso',
        inicio_consulta: new Date().toISOString()
      })
      .eq('id', citaId);

    if (error) throw error;

    router.push({
      name: 'Viaje',
      params: { id: citaId }
    });

  } catch (error) {
    console.error('Error al iniciar viaje:', error);
  }
};

// Suscripción a cambios en tiempo real y verificación periódica
onMounted(() => {
  cargarCitasDoctor();
  
  // Verificar cada minuto para mostrar notificaciones
  const intervalo = setInterval(cargarCitasDoctor, 60000);
  
  const channel = supabase
    .channel('appointments_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'appointments',
      filter: `doctor_id=eq.${localStorage.getItem('doctorId')}`
    }, () => cargarCitasDoctor())
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
    clearInterval(intervalo);
  };
});
</script>