<template>
    <div id="detalles_cita_dr">
        <Titulo texto="Detalles de cita" />
        <br>
        <div id="contenedor-detalles-cita">
            <div id="info_cita">
                <h2>Información de la cita</h2>
                <ul>
                    <li>Modalidad: {{ modalidad }}</li>
                    <li>Hora de salida: {{ horaAutomatica }}</li>
                    <li>Ubicación: {{ ubicacionPaciente }}</li>
                </ul>
            </div>
            <br>
            <div id="info_paciente">
                <h2>Información del paciente</h2>
                <i>Icono info</i>
                <hr>
                <div id="info_paciente_card">
                    <img src="">
                    <h4>{{ NombrePaciente }}</h4>
                    <button><a href="#">Ver perfil del paciente</a></button>
                </div>
            </div>
            <br>
            <!-- Paso 1: Antes del viaje -->
            <!-- Solo debe mostrarse el boton "Ir al viaje" si no lo ha hecho. Una vez terminado, debe desaparecer -->
            <button><a href="#">Ir al viaje</a></button>
            <br>
            <!-- Paso 2: Despues del viaje y para comenzar la cita-->
            <!-- Solo debe mostrarse el boton "Registrar la cita" si ya terminó el viaje y están en la ubicacion del paciente para comenzar la cita -->
            <br>
            <button><a href="#">Registrar la cita</a></button>
            <!-- Paso 3: Durante y después de la cita -->
            <!-- Solo debe mostrarse el boton "Finalizar cita" si ya hizo al menos 1 registro en "Registr de cita" -->
            <button><a href="#">Finalizar cita</a></button>

            </div>
        </div>
</template>

<script setup>
import Titulo from '../../components/Titulo.vue';
</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>
