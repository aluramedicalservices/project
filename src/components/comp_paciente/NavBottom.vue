<template>
  <div id="menu-bottom" class="font-nunito text-white flex space-x-1 w-[90%] mx-auto">
    <!--nav-->
    <div id="menu-b-options" class="bg-medblue rounded-full flex w-3/4 items-center justify-center py-2">

      <!-- Inicio -->
      <div id="m-b-home" @click="goTo('InicioPacientes')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-house">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
          <path
            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
        <h3>Inicio</h3>
      </div>

      <!-- Agendar -->
      <div id="m-b-schedule" @click="goTo('AgendarCita')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-calendar-plus">
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
          <path d="M3 10h18" />
          <path d="M16 19h6" />
          <path d="M19 16v6" />
        </svg>
        <h3>Agendar</h3>
      </div>

      <!-- Historial -->
      <div id="m-b-history" @click="goTo('HistorialClinico')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-clipboard-plus">
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M9 14h6" />
          <path d="M12 17v-6" />
        </svg>
        <h3>Historial</h3>
      </div>
    </div>

    <!-- Emergencias -->
    <div id="menu-b-emergency" @click="goTo('InicioPacientes')"
      class="bg-rojo text-noxgrey rounded-full p-3 cursor-pointer w-1/4 flex items-center justify-center">
      <h3>SOS</h3>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

// Instancia de router
const router = useRouter();

// Función para redireccionar
const goTo = (routeName) => {
  router.push({ name: routeName });
};
</script>
