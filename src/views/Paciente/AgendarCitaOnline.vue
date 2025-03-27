<template>
  <NavTop />
  <div id="Schedule_appointment" class="p-4 max-w-2xl mx-auto pb-32">
    <button 
      @click="router.push('/dashboard-paciente')"
      class="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
    >
      ← Volver
    </button>
    <Titulo texto="Agendar cita online" />

    <!-- Selector de fecha -->
    <div class="mb-8">
      <label class="block text-lg font-medium mb-2">Fecha de la cita</label>
      <Calendar 
        :selected-date="selectedDate"
        @date-selected="handleDateSelect"
      />
      <p class="mt-2 text-gray-600">
        Fecha seleccionada: {{ formattedSelectedDate || 'Selecciona una fecha' }}
      </p>
    </div>

    <!-- Selector de hora -->
    <div class="mb-8">
      <label class="block text-lg font-medium mb-2">Hora de la cita</label>
      <TimeSelector 
        :selected-time="selectedTime"
        @time-selected="handleTimeSelect"
      />
      <p class="mt-2 text-gray-600">
        Hora seleccionada: {{ selectedTime || 'Selecciona una hora' }}
      </p>
    </div>

    <!-- Botón de PayPal -->
    <div v-if="showPaypalButton" class="mb-8">
      <div id="paypal-button-container"></div>
    </div>

    <!-- Botón de confirmación -->
    <button 
      @click="irAConfirmarCita"
      class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Continuar
    </button>
  </div>
  <NavBottom />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from '@/components/Calendar.vue';
import TimeSelector from '@/components/TimeSelector.vue';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';

const router = useRouter();
const selectedDate = ref(new Date());
const selectedTime = ref('');
const showPaypalButton = ref(false);

// Formatear la fecha seleccionada
const formattedSelectedDate = computed(() => {
  return format(selectedDate.value, "d 'de' MMMM 'de' yyyy", { locale: es });
});

const handleDateSelect = (date) => {
  selectedDate.value = date;
};

const handleTimeSelect = (time) => {
  selectedTime.value = time;
};

const irAConfirmarCita = () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Por favor selecciona fecha y hora');
    return;
  }

  // Validar formato de hora (HH:mm)
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(selectedTime.value)) {
    alert('Formato de hora inválido. Usa HH:mm (ejemplo: 09:00)');
    return;
  }

  router.push({
    path: '/confirmar-cita',
    query: {
      modalidad: 'online',
      fecha: format(selectedDate.value, 'yyyy-MM-dd'),
      hora: selectedTime.value,
    },
  });
};

// Cargar el script de PayPal y renderizar el botón
onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=AWlLFrixm6dNXeH0qKmPqGyepzhRpR84-h70Y4lcHbUpxn_N7_mA4nq9gb4_wiFXaerJitttJrqJXGMB&currency=USD';
  script.onload = () => {
    paypal.Buttons({
      createOrder(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '10.00' // Aquí puedes poner el monto de la cita
            }
          }]
        });
      },
      onApprove(data, actions) {
        return actions.order.capture().then((details) => {
          alert('¡Pago exitoso! El ID de transacción es: ' + details.id);
        });
      }
    }).render('#paypal-button-container'); // Renderiza el botón en el contenedor
  };
  document.body.appendChild(script);

  showPaypalButton.value = true; // Mostrar el botón después de cargar el script
});
</script>

<style scoped>
#Schedule_appointment {
  min-height: calc(100vh - 128px);
}
</style>
