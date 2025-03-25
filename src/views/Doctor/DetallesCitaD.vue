<template>
    <div id="vista_detallescita_dashboardmedico"
        class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
        <NavTopD />
        <div id="detalles_cita_dr" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20 pb-32">
            <Titulo texto="Detalles de cita" />
            <!-- Detalles de la cita -->
            <div id="appointment-container-info" class="space-y-3">
                <div id="appointments-container"
                    class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
                    <div id="appointment-info"
                        class="border border-vitalblue rounded-xl shadow-2xs py-4 px-6 bg-vitalblue w-full text-center space-y-4">

                        <!--Titulo e info general-->
                        <TituloH3 :texto="tituloCita" /> <!--Agregar titulo/tipo de cita -->
                        <ul>
                            <li><span class="font-bold">Modalidad: </span> {{ modalidad }}</li>
                            <li><span class="font-bold">Hora: </span> {{ horaEscogida }}</li>
                            <li><span class="font-bold">Ubicación: </span> {{ ubicacionPaciente }}</li>
                        </ul>

                        <!--Personal asignado-->
                        <div id="a-d-personal"
                            class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
                            <h3 class="font-montserrat font-bold text-center">Paciente</h3>
                            <ChevronRight class="absolute top-4 right-4" />
                            <hr class="w-full h-[1px] my-4 bg-gray-300 border-0">
                            <div id="a-d-p-card" class="flex space-x-4 justify-center">
                                <img :src="avatar" alt="perfil_usuario" class="w-16 h-auto" />
                                <div id="a-d-p-card-info" class="text-left">
                                    <h4 class="font-bold">{{ NombrePaciente }}NombrePaciente</h4> <!--Agregar Nombre del paciente-->
                                    <p>{{ TelPaciente }}(664) 107 8075</p> <!--Agregar Numero de tel del paciente-->
                                </div>
                            </div>
                        </div>

                        <!--Estado de la cita-->
                        <div id="a-d-state"
                            class="bg-white border text-noxgrey border-vitalblue rounded-xl relative p-4 space-y-4">
                            <h3 class="font-montserrat font-bold text-center">Estado</h3>
                            <Info class="absolute top-4 right-4" />
                            <hr class="w-full h-[1px] my-4 bg-gray-300 border-0">
                            <div class="flex">
                                <i>Icono sobre el estado</i>
                                <p class="text-start">{{ mensajeEstado }}EstadoDeLaCita</p> <!--Estado de la cita-->
                            </div>
                        </div>

                        <!--Boton para Antes del viaje: solo debe mostrarse si no se ha comenzado el viaje aun (ver el figma)-->
                        <BotonMorado texto="Ir al viaje" />

                        <!--Boton para Antes del viaje: solo debe mostrarse si no se ha comenzado el viaje aun (ver el figma)-->
                        <BotonMorado texto="Ir a registrar cita" />
                    </div>
                </div>
            </div>

            <!--Pendiente de ajustar
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
                 Paso 1: Antes del viaje 
                Solo debe mostrarse el boton "Ir al viaje" si no lo ha hecho. Una vez terminado, debe desaparecer
                <button><a href="#">Ir al viaje</a></button>
                <br>
                Paso 2: Despues del viaje y para comenzar la cita
                 Solo debe mostrarse el boton "Registrar la cita" si ya terminó el viaje y están en la ubicacion del paciente para comenzar la cita 
                <br>
                <button><a href="#">Registrar la cita</a></button>
                Paso 3: Durante y después de la cita
                Solo debe mostrarse el boton "Finalizar cita" si ya hizo al menos 1 registro en "Registr de cita"
                <button><a href="#">Finalizar cita</a></button>

            </div>
            -->
        </div>
        <NavBottomD />
    </div>
</template>

<script setup>
import NavTopD from '../../components/comp_doctor/NavTopD.vue';
import Titulo from '../../components/Titulo.vue';
import TituloH3 from '../../components/TituloH3.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import { ChevronRight } from 'lucide-vue-next';
import { Info } from 'lucide-vue-next';
import avatar from '../../assets/imagenes/avatar.png';
import BotonMorado from '@/components/BotonMorado.vue';

</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>