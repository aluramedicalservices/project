<template>
  <NavTop />
  <div id="Confirm_appointment" class="p-4 max-w-2xl mx-auto">
    <Titulo texto="Confirmar cita" />

    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="space-y-4 text-lg">
        <!-- Fecha corregida (manejo de zona horaria) -->
        <div class="flex items-center">
          <span class="mr-2">📅</span>
          <span>Fecha: <strong>{{ formattedDate }}</strong></span>
        </div>
        
        <!-- Hora -->
        <div class="flex items-center">
          <span class="mr-2">⏰</span>
          <span>Hora: <strong>{{ route.query.hora }} hrs</strong></span>
        </div>
        
        <!-- Profesional asignado -->
        <div class="flex items-center">
          <span class="mr-2">👩⚕️</span>
          <span>Profesional: <strong>{{ nombreProfesional }}</strong></span>
        </div>
        
        <!-- Tipo de cita -->
        <div class="flex items-center">
          <span class="mr-2">💻</span>
          <span>Modalidad: <strong>{{ tipoCitaFormateado }}</strong></span>
        </div>

        <!-- Método de pago (solo para domicilio) -->
        <div v-if="route.query.metodoPago" class="flex items-center">
          <span class="mr-2">💳</span>
          <span>Método de pago: <strong>{{ metodoPagoFormateado }}</strong></span>
        </div>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex gap-4 justify-end">
      <button @click="cancelarCita" class="btn-cancelar">Cancelar</button>
      <button @click="confirmarCita" class="btn-confirmar">Confirmar</button>
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

const router = useRouter();
const route = useRoute();

// Datos de la cita
const nombreProfesional = ref('');
const doctorId = ref(null);
const tipoCita = computed(() => route.query.modalidad || 'online');

// Formatear fecha corrigiendo zona horaria
const formattedDate = computed(() => {
  if (!route.query.fecha) return 'Fecha no seleccionada';
  const fechaLocal = parseISO(route.query.fecha + 'T00:00:00'); // Fuerza zona horaria local
  return format(fechaLocal, "d 'de' MMMM 'de' yyyy", { locale: es });
});

// Asignar profesional según tipo de cita
const obtenerProfesional = async () => {
  try {
    let nombre;
    if (tipoCita.value === 'online') {
      nombre = 'María José Alvarado Escobar'; // Enfermera para online
    } else {
      nombre = 'Juan José Moreno Argueta'; // Cambiar por el nombre real
    }

    const { data, error } = await supabase
      .from('doctors')
      .select('id, nombre_completo')
      .eq('nombre_completo', nombre)
      .single();

    if (error) throw error;
    
    nombreProfesional.value = data.nombre_completo;
    doctorId.value = data.id;
  } catch (error) {
    alert('Error al asignar profesional');
    router.push('/dashboard-paciente');
  }
};

// Confirmar cita en Supabase
const confirmarCita = async () => {
  try {
    // Validar campos
    if (!doctorId.value || !route.query.fecha || !route.query.hora) {
      throw new Error('Datos incompletos');
    }

    // Verificar disponibilidad
    const { data: citasExistentes, error: errorCitas } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId.value)
      .eq('appointment_date', route.query.fecha)
      .eq('appointment_time', route.query.hora + ':00');

    if (citasExistentes?.length > 0) {
      alert('Horario no disponible');
      return;
    }

    // Insertar cita
    const { error } = await supabase.from('appointments').insert([{
      user_id: (await supabase.auth.getUser()).data.user.id,
      doctor_id: doctorId.value,
      appointment_type: tipoCita.value,
      appointment_date: route.query.fecha,
      appointment_time: route.query.hora + ':00',
      status: 'agendada',
      metodo_pago: route.query.metodoPago || null,
      created_at: new Date().toISOString()
    }]);

    if (error) throw error;

    alert('Cita agendada correctamente');
    router.push('/dashboard-paciente');
  } catch (error) {
    alert(error.message || 'Error al guardar la cita');
  }
};

// Inicialización
onMounted(() => obtenerProfesional());
</script>

<style scoped>
.btn-confirmar {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
}

.btn-cancelar {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
}
</style>