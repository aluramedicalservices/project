<template>
  <NavTop />
  <div class="main-spacing">
    <div class="page-container">
      <div id="Confirm_appointment" class="p-4 max-w-2xl mx-auto">
        <Titulo :texto="tituloConfirmacion" class="titulo-confirmacion" />

        <div class="confirmation-card">
          <div class="space-y-3 text-lg">
            <!-- Fecha -->
            <div class="info-item">
              <span class="material-icons-round icon">event</span>
              <span>Fecha: <strong>{{ formattedDate }}</strong></span>
            </div>
            
            <!-- Hora -->
            <div class="info-item">
              <span class="material-icons-round icon">schedule</span>
              <span>Hora: <strong>{{ route.query.hora }} hrs</strong></span>
            </div>
            
            <!-- Profesional asignado -->
            <div class="info-item">
              <span class="material-icons-round icon">person</span>
              <span>Profesional: <strong>{{ nombreProfesional }}</strong></span>
            </div>
            
            <!-- Tipo de cita -->
            <div class="info-item">
              <span class="material-icons-round icon">computer</span>
              <span>Modalidad: <strong>{{ tipoCitaFormateado }}</strong></span>
            </div>

            <!-- Enlace de Google Meet (solo para online) -->
            <div v-if="tipoCita === 'online'" class="info-item">
              <span class="material-icons-round icon">video_camera_front</span>
              <span>Enlace de Google Meet: <strong><a :href="googleMeetLink" target="_blank">{{ googleMeetLink }}</a></strong></span>
            </div>

            <!-- Especialidad (solo para especialista) -->
            <div v-if="tipoCita === 'especialista'" class="info-item">
              <span class="material-icons-round icon">medical_services</span>
              <span>Especialidad: <strong>{{ route.query.especialidad || 'No especificada' }}</strong></span>
            </div>

            <!-- Método de pago (solo para domicilio) -->
            <div v-if="tipoCita === 'domicilio' && route.query.metodoPago" class="info-item">
              <span class="material-icons-round icon">payment</span>
              <span>Método de pago: <strong>{{ metodoPagoFormateado }}</strong></span>
            </div>

            <!-- Ubicación (solo para domicilio) -->
            <div v-if="tipoCita === 'domicilio'" class="info-item">
              <span class="material-icons-round icon">location_on</span>
              <span>Ubicación: <strong>{{ route.query.ubicacion || 'No especificada' }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="button-container">
          <button @click="cancelarCita" class="btn-cancelar">Cancelar</button>
          <button @click="confirmarCita" class="btn-confirmar">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
  <NavBottom />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/config/supabase';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';

const router = useRouter();
const route = useRoute();

// Datos de la cita
const nombreProfesional = ref('');
const doctorId = ref(null);
const tipoCita = computed(() => route.query.modalidad || 'online');
const googleMeetLink = ref('');

// Título dinámico
const tituloConfirmacion = computed(() => {
  return tipoCita.value === 'especialista' 
    ? 'Confirmar cita con especialista' 
    : 'Confirmar cita';
});

// Formateadores
const formattedDate = computed(() => {
  if (!route.query.fecha) return 'Fecha no seleccionada';
  const fechaLocal = parseISO(route.query.fecha + 'T00:00:00');
  return format(fechaLocal, "d 'de' MMMM 'de' yyyy", { locale: es });
});

const tipoCitaFormateado = computed(() => {
  const tipos = {
    'online': 'Consulta Online',
    'domicilio': 'Visita a Domicilio',
    'especialista': 'Consulta con Especialista'
  };
  return tipos[tipoCita.value] || tipoCita.value;
});

const metodoPagoFormateado = computed(() => {
  return route.query.metodoPago === 'efectivo' ? 'Efectivo' : 'Tarjeta';
});

// Función para generar enlace de Google Meet
const generateGoogleMeetLink = () => {
  const randomString = Math.random().toString(36).substring(2, 15);
  return `https://meet.google.com/${randomString}`;
};

// Obtener profesional según tipo de cita
const obtenerProfesional = async () => {
  try {
    if (tipoCita.value === 'especialista') {
      nombreProfesional.value = route.query.doctorNombre || 'Especialista no asignado';
      doctorId.value = route.query.doctorId || null;
      return;
    }

    const profesionales = {
      online: {
        nombre: 'María José Alvarado Escobar',
        email: 'mariajoseae19@gmail.com'
      },
      domicilio: {
        nombre: 'Juan José Moreno Argueta',
        email: 'canamash83@gmail.com'
      }
    };

    const profesional = profesionales[tipoCita.value];
    if (!profesional) return;

    const { data, error } = await supabase
      .from('doctors')
      .select('id, nombre_completo')
      .eq('correo', profesional.email)
      .single();

    if (error) throw error;
    
    nombreProfesional.value = data.nombre_completo;
    doctorId.value = data.id;
  } catch (error) {
    console.error('Error al asignar profesional:', error);
    alert('Error al cargar información del profesional');
    router.push('/dashboard-paciente');
  }
};

// Confirmar cita en Supabase
const confirmarCita = async () => {
  try {
    if (!doctorId.value || !route.query.fecha || !route.query.hora) {
      throw new Error('Datos incompletos');
    }

    const { data: citasExistentes, error: errorCitas } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId.value)
      .eq('appointment_date', route.query.fecha)
      .eq('appointment_time', route.query.hora + ':00')
      .neq('status', 'cancelada');

    if (citasExistentes?.length > 0) {
      alert('Horario no disponible');
      return;
    }

    // Generar enlace de Google Meet solo para citas online
    let meetLink = '';
    if (tipoCita.value === 'online') {
      meetLink = generateGoogleMeetLink();
    }

    const citaData = {
      user_id: (await supabase.auth.getUser()).data.user.id,
      doctor_id: doctorId.value,
      appointment_type: tipoCita.value,
      appointment_date: route.query.fecha,
      appointment_time: route.query.hora + ':00',
      status: 'agendada',
      created_at: new Date().toISOString(),
      google_meet_link: meetLink || null,
      direccion: tipoCita.value === 'domicilio' ? route.query.ubicacion : null // Cambiado de 'location' a 'direccion'
    };

    if (tipoCita.value === 'domicilio') {
      citaData.metodo_pago = route.query.metodoPago || null;
    }

    if (tipoCita.value === 'especialista') {
      citaData.especialidad = route.query.especialidad || null;
    }

    const { error } = await supabase.from('appointments').insert([citaData]);

    if (error) throw error;

    alert('Cita agendada correctamente');
    router.push('/dashboard-paciente');
  } catch (error) {
    console.error('Error al guardar cita:', error);
    alert(error.message || 'Error al guardar la cita');
  }
};

