<template>
    <button id="">Volver</button>
    <h1 class="titulo">{{ texto }}</h1>
    <hr>
  </template>
  
  <script>
  export default {
    name: 'Titulo',
    props: {
      texto: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
 
  </style>