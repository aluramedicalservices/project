<template>
    <button
        class="w-full font-nunito bg-medblue text-white mb-2 my-1 py-3  rounded-full px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-medbluehover transition focus:outline-hidden focus:border-medbluelight disabled:opacity-50 disabled:pointer-events-none">
        {{ texto }}
    </button>
</template>

<script>
export default {
  name: 'BotonMorado',
  
  props: {
    texto: {
      type: String,
      required: true
    }
  },

}

</script>


    