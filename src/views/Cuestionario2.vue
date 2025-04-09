<template>
    <div id="register" class="flex flex-col min-h-screen bg-white">
        <div class="principal-title">
            <Titulo texto="Cuestionario" />
            <hr />
        </div>

        <div class="form-wrapper">
            <p class="text-center text-medblue font-semibold mb-4">Por favor, complete su dirección.</p>
            <form @submit.prevent="Cuestionario2" class="space-y-4">
                <div class="form-group">
                    <label for="calle">Calle</label>
                    <input v-model="calle" type="text" id="calle" placeholder="Calle" required />
                </div>

                <div class="form-group">
                    <label for="numero">Número exterior</label>
                    <input v-model="numeroExterior" type="text" id="numero" placeholder="Número" required />
                </div>

                <div class="form-group">
                    <label for="colonia">Colonia</label>
                    <input v-model="colonia" type="text" id="colonia" placeholder="Colonia" required />
                </div>

                <div class="form-group">
                    <label for="ciudad">Ciudad</label>
                    <input v-model="ciudad" type="text" id="ciudad" placeholder="Ciudad" required />
                </div>

                <div class="form-group">
                    <label for="cp">Código Postal</label>
                    <input v-model="cp" type="text" id="cp" placeholder="Código postal" required />
                </div>

                <button type="submit">Siguiente</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import Titulo from '../components/Titulo.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'
import Swal from 'sweetalert2'

const router = useRouter()

const calle = ref('')
const numeroExterior = ref('')
const colonia = ref('')
const ciudad = ref('')
const cp = ref('')

onMounted(() => {
  const datosUsuario = sessionStorage.getItem('datosUsuario')
  if (!datosUsuario) {
    router.push('/cuestionario-1')
    return
  }
})

const Cuestionario2 = async () => {
  try {
    const datosUsuario = JSON.parse(sessionStorage.getItem('datosUsuario'))
    if (!datosUsuario) {
      router.push('/cuestionario-1')
      return
    }

    // Combinar los datos de ambas partes
    const datosCompletos = {
      ...datosUsuario,
      calle: calle.value,
      numero_exterior: numeroExterior.value,
      colonia: colonia.value,
      ciudad: ciudad.value,
      cp: cp.value,
    }

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

    // Limpiar sessionStorage después de guardar
    sessionStorage.removeItem('datosUsuario')
    
    // Mostrar alerta bonita
    await Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tus datos han sido guardados correctamente',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#5B5EA7',
      background: '#F0F9FE',
      customClass: {
        popup: 'rounded-lg',
        title: 'text-medblue',
      }
    })
    
    router.push('/dashboard-paciente')

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ocurrió un error al guardar los datos. Inténtalo de nuevo.',
      confirmButtonColor: '#5B5EA7',
      background: '#F0F9FE'
    })
    console.error('Error al guardar los datos:', err.message)
  }
}
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
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
}

form {
    background-color: #F0F9FE;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    color: #5B5EA7;
    font-weight: bold;
    margin-bottom: 0.5rem;
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

@media (max-width: 768px) {
    .form-wrapper {
        margin: 0 1rem;
    }
}
</style>
