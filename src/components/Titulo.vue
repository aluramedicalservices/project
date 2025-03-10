<template>
  <div id="component-titulo" class="flex justify-center items-center relative w-full m-2">
            
    <button @click="volverAtras" id="volver" class="bg-medblue text-white w-10 h-10 flex items-center justify-center rounded-full absolute left-0">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
      </svg>
    </button>

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