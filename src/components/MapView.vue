<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { initGoogleMaps, getGoogleMapsInstance } from '@/utils/maps';

const props = defineProps({
  doctorLocation: Object,
  patientLocation: Object,
  showRoute: Boolean
});

const emit = defineEmits(['route-calculated']);
const mapContainer = ref(null);
const map = ref(null);
const directionsRenderer = ref(null);
const markers = ref([]);

const initializeMap = async () => {
  try {
    const google = await initGoogleMaps();
    
    // Centrar en la ubicación del doctor si está disponible
    const initialCenter = props.doctorLocation || props.patientLocation || { lat: 32.5149, lng: -117.0382 };
    
    map.value = new google.maps.Map(mapContainer.value, {
      zoom: 13,
      center: initialCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    });

    directionsRenderer.value = new google.maps.DirectionsRenderer({
      map: map.value,
      suppressMarkers: true
    });

    updateMarkers();
  } catch (error) {
    console.error('Error initializing map:', error);
  }
};

const updateMarkers = () => {
  // Clear existing markers
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];

  const google = window.google;
  if (!google) return;

  // Add doctor marker
  if (props.doctorLocation) {
    markers.value.push(new google.maps.Marker({
      position: props.doctorLocation,
      map: map.value,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      title: 'Tu ubicación'
    }));
  }

  // Add patient marker
  if (props.patientLocation) {
    markers.value.push(new google.maps.Marker({
      position: props.patientLocation,
      map: map.value,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      },
      title: 'Paciente'
    }));
  }
};

const calculateRoute = async (origin, destination) => {
  const google = getGoogleMapsInstance();
  const directionsService = new google.maps.DirectionsService();
  
  try {
    const result = await directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING
    });

    directionsRenderer.value.setDirections(result);
    const duration = result.routes[0].legs[0].duration.text;
    emit('route-calculated', duration);
  } catch (error) {
    console.error('Error calculating route:', error);
    emit('route-calculated', 'No disponible');
  }
};

watch([() => props.doctorLocation, () => props.patientLocation, () => props.showRoute], 
  ([newDocLoc, newPatientLoc, showRoute]) => {
    if (!map.value || !newDocLoc || !newPatientLoc) return;

    updateMarkers();

    if (showRoute) {
      calculateRoute(newDocLoc, newPatientLoc);
    }
  }
);

onMounted(() => {
  initializeMap();
});

onUnmounted(() => {
  markers.value.forEach(marker => marker.setMap(null));
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
  position: relative;
}
</style>