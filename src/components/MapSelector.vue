<template>
  <div class="relative">
    <div ref="mapDiv" class="w-full h-[300px] rounded-lg"></div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar dirección..."
      class="absolute top-2 left-2 w-[calc(100%-1rem)] max-w-md p-2 bg-white rounded-lg shadow-md border"
      @keydown.enter="searchLocation"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

const emit = defineEmits(['location-selected']);
const mapDiv = ref(null);
const searchQuery = ref('');
let map = null;
let marker = null;

onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: 'weekly',
    libraries: ['places']
  });

  const google = await loader.load();
  
  // Centrar inicialmente en Tijuana
  const center = { lat: 32.5149, lng: -117.0382 };
  
  map = new google.maps.Map(mapDiv.value, {
    center,
    zoom: 13,
  });

  marker = new google.maps.Marker({
    map,
    draggable: true,
    position: center,
  });

  map.addListener('click', (e) => {
    marker.setPosition(e.latLng);
    emitLocation(e.latLng);
  });

  marker.addListener('dragend', () => {
    emitLocation(marker.getPosition());
  });
});

const searchLocation = async () => {
  if (!searchQuery.value) return;

  const google = window.google;
  const geocoder = new google.maps.Geocoder();

  try {
    const { results } = await geocoder.geocode({ address: searchQuery.value });
    if (results[0]) {
      const location = results[0].geometry.location;
      map.setCenter(location);
      marker.setPosition(location);
      emitLocation(location);
    }
  } catch (error) {
    console.error('Error al buscar ubicación:', error);
  }
};

const emitLocation = (position) => {
  emit('location-selected', {
    lat: position.lat(),
    lng: position.lng()
  });
};
</script>
