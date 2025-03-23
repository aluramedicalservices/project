<template>
  <div>
    <h1>Bienvenido/a al Dashboard Médico</h1>
    <p>Dr. {{ doctor.nombre }}</p>
    <p>Email: {{ doctor.email }}</p>
    <p>Especialidad: {{ doctor.especialidad }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/config/supabase';

const doctor = ref({});

onMounted(async () => {
  try {
    // Obtener el doctor autenticado por su credencial
    const { data, error } = await supabase.from('doctors').select('*').single();
    if (data) doctor.value = data;
  } catch (error) {
    console.error('Error al obtener datos del doctor:', error.message);
  }
});
</script>
