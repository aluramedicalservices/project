<template>
    <div class="message-container" :class="tipo">
        <i>icono</i>
        <h2>{{ titulo }}</h2>
        <p>{{ mensaje }}</p>
        <button @click="accion">{{ boton }}</button>
    </div>
</template>

<script>
export default {
    props: {
        titulo: { type: String, default: 'Mensaje' },
        mensaje: { type: String, default: 'Información relevante.' },
        boton: { type: String, default: 'Volver' },
        redireccion: { type: String, default: '/agendar-cita' },
        tipo: { type: String, default: 'info' } // Ej: 'error', 'exito', 'advertencia'
    },
    methods: {
        accion() {
            this.$router.push(this.redireccion);
        }
    }
};
</script>

<style scoped>

</style>