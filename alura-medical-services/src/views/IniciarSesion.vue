<template>
    <div class="principal-title">
        <button><a>Volver</a></button>
        <h1>Inicia Sesión</h1>
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
    import { supabase } from '@/config/supabase'
    import { useRouter } from 'vue-router';

    const correo = ref('');
    const contraseña = ref('');

    const router = useRouter();

    // Función para manejar el inicio de sesión // 

    const iniciarSesion = async () => {
        if (!correo.value || !contraseña.value) {
            alert('Por favor, ingresa ambos campos.');
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: correo.value,
                password: contraseña.value
            });

            if (error) {
                throw error;
            }

            alert('Inicio de sesión exitoso.');
            router.push('/');

        } catch (error) {
            alert(error.message);
        }
    };
</script>

<style scoped>
/* Estilos básicos para el formulario de inicio de sesión */
</style>