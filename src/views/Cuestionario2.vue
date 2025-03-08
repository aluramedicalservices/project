<template>
  <div id="register">
    <Titulo texto="Cuestionario" />
    <div> Aqui ira la barra de progreso </div>
    <div class="content">
      <form @submit.prevent="Cuestionario2">
        <hr>
        <label for="calle">Calle</label><br>
        <input v-model="calle" type="text" id="calle" placeholder="Calle" required />
        <br>

        <label for="numero">Número exterior</label><br>
        <input v-model="numeroExterior" type="text" id="numero" placeholder="Número" required />
        <br>

        <label for="colonia">Colonia</label><br>
        <input v-model="colonia" type="text" id="colonia" placeholder="Colonia" required />
        <br>

        <label for="ciudad">Ciudad</label><br>
        <input v-model="ciudad" type="text" id="ciudad" placeholder="Ciudad" required />
        <br>

        <label for="cp">Código Postal</label><br>
        <input v-model="cp" type="text" id="cp" placeholder="Código postal" required />
        <br>

        <button type="submit">Siguiente</button>
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

const calle = ref('')
const numeroExterior = ref('')
const colonia = ref('')
const ciudad = ref('')
const cp = ref('')

const Cuestionario2 = async () => {
  // Obtener los datos de la primera parte del cuestionario
  const datosUsuario = JSON.parse(sessionStorage.getItem('datosUsuario'))

  // Combinar los datos de ambas partes
  const datosCompletos = {
    ...datosUsuario,
    calle: calle.value,
    numero_exterior: numeroExterior.value,
    colonia: colonia.value,
    ciudad: ciudad.value,
    cp: cp.value,
  }

  try {
    // Obtener el ID del usuario autenticado
    const { data: { user } } = await supabase.auth.getUser()

    // Insertar los datos en la tabla `users`
    const { error } = await supabase
      .from('users')
      .insert([
        {
          id: user.id, // ID del usuario autenticado
          nombre: datosCompletos.nombre,
          apellido_paterno: datosCompletos.apellidoPaterno,
          apellido_materno: datosCompletos.apellidoMaterno,
          telefono: datosCompletos.telefono,
          sexo: datosCompletos.sexo,
          fecha_nacimiento: datosCompletos.fechaNacimiento,
          calle: datosCompletos.calle,
          numero_exterior: datosCompletos.numero_exterior,
          colonia: datosCompletos.colonia,
          ciudad: datosCompletos.ciudad,
          cp: datosCompletos.cp,
          correo: user.email, // Correo del usuario autenticado
          acepta_terminos: true, // Asumiendo que ya aceptó los términos
          acepta_politicas: true, // Asumiendo que ya aceptó las políticas
          acepta_correos: true, // Asumiendo que ya aceptó recibir correos
        }
      ])

    if (error) throw error

    alert('¡Registro completado con éxito!')
    router.push('/') // Redirigir al inicio o a otra vista

  } catch (err) {
    console.error('Error al guardar los datos:', err.message)
    alert('Ocurrió un error al guardar los datos. Inténtalo de nuevo.')
  }
}
</script>

<style scoped>
/* Aquí puedes agregar estilos para tu formulario */
</style>
    