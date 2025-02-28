<template>
  <div class="principal-title">
    <button><a href="/autenticacion">Volver</a></button>
    <h1>Restablecer Contraseña</h1>
    <hr />
  </div>

  <form @submit.prevent="restablecerContrasena">
    <div>
      <label for="nueva-contrasena">Nueva Contraseña</label><br />
      <input
        type="password"
        id="nueva-contrasena"
        v-model="nuevaContrasena"
        placeholder="Nueva Contraseña"
        required
      />
    </div>

    <button type="submit">Restablecer Contraseña</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/config/supabase";

const nuevaContrasena = ref("");
const route = useRoute();
const router = useRouter();
const accessToken = ref("");

onMounted(() => {
  accessToken.value =
    route.query.access_token || // Si viene en query param
    window.location.hash.split("access_token=")[1]?.split("&")[0]; // Si viene en hash

  console.log("Token recibido:", accessToken.value);
});

const restablecerContrasena = async () => {
  if (!nuevaContrasena.value) {
    alert("Por favor, ingresa una nueva contraseña.");
    return;
  }

  if (!accessToken.value) {
    alert("Token de acceso no encontrado. Verifica el enlace de restablecimiento.");
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: nuevaContrasena.value,
    });

    if (error) {
      throw error;
    }

    alert("Tu contraseña ha sido restablecida exitosamente.");
    router.push("/autenticacion");
  } catch (error) {
    alert(error.message);
  }
};
</script>

<style scoped>
/* Estilos*/
</style>
