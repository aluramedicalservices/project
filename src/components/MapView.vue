<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { initGoogleMaps, getGoogleMapsInstance } from '@/utils/maps';

const props = defineProps({
  doctorLocation: Object,
  patientLocation: Object,
  showRoute: Boolean,
  currentRoute: Object
});

const emit = defineEmits(['route-calculated']);
const mapContainer = ref(null);
const map = ref(null);
const directionsRenderer = ref(null);
const markers = ref([]);

const initializeMap = async () => {
  try {
    await initGoogleMaps();
    const google = getGoogleMapsInstance();
    
    // Initialize map with default center if patient location is not available
    const defaultCenter = props.patientLocation || { lat: 32.5149, lng: -117.0382 }; // Tijuana coordinates
    
    map.value = new google.maps.Map(mapContainer.value, {
      zoom: 13,
      center: defaultCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    });

    // Initialize directions renderer
    directionsRenderer.value = new google.maps.DirectionsRenderer({
      map: map.value,
      suppressMarkers: true // We'll use custom markers
    });

    // Add markers if locations are available
    updateMarkers();
  } catch (error) {
    console.error('Error initializing map:', error);
  }
};

const updateMarkers = () => {
  // Clear existing markers
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];

  const google = getGoogleMapsInstance();
  if (!google) return;

  // Add doctor marker
  if (props.doctorLocation) {
    markers.value.push(new google.maps.Marker({
      position: props.doctorLocation,
      map: map.value,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      title: 'Doctor'
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

watch([() => props.doctorLocation, () => props.showRoute], async ([newDocLoc, showRoute]) => {
  if (!map.value || !newDocLoc || !props.patientLocation) return;

  updateMarkers();

  if (showRoute) {
    const google = getGoogleMapsInstance();
    const directionsService = new google.maps.DirectionsService();
    
    try {
      const result = await directionsService.route({
        origin: newDocLoc,
        destination: props.patientLocation,
        travelMode: google.maps.TravelMode.DRIVING
      });

      directionsRenderer.value.setDirections(result);
      emit('route-calculated', result.routes[0].legs[0].duration.text);
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  }
});

onMounted(() => {
  initializeMap();
});

onUnmounted(() => {
  // Cleanup markers
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