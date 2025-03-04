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
                <span class="icon">🩺</span> Modalidad: <strong>{{ appointment_type }}</strong>
            </li>
            <li>
                <span class="icon">📍</span> Ubicación: <strong>{{ ubicacionPaciente || 'Pendiente' }}</strong>
            </li>
            <li>
                <span class="icon">👨‍⚕️</span> Personal: <strong>{{ personal || 'Pendiente' }}</strong>
            </li>
        </ul>

        <hr />

        <!-- Botones de confirmación y cancelación -->
        <div class="buttons">
            <button @click="confirmarCita" class="btn-confirmar">Confirmar</button>
            <button @click="cancelarCita" class="btn-cancelar">Cancelar</button>
        </div>
    </div>
    <NavBottom />
</template>

<script>
import NavTop from '../../components/Paciente/NavTop.vue';
import NavBottom from '../../components/Paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';

export default {
    components: {
        Titulo,
        NavTop,
        NavBottom
    },
    data() {
        return {
            // Los datos vienen de la vista Agendar cita
            appointment_type: '',
            fechaSeleccionada: null,
            hourOption: '',
            ubicacionPaciente: '',  // Para ser llenado más tarde
            personal: ''  // Para ser llenado más tarde
        };
    },
    methods: {
        confirmarCita() {
            // Confirmar la cita
            alert(`Cita confirmada para el ${this.fechaSeleccionada} a las ${this.hourOption} en modalidad de ${this.appointment_type}.`);
        },
        cancelarCita() {
            // Redirigir a la vista de agendar cita o simplemente limpiar los campos
            this.$router.push('/agendar-cita');  // Suponiendo que tienes una ruta para esta vista
        },
    }
};
</script>

<style scoped></style>
