<template>
  <div class="principal-title">
    <button @click="router.push('/apertura')">Volver</button>
    <h1>Inicia Sesión</h1>
    <hr>
  </div>

  <!-- Formulario para pacientes -->
  <form @submit.prevent="iniciarSesionPaciente" v-if="!mostrarCredencialDoctor">
    <div>
      <label for="correo">Correo electrónico</label><br>
      <input type="email" id="correo" v-model="correo" placeholder="Correo electrónico" required />
    </div>

    <div>
      <label for="contraseña">Contraseña</label><br>
      <input type="password" id="contraseña" v-model="contraseña" placeholder="Contraseña" required />
    </div>

    <button type="submit">Iniciar sesión</button>

    <div>
      <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
    </div>

    <div>
      <button type="button" @click="mostrarCredencialDoctor = true">Soy doctor</button>
    </div>
  </form>

  <!-- Formulario para doctores -->
  <form @submit.prevent="iniciarSesionDoctor" v-else>
    <div>
      <label for="credential">Credencial de doctor</label><br>
      <input type="text" id="credential" v-model="credential" placeholder="Ingresa tu credencial" required />
    </div>

    <button type="submit">Acceder como doctor</button>

    <div>
      <button type="button" @click="mostrarCredencialDoctor = false">Volver a inicio de sesión</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import { useRouter } from 'vue-router';

const correo = ref('');
const contraseña = ref('');
const credential = ref('');
const mostrarCredencialDoctor = ref(false);

const router = useRouter();

// Función para iniciar sesión como paciente
const iniciarSesionPaciente = async () => {
  if (!correo.value || !contraseña.value) {
    alert('Por favor, ingresa ambos campos.');
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: correo.value,
      password: contraseña.value,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        alert('Correo o contraseña incorrectos.');
      } else {
        throw error;
      }
      return;
    }

    alert('Inicio de sesión exitoso.');
    router.push('/dashboard-paciente'); // Redirigir al dashboard de pacientes
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    alert('Error al iniciar sesión: ' + error.message);
  }
};

// Función para iniciar sesión como doctor
const iniciarSesionDoctor = async () => {
  if (!credential.value) {
    alert('Por favor, ingresa tu credencial.');
    return;
  }

  try {
    // Verificar la credencial en la tabla doctors
    const { data: doctor, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('credential', credential.value)
      .single();

    if (error) throw error;

    if (!doctor) {
      alert('Credencial inválida.');
      return;
    }

    // Redirigir al dashboard de doctores
    router.push('/dashboard-doctor');
  } catch (error) {
    console.error('Error al verificar la credencial:', error.message);
    alert('Error al verificar la credencial: ' + error.message);
  }
};
</script>

<style scoped>
/* Estilos */
</style>