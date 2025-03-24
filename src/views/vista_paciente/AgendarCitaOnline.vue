<template>
  <NavTop />
  <div id="Schedule_appointment">
    <button @click="router.push('/dashboard-paciente')">Volver</button>
    <Titulo texto="Agendar online" />

    <!-- Calendario siempre abierto -->
    <div class="calendar-container">
      <label>Escoger fecha</label><br>
      <div class="calendar">
        <div class="calendar-header">
          <button @click="prevMonth">«</button>
          <span>{{ months[currentMonth] }} {{ currentYear }}</span>
          <button @click="nextMonth">»</button>
        </div>
        <div class="calendar-body">
          <div class="calendar-day" v-for="day in weekDays" :key="day">{{ day }}</div>
          <div class="calendar-date" v-for="day in blankDays" :key="'blank-' + day"></div>
          <div class="calendar-date" v-for="day in daysInMonth" :key="day"
               :class="{ selected: isSelected(day) }" @click="selectDate(day)">
            {{ day }}
          </div>
        </div>
      </div>
      <p>Fecha seleccionada: {{ selectedDate || 'Ninguna' }}</p>
    </div>

    <!-- Horarios -->
    <label for="hour-option">Escoger horario</label><br>
    <select v-model="hourOption" id="hour-option" required>
      <option value="" disabled selected>Escoger horario</option>
      <option value="7am">07:00 a.m.</option>
      <option value="8am">08:00 a.m.</option>
      <option value="9am">09:00 a.m.</option>
      <option value="10am">10:00 a.m.</option>
      <option value="11am">11:00 a.m.</option>
      <option value="12pm">12:00 p.m.</option>
      <option value="1pm">01:00 p.m.</option>
      <option value="2pm">02:00 p.m.</option>
      <option value="3pm">03:00 p.m.</option>
      <option value="4pm">04:00 p.m.</option>
      <option value="5pm">05:00 p.m.</option>
      <option value="6pm">06:00 p.m.</option>
      <option value="7pm">07:00 p.m.</option>
      <option value="8pm">08:00 p.m.</option>
    </select>

    <!-- Botón agendar -->
    <br>
    <button @click="irAConfirmarCita" class="btn-agendar">Agendar</button>
  </div>
  <NavBottom />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';

// Variables reactivas
const selectedDate = ref('');
const hourOption = ref('');
const router = useRouter();

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// Cálculo de días en el mes
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

// Calcular espacios en blanco antes del primer día del mes
const blankDays = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

// Función para seleccionar la fecha
const selectDate = (day) => {
  selectedDate.value = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Funciones para cambiar de mes
const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};

// Resaltar fecha seleccionada
const isSelected = (day) => {
  return selectedDate.value === `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Función para redirigir a ConfirmarCita.vue
const irAConfirmarCita = () => {
  if (!selectedDate.value || !hourOption.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  router.push({
    path: '/confirmar-cita',
    query: {
      modalidad: 'online', // Tipo de cita
      fecha: selectedDate.value,
      hora: hourOption.value,
    },
  });
};
</script>

<style scoped>
.calendar-container {
  margin-top: 1rem;
}

.calendar {
  border: 1px solid #ccc;
  width: 280px;
  text-align: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  background-color: #f2f2f2;
  padding: 0.5rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 0.5rem;
}

.calendar-day {
  font-weight: bold;
}

.calendar-date {
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
}

.calendar-date:hover {
  background-color: #dfe6e9;
}

.selected {
  background-color: #74b9ff;
  color: white;
}
</style>