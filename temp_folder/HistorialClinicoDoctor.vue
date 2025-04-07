<template>
  <div class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTopD />
    <div class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
      <!-- Botón Volver -->
      <div class="mb-6">
        <button 
          @click="$router.go(-1)"
          class="flex items-center text-[#5B5EA7] hover:text-[#4e4b8b]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Volver
        </button>
      </div>

      <!-- Título y datos del paciente -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-medblue text-center mb-6">Historial Clínico</h1>
        <div class="bg-[#F0F9FE] rounded-xl shadow-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-[#5B5EA7]">Datos del Paciente</h2>
            <router-link 
              :to="'/doctor/perfil/' + paciente.id" 
              class="px-4 py-2 bg-[#76C7D0] text-white rounded-full hover:bg-[#5aa7bd]">
              Ver perfil
            </router-link>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
            <div>
              <p><span class="font-medium">Nombre:</span> {{ paciente.nombre }} {{ paciente.apellido_paterno }} {{ paciente.apellido_materno }}</p>
              <p><span class="font-medium">Teléfono:</span> {{ paciente.telefono }}</p>
            </div>
            <div>
              <p><span class="font-medium">Edad:</span> {{ calcularEdad(paciente.fecha_nacimiento) }} años</p>
              <p><span class="font-medium">Sexo:</span> {{ paciente.sexo }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de consultas anteriores -->
      <div v-if="historial.length > 0">
        <div v-for="consulta in historial" :key="consulta.id" class="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-semibold text-lg text-[#5B5EA7]">
                Consulta del {{ new Date(consulta.fecha).toLocaleDateString() }}
              </h3>
            </div>
            <a 
              v-if="consulta.pdf_url"
              :href="consulta.pdf_url"
              target="_blank"
              class="px-4 py-2 bg-[#76C7D0] text-white rounded-full hover:bg-[#5aa7bd]">
              Ver PDF
            </a>
          </div>
          
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-700">Diagnóstico:</h4>
              <p class="mt-1">{{ consulta.diagnostico }}</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-700">Tratamiento:</h4>
              <p class="mt-1">{{ consulta.tratamiento || 'No especificado' }}</p>
            </div>
            <div v-if="consulta.notas">
              <h4 class="font-medium text-gray-700">Notas:</h4>
              <p class="mt-1">{{ consulta.notas }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center text-gray-600 py-8">
        No hay registros de consultas anteriores
      </div>
    </div>
    <NavBottomD class="lg:hidden"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/config/supabase';
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';

const route = useRoute();
const pacienteId = route.params.id;
const paciente = ref({});
const historial = ref([]);

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

const cargarDatos = async () => {
  try {
    // Cargar datos del paciente
    const { data: dataPaciente, error: errorPaciente } = await supabase
      .from('users')
      .select('*')
      .eq('id', pacienteId)
      .single();

    if (errorPaciente) throw errorPaciente;
    paciente.value = dataPaciente;

    // Cargar historial clínico
    const { data: dataHistorial, error: errorHistorial } = await supabase
      .from('historial_clinico')
      .select('*')
      .eq('paciente_id', pacienteId)
      .order('fecha', { ascending: false });

    if (errorHistorial) throw errorHistorial;
    historial.value = dataHistorial;

  } catch (error) {
    console.error('Error cargando datos:', error);
    alert('Error al cargar los datos: ' + error.message);
  }
};

onMounted(cargarDatos);
</script>
