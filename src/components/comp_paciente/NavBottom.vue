<template>
  <div id="menu-bottom" class="font-nunito text-white flex space-x-2 w-[90%] fixed bottom-3 left-1/2 -translate-x-1/2 z-10">
    <!--nav-->
    <div id="menu-b-options" class="bg-medblue rounded-full flex w-3/4 items-center justify-center py-2">

      <!-- Inicio -->
      <div id="m-b-home" @click="goTo('InicioPacientes')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2">
        <Home />
        <h3>Inicio</h3>
      </div>

      <!-- Agendar -->
      <div id="m-b-schedule" @click="goTo('AgendarCita')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2">
        <CalendarPlus />
        <h3>Agendar</h3>
      </div>

      <!-- Historial -->
      <div id="m-b-history" @click="goTo('HistorialClinico')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2">
        <ClipboardPlus />
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
  import { Home } from 'lucide-vue-next';
  import { CalendarPlus } from 'lucide-vue-next';
  import { ClipboardPlus } from 'lucide-vue-next';

// Instancia de router
  const router = useRouter();

// Función para redireccionar
  const goTo = (routeName) => {
    router.push({ name: routeName });
};


</script>
