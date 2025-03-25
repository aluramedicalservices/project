<template>
  <div id="vista_inicio_doctores" class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
    <NavTopD />
    <div id="contenedor_inicio" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20">

      <!-- Bienvenida y nombre del paciente -->
      <div id="s-welcome-card" class="flex justify-center font-nunito gap-4">
        <div>
          <img :src="avatar" alt="perfil_usuario" />
        </div>
        <div>
          <p id="plan-label"
            class="text-healingblue bg-healingbluelight inline-block rounded-b-full px-1 text-sm/6">
            {{TipoRol}}ponerRol <!-- Poner aqui el rol del personal (Ej. Doctor, enfermero, etc) -->
          </p>
          <p class="text-noxgrey mb-1">Bienvenido/a de nuevo,</p>
          <p class="text-medblue mb-1 text-xl font-semibold">{{ nombrePersonal }}NombrePersonal</p> <!--Agregar el nombre del doctor aqui-->
        </div>
      </div>

      <!-- Próximas citas (solo si hay citas agendadas) -->
      <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

      <div id="s-upcoming-appointments" class="font-nunito flex flex-col items-center space-y-3">
        <div class="text-center">
          <div @click="$router.push('/#')" class="flex justify-center relative cursor-pointer">
            <TituloH2 texto="Agenda" class="text-center" />
            <ChevronRight class="" />
          </div>
          <p>Hoy es {{ fechaActual }}</p>
        </div>
      </div>

      <!-- Citas agendadas -->
      <div id="appointments-container" class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
          <div id="appointment-info" class="border border-vitalblue rounded-xl shadow-2xs py-2 px-3 bg-vitalblue w-full">
            <h2 class="font-bold text-medblue">Hola{{ TipoDeCita }}</h2> <!--Aqui va el nombre/titulo de la cita-->
            
            <div class="flex space-x-2 space-y-1">
              <Calendar class="w-5 h-5" />
              <p>Hola{{ FechaCita }}</p> <!--Aqui va la fecha de la cita-->
            </div>

            <div class="flex space-x-2 space-y-1">
              <Clock class="w-5 h-5" />
              <p>Hola{{ HoraSalidaACita }}</p> <!--Aqui va la hora de la cita o la hora en que debe salir el personal para llegar a la cita-->
            </div>
          </div>
        </div>

        <button @click="$router.push('/proximas-citas')" class="underline cursor-pointer">
          Ver todas las citas
        </button>
      </div>
      <NavBottomD />
    </div>

</template>

<script setup>

import NavTopD from '../../components/comp_doctor/NavTopD.vue';
import NavBottomD from '../../components/comp_doctor/NavBottomD.vue';
import TituloH2 from '../../components/TituloH2.vue';
import avatar from '../../assets/imagenes/avatar.png';

import { Calendar, Clock, ChevronRight } from 'lucide-vue-next';

</script>