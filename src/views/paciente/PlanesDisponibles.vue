<template>
  <div class="min-h-screen bg-[#F0F9FE]">
    <NavTop />
    <div class="container mx-auto py-20 px-6 mb-24">
      <h1 class="text-4xl font-bold text-center text-[#5B5EA7] mb-12">Planes Disponibles</h1>

      <!-- Servicios sin membresía -->
      <div class="mb-12 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border-2 border-[#76C7D0]">
        <h2 class="text-2xl font-bold text-[#5B5EA7] mb-6 text-center">Servicios sin Membresía</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-[#E0F9FC] rounded-xl p-6 transition-transform hover:scale-105">
            <div class="flex items-center mb-3">
              <svg class="w-6 h-6 text-[#5B5EA7] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 class="font-semibold text-[#5B5EA7]">Consulta Online</h3>
            </div>
            <p class="text-2xl font-bold text-[#76C7D0] mb-2">$350 MXN</p>
            <p class="text-gray-600 text-sm">Por consulta</p>
          </div>

          <div class="bg-[#E0F9FC] rounded-xl p-6 transition-transform hover:scale-105">
            <div class="flex items-center mb-3">
              <svg class="w-6 h-6 text-[#5B5EA7] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 class="font-semibold text-[#5B5EA7]">Visita a Domicilio</h3>
            </div>
            <p class="text-2xl font-bold text-[#76C7D0] mb-2">$600 MXN</p>
            <p class="text-gray-600 text-sm">Por visita</p>
          </div>

          <div class="bg-[#E0F9FC] rounded-xl p-6 transition-transform hover:scale-105">
            <div class="flex items-center mb-3">
              <svg class="w-6 h-6 text-[#5B5EA7] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 class="font-semibold text-[#5B5EA7]">Emergencias</h3>
            </div>
            <p class="text-2xl font-bold text-[#76C7D0] mb-2">$1,800 MXN</p>
            <p class="text-gray-600 text-sm">Sin traslado</p>
          </div>

          <div class="bg-[#E0F9FC] rounded-xl p-6 transition-transform hover:scale-105">
            <div class="flex items-center mb-3">
              <svg class="w-6 h-6 text-[#5B5EA7] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 class="font-semibold text-[#5B5EA7]">Emergencias con Traslado</h3>
            </div>
            <p class="text-2xl font-bold text-[#76C7D0] mb-2">$3,500 MXN</p>
            <p class="text-gray-600 text-sm">Incluye ambulancia</p>
          </div>
        </div>
      </div>

      <div class="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
        <!-- Plan Básico -->
        <div class="border-2 border-[#76C7D0] p-8 rounded-2xl shadow-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-2">
          <div class="bg-[#E0F9FC] -m-8 mb-6 p-8 rounded-t-2xl">
            <h2 class="text-3xl font-bold text-[#5B5EA7]">Plan Básico</h2>
            <p class="text-[#76C7D0] mt-2 text-lg">Servicios médicos esenciales</p>
          </div>
          <ul class="space-y-3 mb-6 text-gray-600">
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Asesorías médicas online
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Citas de enfermería a domicilio
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Atención y transporte a emergencias
            </li>
          </ul>
          <p class="text-2xl font-bold text-[#5B5EA7] mb-6">$14,400 MXN / 6 meses</p>
          <button @click="iniciarPago(14400, 'básico')" 
                  class="w-full bg-[#76C7D0] hover:bg-[#5B5EA7] text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Seleccionar Plan
          </button>
        </div>

        <!-- Plan Premium -->
        <div class="border-2 border-[#76C7D0] p-8 rounded-2xl shadow-xl bg-white transition-all hover:shadow-2xl hover:-translate-y-2">
          <div class="bg-[#E0F9FC] -m-8 mb-6 p-8 rounded-t-2xl">
            <h2 class="text-3xl font-bold text-[#5B5EA7]">Plan Premium</h2>
            <p class="text-[#76C7D0] mt-2 text-lg">Atención médica integral</p>
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
              Especialistas en cardiología y neumología
            </li>
            <li class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#76C7D0]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
              </svg>
              Citas médicas a domicilio con especialistas
            </li>
          </ul>
          <p class="text-2xl font-bold text-[#5B5EA7] mb-6">$21,600 MXN / 6 meses</p>
          <button @click="iniciarPago(21600, 'premium')" 
                  class="w-full bg-[#76C7D0] hover:bg-[#5B5EA7] text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Seleccionar Plan
          </button>
        </div>
      </div>

      <!-- Modal de Confirmación -->
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-2xl max-w-md w-full mx-4">
          <h3 class="text-2xl font-bold text-[#5B5EA7] mb-4">Confirmar Selección</h3>
          <div class="bg-[#E0F9FC] p-6 rounded-xl mb-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[#5B5EA7] font-semibold">Plan:</span>
              <span class="text-[#76C7D0] font-bold capitalize">{{planSeleccionado}}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#5B5EA7] font-semibold">Monto:</span>
              <span class="text-2xl font-bold text-[#76C7D0]">${{monto}} MXN</span>
            </div>
          </div>
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
          <div class="bg-[#E0F9FC] p-6 rounded-xl mb-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[#5B5EA7] font-semibold">Plan:</span>
              <span class="text-[#76C7D0] font-bold capitalize">{{planSeleccionado}}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-[#5B5EA7] font-semibold">Total:</span>
              <span class="text-2xl font-bold text-[#76C7D0]">${{monto}} MXN</span>
            </div>
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
      this.monto = 350; // Forzar el monto a 350
      this.planSeleccionado = plan;
      this.showConfirmModal = true;
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