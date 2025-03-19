<template>
  <div id="component-titulo" class="flex justify-center items-center relative w-full m-2">
    <h1 class="titulo font-montserrat font-bold text-medblue text-[32px]">{{ texto }}</h1>
  </div>

  <hr class="w-full h-[1px] my-3 bg-gray-300 border-0">
</template>
  
  <script>
  export default {
    name: 'Titulo',
    props: {
      texto: {
        type: String,
        required: true
      }
    },

    methods: {
      volverAtras() {
      this.$router.go(-1);
      }
    }
  }

  </script>
  
  <style scoped>
 
  </style>