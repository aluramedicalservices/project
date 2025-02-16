<template>
    <div id="register">
        <div class="principal-title">
            <button><a>Volver</a></button>
            <h1>Registro</h1>
            <hr>
        </div>
        <div class="content">
            <form @submit.prevent="guardarDatos">
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
                    pattern="^\+52\s\d{3}\s\d{3}\s\d{4}$" required />
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
    import { ref } from 'vue';

    const nombre = ref('');
    const apellidoPaterno = ref('');
    const apellidoMaterno = ref('');
    const telefono = ref('');
    const sexo = ref('');
    const fechaNacimiento = ref('');
    const calle = ref('');
    const numeroExterior = ref('');
    const colonia = ref('');
    const ciudad = ref('');
    const cp = ref('');

    // Esta función se ejecutará cuando el formulario sea enviado
    const guardarDatos = () => {
    // Aquí podrías guardar los datos en un backend, localStorage, etc.
    console.log({
        nombre: nombre.value,
        apellidoPaterno: apellidoPaterno.value,
        apellidoMaterno: apellidoMaterno.value,
        telefono: telefono.value,
        sexo: sexo.value,
        fechaNacimiento: fechaNacimiento.value,
        calle: calle.value,
        numeroExterior: numeroExterior.value,
        colonia: colonia.value,
        ciudad: ciudad.value,
        cp: cp.value,
    });

    // Después de guardar los datos, puedes redirigir o hacer otra acción
    alert('Datos guardados correctamente.');
    };
</script>

<style scoped>
/* Aquí puedes agregar estilos para tu formulario */           
</style>
        
    