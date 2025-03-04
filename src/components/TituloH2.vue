<template>
    <h1 class="tituloH2">{{ texto }}</h1>
    <hr>
</template>

<script>
export default {
    name: 'TituloH2',
    props: {
        texto: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped></style>