const cancelarCita = () => {
  router.push('/dashboard-paciente');
};

// Inicialización
onMounted(() => {
  obtenerProfesional();
  if (tipoCita.value === 'online') {
    googleMeetLink.value = generateGoogleMeetLink();
  }
});
</script>

<style scoped>
.page-container {
  background: linear-gradient(135deg, #F0F9FE 0%, #E0F9FC 100%);
  min-height: calc(100vh - 120px);
  padding: 1rem;
  width: 100%;
}

.titulo-confirmacion {
  color: #5B5EA7;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.75rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(91, 94, 167, 0.1);
}

.confirmation-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(118, 199, 208, 0.15);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 2px solid #E0F9FC;
  transition: all 0.3s ease;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, #F0F9FE, #E0F9FC);
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  gap: 0.75rem;
  border: 1px solid rgba(118, 199, 208, 0.2);
}

.info-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(91, 94, 167, 0.1);
}

.icon {
  color: #5B5EA7;
  font-size: 1.25rem;
  flex-shrink: 0;
  width: 24px;
}

.button-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-direction: column-reverse;
  padding: 0 1rem;
}

.btn-confirmar, .btn-cancelar {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.btn-confirmar {
  background: linear-gradient(135deg, #5B5EA7 0%, #76C7D0 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(91, 94, 167, 0.2);
}

.btn-cancelar {
  background: white;
  color: #5B5EA7;
  border: 2px solid #5B5EA7;
  box-shadow: 0 4px 15px rgba(91, 94, 167, 0.1);
}

.btn-confirmar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 94, 167, 0.3);
  background: linear-gradient(135deg, #76C7D0 0%, #5B5EA7 100%);
}

.btn-cancelar:hover {
  background: #F0F9FE;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 94, 167, 0.15);
}

.btn-confirmar:active, .btn-cancelar:active {
  transform: translateY(1px);
}

a {
  color: #76C7D0;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

a:hover {
  color: #5B5EA7;
  text-decoration: underline;
}

/* Media Queries */
@media (min-width: 640px) {
  .button-container {
    flex-direction: row;
    justify-content: flex-end;
  }

  .btn-confirmar, .btn-cancelar {
    width: auto;
    min-width: 160px;
    padding: 1rem 2rem;
  }
}

@media (min-width: 480px) {
  .page-container {
    padding: 1.5rem;
  }

  .confirmation-card {
    padding: 1.5rem;
  }

  .info-item {
    font-size: 1rem;
    padding: 0.875rem;
  }
}

@media (min-width: 768px) {
  .confirmation-card {
    padding: 2rem;
  }

  .info-item {
    padding: 1rem;
    font-size: 1.125rem;
  }

  .titulo-confirmacion {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .page-container {
    padding: 2.5rem;
  }

  #Confirm_appointment {
    max-width: 900px;
  }

  .info-item:hover {
    transform: translateX(5px);
    background-color: #E0F9FC;
  }
}

/* Ajustes para pantallas muy pequeñas */
@media (max-width: 360px) {
  .info-item {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  .confirmation-card {
    padding: 1rem;
  }

  .titulo-confirmacion {
    font-size: 1.25rem;
  }
}
</style>