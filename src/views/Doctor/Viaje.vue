<template>
  <div class="min-h-screen bg-fondo p-6 flex flex-col items-center">
    <NavTopD />
    <div class="max-w-4xl w-full bg-white p-6 rounded-xl shadow-xl mt-4">
      <!-- Muestra el mapa si se tienen ambas coordenadas -->
      <Mapview 
        v-if="doctorLocation && patientLocation" 
        :doctorLocation="doctorLocation" 
        :patientLocation="patientLocation" 
        class="rounded-xl overflow-hidden"
      />

      <!-- Información de la consulta -->
      <div class="mt-6 space-y-4 text-center">
        <h2 class="text-xl font-bold text-gray-800">En camino a la consulta</h2>
        <p class="text-gray-600"><strong>Paciente:</strong> {{ pacienteNombre }}</p>
        <p class="text-gray-600"><strong>Dirección:</strong> {{ direccionMostrada }}</p>
        <p class="text-gray-600"><strong>Tiempo estimado:</strong> {{ tiempoEstimado }}</p>
        
        <!-- Botones: si aún no se inició el viaje se muestra "Comenzar viaje"; si ya inició y el doctor está cerca, se muestra "Registrar consulta" -->
        <button 
          v-if="!viajeIniciado" 
          @click="iniciarViaje" 
          class="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          Comenzar viaje
        </button>
        <button 
          v-else-if="haLlegado" 
          @click="registrarConsulta" 
          class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          Registrar consulta
        </button>
      </div>
    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import Mapview from '@/components/Mapview.vue';
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import { Loader } from '@googlemaps/js-api-loader';

const route = useRoute();
const router = useRouter();
const citaId = route.params.id;

const cita = ref({});
const pacienteNombre = ref('');
const tiempoEstimado = ref('Calculando...');
const doctorLocation = ref(null);
const patientLocation = ref(null);
const direccionPorDefecto = "P.º del Centenario 9580-9, Zona Urbana Rio Tijuana, 22010 Tijuana, B.C.";

// Estados para el viaje
const viajeIniciado = ref(false);
const haLlegado = ref(false);

// Si la cita tiene una ubicación en formato JSON (coordenadas) se usará, de lo contrario se mostrará como dirección
const direccionMostrada = computed(() => {
  try {
    const parsed = JSON.parse(cita.value.ubicacion);
    if (parsed && parsed.lat && parsed.lng) {
      return `Coordenadas: ${parsed.lat.toFixed(5)}, ${parsed.lng.toFixed(5)}`;
    }
  } catch (e) {
    // No es JSON, se asume que es una dirección
  }
  return cita.value.ubicacion || direccionPorDefecto;
});

// Carga los datos de la cita desde Supabase
const cargarDatos = async () => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, patients:user_id(nombre, apellido_paterno)')
    .eq('id', citaId)
    .single();

  if (error) {
    console.error("Error al cargar datos de la cita:", error);
    return;
  }
  cita.value = data;
  pacienteNombre.value = `${data.patients.nombre} ${data.patients.apellido_paterno}`;
  // Si no se ha registrado la ubicación, se utiliza la dirección por defecto
  if (!cita.value.ubicacion) {
    cita.value.ubicacion = direccionPorDefecto;
  }
};

// Función que utiliza la API de geocodificación de Google para convertir una dirección en coordenadas
const geocodeAddress = async (google, address) => {
  const geocoder = new google.maps.Geocoder();
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        reject("No se pudo geocodificar la dirección: " + status);
      }
    });
  });
};

// Calcula el tiempo estimado de ruta entre dos puntos
const computeRouteAndTime = async (google, origin, destination) => {
  const directionsService = new google.maps.DirectionsService();
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          const durationText = result.routes[0].legs[0].duration.text;
          resolve(durationText);
        } else {
          reject("Error al calcular la ruta: " + status);
        }
      }
    );
  });
};

// Función para calcular la distancia en kilómetros entre dos coordenadas (usando la fórmula Haversine)
const calcularDistancia = (pos1, pos2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (pos2.lat - pos1.lat) * (Math.PI / 180);
  const dLon = (pos2.lng - pos1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(pos1.lat * (Math.PI / 180)) *
      Math.cos(pos2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Carga la ubicación del paciente y del doctor y calcula el tiempo estimado
const loadMapData = async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly",
  });
  const google = await loader.load();

  // Primero se obtiene la ubicación actual del doctor
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        doctorLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        let patientLoc;
        try {
          // Se intenta parsear la ubicación almacenada en la cita
          const parsed = JSON.parse(cita.value.ubicacion);
          if (parsed && parsed.lat && parsed.lng) {
            patientLoc = parsed;
          }
        } catch (e) {
          // Si no es JSON, se asume que es una dirección y se geocodifica
          try {
            patientLoc = await geocodeAddress(google, cita.value.ubicacion);
          } catch (err) {
            console.error(err);
            tiempoEstimado.value = "No disponible";
            return;
          }
        }
        patientLocation.value = patientLoc;

        // Se calcula el tiempo estimado de ruta
        try {
          const duration = await computeRouteAndTime(google, doctorLocation.value, patientLocation.value);
          tiempoEstimado.value = duration;
        } catch (err) {
          console.error(err);
          tiempoEstimado.value = "No disponible";
        }
      },
      (error) => {
        console.error("Error obteniendo geolocalización del doctor:", error);
      },
      { enableHighAccuracy: true }
    );
  } else {
    console.error("Geolocalización no soportada");
  }
};

// Función para iniciar el viaje: se actualiza el estado en la base de datos y se activa el tracking en tiempo real
const iniciarViaje = async () => {
  const { error } = await supabase
    .from('appointments')
    .update({ status: 'en camino' })
    .eq('id', citaId);
  if (error) {
    console.error("Error al iniciar viaje:", error);
    return;
  }
  viajeIniciado.value = true;
  // Inicia el tracking en tiempo real del doctor
  trackDoctorLocation();
};

// Función que utiliza watchPosition para actualizar la ubicación del doctor y calcular la distancia con el paciente
const trackDoctorLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        doctorLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        if (patientLocation.value) {
          const distance = calcularDistancia(doctorLocation.value, patientLocation.value);
          // Si la distancia es menor a 0.2 km (200 metros), consideramos que el doctor ha llegado
          haLlegado.value = distance < 0.2;
        }
      },
      (error) => console.error("Error tracking location:", error),
      { enableHighAccuracy: true }
    );
  }
};

// Función para registrar la consulta y actualizar su estado a 'completada'
const registrarConsulta = async () => {
  const { error } = await supabase
    .from('appointments')
    .update({
      status: 'completada',
      fin_consulta: new Date().toISOString()
    })
    .eq('id', citaId);
  if (error) {
    console.error("Error al registrar la consulta:", error);
    return;
  }
  router.push(`/registro-cita/${citaId}`);
};

onMounted(async () => {
  await cargarDatos();
  await loadMapData();
});
</script>

<style scoped>
/* Agrega estilos adicionales si es necesario */
</style>
