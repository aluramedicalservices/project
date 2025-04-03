<template>
  <Transition name="fade">
    <div v-if="show" class="alert-overlay">
      <div class="alert-box">
        <div class="alert-content">
          <div class="alert-icon">✉️</div>
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <button @click="$emit('close')">Aceptar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String
});

defineEmits(['close']);
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.alert-box {
  background-color: #F0F9FE;
  border-radius: 10px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 2px solid #E0F9FC;
}

.alert-content {
  text-align: center;
}

.alert-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h3 {
  color: #5B5EA7;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  color: #5B5EA7;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

button {
  background-color: #76C7D0;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5B5EA7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
