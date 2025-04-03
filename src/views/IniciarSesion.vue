<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- Botón Volver -->
      <button @click="router.push('/')" 
        class="mb-4 flex items-center gap-2 text-gray-600 hover:text-medblue transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Logo o título -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-medblue mb-2">¡Bienvenido/a!</h1>
          <p class="text-gray-600" v-if="!mostrarCredencialDoctor">
            ¿No tiene una cuenta?
            <a class="text-healingblue hover:text-blue-700 transition-colors font-semibold" href="/registro">
              Regístrese aquí
            </a>
          </p>
        </div>

        <!-- Botón de Google -->
        <button v-if="!mostrarCredencialDoctor" 
          @click="iniciarSesionGoogle"
          class="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-xl shadow-sm transition-all duration-200 ease-in-out mb-6 flex items-center justify-center gap-3">
          <svg class="w-5 h-5" viewBox="0 0 46 47" fill="none">
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
          <span>Continuar con Google</span>
        </button>

        <!-- Separador -->
        <div v-if="!mostrarCredencialDoctor" class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">o continúe con</span>
          </div>
        </div>

        <!-- Formulario Pacientes -->
        <form @submit.prevent="iniciarSesionPaciente" v-if="!mostrarCredencialDoctor" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input type="email" v-model="correo" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medblue focus:ring-2 focus:ring-medblue/20 transition-all duration-200"
              placeholder="ejemplo@correo.com"/>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-medium text-gray-700">Contraseña</label>
              <a href="/recuperar-contrasena" class="text-sm text-healingblue hover:text-blue-700 transition-colors">
                ¿Olvidó su contraseña?
              </a>
            </div>
            <input type="password" v-model="contraseña" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medblue focus:ring-2 focus:ring-medblue/20 transition-all duration-200"
              placeholder="••••••••"/>
          </div>

          <div class="flex items-center">
            <input type="checkbox" id="remember-me"
              class="h-4 w-4 rounded border-gray-300 text-medblue focus:ring-medblue"/>
            <label for="remember-me" class="ml-2 text-sm text-gray-600">Recordarme</label>
          </div>

          <button type="submit"
            class="w-full bg-medblue hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-500/20">
            Iniciar sesión
          </button>
        </form>

        <!-- Formulario Doctores -->
        <form @submit.prevent="iniciarSesionDoctor" v-else class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Credencial de doctor</label>
            <input type="text" v-model="credential" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medblue focus:ring-2 focus:ring-medblue/20 transition-all duration-200"
              placeholder="Ingrese su credencial"/>
          </div>

          <button type="submit"
            class="w-full bg-medblue hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-500/20">
            Acceder como doctor
          </button>
        </form>

        <!-- Enlace para cambiar de modo -->
        <p class="text-center mt-6">
          <a @click="mostrarCredencialDoctor = !mostrarCredencialDoctor"
            class="text-healingblue hover:text-blue-700 transition-colors cursor-pointer text-sm font-medium">
            {{ mostrarCredencialDoctor ? 'Volver al inicio de sesión para pacientes' : 'Acceder como doctor' }}
          </a>
        </p>
      </div>
    </div>
  </div>
  <Toast 
    :show="showToast"
    :message="toastMessage"
    :type="toastType"
    @close="showToast = false"
  />
</template>

<script setup>
import Titulo from '../components/Titulo.vue';
import Toast from '../components/Toast.vue';

import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import { useRouter } from 'vue-router';

const correo = ref('');
const contraseña = ref('');
const credential = ref('');
const mostrarCredencialDoctor = ref(false);

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

const router = useRouter();

// Función para iniciar sesión como paciente
const iniciarSesionPaciente = async () => {
  if (!correo.value || !contraseña.value) {
    toastMessage.value = 'Por favor, ingresa ambos campos.';
    toastType.value = 'error';
    showToast.value = true;
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: correo.value,
      password: contraseña.value,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        toastMessage.value = 'Correo o contraseña incorrectos.';
        toastType.value = 'error';
        showToast.value = true;
      } else {
        throw error;
      }
      return;
    }

    toastMessage.value = '¡Inicio de sesión exitoso!';
    toastType.value = 'success';
    showToast.value = true;
    
    setTimeout(() => {
      router.push('/dashboard-paciente');
    }, 1000);
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
    toastMessage.value = 'Error al iniciar sesión: ' + error.message;
    toastType.value = 'error';
    showToast.value = true;
  }
};

// Función para iniciar sesión como doctor
const iniciarSesionDoctor = async () => {
  if (!credential.value) {
    toastMessage.value = 'Por favor, ingresa tu credencial.';
    toastType.value = 'error';
    showToast.value = true;
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

    toastMessage.value = '¡Bienvenido doctor!';
    toastType.value = 'success';
    showToast.value = true;
    
    setTimeout(() => {
      router.push('/dashboard-doctor');
    }, 1000);
    
  } catch (error) {
    console.error('Error al iniciar sesión como doctor:', error);
    toastMessage.value = 'Error: ' + (error.message || 'No se pudo iniciar sesión');
    toastType.value = 'error';
    showToast.value = true;
    // Limpiar datos en caso de error
    localStorage.removeItem('doctorId');
    localStorage.removeItem('doctorNombre');
    localStorage.removeItem('doctorEspecialidad');
    localStorage.removeItem('doctorCredential');
  }
};

// Función para iniciar sesión con Google
const iniciarSesionGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin // Esto asegura que vuelva a tu aplicación
      }
    });

    if (error) throw error;

    // Cuando el usuario se autentique exitosamente, será redirigido automáticamente
    if (data) {
      router.push('/dashboard-paciente');
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error.message);
    toastMessage.value = 'Error al iniciar sesión con Google: ' + error.message;
    toastType.value = 'error';
    showToast.value = true;
  }
};

</script>

<style scoped>
/* Estilos personalizados */
</style>
