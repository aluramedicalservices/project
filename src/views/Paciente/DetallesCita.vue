<template>
    <NavTop />
    <div id="next_appointments">
        <Titulo texto="Próximas citas" />
        <div id="appointment-description">
            <h2>{{ tituloCita }}</h2>
            <ul>
                <li>Modalidad: {{ modalidad }}</li>
                <li>Hora: {{ horaEscogida }}</li>
                <li>Ubicación: {{ ubicacionPaciente }}</li>
            </ul>
            <div id="a-d-personal">
                <h3>Personal asignado</h3>
                <i>Icono info</i>
                <hr>
                <div id="a-d-p-card">
                    <img src="">
                    <h4>{{ NombrePersonalQueAtiende}}</h4>
                    <p>{{ TituloPersonal }}</p>
                </div>
            </div>
            <div id="a-d-instrcutions">
                <h3>Instrucciones</h3>
                <i>Icono info</i>
                <hr>
                <p>{{ mensajeInstrucciones }}</p>
            </div>
            <div id="a-d-state">
                <h3>Estado</h3>
                <i>Icono info</i>
                <hr>
                <i>Icono estado</i>
                <p>{{ mensajeEstado }}</p>
            </div>
            <a href="#">Ver más información de la cita</a>
        </div>
    </div>
    <NavBottom />
</template>

<script setup>
import NavTop from '../../components/Paciente/NavTop.vue';
import NavBottom from '../../components/Paciente/NavBottom.vue';
import { ref } from 'vue';
import Titulo from '../../components/Titulo.vue';

// Variables reactivas
const tituloCita = ref('Consulta Médica');
const modalidad = ref('Presencial');
const horaEscogida = ref('10:00 AM');
const ubicacionPaciente = ref('Clínica Central');
const mensajeEstado = ref('La cita está confirmada');
</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>
