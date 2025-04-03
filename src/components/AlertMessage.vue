<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div class="fixed inset-0 bg-black bg-opacity-30" @click="close"></div>
      <div class="bg-[#F0F9FE] rounded-xl p-6 shadow-xl relative max-w-md w-full border-t-4" 
           style="border-color: #5B5EA7">
        <div class="flex items-start mb-4">
          <div class="bg-[#E0F9FC] rounded-full p-3">
            <MapPinIcon class="w-6 h-6" style="color: #76C7D0" />
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold" style="color: #5B5EA7">Verifica tu ubicación</h3>
            <p class="text-gray-600 mt-1">{{ message }}</p>
          </div>
        </div>
        <button 
          @click="close"
          class="w-full py-2 px-4 rounded-lg text-white font-medium transition-colors"
          style="background-color: #5B5EA7; hover:opacity-90"
        >
          Entendido
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { MapPinIcon } from 'lucide-vue-next';

defineProps({
  show: Boolean,
  message: String
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
