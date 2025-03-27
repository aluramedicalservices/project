<template>
  <div id="menu-bottom" class="font-nunito text-white bg-fondo flex space-x-2 w-full px-3 py-3 fixed bottom-0 z-50">
    <!-- Navegación principal -->
    <div id="menu-b-options" class="bg-medblue rounded-full flex w-3/4 items-center justify-center py-2">
      <!-- Inicio -->
      <div id="m-b-home" @click="goTo('InicioPacientes')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2 space-y-1">
        <Home class="w-5 h-5" />
        <h3 class="text-sm">Inicio</h3>
      </div>

      <!-- Agendar -->
      <div id="m-b-schedule" @click="goTo('AgendarCita')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2 space-y-1">
        <CalendarPlus class="w-5 h-5" />
        <h3 class="text-sm">Agendar</h3>
      </div>

      <!-- Historial -->
      <div id="m-b-history" @click="goTo('HistorialClinico')"
        class="cursor-pointer flex flex-col w-1/3 justify-center items-center py-2 space-y-1">
        <ClipboardPlus class="w-5 h-5" />
        <h3 class="text-sm">Historial</h3>
      </div>
    </div>

    <!-- Botón SOS -->
    <button id="menu-b-emergency" @click="mostrarConfirmacion"
      class="bg-rojo text-noxgrey rounded-full p-3 cursor-pointer w-1/4 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none"
      aria-label="Botón de emergencia SOS">
      <h3 class="text-[24px] font-semibold">SOS</h3>
    </button>

    <!-- Modal de confirmación - Versión corregida para posición -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center z-[1000] p-4 bg-black bg-opacity-70"
          @click.self="cancelarLlamada">
          <div class="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md transform transition-all">
            <div class="p-6 text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">¿Necesitas ayuda de emergencia?</h3>
              <p class="text-gray-600 mb-6">
                Al confirmar, se realizará una llamada inmediata al servicio de emergencias.
              </p>
              <div class="flex justify-center gap-4">
                <button @click="cancelarLlamada" type="button"
                  class="px-6 py-2 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200">
                  Cancelar
                </button>
                <button @click="confirmarLlamada" type="button"
                  class="px-6 py-2 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                  Llamar al 911
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Home, CalendarPlus, ClipboardPlus } from 'lucide-vue-next';

const router = useRouter();
const mostrarModal = ref(false);

const goTo = (routeName) => {
  router.push({ name: routeName });
};

const mostrarConfirmacion = () => {
  // Vibrar el dispositivo si es soportado
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100]);
  }
  mostrarModal.value = true;
};

const confirmarLlamada = () => {
  mostrarModal.value = false;
  // Cambia '911' por el número de emergencia local si es diferente
  window.location.href = 'tel:911';
};

const cancelarLlamada = () => {
  mostrarModal.value = false;
};
</script>

<style scoped>
/* Estilos del menú inferior */
#menu-bottom {
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(5px);
}

/* Estilos del botón SOS */
#menu-b-emergency {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

#menu-b-emergency:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
}

#menu-b-emergency:active {
  transform: scale(0.98);
}

/* Estilos para los iconos de navegación */
#m-b-home,
#m-b-schedule,
#m-b-history {
  transition: all 0.2s ease;
}

#m-b-home:hover,
#m-b-schedule:hover,
#m-b-history:hover {
  transform: translateY(-2px);
}

/* Animaciones para el modal */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>