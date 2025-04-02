<template>
  <div class="flex flex-col justify-between min-h-screen font-nunito" style="background-color: #F0F9FE;">
    <NavTopD />
    <div class="w-4/5 max-w-[1200px] mx-auto pt-20 pb-32">
      <!-- Encabezado -->
      <div class="text-center mb-8">
        <TituloH2 texto="Mis Pacientes" class="text-[#5B5EA7]" />
        <p style="color: #5B5EA7">Lista de pacientes atendidos</p>
      </div>

      <!-- Barra de búsqueda -->
      <div class="mb-6">
        <input 
          type="text" 
          v-model="busqueda" 
          placeholder="Buscar paciente por nombre..."
          class="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
          style="border-color: #76C7D0; background-color: #E0F9FC;"
          @input="buscarPacientes"
        >
      </div>

      <!-- Lista de pacientes -->
      <div v-if="pacientes.length > 0" class="space-y-4">
        <div 
          v-for="paciente in pacientes" 
          :key="paciente.id"
          class="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          style="background-color: #E0F9FC; border: 1px solid #76C7D0;"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-lg" style="color: #5B5EA7">
                {{ paciente.nombre_completo }}
              </h3>
              <p class="text-sm" style="color: #5B5EA7">
                Última consulta: {{ formatearFecha(paciente.ultima_consulta) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm" style="color: #5B5EA7">
                Total consultas: {{ paciente.total_consultas }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <button 
              @click="verHistorialPaciente(paciente.id)"
              class="px-3 py-1 text-white rounded-lg text-sm transition-colors duration-200"
              style="background-color: #76C7D0; hover:background-color: #5B5EA7"
            >
              Ver historial
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje sin resultados -->
      <div v-else class="text-center py-12">
        <p style="color: #5B5EA7">No se encontraron pacientes registrados</p>
      </div>
    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/config/supabase';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import TituloH2 from '@/components/TituloH2.vue';

const router = useRouter();
const pacientes = ref([]);
const busqueda = ref('');

const formatearFecha = (fecha) => {
  if (!fecha) return 'No disponible';
  return format(parseISO(fecha), "d 'de' MMMM 'de' yyyy", { locale: es });
};

const cargarPacientes = async () => {
  try {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) {
      router.push('/dashboard-doctor');
      return;
    }

    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        user_id,
        patients:user_id(
          id,
          nombre,
          apellido_paterno,
          apellido_materno
        ),
        fin_consulta
      `)
      .eq('doctor_id', doctorId)
      .eq('status', 'completada');

    if (error) throw error;

    // Procesar y agrupar por paciente
    const pacientesMap = new Map();
    appointments.forEach(cita => {
      if (!cita.patients) return;
      
      const pacienteId = cita.patients.id;
      if (!pacientesMap.has(pacienteId)) {
        pacientesMap.set(pacienteId, {
          id: pacienteId,
          nombre_completo: `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim(),
          total_consultas: 1,
          ultima_consulta: cita.fin_consulta
        });
      } else {
        const paciente = pacientesMap.get(pacienteId);
        paciente.total_consultas++;
        if (cita.fin_consulta > paciente.ultima_consulta) {
          paciente.ultima_consulta = cita.fin_consulta;
        }
      }
    });

    pacientes.value = Array.from(pacientesMap.values());

  } catch (error) {
    console.error('Error al cargar pacientes:', error);
    alert('Error al cargar la lista de pacientes');
  }
};

const buscarPacientes = () => {
  if (!busqueda.value.trim()) {
    cargarPacientes();
    return;
  }

  const termino = busqueda.value.toLowerCase();
  pacientes.value = pacientes.value.filter(paciente => 
    paciente.nombre_completo.toLowerCase().includes(termino)
  );
};

const verHistorialPaciente = (pacienteId) => {
  router.push({
    name: 'HistorialCitas',
    query: { pacienteId }
  });
};

onMounted(() => {
  cargarPacientes();
});
</script>
