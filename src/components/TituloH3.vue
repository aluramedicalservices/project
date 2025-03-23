<template>
    <h1 class="tituloH3 font-montserrat text-medblue text-[20px] font-bold">{{ texto }}</h1>
</template>

<script>
export default {
    name: 'TituloH3',
    props: {
        texto: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped></style>