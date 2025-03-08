<template>
    <div id="register">
        <Titulo texto="Cuestionario" />

        <div> Aqui ira la barra de progreso </div>

        <p><b>Por favor, llene el formulario para continuar.</b></p>
        <div class="content">
            <form @submit.prevent="Cuestionario">
                <label for="name">Nombre(s)</label><br>
                <input v-model="nombre" type="text" id="name" placeholder="Nombre(s)" required />
                <br>

                <label for="lastname1">Apellido paterno</label><br>
                <input v-model="apellidoPaterno" type="text" id="lname1" placeholder="Apellido paterno" required />
                <br>

                <label for="lastname2">Apellido materno</label><br>
                <input v-model="apellidoMaterno" type="text" id="lname2" placeholder="Apellido materno" required />
                <br>

                <label for="phone">Número de celular</label><br>
                <input v-model="telefono" type="tel" id="phone" placeholder="+52 664 107 8075"
                     required />
                <br>

                <label for="gender">Sexo</label><br>
                <select v-model="sexo" id="sexo" required>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                </select>
                <br>
                
                <hr>
                <label for="birthdate">Fecha de nacimiento</label><br>
                <input v-model="fechaNacimiento" type="date" id="birthdate" min="1900-01-01" max="2025-12-31"
                    required />
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

const router = useRouter()

const nombre = ref('')
const apellidoPaterno = ref('')
const apellidoMaterno = ref('')
const telefono = ref('')
const sexo = ref('')
const fechaNacimiento = ref('')

const Cuestionario = () => {
  // Guardamos los datos en sessionStorage para usarlos en `registro2.vue`
  sessionStorage.setItem('datosUsuario', JSON.stringify({
    nombre: nombre.value,
    apellidoPaterno: apellidoPaterno.value,
    apellidoMaterno: apellidoMaterno.value,
    telefono: telefono.value,
    sexo: sexo.value,
    fechaNacimiento: fechaNacimiento.value,
  }))

  // Redirige a la segunda parte del registro
  router.push('/cuestionario-2')
}
</script>

<style scoped>
/* Aquí puedes agregar estilos para tu formulario */           
</style>
        
    