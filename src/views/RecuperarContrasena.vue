<template>
  <div class="principal-title">
    <button><a href="/autenticacion">Volver</a></button>
    <h1>Recuperar Contraseña</h1>
    <hr />
  </div>

  <form @submit.prevent="recuperarContraseña">
    <div>
      <label for="correo">Correo electrónico</label><br />
      <input
        type="email"
        id="correo"
        v-model="correo"
        placeholder="Correo electrónico"
        required
      />
    </div>

    <button type="submit">Recuperar Contraseña</button>

    <div>
      <a href="/autenticacion">¿Ya tienes cuenta? Iniciar sesión</a>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/config/supabase';

const correo = ref('');

// Función recuperar contraseña //
const recuperarContraseña = async () => {
  if (!correo.value) {
    alert('Por favor, ingresa tu correo electrónico.');
    return;
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(correo.value, {
      redirectTo: "http://localhost:5173/restablecer-contrasena?type=recovery",
    });

    if (error) {
      throw error;
    }

    alert('Se ha enviado un enlace para restablecer tu contraseña a tu correo.');
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
/* Estilos */
</style>


