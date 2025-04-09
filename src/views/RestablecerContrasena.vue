<template>
  <div class="principal-title">
    <h1>Restablecer Contraseña</h1>
    <hr />
  </div>

  <div class="form-wrapper">
    <button class="back-button"><a href="/">Volver</a></button>
    <form @submit.prevent="restablecerContrasena">
      <div class="password-container">
        <label for="nueva-contrasena">Nueva Contraseña</label>
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
  </div>
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
.principal-title {
  text-align: center;
  margin: 0 0 2rem 0;
  position: relative;
  padding-top: 1rem;
}

.principal-title h1 {
  color: #5B5EA7;
  margin: 1rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.form-wrapper {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

form {
  padding: 2rem;
  background-color: #F0F9FE;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form div {
  margin-bottom: 1.5rem;
}

label {
  color: #5B5EA7;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #E0F9FC;
  border-radius: 5px;
  background-color: white;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #76C7D0;
}

button[type="submit"] {
  width: 100%;
  padding: 1rem;
  background-color: #76C7D0;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover {
  background-color: #5B5EA7;
}

.password-container {
  position: relative;
}

.back-button {
  position: absolute;
  left: -100px;
  top: 20px;
  background-color: #76C7D0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-button:hover {
  background-color: #5B5EA7;
}

.back-button a {
  color: white;
  text-decoration: none;
  margin: 0;
}

@media (max-width: 768px) {
  .form-wrapper {
    margin: 0 1rem;
  }

  .back-button {
    position: static;
    margin-bottom: 1rem;
  }
}
</style>
