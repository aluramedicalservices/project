<template>
  <div id="component-titulo" class="flex justify-center items-center relative w-full m-2">
            
    <button @click="volverAtras" id="volver" class="bg-medblue text-white w-8 h-8 flex items-center justify-center rounded-full absolute left-0">
      <ChevronLeft class="w-5 h-5 text-white"/>
    </button>

    <h1 class="titulo font-montserrat font-bold text-medblue text-[3.5vh] lg:text-[32px]">{{ texto }}</h1>
  </div>

  <hr class="w-full h-[1px] my-3 bg-gray-300 border-0">
</template>
  
  <script>
  import { ChevronLeft } from 'lucide-vue-next';

  export default {
    name: 'Titulo',
    components: {
      ChevronLeft
    },

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