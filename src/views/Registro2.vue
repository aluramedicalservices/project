<template>
    <div id="register">
        <div class="principal-title">
            <button><a>Volver</a></button>
            <h1>Registro</h1>
            <hr>
        </div>
        <div class="content">
            <form @submit.prevent="guardarDatos">
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
    import { ref } from 'vue';

    const correo = ref('');
    const contraseña = ref('');
    const repetirContraseña = ref('');
    const aceptoTerminos = ref(false);
    const aceptoPoliticas = ref(false);
    const aceptoRecibirCorreos = ref(false);

    // Función para guardar los datos (puedes modificarla según tus necesidades)
    const guardarDatos = () => {
        // Validar que las contraseñas coincidan
        if (contraseña.value !== repetirContraseña.value) {
            alert('Las contraseñas no coinciden. Por favor, intente de nuevo.');
            return;
        }

        // Si todo es correcto, muestra los datos en consola
        console.log({
            correo: correo.value,
            contraseña: contraseña.value,
            aceptoTerminos: aceptoTerminos.value,
            aceptoPoliticas: aceptoPoliticas.value,
            aceptoRecibirCorreos: aceptoRecibirCorreos.value,
        });

        // Aquí puedes hacer una solicitud para guardar los datos en el servidor, etc.
        alert('Formulario enviado correctamente.');
    };
</script>

<style scoped>
/* Aquí puedes agregar estilos para tu formulario */
</style>