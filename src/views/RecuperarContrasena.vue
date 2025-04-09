<template>
  <div class="principal-title">
    <h1>Recuperar Contraseña</h1>
    <hr />
  </div>

  <div class="form-wrapper">
    <button class="back-button"><a href="/iniciar-sesion">Volver</a></button>
    <form @submit.prevent="recuperarContraseña">
      <div class="email-container">
        <label for="correo">Correo electrónico</label>
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
        <a href="/iniciar-sesion">¿Ya tienes cuenta? Iniciar sesión</a>
      </div>
    </form>
  </div>

  <AlertModal
    :show="showAlert"
    title="¡Correo enviado!"
    message="Se ha enviado un enlace para restablecer tu contraseña a tu correo."
    @close="showAlert = false"
  />
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import AlertModal from '@/components/AlertModal.vue';

const correo = ref('');
const showAlert = ref(false);

// Función recuperar contraseña //
const recuperarContraseña = async () => {
  if (!correo.value) {
    alert('Por favor, ingresa tu correo electrónico.');
    return;
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(correo.value, {
      redirectTo: "https://alura-prueba-descarga-git-main-aluramedicalservices-projects.vercel.app/restablecer-contrasena?type=recovery",
    });

    if (error) {
      throw error;
    }

    showAlert.value = true;
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
  font-weight: 600; /* semi bold */
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

a {
  color: #5B5EA7;
  text-decoration: none;
  display: block;
  text-align: center;
  margin-top: 1rem;
  transition: color 0.3s ease;
}

a:hover {
  color: #76C7D0;
}

.email-container {
  position: relative;
}

.back-button {
  position: absolute;
  left: -100px;
  top: 20px; /* changed from 30px to 20px to align higher */
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


