<template>
  <div id="menu-bottom" class="font-nunito text-noxgrey bg-fondo flex space-x-2 w-[100%] px-6 py-4 fixed bottom-0 z-10">
    <!--nav-->
    <div id="menu-b-options" class="bg-healingblue rounded-full flex w-full items-center justify-center p-2">

      <!-- Inicio -->
      <div id="m-b-home" @click="goTo('InicioDoctores')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2 space-y-1">
        <Home />
        <h3 class="text-sm">Inicio</h3>
      </div>

      <!-- Calendario -->
      <div id="m-b-schedule" @click="goTo('Calendario')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2 space-y-1">
        <Calendar />
        <h3 class="text-sm">Calendario</h3>
      </div>

      <!-- Historial -->
      <div id="m-b-history" @click="goTo('HistorialCitas')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2 space-y-1">
        <ClipboardPlus />
        <h3 class="text-sm">Historial</h3>
      </div>

      <!-- Pscientes -->
      <div id="m-b-history" @click="goTo('Pacientes')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2 space-y-1">
        <Users />
        <h3 class="text-sm">Pacientes</h3>
      </div>
    </div>

  </div>
</template>

<script setup>
  import { useRouter } from 'vue-router';
  import { Home } from 'lucide-vue-next';
  import { Calendar } from 'lucide-vue-next';
  import { ClipboardPlus } from 'lucide-vue-next';
  import { Users } from 'lucide-vue-next';

// Instancia de router
  const router = useRouter();

// Función para redireccionar
  const goTo = (routeName) => {
    router.push({ name: routeName });
};


</script>
