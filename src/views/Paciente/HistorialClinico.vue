<template>
    <Titulo texto="Historial clínico" />


<!-- PRUEBA DE POPUP -->
    <button @click="showPopup = true">Mostrar popup</button>

  <PopupMessage
    v-if="showPopup"
    :icon="CheckCircle"
    iconClass="text-green-500"
    title="¡Operación exitosa!"
    message="Tu cita fue agendada correctamente."
    primaryLabel="Aceptar"
    :onPrimaryAction="handlePrimaryAction"
    secondaryLabel="Cancelar"
    :onSecondaryAction="handleSecondaryAction"
  />
</template>

<script setup>
import Titulo from '../../components/Titulo.vue';

import PopupMessage from '@/components/PopupMessage.vue'
import { CheckCircle, AlertCircle } from 'lucide-vue-next'
import { ref } from 'vue'

const showPopup = ref(false)
const handlePrimaryAction = () => {
  console.log('Acción principal confirmada')
  showPopup.value = false
}

const handleSecondaryAction = () => {
  console.log('Acción secundaria cancelada')
  showPopup.value = false
}
</script>