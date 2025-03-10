<template>
  <div id="vista-iniciar-sesion" class="flex flex-col w-90 space-y-24 min-h-screen text-noxgrey">
    <Titulo texto="Iniciar sesión" />

    <!-- Formulario para pacientes -->
    <form @submit.prevent="iniciarSesionPaciente" v-if="!mostrarCredencialDoctor">

      <!-- Estos ya estan
    <div>
      <label for="correo">Correo electrónico</label><br>
      <input type="email" id="correo" v-model="correo" placeholder="Correo electrónico" required />
    </div>
   
    <div>
      <label for="contraseña">Contraseña</label><br>
      <input type="password" id="contraseña" v-model="contraseña" placeholder="Contraseña" required />
    </div>

     //// Hasta aqui estan hechos
     //// A partir de abajo no estan 

      <button type="submit">Iniciar sesión</button>

      <div>
        <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
      </div>

      <div>
        <button type="button" @click="mostrarCredencialDoctor = true">Soy doctor</button>
      </div>
      -->
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







    <!-- PRELINE -->

    <div class="mt-7 ">
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h1 class="block text-2xl font-montserrat font-semibold text-gray-800">¡Bienvenido/a de nuevo!</h1>
          <p class="mt-2 text-sm text-gray-600 font-nunito">
            ¿No tiene una cuenta aún?
            <a class="text-healingblue decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
              href="../examples/html/signup.html">
              Regístrese aquí
            </a>
          </p>
        </div>

        <div class="mt-5">
          <button type="button"
            class="font-nunito w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none ">
            <svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
              <path
                d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                fill="#4285F4" />
              <path
                d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                fill="#34A853" />
              <path
                d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                fill="#FBBC05" />
              <path
                d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                fill="#EB4335" />
            </svg>
            Iniciar sesión con Google
          </button>

          <div
            class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
            O</div>

          <!-- Form -->
          <form>
            <div class="grid gap-y-4">
              <!-- Form Group -->
              <div class="max-w-sm">
                <label for="correo" class="block text-sm font-nunito mb-2">Correo electrónico</label>
                <input type="email" id="correo"
                  class="font-nunito py-2.5 sm:py-3 px-4 block w-full border-1 border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="tu@sitio.com" v-model="correo" required />
              </div>
              <!-- End Form Group -->

              <!-- Form Group -->
              <div>
                <div class="font-nunito flex flex-wrap justify-between items-center gap-2">
                  <label for="password" class="block text-sm mb-2">Password</label>
                  <a class="inline-flex items-center gap-x-1 text-sm text-healingblue decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                    href="../examples/html/recover-account.html">¿Olvidó su contraseña?</a>
                </div>
                <div class="relative">
                  <input type="password" id="password" name="password"
                    class="border-1 border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 block w-full sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    required aria-describedby="password-error">
                  <div class="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                    <svg class="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
                      aria-hidden="true">
                      <path
                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                    </svg>
                  </div>
                </div>
                <p class="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
              </div>
              <!-- End Form Group -->

              <!-- Checkbox -->
              <div class="flex items-center">
                <div class="flex">
                  <input id="remember-me" name="remember-me" type="checkbox"
                    class="shrink-0 mt-0.5 border-gray-200 rounded-sm text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800">
                </div>
                <div class="ms-3">
                  <label for="remember-me" class="text-sm font-nunito">Recordarme</label>
                </div>
              </div>
              <!-- End Checkbox -->

              <button type="submit"
                class="w-full font-nunito bg-medblue text-white mb-2 my-1 w-full py-3  rounded-full px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                Iniciar sesión</button>
            </div>
          </form>
          <!-- End Form -->
        </div>
      </div>
    </div>
  </div>


















</template>

<script setup>
import Titulo from '../components/Titulo.vue'

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
    // Verificar la credencial en la tabla `doctors`
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