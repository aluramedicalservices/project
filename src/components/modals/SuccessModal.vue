<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="success-icon">
        <span class="material-icons-round">check_circle</span>
      </div>
      <h2>¡Cita Agendada!</h2>
      <p>Tu cita ha sido agendada correctamente</p>
      <button @click="close" class="btn-cerrar">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  max-width: 90%;
  width: 400px;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 8px 20px rgba(91, 94, 167, 0.2);
}

.success-icon {
  margin-bottom: 1rem;
}

.success-icon span {
  font-size: 4rem;
  color: #4CAF50;
}

h2 {
  color: #5B5EA7;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn-cerrar {
  background: linear-gradient(135deg, #5B5EA7 0%, #76C7D0 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cerrar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(91, 94, 167, 0.2);
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
