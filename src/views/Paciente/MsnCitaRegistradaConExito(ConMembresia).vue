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
    <button><a href="#">Ok</a></button>

</template>

<script setup>
import TextoMsn from '../components/TextoMsn.vue';
import TituloH2 from '../../components/TituloH2.vue';
</script>