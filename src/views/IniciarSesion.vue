<template>
  <Titulo texto="Iniciar sesión" />
  <div id="vista-iniciar-sesion" class="font-nunito flex flex-col items-center min-h-screen text-noxgrey">
    <div class="mt-7 border border-gray-200 rounded-xl shadow-2xs w-4/5 md:w-[450px]">
      <div class="p-4 sm:p-7">
        <div class="text-center">
          <h1 class="block text-2xl font-montserrat font-semibold text-gray-800">¡Bienvenido/a de nuevo!</h1>
          
          <!-- Solo mostrar el mensaje de registro a los pacientes -->
          <p class="mt-2 text-sm text-gray-600 font-nunito" v-if="!mostrarCredencialDoctor">
            ¿No tiene una cuenta aún?
            <a class="text-healingblue decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
              href="/registro">
              Regístrese aquí
            </a>
          </p>
        </div>

        <div class="mt-5">
          <!-- Solo se muestra el botón de Google para pacientes -->
          <button v-if="!mostrarCredencialDoctor" type="button"
            class="font-nunito w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none "
            @click="iniciarSesionGoogle">
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

          <!-- Separador "O" solo para pacientes -->
          <div class="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500" 
          v-if="!mostrarCredencialDoctor">
          O
          </div>


          <!-- Formulario Pacientes -->
          <form @submit.prevent="iniciarSesionPaciente" v-if="!mostrarCredencialDoctor">
            <div class="grid gap-y-4">
              <!-- Correo -->
              <div>
                <label for="correo" class="block text-sm font-nunito mb-2">Correo electrónico</label>
                <input type="email" id="correo"
                  class="font-nunito py-2.5 sm:py-3 px-4 block w-full border-1 border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="correo" v-model="correo" required />
              </div>

              <!-- Contraseña-->
              <div>
                <div class="font-nunito flex flex-wrap justify-between items-center gap-2">
                  <label for="password" class="block text-sm mb-2">Password</label>
                  <a class="inline-flex items-center gap-x-1 text-sm text-healingblue decoration-2 hover:underline focus:outline-hidden focus:underline font-medium"
                    href="/recuperar-contrasena">¿Olvidó su contraseña?</a>
                </div>
                <div class="relative">
                  <input type="password" id="contraseña" name="password"
                    class="border-1 border-gray-300 rounded-lg py-2.5 sm:py-3 px-4 block w-full sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    aria-describedby="password-error" v-model="contraseña" placeholder="contraseña" required />
                </div>
              </div>

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

              <!-- Boton -->
              <button type="submit"
                class="w-full font-nunito bg-medblue text-white mb-2 my-1 py-3  rounded-full px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                Iniciar sesión</button>
            </div>
          </form>

          <!-- Formulario Doctores -->
          <form @submit.prevent="iniciarSesionDoctor" v-else>
            <div>
              <label for="credential" class="block text-sm font-nunito mb-2">Credencial de doctor</label>

              <input type="text" id="credential"
                  class="font-nunito py-2.5 sm:py-3 px-4 block w-full border-1 border-gray-300 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  v-model="credential" 
                  placeholder="Ingresa tu credencial" required />
            </div>

            <button type="submit"
              class="w-full font-nunito bg-medblue text-white mb-2 my-1 py-3  rounded-full px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
              Acceder como doctor</button>

          </form>

          <!-- Enlace para iniciar sesión como doctor -->
          <p class="text-center text-sm mt-4">
            <a class="font-nunito text-healingblue hover:underline font-medium cursor-pointer"
              @click="mostrarCredencialDoctor = !mostrarCredencialDoctor">
              {{ mostrarCredencialDoctor ? 'Volver al inicio de sesión para pacientes' : 'Iniciar sesión en el portal médico' }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import Titulo from '../components/Titulo.vue';

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
    // 1. Verificar credencial en tabla doctors
    const { data: doctor, error } = await supabase
      .from('doctors')
      .select('id, nombre_completo, credential, especialidad')
      .eq('credential', credential.value.trim())
      .single();

    if (error || !doctor) {
      throw new Error('Credencial inválida o no registrada');
    }

    // 2. Guardar información del doctor en localStorage
    localStorage.setItem('doctorId', doctor.id);
    localStorage.setItem('doctorNombre', doctor.nombre_completo);
    localStorage.setItem('doctorEspecialidad', doctor.especialidad);
    localStorage.setItem('doctorCredential', doctor.credential);

    // 3. Redirigir al dashboard del doctor
    router.push('/dashboard-doctor');
    
  } catch (error) {
    console.error('Error al iniciar sesión como doctor:', error);
    alert('Error: ' + (error.message || 'No se pudo iniciar sesión'));
    // Limpiar datos en caso de error
    localStorage.removeItem('doctorId');
    localStorage.removeItem('doctorNombre');
    localStorage.removeItem('doctorEspecialidad');
    localStorage.removeItem('doctorCredential');
  }
};

</script>

<style scoped>
/* Estilos personalizados */
</style>
