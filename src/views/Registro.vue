<template>
  <div id="register">
    <Titulo texto="Registro" />

    <button onclick="window.location.href='/apertura'">Volver</button>

    <div class="content">
      <form @submit.prevent="registrarUsuario">
        <div>
          <label for="correo">Correo electrónico</label><br>
          <input type="email" id="correo" v-model="correo" placeholder="Correo electrónico" required />
        </div>

        <div>
          <label for="contraseña">Contraseña</label><br>
          <input type="password" id="contraseña" v-model="contraseña" placeholder="Contraseña" required />
        </div>

        <div>
          <label for="repetirContraseña">Repita su contraseña</label><br>
          <input type="password" id="repetirContraseña" v-model="repetirContraseña" placeholder="Repita su contraseña"
            required />
        </div>

        <hr>
        <div>
          <label>
            <input type="checkbox" v-model="aceptoTerminos" required />
            Acepto los términos y condiciones de servicio
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="aceptoPoliticas" required />
            Acepto las políticas de privacidad
          </label>
        </div>

        <div>
          <label>
            <input type="checkbox" v-model="aceptoRecibirCorreos" />
            Acepto recibir correos electrónicos de parte de Alura
          </label>
        </div>

        <button type="submit">Registrar</button>
      </form>
    </div>
  </div>
  
</template>

<script setup>
import Titulo from '../components/Titulo.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const router = useRouter()

const correo = ref('')
const contraseña = ref('')
const repetirContraseña = ref('')
const aceptoTerminos = ref(false)
const aceptoPoliticas = ref(false)
const aceptoRecibirCorreos = ref(false)

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

    alert('¡Registro exitoso! Ahora puedes iniciar sesión. Contesta nuestro Cuestionario.')
    router.push('/cuestionario-1')

  } catch (err) {
    console.error('Error en el registro:', err.message)
    alert('Ocurrió un error al registrar. Inténtalo de nuevo.')
  }
}

</script>


<style scoped>
/* Aquí puedes agregar estilos para tu formulario */
</style>