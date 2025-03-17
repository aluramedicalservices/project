<template>
    <h1 class="tituloH2 font-montserrat text-medblue text-[24px] font-bold">{{ texto }}</h1>
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