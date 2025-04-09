<template>
  <!-- Si hay prop 'to', renderiza un router-link -->
  <router-link
    v-if="to"
    :to="to"
    class="bg-[#5B5EA7] hover:bg-[#4a4d92] text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors duration-300 text-center inline-block"
  >
    {{ label }}
  </router-link>

  <!-- Si no hay 'to', renderiza un botón normal -->
  <button
    v-else
    @click="$emit('click')"
    class="bg-[#5B5EA7] hover:bg-[#4a4d92] text-white font-bold py-2 px-4 rounded-xl shadow-md transition-colors duration-300"
  >
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  to: {
    type: String,
    default: null
  }
})

defineEmits(['click'])
</script>