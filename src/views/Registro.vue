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
          <p class="text-gray-600">
            ¿Ya tiene una cuenta?
            <a class="text-healingblue hover:text-blue-700 transition-colors font-semibold" href="/iniciar-sesion">
              Inicie sesión aquí
            </a>
          </p>
        </div>

        <!-- Botón de Google -->
        <button type="button" @click="registrarConGoogle"
          class="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-xl shadow-sm transition-all duration-200 ease-in-out mb-6 flex items-center justify-center gap-3">
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
          <span>Registrarse con Google</span>
        </button>

        <!-- Separador -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">o regístrese con</span>
          </div>
        </div>

        <!-- Formulario de registro -->
        <form @submit.prevent="registrarUsuario" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input type="email" v-model="correo" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medblue focus:ring-2 focus:ring-medblue/20 transition-all duration-200"
              placeholder="ejemplo@correo.com"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input type="password" v-model="contraseña" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medblue focus:ring-2 focus:ring-medblue/20 transition-all duration-200"
              placeholder="••••••••"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
            <input type="password" v-model="repetirContraseña" required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medblue focus:ring-2 focus:ring-medblue/20 transition-all duration-200"
              placeholder="••••••••"/>
          </div>

          <!-- Checkboxes -->
          <div class="space-y-4">
            <div class="flex items-center">
              <input type="checkbox" v-model="aceptoTerminos"
                class="h-4 w-4 rounded border-gray-300 text-medblue focus:ring-medblue"/>
              <label class="ml-2 text-sm text-gray-600">Acepto los términos y condiciones</label>
            </div>

            <div class="flex items-center">
              <input type="checkbox" v-model="aceptoPoliticas"
                class="h-4 w-4 rounded border-gray-300 text-medblue focus:ring-medblue"/>
              <label class="ml-2 text-sm text-gray-600">Acepto las políticas de privacidad</label>
            </div>

            <div class="flex items-center">
              <input type="checkbox" v-model="aceptoRecibirCorreos"
                class="h-4 w-4 rounded border-gray-300 text-medblue focus:ring-medblue"/>
              <label class="ml-2 text-sm text-gray-600">Acepto recibir correos de Alura</label>
            </div>
          </div>

          <button type="submit"
            class="w-full bg-medblue hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-500/20">
            Registrarse
          </button>
        </form>
      </div>
    </div>

    <!-- POPUP DE REGISTRO EXITOSO -->
    <div class="popup">
      <PopupMessage
        v-if="showPopup"
        :icon="CheckCircle"
        iconClass="text-green-500"
        title="¡Registro exitoso!"
        message="¡Bienvenido/a a la App de Alura! Hemos enviado un correo de verificación. Por favor, confirma tu cuenta antes de iniciar sesión. "
        primaryLabel="Aceptar"
        :onPrimaryAction="handlePrimaryAction"
        secondaryLabel="Cancelar"
        :onSecondaryAction="handleSecondaryAction"
      />
    </div>
  </div>
</template>

<script setup>
import Titulo from '../components/Titulo.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'
import PopupMessage from '../components/PopUpMessage.vue'
import { CheckCircle, AlertCircle } from 'lucide-vue-next'

const router = useRouter()

const correo = ref('')
const contraseña = ref('')
const repetirContraseña = ref('')
const aceptoTerminos = ref(false)
const aceptoPoliticas = ref(false)
const aceptoRecibirCorreos = ref(false)
const showPopup = ref(false) // Agregar el estado para el popup

const registrarUsuario = async () => {
  console.log("Intentando registrar usuario...")
  if (contraseña.value !== repetirContraseña.value) {
    alert('Las contraseñas no coinciden.')
    return
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: correo.value,
      password: contraseña.value,
    })

    if (error) throw error

    showPopup.value = true // Mostrar el popup después de un registro exitoso
    // No es necesario redirigir inmediatamente
    // router.push('/apertura') // Puedes redirigir después de que el usuario cierre el popup
  } catch (err) {
    console.error('Error en el registro:', err.message)
    alert('Ocurrió un error al registrar. Inténtalo de nuevo.')
  }
}

const registrarConGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error

    // El redireccionamiento lo maneja Supabase automáticamente
  } catch (err) {
    console.error('Error en el registro con Google:', err.message)
    alert('Ocurrió un error al intentar registrarse con Google. Inténtalo de nuevo.')
  }
}

const handlePrimaryAction = () => {
  showPopup.value = false
  router.push('/') // Redirigir al usuario a la página de inicio
}

const handleSecondaryAction = () => {
  showPopup.value = false
}
</script>