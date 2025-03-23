<template>
    <div id="vista_citas_agendadas" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
        <NavTop />
        <div id="next_appointments" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20">
            <Titulo texto="Próximas citas"/>
            <!-- Citas agendadas -->
            <div id="citas_agendadas" class="space-y-3">
                <div id="appointments-container" class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
                    <div id="appointment-info" class="border border-vitalblue rounded-xl shadow-2xs py-4 px-3 bg-vitalblue w-full text-center space-y-4">
                        <TituloH3 :texto="tituloCita" />
                        <ul>
                            <li>Modalidad: {{ modalidad }}</li>
                            <li>Hora: {{ horaEscogida }}</li>
                            <li>Ubicación: {{ ubicacionPaciente }}</li>
                        </ul>

                        <div id="a-d-state" class="bg-white border border-vitalblue rounded-xl p-4 space-y-4">
                            <div id="a-d-state" class="bg-white border text-noxgrey border-vitalblue rounded-xl relative">
                                <h3 class="font-montserrat font-bold text-center">Estado</h3>
                                <Info class="absolute right-1 top-1/2 -translate-y-1/2" />
                            </div>

                            <hr>
                            <i>Imagen sobre el estado</i>
                            <p>{{ mensajeEstado }}</p>
                        </div>
                        <a href="#" class="underline">Ver más información de la cita</a>
                    </div>
                </div>
            </div>
        </div>
        <NavBottom />
    </div>
</template>

<script setup>
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import { ref } from 'vue';
import Titulo from '../../components/Titulo.vue';
import TituloH3 from '../../components/TituloH3.vue';
import { Info } from 'lucide-vue-next';

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
