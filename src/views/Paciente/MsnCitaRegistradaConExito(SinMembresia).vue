<template>
    <TituloH2 texto="¡Su cita fue reservada con éxito!" />
    <p>{{ fechaDeCita }}</p>
    <br>
    <TextoMsn texto="
    Modalidad: 
    Hora:
    Personal: 
    Ubicación: " />
    <br>
    <hr>
    <br>
    <p>Por favor, pague la cita para que podamos confirmarla.</p>
    <br>
    <button><a href="#">Ir al portal de pagos</a></button>
    <button><a href="#">Cerrar</a></button>
</template>

<script setup>
import TextoMsn from '../components/TextoMsn.vue';
import TituloH2 from '../../components/TituloH2.vue';
</script>