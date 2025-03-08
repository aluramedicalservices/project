<template>
    <p class="textoMsn">{{ texto }}</p>
</template>

<script>
export default {
    name: 'textoMsn',
    props: {
        texto: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped></style>