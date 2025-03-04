<template>
<div id="comenzarViaje">
    <NavTopD />
    <Titulo texto="Detalles de cita" />
    <br>

    <div id="mapa_contenedor">
         <div id="mapa_tiempo_real">
            //Aqui irá el mapa en tiempo real
         </div>
         <p>{{ UbicacionPaciente }}</p>
    </div>

    <br>
    <p>{{ TiempoEstimadoParaLlegar }}
        //Aqui irá el tiempo estimado para llegar al destino
    </p>
    <br>
    <button><a href="#">Cancelar viaje</a></button>

</div>
</template>

<script>
import GoogleMap from "./components/MapView.vue";

export default {
  name: "App",
  components: {
    GoogleMap,
  },
};
</script>