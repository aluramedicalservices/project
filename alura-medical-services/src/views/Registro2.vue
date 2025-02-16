<template>
    <div id="register">
        <div class="principal-title">
            <button><a>Volver</a></button>
            <h1>Registro</h1>
            <hr>
        </div>
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
                    <input type="password" id="repetirContraseña" v-model="repetirContraseña"
                        placeholder="Repita su contraseña" required />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const router = useRouter()

// Datos de usuario traídos de `sessionStorage`
const datosUsuario = ref({})
onMounted(() => {
  try {
    const datosGuardados = sessionStorage.getItem('datosUsuario')
    if (!datosGuardados || Object.keys(JSON.parse(datosGuardados)).length === 0) {
      alert('Por favor, completa la primera parte del registro.')
      router.push('/registro1')
    } else {
      datosUsuario.value = JSON.parse(datosGuardados)
    }
  } catch (error) {
    console.error('Error al recuperar datos del registro:', error)
    router.push('/registro1')
  }
})


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
    // **Registrar usuario en Supabase Auth**
    const { data, error } = await supabase.auth.signUp({
      email: correo.value,
      password: contraseña.value,
    })

    if (error) throw error

    // **Guardar los datos en la tabla `users`**
    const { error: dbError } = await supabase.from('users').insert([
      {
        id: data.user.id, // Usa el mismo ID del usuario en `auth`
        nombre: datosUsuario.value.nombre,
        apellido_paterno: datosUsuario.value.apellidoPaterno,
        apellido_materno: datosUsuario.value.apellidoMaterno,
        telefono: datosUsuario.value.telefono,
        sexo: datosUsuario.value.sexo,
        fecha_nacimiento: datosUsuario.value.fechaNacimiento,
        calle: datosUsuario.value.calle,
        numero_exterior: datosUsuario.value.numeroExterior,
        colonia: datosUsuario.value.colonia,
        ciudad: datosUsuario.value.ciudad,
        cp: datosUsuario.value.cp,
        correo: correo.value,
        acepta_terminos: aceptoTerminos.value,
        acepta_politicas: aceptoPoliticas.value,
        acepta_correos: aceptoRecibirCorreos.value,
      }
    ])

    if (dbError) throw dbError

    alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
    router.push('/login')

  } catch (err) {
    console.error('Error en el registro:', err.message)
    alert('Ocurrió un error al registrar. Inténtalo de nuevo.')
  }
}
</script>

<style scoped>
/* Aquí puedes agregar estilos para tu formulario */
</style>