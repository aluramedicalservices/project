<template>
  <div class="map-container" style="height: 400px; width: 100%">
    <div id="map" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const emit = defineEmits(['location-selected']);

onMounted(async () => {
  const loader = new Loader({
    apiKey: 'TU_API_KEY_DE_GOOGLE_MAPS',
    version: 'weekly',
  });

  try {
    const google = await loader.load();
    const { Map, Marker } = google.maps;

    // Coordenadas iniciales (Ciudad de México)
    const center = { lat: 19.4326, lng: -99.1332 };
    
    const map = new Map(document.getElementById('map'), {
      center,
      zoom: 13,
    });

    let marker = new Marker({
      position: center,
      map,
      draggable: true,
    });

    map.addListener('click', (e) => {
      const location = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      marker.setPosition(location);
      emit('location-selected', location);
    });

    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      const location = {
        lat: position.lat(),
        lng: position.lng(),
      };
      emit('location-selected', location);
    });
  } catch (error) {
    console.error('Error loading Google Maps:', error);
  }
});
</script>
