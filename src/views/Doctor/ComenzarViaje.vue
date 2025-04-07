<template>
  <div class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTopD />
    <div class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
      <Titulo texto="Viaje en curso" />
      
      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <div class="flex items-center space-x-2 mb-2">
          <MapPinIcon class="w-5 h-5 text-blue-600" />
          <p><strong>Dirección del paciente:</strong> {{ direccion }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <ClockIcon class="w-5 h-5 text-blue-600" />
          <p><strong>Tiempo estimado:</strong> {{ tiempoEstimado || 'Calculando...' }}</p>
        </div>
      </div>

      <!-- Mapa en tiempo real -->
      <div class="rounded-xl overflow-hidden mb-6" style="height: 400px;">
        <Mapview 
          :doctorLocation="currentLocation" 
          :patientLocation="patientLocation"
          :showRoute="true"
          :currentRoute="currentRoute"
          @route-calculated="handleRouteCalculated"
        />
      </div>

      <div class="flex justify-center space-x-4">
        <button 
          @click="abrirGoogleMaps" 
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          Abrir en Google Maps
        </button>
        <button 
          @click="registrarConsulta" 
          class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
        >
          Registrar cita
        </button>
        <button 
          v-if="haLlegado"
          @click="registrarConsulta" 
          class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
        >
          Iniciar Consulta
        </button>
      </div>
    </div>
    <NavBottomD class="lg:hidden"/>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavTopD from '../../components/comp_doctor/NavTopD.vue';
import NavBottomD from '../../components/comp_doctor/NavBottomD.vue';
import Titulo from '../../components/Titulo.vue';
import Mapview from '../../components/Mapview.vue';
import { MapPinIcon, ClockIcon } from 'lucide-vue-next';
import { supabase } from '@/config/supabase';
import { initGoogleMaps } from '@/utils/maps';

const route = useRoute();
const router = useRouter();

const currentLocation = ref(null);
const patientLocation = ref(null);
const direccion = ref('');
const tiempoEstimado = ref('');
const haLlegado = ref(false);
const directionsService = ref(null);
const currentRoute = ref(null);
let watchId = null;

onMounted(async () => {
  try {
    const google = await initGoogleMaps();
    directionsService.value = new google.maps.DirectionsService();
  } catch (error) {
    console.error("Error loading Google Maps:", error);
  }

  // Get locations from route query
  patientLocation.value = {
    lat: parseFloat(route.query.patientLat),
    lng: parseFloat(route.query.patientLng)
  };
  direccion.value = route.query.direccion;
  
  startTracking();
});

const updateRoute = async () => {
  if (!directionsService.value || !currentLocation.value || !patientLocation.value) return;

  try {
    const google = window.google; // Use the global google object
    const result = await directionsService.value.route({
      origin: currentLocation.value,
      destination: patientLocation.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    if (result.routes && result.routes[0]) {
      currentRoute.value = result.routes[0];
      // Update tiempo estimado with new duration
      const duration = result.routes[0].legs[0].duration.text;
      tiempoEstimado.value = duration;
    }
  } catch (error) {
    console.error("Error actualizando ruta:", error);
  }
};

const startTracking = () => {
  if (!navigator.geolocation) {
    alert("Geolocalización no disponible");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      currentLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      await updateRoute(); // Update route when location changes
      checkDistance();
    },
    (error) => console.error("Error tracking location:", error),
    { enableHighAccuracy: true }
  );
};

const checkDistance = () => {
  if (currentLocation.value && patientLocation.value) {
    const distance = calculateDistance(currentLocation.value, patientLocation.value);
    haLlegado.value = distance < 0.2; // 200 meters
  }
};

const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const handleRouteCalculated = (duration) => {
  tiempoEstimado.value = duration;
};

const abrirGoogleMaps = () => {
  if (patientLocation.value) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${patientLocation.value.lat},${patientLocation.value.lng}`;
    window.open(url, '_blank');
  }
};

const registrarConsulta = async () => {
  try {
    await supabase
      .from('appointments')
      .update({ status: 'completada' })
      .eq('id', route.query.citaId);
    
    router.push(`/registro-cita/${route.query.citaId}`);
  } catch (error) {
    console.error("Error al registrar consulta:", error);
  }
};

onUnmounted(() => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
  }
});
</script>