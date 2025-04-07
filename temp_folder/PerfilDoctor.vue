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
      
      <h1 class="text-3xl font-bold text-medblue text-center mb-8">Perfil del Paciente</h1>
      
      <div class="bg-[#F0F9FE] rounded-xl shadow-lg p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 class="text-lg font-semibold text-[#5B5EA7] mb-4">Datos Personales</h2>
            <div class="space-y-3">
              <p><span class="font-medium">Nombre:</span> {{ usuario.nombre }} {{ usuario.apellido_paterno }} {{ usuario.apellido_materno }}</p>
              <p><span class="font-medium">Edad:</span> {{ calcularEdad(usuario.fecha_nacimiento) }} años</p>
              <p><span class="font-medium">Fecha de nacimiento:</span> {{ formatearFecha(usuario.fecha_nacimiento) }}</p>
              <p><span class="font-medium">Sexo:</span> {{ usuario.sexo }}</p>
            </div>
          </div>
          
          <div>
            <h2 class="text-lg font-semibold text-[#5B5EA7] mb-4">Información de Contacto</h2>
            <div class="space-y-3">
              <p><span class="font-medium">Correo:</span> {{ usuario.correo }}</p>
              <p><span class="font-medium">Teléfono:</span> {{ usuario.telefono }}</p>
              <p><span class="font-medium">Dirección:</span> {{ usuario.direccion || 'No especificada' }}</p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h2 class="text-lg font-semibold text-[#5B5EA7] mb-4">Información Médica</h2>
          <div class="space-y-3">
            <p><span class="font-medium">Alergias:</span> {{ usuario.alergias || 'Ninguna registrada' }}</p>
            <p><span class="font-medium">Enfermedades crónicas:</span> {{ usuario.enfermedades_cronicas || 'Ninguna registrada' }}</p>
            <p><span class="font-medium">Medicamentos actuales:</span> {{ usuario.medicamentos_actuales || 'Ninguno registrado' }}</p>
          </div>
        </div>
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
const usuario = ref({});

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

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const cargarDatos = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', route.params.id)
      .single();

    if (error) throw error;
    usuario.value = data;
  } catch (error) {
    console.error('Error cargando datos:', error);
    alert('Error al cargar los datos del usuario');
  }
};

onMounted(cargarDatos);
</script>
