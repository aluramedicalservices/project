<template>
  <div id="component_popup" class="font-nunito text-noxgrey">
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl p-6 w-80 text-center relative">
      <!-- Icono variable -->
      <div class="mb-4">
        <component :is="icon" class="w-12 h-12 mx-auto" :class="iconClass" />
      </div>

      <!-- Título con componente personalizado -->
      <TituloH2 class="mb-2" :texto="title" />

      <!-- Mensaje -->
      <p class="text-gray-600 mb-6">{{ message }}</p>

      <!-- Botones de acción -->
      <div class="flex flex-col justify-center gap-4">
        <button 
          @click="onPrimaryAction"
          class="w-full font-nunito bg-medblue text-white mb-2 my-1 py-3  rounded-full px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        >
          {{ primaryLabel }}
        </button>

        <button
          v-if="secondaryLabel"
          @click="onSecondaryAction"
          class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-xl"
        >
          {{ secondaryLabel }}
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { defineProps } from 'vue';
import TituloH2 from '@/components/TituloH2.vue';

const props = defineProps({
  icon: { type: Object, required: true }, // Pasas el icono importado
  iconClass: { type: String, default: '' }, // Para custom classes como color
  title: { type: String, required: true },
  message: { type: String, required: true },
  primaryLabel: { type: String, required: true },
  secondaryLabel: { type: String, default: null },
  onPrimaryAction: { type: Function, required: true },
  onSecondaryAction: { type: Function, default: () => {} }
})
</script>
