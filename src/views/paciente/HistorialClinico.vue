<template>
  <div class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-gradient-to-br from-slate-100 to-white">
    <NavTop />
    <div  class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto pt-20 pb-32">
      <div class="flex flex-col items-center gap-3 mb-12">
        <ClipboardDocumentIcon class="w-12 h-12 text-[#5B5EA7]"/>
        <h1 class="text-4xl font-semibold text-[#5B5EA7] text-center">Historial Clínico</h1>
      </div>
      
      <div class="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm">
        <select 
          v-model="filtroTipo"
          class="px-6 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#76C7D0] bg-[#F0F9FE] text-[#5B5EA7] font-medium transition-all hover:border-[#76C7D0]">
          <option value="">Todos los tipos</option>
          <option value="online">Online</option>
          <option value="domicilio">A domicilio</option>
          <option value="especialista">Especialista</option>
        </select>
      </div>
      
      <div v-if="loading" class="text-center py-12 bg-white rounded-2xl shadow-sm">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#76C7D0] mx-auto"></div>
        <p class="text-[#5B5EA7] mt-4 font-medium">Cargando tu historial médico...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12 bg-white rounded-2xl shadow-sm border border-red-200">
        <div class="mx-auto w-16 h-16 text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button 
          @click="cargarHistorial"
          class="px-4 py-2 bg-[#76C7D0] text-white rounded-full hover:bg-[#5B5EA7]">
          Reintentar
        </button>
      </div>
      
      <div v-else-if="historialFiltrado.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-sm border-2 border-dashed border-[#76C7D0]/30">
        <div class="mx-auto w-20 h-20 text-[#76C7D0] mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-[#5B5EA7] font-medium">No se encontraron registros médicos</p>
        <p class="text-[#5B5EA7]/70 mt-2">Tus futuras consultas aparecerán aquí</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="registro in historialFiltrado" 
          :key="registro.id"
          class="bg-gradient-to-br from-white to-[#F0F9FE] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#E0F9FC] overflow-hidden">
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-xl font-bold text-[#5B5EA7] mb-1">{{ formatoTipoCita(registro.appointment_type) }}</h3>
                <p class="text-sm text-[#5B5EA7]/70 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatoFecha(registro.appointment_date) }}
                </p>
              </div>
              <span class="px-4 py-1.5 rounded-xl text-sm font-medium"
                :class="{
                  'bg-green-100 text-green-800': registro.status === 'completada',
                  'bg-blue-100 text-blue-800': registro.status === 'en_proceso'
                }">
                {{ registro.status === 'completada' ? 'Completada' : 'En Proceso' }}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <div class="bg-white/50 rounded-xl p-4">
                <p class="text-sm text-[#5B5EA7]/70 mb-1">Doctor</p>
                <p class="font-medium text-[#5B5EA7]">{{ registro.doctor_nombre || 'No especificado' }}</p>
              </div>
              <div class="bg-white/50 rounded-xl p-4">
                <p class="text-sm text-[#5B5EA7]/70 mb-1">Modalidad</p>
                <p class="font-medium text-[#5B5EA7]">{{ registro.appointment_type === 'online' ? 'Virtual' : 'Presencial' }}</p>
              </div>
            </div>
            
            <div class="bg-white/50 rounded-xl p-4 mb-3">
              <p class="text-sm text-[#5B5EA7]/70 mb-1">Diagnóstico</p>
              <p class="font-medium text-[#5B5EA7] line-clamp-2">{{ registro.diagnostico || 'No se registró diagnóstico' }}</p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-2">
              <button 
                @click="verDetalles(registro.id)"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-[#76C7D0] to-[#5B5EA7] text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver detalles
              </button>
              <button 
                v-if="registro.pdf_url"
                @click="descargarPDF(registro)"
                class="flex-1 px-6 py-3 bg-[#F0F9FE] text-[#5B5EA7] border-2 border-[#76C7D0] rounded-xl hover:bg-[#E0F9FC] hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NavBottom class="lg:hidden"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import NavTop from '@/components/comp_paciente/NavTop.vue';
import NavBottom from '@/components/comp_paciente/NavBottom.vue';
import { ElLoading, ElNotification } from 'element-plus';
import { ClipboardDocumentIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const historial = ref([]);
const loading = ref(true);
const error = ref(null);
const busqueda = ref('');
const filtroTipo = ref('');

// Formateadores
const formatoFecha = (fecha) => {
  if (!fecha) return 'No especificada';
  try {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
};

const formatoTipoCita = (tipo) => {
  const tipos = {
    'online': 'Consulta Online',
    'domicilio': 'Visita a Domicilio',
    'especialista': 'Consulta Especializada'
  };
  return tipos[tipo] || 'Consulta';
};

// Filtrado computado
const historialFiltrado = computed(() => {
  let resultados = historial.value;
  
  // Filtro por búsqueda
  if (busqueda.value) {
    const termino = busqueda.value.toLowerCase();
    resultados = resultados.filter(registro => 
      (registro.diagnostico && registro.diagnostico.toLowerCase().includes(termino)) ||
      (registro.doctor_nombre && registro.doctor_nombre.toLowerCase().includes(termino))
    );
  }
  
  // Filtro por tipo
  if (filtroTipo.value) {
    resultados = resultados.filter(registro => 
      registro.appointment_type === filtroTipo.value
    );
  }
  
  return resultados.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
});

// Métodos
const verDetalles = (citaId) => {
  router.push({ 
    name: 'DetallesCitaD',
    params: { id: citaId } 
  });
};

const descargarPDF = async (registro) => {
  if (!registro.pdf_url) {
    ElNotification({
      title: 'Error',
      message: 'No hay PDF disponible para esta consulta',
      type: 'error',
      duration: 3000
    });
    return;
  }

  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Preparando PDF para descarga...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    // Opción 1: Descargar directamente desde la URL pública
    try {
      const response = await fetch(registro.pdf_url);
      if (!response.ok) throw new Error('Error al obtener el PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `consulta_${registro.id}_${new Date(registro.appointment_date).toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Liberar memoria
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
      loadingInstance.close();
      return;
    } catch (directError) {
      console.log('Descarga directa falló, intentando con Supabase Storage...', directError);
    }

    // Opción 2: Descargar usando Supabase Storage
    try {
      // Extraer el nombre del archivo de la URL
      const fileName = registro.pdf_url.split('/').pop();
      
      const { data, error: downloadError } = await supabase.storage
        .from('consultas')
        .download(fileName);

      if (downloadError) throw downloadError;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `consulta_${registro.id}.pdf`;
      link.click();
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);

    } catch (storageError) {
      console.error('Error con Supabase Storage:', storageError);
      throw new Error('No se pudo descargar el PDF desde ninguna fuente');
    }

  } catch (error) {
    console.error('Error descargando PDF:', error);
    
    // Opción 3: Abrir en nueva pestaña como último recurso
    if (registro.pdf_url) {
      window.open(registro.pdf_url, '_blank');
    }
    
    ElNotification({
      title: 'Error',
      message: error.message || 'Error al descargar el PDF',
      type: 'error',
      duration: 5000
    });
  } finally {
    loadingInstance.close();
  }
};

const cargarHistorial = async () => {
  try {
    loading.value = true;
    error.value = null;
    historial.value = [];
    
    // Obtener usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('Debes iniciar sesión para ver tu historial');
    }

    // Consulta corregida para obtener citas completadas
    const { data: citas, error: citasError } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_type,
        appointment_date,
        appointment_time,
        status,
        diagnostico,
        pdf_url,
        doctor_id (nombre_completo, especialidad),
        receta,
        notas_medicas,
        ubicacion
      `)
      .eq('user_id', user.id)
      .eq('status', 'completada')
      .order('appointment_date', { ascending: false });

    if (citasError) throw citasError;
    
    // Mapeo de resultados
    historial.value = citas.map(cita => ({
      ...cita,
      doctor_nombre: cita.doctor_id?.nombre_completo || 'Doctor no especificado',
      especialidad: cita.doctor_id?.especialidad || 'No especificada'
    }));
    
  } catch (err) {
    console.error('Error cargando historial:', err);
    error.value = err.message || 'Error al cargar el historial médico';
  } finally {
    loading.value = false;
  }
};

// Carga inicial
onMounted(cargarHistorial);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:active {
  transform: scale(0.98);
}
</style>