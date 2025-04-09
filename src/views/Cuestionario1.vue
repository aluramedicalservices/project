<template>
    <div id="register" class="flex flex-col min-h-screen bg-white">
        <div class="principal-title">
            <Titulo texto="Cuestionario" />
            <hr />
        </div>

        <div class="form-wrapper">
            <p class="text-center text-medblue font-semibold mb-4">Por favor, llene el formulario para continuar.</p>
            <form @submit.prevent="Cuestionario" class="space-y-4">
                <div class="form-group">
                    <label for="name">Nombre(s)</label>
                    <input v-model="nombre" type="text" id="name" placeholder="Nombre(s)" required />
                </div>

                <div class="form-group">
                    <label for="lastname1">Apellido paterno</label>
                    <input v-model="apellidoPaterno" type="text" id="lname1" placeholder="Apellido paterno" required />
                </div>

                <div class="form-group">
                    <label for="lastname2">Apellido materno</label>
                    <input v-model="apellidoMaterno" type="text" id="lname2" placeholder="Apellido materno" required />
                </div>

                <div class="form-group">
                    <label for="phone">Número de celular</label>
                    <input v-model="telefono" type="tel" id="phone" placeholder="+52 664 107 8075" required />
                </div>

                <div class="form-group">
                    <label for="gender">Sexo</label>
                    <select v-model="sexo" id="sexo" required>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="birthdate">Fecha de nacimiento</label>
                    <input v-model="fechaNacimiento" type="date" id="birthdate" min="1900-01-01" max="2025-12-31" required />
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

onMounted(async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      router.push('/login')
      return
    }

    // Verificar si el usuario ya tiene datos guardados
    const { data: userData } = await supabase
      .from('users')
      .select('nombre')
      .eq('id', user.id)
      .single()

    if (userData && userData.nombre) {
      router.push('/inicio-paciente')
    }
  } catch (error) {
    console.error('Error:', error)
    router.push('/login')
  }
})
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

input, select {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #E0F9FC;
    border-radius: 5px;
    background-color: white;
    transition: border-color 0.3s ease;
}

input:focus, select:focus {
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

