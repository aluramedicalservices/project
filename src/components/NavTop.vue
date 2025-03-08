<template>
  <nav>
    <!-- Otros elementos del NavTop -->
    <button @click="cerrarSesion">Cerrar sesión</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';

const router = useRouter();

// Función para cerrar sesión
const cerrarSesion = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    alert('Sesión cerrada correctamente.');
    router.push('/iniciar-sesion'); // Redirigir al inicio de sesión
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
    alert('Error al cerrar sesión: ' + error.message);
  }
};
</script>

<style scoped>
/* Estilos del NavTop */
</style>