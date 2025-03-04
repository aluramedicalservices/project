<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

export default {
  props: {
    doctorLocation: Object,
    patientLocation: Object,
  },
  setup(props) {
    const mapContainer = ref(null);
    let map;

    onMounted(async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: "weekly",
      });

      const google = await loader.load();

      // Inicializar mapa centrado en la ubicación del doctor
      map = new google.maps.Map(mapContainer.value, {
        center: props.doctorLocation,
        zoom: 14,
      });

      // Marcador del doctor
      new google.maps.Marker({
        position: props.doctorLocation,
        map,
        title: "Doctor",
      });

      // Marcador del paciente
      new google.maps.Marker({
        position: props.patientLocation,
        map,
        title: "Paciente",
      });

      // Dibujar ruta cuando ambos puntos estén disponibles
      if (props.doctorLocation && props.patientLocation) {
        drawRoute(google, map, props.doctorLocation, props.patientLocation);
      }
    });

    // Función para dibujar la ruta en el mapa
    function drawRoute(google, map, origin, destination) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          } else {
            console.error("Error al calcular la ruta:", status);
          }
        }
      );
    }

    return { mapContainer };
  },
};
</script>

<style>
.map {
  width: 100%;
  height: 400px;
}
</style>
