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
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '@/config/supabase';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';

const router = useRouter();
const route = useRoute();

// Lista de valores permitidos para "appointment_type"
const tiposPermitidos = ["online", "domicilio", "especialista"];

// Obtener los datos de la cita desde los parámetros de la ruta
const fechaSeleccionada = ref(route.query.fecha || 'Pendiente');
const hourOption = ref(route.query.hora || 'Pendiente');
const appointmentType = ref(route.query.modalidad || 'Pendiente');
const metodoPago = ref(route.query.metodoPago || '');
const especialidad = ref(route.query.especialidad || '');

// Función para convertir la hora a formato de 24 horas (HH:MM:SS)
const convertirHora = (hora) => {
  if (!hora) return null;
  const match = hora.match(/^(\d{1,2}):?(\d{2})?\s?(AM|PM)?$/i);
  if (!match) return null;

  let [_, horas, minutos, periodo] = match;
  horas = parseInt(horas, 10);
  minutos = minutos ? minutos.padStart(2, "0") : "00";

  if (periodo && periodo.toUpperCase() === "PM" && horas !== 12) {
    horas += 12;
  } else if (periodo && periodo.toUpperCase() === "AM" && horas === 12) {
    horas = 0;
  }

  return `${horas.toString().padStart(2, "0")}:${minutos}:00`;
};

const confirmarCita = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    alert('Debes iniciar sesión para agendar una cita.');
    return;
  }

  // Validar el tipo de cita
  if (!tiposPermitidos.includes(appointmentType.value.toLowerCase())) {
    alert(`Error: Tipo de cita inválido (${appointmentType.value}).`);
    return;
  }

  // Datos de la cita a guardar en la base de datos
  const citaData = {
    user_id: user.id,
    appointment_type: appointmentType.value.toLowerCase(),
    appointment_date: fechaSeleccionada.value,
    appointment_time: convertirHora(hourOption.value),
    status: 'agendada',
    doctor_id: null,
  };

  if (metodoPago.value) citaData.metodo_pago = metodoPago.value;
  if (especialidad.value) citaData.especialidad = especialidad.value;

  try {
    // Insertar la cita en la base de datos
    const { error } = await supabase.from('appointments').insert([citaData]);

    if (error) {
      console.error('Error al agendar la cita:', error);
      alert(`Error al agendar la cita: ${error.message}`);
    } else {
      alert(`Cita confirmada para el ${fechaSeleccionada.value} a las ${convertirHora(hourOption.value)}.`);
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
