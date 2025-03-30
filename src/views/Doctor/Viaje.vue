<template>
  <div class="min-h-screen bg-fondo p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Mapa -->
      <div class="h-96 bg-white rounded-xl shadow-lg mb-6">
        <div ref="mapContainer" class="h-full w-full rounded-xl"></div>
      </div>

      <!-- Información del Paciente -->
      <div class="bg-white p-4 rounded-xl shadow-lg">
        <h2 class="text-lg font-semibold mb-4">En camino a la consulta</h2>
        <p>Paciente: {{ pacienteNombre }}</p>
        <p>Dirección: {{ cita.ubicacion }}</p>
        <p>Tiempo estimado: {{ tiempoEstimado }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/config/supabase';

const route = useRoute();
const citaId = route.params.id;
const mapContainer = ref(null);
const cita = ref({});
const pacienteNombre = ref('');
const tiempoEstimado = ref('Calculando...');

const loadMap = async () => {
  // Implementar lógica de Google Maps API
  const { Map } = await google.maps.importLibrary("maps");
  const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");

  const map = new Map(mapContainer.value, {
    center: { lat: 32.5149, lng: -117.0382 }, // Coordenadas de Tijuana
    zoom: 12,
  });

  const directionsService = new DirectionsService();
  const directionsRenderer = new DirectionsRenderer({ map });

  // Obtener ubicación en tiempo real del doctor
  navigator.geolocation.watchPosition((position) => {
    const doctorPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    directionsService.route({
      origin: doctorPos,
      destination: cita.value.ubicacion,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        tiempoEstimado.value = result.routes[0].legs[0].duration.text;
      }
    });
  });
};

const cargarDatos = async () => {
  const { data } = await supabase
    .from('appointments')
    .select('*, patients:user_id(nombre, apellido_paterno)')
    .eq('id', citaId)
    .single();

  cita.value = data;
  pacienteNombre.value = `${data.patients.nombre} ${data.patients.apellido_paterno}`;
};

onMounted(async () => {
  await cargarDatos();
  if (window.google) loadMap();
});
</script>