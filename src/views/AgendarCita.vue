<template>
    <NavTop />
    <div id="Schedule_appointment">
        <Titulo texto="Agendar cita" />

        <!-- Tipo de consulta -->
        <label for="appointment_type">Escoger tipo de consulta</label><br>
        <select v-model="appointment_type" id="appointment_type" required>
            <option value="" disabled selected>Escoger tipo de consulta</option>
            <option value="asesoria">Asesoría médica</option>
            <option value="enfermeria">Cita con enfermería</option>
            <option value="especialista">Cita con especialista</option>
        </select>

        <!-- Calendario -->
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
            <option v-for="hour in availableHours" :key="hour" :value="hour">{{ hour }}</option>
        </select>

        <!-- Botón agendar -->
        <br>
        <button @click="agendarCita" class="btn-agendar">Agendar</button>
    </div>
    <NavBottom />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import NavTop from '../components/NavTop.vue';
import NavBottom from '../components/NavBottom.vue';
import Titulo from '../components/Titulo.vue';

// Variables reactivas
const appointment_type = ref('');
const selectedDate = ref('');
const hourOption = ref('');
const router = useRouter();
const user = ref(null); // Almacena la sesión del usuario

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth());

const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];


// Horarios disponibles
const availableHours = [
    "07:00 a.m.", "08:00 a.m.", "09:00 a.m.", "10:00 a.m.",
    "11:00 a.m.", "12:00 p.m.", "01:00 p.m.", "02:00 p.m.",
    "03:00 p.m.", "04:00 p.m.", "05:00 p.m.", "06:00 p.m.",
    "07:00 p.m.", "08:00 p.m."
];

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

// Cargar usuario autenticado
const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    user.value = user;
};

// Función para agendar la cita
const agendarCita = async () => {
    if (!appointment_type.value || !selectedDate.value || !hourOption.value) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    if (!user.value) {
        alert("Debes iniciar sesión para agendar una cita.");
        return;
    }

    const { data, error } = await supabase
        .from('appointments')
        .insert([
            {
                user_id: user.value.id,
                appointment_type: appointment_type.value,
                appointment_date: selectedDate.value,
                appointment_time: hourOption.value
            }
        ]);

    if (error) {
        alert('Error al agendar la cita: ' + error.message);
    } else {
        alert('Cita agendada con éxito');
        router.push('/citas'); // Redirige al usuario después de agendar
    }
};

// Cargar usuario al montar el componente
getUser();
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