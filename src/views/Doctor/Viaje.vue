<template>
  <div class="min-h-screen bg-fondo p-6 flex flex-col items-center">
    <NavTopD />
    <div class="max-w-4xl w-full bg-white p-6 rounded-xl shadow-xl mt-4">
      <!-- Estado del viaje -->
      <div class="mb-4 text-center">
        <h2 class="text-xl font-bold text-gray-800 mb-2">
          {{ viajeIniciado ? 'Viaje en curso' : 'Detalles del viaje' }}
        </h2>
        <div class="bg-blue-50 p-3 rounded-lg">
          <p class="text-blue-800">
            {{ viajeIniciado ? 'En camino al domicilio del paciente' : 'Presiona "Comenzar viaje" cuando estés listo' }}
          </p>
        </div>
      </div>

      <!-- Información de la consulta -->
      <div class="mb-6 space-y-3">
        <div class="flex items-center space-x-2">
          <UserIcon class="w-5 h-5 text-gray-600" />
          <p><strong>Paciente:</strong> {{ pacienteNombre }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <MapPinIcon class="w-5 h-5 text-gray-600" />
          <p><strong>Dirección:</strong> {{ direccionMostrada }}</p>
        </div>
        <div v-if="tiempoEstimado" class="flex items-center space-x-2">
          <ClockIcon class="w-5 h-5 text-gray-600" />
          <p><strong>Tiempo estimado:</strong> {{ tiempoEstimado }}</p>
        </div>
      </div>

      <!-- Mapa -->
      <div 
        v-if="doctorLocation && patientLocation" 
        class="relative rounded-xl overflow-hidden mb-6"
        style="height: 400px;"
      >
        <Mapview 
          :doctorLocation="doctorLocation" 
          :patientLocation="patientLocation"
          :showRoute="viajeIniciado"
          @route-calculated="handleRouteCalculated"
        />
      </div>
      <div v-else class="bg-gray-100 rounded-xl p-4 text-center mb-6">
        <p>Cargando mapa...</p>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-center space-x-4">
        <button 
          v-if="!viajeIniciado" 
          @click="ComenzarViaje" 
          class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          Comenzar viaje
        </button>
        <button 
          v-else-if="haLlegado" 
          @click="registrarConsulta" 
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          Registrar consulta
        </button>
        <button 
          v-if="viajeIniciado" 
          @click="abrirGoogleMaps" 
          class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-all"
        >
          Abrir en Google Maps
        </button>
      </div>
    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import Mapview from '@/components/Mapview.vue';
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import { UserIcon, MapPinIcon, ClockIcon } from 'lucide-vue-next';
import { initGoogleMaps } from '@/utils/maps';

const route = useRoute();
const router = useRouter();
const citaId = route.params.id;

// Estados
const cita = ref({});
const pacienteNombre = ref('');
const direccionMostrada = ref('');
const tiempoEstimado = ref('');
const doctorLocation = ref(null);
const patientLocation = ref(null);
const direccionPorDefecto = "P.º del Centenario 9580-9, Zona Urbana Rio Tijuana, 22010 Tijuana, B.C.";
const viajeIniciado = ref(false);
const haLlegado = ref(false);
let watchId = null;

// Función para cargar los datos de la cita
const cargarDatos = async () => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patients:user_id(
          nombre, 
          apellido_paterno, 
          apellido_materno
        )
      `)
      .eq('id', citaId)
      .single();

    if (error) throw error;

    cita.value = data;
    pacienteNombre.value = `${data.patients.nombre} ${data.patients.apellido_paterno}`;
    
    // Set direccionMostrada based on ubicacion or default address
    const addressToUse = data.ubicacion || direccionPorDefecto;
    direccionMostrada.value = addressToUse;

    try {
      // Try to parse as JSON only if it looks like a JSON string
      if (addressToUse.startsWith('{') || addressToUse.startsWith('[')) {
        const ubicacionData = JSON.parse(addressToUse);
        if (ubicacionData && ubicacionData.lat && ubicacionData.lng) {
          patientLocation.value = ubicacionData;
          return;
        }
      }

      // If not JSON or no valid coordinates, geocode the address
      const google = await initGoogleMaps();
      const geocoder = new google.maps.Geocoder();
      
      const resultado = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: addressToUse }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng()
            });
          } else {
            reject(new Error("No se pudo geocodificar la dirección"));
          }
        });
      });
      
      patientLocation.value = resultado;

    } catch (e) {
      console.error("Error procesando ubicación:", e);
      throw new Error("No se pudo procesar la ubicación");
    }

    // Obtener ubicación del doctor
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          doctorLocation.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        },
        (error) => {
          console.error("Error obteniendo ubicación del doctor:", error);
          alert("No se pudo obtener tu ubicación. Verifica los permisos de ubicación.");
        },
        { enableHighAccuracy: true }
      );
    }

  } catch (error) {
    console.error("Error cargando datos:", error);
    alert("Error al cargar los datos de la consulta. Por favor, intenta nuevamente.");
  }
};

// Función para iniciar el seguimiento de ubicación del doctor
const trackDoctorLocation = () => {
  if (!navigator.geolocation) {
    alert("Tu navegador no soporta geolocalización");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      doctorLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      if (patientLocation.value) {
        const distancia = calcularDistancia(
          doctorLocation.value,
          patientLocation.value
        );
        haLlegado.value = distancia < 0.2; // 200 metros

        // Actualizar tiempo estimado
        actualizarTiempoEstimado();
      }
    },
    (error) => {
      console.error("Error en seguimiento:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
};

// Función para actualizar tiempo estimado
const actualizarTiempoEstimado = async () => {
  if (!doctorLocation.value || !patientLocation.value) return;

  try {
    const google = await initGoogleMaps();
    const duration = await computeRouteAndTime(
      google,
      doctorLocation.value,
      patientLocation.value
    );
    tiempoEstimado.value = duration;
  } catch (error) {
    console.error("Error actualizando tiempo estimado:", error);
  }
};

const handleRouteCalculated = (duration) => {
  tiempoEstimado.value = duration;
};

const ComenzarViaje = async () => {
  try {
    if (!doctorLocation.value || !patientLocation.value) {
      alert("No se pueden obtener las ubicaciones necesarias para iniciar el viaje");
      return;
    }

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'en_proceso' })
      .eq('id', citaId);

    if (error) throw error;

    viajeIniciado.value = true;
    
    router.push({
      name: 'ComenzarViaje',
      query: {
        doctorLat: doctorLocation.value.lat,
        doctorLng: doctorLocation.value.lng,
        patientLat: patientLocation.value.lat,
        patientLng: patientLocation.value.lng,
        direccion: direccionMostrada.value,
        citaId: citaId
      }
    });
  } catch (error) {
    console.error("Error al iniciar viaje:", error);
    alert("Error al iniciar el viaje. Por favor, intenta nuevamente.");
  }
};

const registrarConsulta = async () => {
  try {
    await supabase
      .from('appointments')
      .update({ status: 'completada' })
      .eq('id', citaId);

    router.push(`/registro-cita/${citaId}`);
  } catch (error) {
    console.error("Error al registrar consulta:", error);
  }
};

const abrirGoogleMaps = () => {
  if (patientLocation.value) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${patientLocation.value.lat},${patientLocation.value.lng}`;
    window.open(url, '_blank');
  }
};

// Limpieza al desmontar el componente
onUnmounted(() => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
});

onMounted(async () => {
  await cargarDatos();
  if (!patientLocation.value) {
    alert("No se pudo obtener la ubicación del paciente. Verifica la dirección.");
  }
});
</script>
