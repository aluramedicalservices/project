<template>
  <div id="vista_agenda" class="flex flex-col justify-between min-h-screen font-nunito text-[#5B5EA7]">
    <NavTopD />
    <div id="contenedor_agenda" class="bg-[#F0F9FE] text-[#5B5EA7] py-20">
      <TituloPrincipal texto="Agenda"/>
      
      <!-- Leyenda de estados -->
      <div class="flex justify-center gap-4 mb-6 px-4">
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full bg-[#76C7D0] mr-2"></div>
          <span class="text-sm">Agendada</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full bg-[#5B5EA7] mr-2"></div>
          <span class="text-sm">En curso</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 rounded-full bg-[#E0F9FC] border border-[#76C7D0] mr-2"></div>
          <span class="text-sm">Completada</span>
        </div>
      </div>

      <div id="agenda_vuecal" class="px-4">
        <vue-cal 
          class="custom-theme font-nunito" 
          :view="view" 
          :events="events" 
          :views="['day', 'month']" 
          locale="es"
          :time-from="8 * 60" 
          :time-to="21 * 60" 
          :time-step="30"
          :on-event-click="onEventClick"
          :events-on-month-view="true"
          :disable-views="['years', 'year', 'week']"
          watch-real-time
        />
      </div>
    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { VueCal } from 'vue-cal';
import { supabase } from '@/config/supabase';
import 'vue-cal/style';
import NavTopD from '@/components/comp_doctor/NavTopD.vue';
import NavBottomD from '@/components/comp_doctor/NavBottomD.vue';
import TituloPrincipal from '@/components/TituloPrincipal.vue';

const router = useRouter();
const view = ref('month');
const events = ref([]);

const cargarCitas = async () => {
  try {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_type,
        appointment_date,
        appointment_time,
        status,
        patients:user_id(nombre, apellido_paterno)
      `)
      .eq('doctor_id', doctorId);

    if (error) throw error;

    events.value = data.map(cita => {
      const fechaHora = `${cita.appointment_date} ${cita.appointment_time}`;
      const startDate = new Date(fechaHora);
      const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutos después

      // Definir el color según el estado
      const colorMap = {
        'agendada': '#76C7D0',
        'en_proceso': '#5B5EA7',
        'completada': '#E0F9FC'
      };

      return {
        start: startDate,
        end: endDate,
        title: 'Cita',
        class: `estado-${cita.status}`,
        backgroundColor: colorMap[cita.status] || '#76C7D0',
        borderColor: cita.status === 'completada' ? '#76C7D0' : 'transparent',
        id: cita.id
      };
    });
  } catch (error) {
    console.error('Error al cargar citas:', error);
  }
};

const onEventClick = (event) => {
  if (event && event.id) {
    router.push({
      name: 'DetallesCitaD',
      params: { citaId: event.id }
    });
  }
};

onMounted(() => {
  cargarCitas();
  
  // Suscripción a cambios en tiempo real
  const channel = supabase
    .channel('agenda_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'appointments',
      filter: `doctor_id=eq.${localStorage.getItem('doctorId')}`
    }, () => cargarCitas())
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
});
</script>

<style>
.vuecal {
  height: 650px !important;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.vuecal__title {
  color: #5B5EA7 !important;
  font-weight: bold;
}

.vuecal__cell {
  background-color: white !important;
}

.vuecal__cell--today {
  background-color: #F0F9FE !important;
}

.vuecal__cell--selected {
  background-color: #E0F9FC !important;
}

.vuecal__event {
  border-radius: 4px;
  color: white;
}

.estado-completada {
  color: #5B5EA7 !important;
  background-color: #E0F9FC !important;
  border: 1px solid #76C7D0 !important;
}

.vuecal__header {
  background-color: #ABBAF0 !important;
  border-radius: 1rem 1rem 0 0;
}

.vuecal__weekdays-headings {
  background-color: #F0F9FE !important;
}

/* Añadir color al texto de los días */
.vuecal__cell-date {
  color: #5B5EA7 !important;
  font-weight: 500;
}

/* Color para el texto del mes y año */
.vuecal__title-bar {
  color: #5B5EA7 !important;
}

/* Color para los días de la semana */
.vuecal__weekdays-headings .vuecal__heading {
  color: #5B5EA7 !important;
  font-weight: 600;
}

/* Color para las horas en la vista de día */
.vuecal__time-cell {
  color: #5B5EA7 !important;
}

.vuecal:not(.vuecal--day-view) .vuecal__event {
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.vuecal__menu {
  background-color: #F0F9FE !important;
}
</style>