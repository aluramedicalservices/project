<template>
  <div class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTopD />
    <div class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
      <!-- Estado del viaje -->
      <div class="mb-4 text-center">
        <h2 class="text-4xl font-bold mb-2" style="color: #3D4448">
          {{ viajeIniciado ? 'Viaje en curso' : 'Detalles del viaje' }}
        </h2>
        <div class="bg-blue-50 p-3 rounded-lg">
          <p class="text-blue-800">
            {{ viajeIniciado ? 'En camino al domicilio del paciente' : 'Presiona "Comenzar viaje" cuando estés listo' }}
          </p>
          <p v-if="distancia" class="text-blue-600 mt-1">
            Distancia: {{ distancia.toFixed(2) }} km
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
          @click="comenzarViaje" 
          class="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-all text-sm"
          style="background-color: #5B5EA7; hover:opacity-90"
        >
          Comenzar viaje
        </button>
        <button 
          v-else-if="haLlegado" 
          @click="registrarConsulta" 
          class="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-all text-sm"
          style="background-color: #5B5EA7; hover:opacity-90"
        >
          Registrar consulta
        </button>
        <button 
          v-if="viajeIniciado && !haLlegado" 
          @click="verificarLlegada"
          class="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-all text-sm"
          style="background-color: #5B5EA7; hover:opacity-90"
        >
          He llegado
        </button>
        <button 
          v-if="viajeIniciado" 
          @click="abrirGoogleMaps" 
          class="px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-all text-sm"
          style="background-color: #5B5EA7; hover:opacity-90"
        >
          Abrir en Google Maps
        </button>
      </div>
    </div>
    <NavBottomD class="lg:hidden"/>
    <AlertMessage 
      :show="showAlert" 
      :message="`Aún no has llegado. Estás a ${distancia.toFixed(2)} km del destino`"
      @close="showAlert = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import Mapview from '@/components/Mapview.vue';
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import { UserIcon, MapPinIcon, ClockIcon } from 'lucide-vue-next';
import { initGoogleMaps } from '@/utils/maps';
import AlertMessage from '@/components/AlertMessage.vue';

const route = useRoute();
const router = useRouter();
const citaId = route.params.id;

// Estados
const cita = ref({});
const pacienteNombre = ref('');
const direccionMostrada = ref('');
const tiempoEstimado = ref('');
const distancia = ref(0);
const doctorLocation = ref(null);
const patientLocation = ref(null);
const viajeIniciado = ref(false);
const haLlegado = ref(false);
const showAlert = ref(false);
let watchId = null;

const calcularDistancia = (pos1, pos2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const dLon = (pos2.lng - pos1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

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
    
    // Procesar ubicación
    try {
      const ubicacion = JSON.parse(data.direccion);
      if (ubicacion && ubicacion.lat && ubicacion.lng) {
        patientLocation.value = ubicacion;
        direccionMostrada.value = 'Ubicación en mapa';
      } else {
        throw new Error('Formato de ubicación inválido');
      }
    } catch {
      direccionMostrada.value = data.direccion || 'Dirección no especificada';
      const google = await initGoogleMaps();
      const geocoder = new google.maps.Geocoder();
      
      const { results } = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: direccionMostrada.value }, (results, status) => {
          status === "OK" ? resolve(results) : reject(status);
        });
      });
      
      patientLocation.value = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()
      };
    }

    // Verificar si el viaje ya estaba iniciado
    if (cita.value.status === 'en_proceso') {
      viajeIniciado.value = true;
      iniciarSeguimiento();
    }

  } catch (error) {
    console.error("Error cargando datos:", error);
    alert("Error al cargar los datos de la consulta");
  }
};

const iniciarSeguimiento = () => {
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
        distancia.value = calcularDistancia(
          doctorLocation.value,
          patientLocation.value
        );
        haLlegado.value = distancia.value < 0.2; // 200 metros
      }
    },
    (error) => console.error("Error en geolocalización:", error),
    { enableHighAccuracy: true, timeout: 5000 }
  );
};

const handleRouteCalculated = (duration) => {
  tiempoEstimado.value = duration;
};

const comenzarViaje = async () => {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        status: 'en_proceso',
        inicio_consulta: new Date().toISOString()
      })
      .eq('id', citaId);

    if (error) throw error;

    viajeIniciado.value = true;
    iniciarSeguimiento();
    
  } catch (error) {
    console.error("Error al iniciar viaje:", error);
    alert("Error al iniciar el viaje. Por favor, intenta nuevamente.");
  }
};

const verificarLlegada = () => {
  if (distancia.value < 0.2) {
    haLlegado.value = true;
  } else {
    showAlert.value = true;
  }
};

const registrarConsulta = async () => {
  router.push(`/registro-cita/${citaId}`);
};

const abrirGoogleMaps = () => {
  if (patientLocation.value) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${patientLocation.value.lat},${patientLocation.value.lng}&travelmode=driving`;
    window.open(url, '_blank');
  }
};

onMounted(() => {
  cargarDatos();
});

onUnmounted(() => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
});
</script>

<style scoped>
.bg-fondo {
  background-color: #F0F9FE;
}
</style>