<template>
    <div class="principal-title">
        <button><a>Volver</a></button>
        <h1>Registro</h1>
        <hr>
    </div>

    <form @submit.prevent="iniciarSesion">
        <div>
            <label for="correo">Correo electrónico</label><br>
            <input type="email" id="correo" v-model="correo" placeholder="Correo electrónico" required />
        </div>

        <div>
            <label for="contraseña">Contraseña</label><br>
            <input type="password" id="contraseña" v-model="contraseña" placeholder="Contraseña" required />
        </div>

        <button type="submit">Iniciar sesión</button>

        <div>
            <a href="/recuperar-contraseña">¿Olvidaste tu contraseña?</a>
        </div>
    </form>
</template>

<script setup>
    import { ref } from 'vue';

    const correo = ref('');
    const contraseña = ref('');

    // Función para manejar el inicio de sesión
    const iniciarSesion = () => {
        // Validación simple: verificar si los campos están vacíos
        if (!correo.value || !contraseña.value) {
            alert('Por favor, ingresa ambos campos.');
            return;
        }

        // Si los datos son correctos, se puede proceder con la lógica de autenticación
        console.log({
            correo: correo.value,
            contraseña: contraseña.value,
        });

        // Aquí podrías hacer una solicitud para verificar las credenciales en el servidor
        alert('Inicio de sesión exitoso.');
    };
</script>

<style scoped>
/* Estilos básicos para el formulario de inicio de sesión */
</style>