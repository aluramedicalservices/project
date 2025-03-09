<template>
  <NavTop />
  <div id="Confirm_appointment">
    <Titulo texto="Confirmar cita" />

    <ul>
      <li>
        <span class="icon">📅</span> Fecha: <strong>{{ fechaSeleccionada }}</strong>
      </li>
      <li>
        <span class="icon">⏰</span> Hora: <strong>{{ hourOption }}</strong>
      </li>
      <li>
        <span class="icon">🩺</span> Modalidad: <strong>{{ appointmentType }}</strong>
      </li>
      <li v-if="metodoPago">
        <span class="icon">💳</span> Método de Pago: <strong>{{ metodoPago }}</strong>
      </li>
      <li v-if="especialidad">
        <span class="icon">👨‍⚕️</span> Especialidad: <strong>{{ especialidad }}</strong>
      </li>
    </ul>

    <hr />

    <div class="buttons">
      <button @click="confirmarCita" class="btn-confirmar">Confirmar</button>
      <button @click="cancelarCita" class="btn-cancelar">Cancelar</button>
    </div>
  </div>
  <NavBottom />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/config/supabase';
import NavTop from '../../components/Paciente/NavTop.vue';
import NavBottom from '../../components/Paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';

const router = useRouter();
const route = useRoute();

// Obtener los datos de la cita desde los parámetros de la ruta
const fechaSeleccionada = ref(route.query.fecha || 'Pendiente');
const hourOption = ref(route.query.hora || 'Pendiente');
const appointmentType = ref(route.query.modalidad || 'Pendiente');
const metodoPago = ref(route.query.metodoPago || '');
const especialidad = ref(route.query.especialidad || '');

const confirmarCita = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    alert('Debes iniciar sesión para agendar una cita.');
    return;
  }

  // Datos de la cita a guardar en la base de datos
  const citaData = {
    user_id: user.id,
    appointment_type: appointmentType.value,
    appointment_date: fechaSeleccionada.value,
    appointment_time: hourOption.value,
    status: 'scheduled', // Estado inicial
    doctor_id: null, // Inicialmente no tiene doctor asignado
  };

  // Agregar método de pago si está presente
  if (metodoPago.value) {
    citaData.metodo_pago = metodoPago.value;
  }

  // Agregar especialidad si está presente
  if (especialidad.value) {
    citaData.especialidad = especialidad.value;
  }

  try {
    // Insertar la cita en la base de datos
    const { error } = await supabase.from('appointments').insert([citaData]);

    if (error) {
      console.error('Error al agendar la cita:', error);
      alert(`Error al agendar la cita: ${error.message}`);
    } else {
      alert(`Cita confirmada para el ${fechaSeleccionada.value} a las ${hourOption.value}.`);
      router.push('/dashboard-paciente'); // Redirigir al dashboard del paciente
    }
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('Hubo un problema inesperado al agendar la cita. Inténtalo de nuevo.');
  }
};

const cancelarCita = () => {
  router.push('/agendar-cita'); // Redirigir al formulario de agendar cita
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

.icon {
  margin-right: 5px;
}

.btn-confirmar {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-confirmar:hover {
  background-color: #0056b3;
}

.btn-cancelar {
  background-color: #dc3545;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-cancelar:hover {
  background-color: #c82333;
}
</style>