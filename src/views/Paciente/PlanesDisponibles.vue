<template>
  <div class="min-h-screen bg-[#F0F9FE]">
    <NavTop />
    <div class="container mx-auto py-20 px-6 mb-24">
      <h1 class="text-4xl font-bold text-center text-[#5B5EA7] mb-12">Planes Disponibles</h1>

      <div class="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
        <!-- Plan Básico -->
        <div class="border-2 border-[#76C7D0] p-8 rounded-2xl shadow-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-2">
          <div class="bg-[#E0F9FC] -m-8 mb-6 p-8 rounded-t-2xl">
            <h2 class="text-3xl font-bold text-[#5B5EA7]">Plan Básico</h2>
            <p class="text-[#76C7D0] mt-2 text-lg">Consultas médicas básicas</p>
          </div>
          <ul class="space-y-3 mb-6 text-gray-600">
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Consultas generales
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Historial médico básico
            </li>
          </ul>
          <p class="text-2xl font-bold text-[#5B5EA7] mb-6">$20,000 MXN / 6 meses</p>
          <button @click="iniciarPago(20000, 'básico')" 
                  class="w-full bg-[#76C7D0] hover:bg-[#5B5EA7] text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Seleccionar Plan
          </button>
        </div>

        <!-- Plan Premium -->
        <div class="border-2 border-[#76C7D0] p-8 rounded-2xl shadow-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-2">
          <div class="bg-[#E0F9FC] -m-8 mb-6 p-8 rounded-t-2xl">
            <h2 class="text-3xl font-bold text-[#5B5EA7]">Plan Premium</h2>
            <p class="text-[#76C7D0] mt-2 text-lg">Acceso total a especialistas</p>
          </div>
          <ul class="space-y-3 mb-6 text-gray-600">
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Todo lo del plan básico
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Acceso a especialistas
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Historial médico completo
            </li>
          </ul>
          <p class="text-2xl font-bold text-[#5B5EA7] mb-6">$60,000 MXN / 6 meses</p>
          <button @click="iniciarPago(60000, 'premium')" 
                  class="w-full bg-[#76C7D0] hover:bg-[#5B5EA7] text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Seleccionar Plan
          </button>
        </div>
      </div>

      <!-- Modal de Confirmación -->
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-2xl max-w-md w-full mx-4">
          <h3 class="text-2xl font-bold text-[#5B5EA7] mb-4">Confirmar Selección</h3>
          <div class="bg-[#F0F9FE] p-4 rounded-lg mb-6">
            <p class="text-gray-700 mb-2"><span class="font-semibold">Plan:</span> {{planSeleccionado}}</p>
            <p class="text-gray-700"><span class="font-semibold">Monto:</span> ${{monto}} MXN</p>
          </div>
          <p class="text-gray-600 mb-6">¿Estás seguro de que deseas proceder con el pago?</p>
          <div class="flex gap-4">
            <button @click="confirmarPago" 
                    class="flex-1 bg-[#76C7D0] hover:bg-[#5B5EA7] text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Confirmar
            </button>
            <button @click="showConfirmModal = false" 
                    class="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de PayPal -->
      <div v-if="showPaypalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-2xl max-w-md w-full mx-4">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-[#5B5EA7]">Realizar Pago</h3>
            <button @click="showPaypalModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="bg-[#F0F9FE] p-4 rounded-lg mb-6">
            <p class="text-gray-700"><span class="font-semibold">Plan {{planSeleccionado}}</span></p>
            <p class="text-gray-700"><span class="font-semibold">Total:</span> ${{monto}} MXN</p>
          </div>
          <div id="paypal-button-container"></div>
        </div>
      </div>
    </div>
    <NavBottom />
  </div>
</template>

<script>
import NavTop from '@/components/comp_paciente/NavTop.vue';
import NavBottom from '@/components/comp_paciente/NavBottom.vue';

export default {
  components: {
    NavTop,
    NavBottom
  },
  data() {
    return {
      monto: null,
      showPaypalModal: false,
      showConfirmModal: false,
      planSeleccionado: '',
    };
  },
  mounted() {
    this.cargarScriptPaypal();
  },
  methods: {
    cargarScriptPaypal() {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=MXN';
      script.addEventListener('load', this.setLoaded);
      document.body.appendChild(script);
    },
    iniciarPago(monto, plan) {
      this.monto = monto;
      this.planSeleccionado = plan;
      this.showConfirmModal = true; // Mostrar confirmación primero
    },
    confirmarPago() {
      this.showConfirmModal = false;
      this.showPaypalModal = true;
      this.$nextTick(() => {
        this.renderPaypalButton();
      });
    },
    renderPaypalButton() {
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            color: 'blue',
            shape: 'pill',
            label: 'pay'
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: 'MXN',
                  value: this.monto
                },
                description: `Plan ${this.planSeleccionado} - Alura Medical Services`
              }]
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            this.showPaypalModal = false;
            // Aquí puedes agregar la lógica para guardar el pago en tu backend
            alert('¡Pago completado con éxito!');
          },
          onError: (err) => {
            console.error('Error en el pago:', err);
            alert('Hubo un error en el proceso de pago. Por favor, intente nuevamente.');
          }
        }).render('#paypal-button-container');
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>