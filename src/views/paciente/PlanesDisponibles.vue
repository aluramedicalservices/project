<template>
  <div class="container mx-auto py-10 px-6">
    <h1 class="text-2xl font-bold mb-6">Planes Disponibles</h1>

    <div class="grid gap-6 md:grid-cols-2">
      <!-- Plan Básico -->
      <div class="border p-6 rounded-lg shadow-md bg-white">
        <h2 class="text-xl font-semibold">Plan Básico</h2>
        <p class="text-gray-600">Acceso a consultas médicas básicas.</p>
        <p class="text-lg font-bold mt-2">$20,000 MXN / 6 meses</p>
        <!-- Botón para iniciar el pago del plan básico -->
        <button @click="pagar(20000)" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Pagar con PayPal
        </button>
      </div>

      <!-- Plan Premium -->
      <div class="border p-6 rounded-lg shadow-md bg-white">
        <h2 class="text-xl font-semibold">Plan Premium</h2>
        <p class="text-gray-600">Acceso completo a consultas con especialistas.</p>
        <p class="text-lg font-bold mt-2">$60,000 MXN / 6 meses</p>
        <!-- Botón para iniciar el pago del plan premium -->
        <button @click="pagar(60000)" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Pagar con PayPal
        </button>
      </div>
    </div>

    <!-- Aquí es donde se carga el componente de PayPal -->
    <div v-if="monto">
      <div id="paypal-button-container"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      monto: null,
    };
  },
  methods: {
    pagar(monto) {
      this.monto = monto;
      this.renderPaypalButton(); // Llamamos a la función que renderiza el botón de PayPal
    },
    renderPaypalButton() {
      // Verificamos si el script de PayPal está cargado antes de renderizar el botón
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: this.monto,
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              console.log("Pago exitoso", details);
              // Aquí puedes hacer algo más con la respuesta del pago, como redirigir o mostrar un mensaje
            });
          },
          onError: (error) => {
            console.log("Error de pago", error);
            // Aquí puedes manejar errores de la transacción
          },
        }).render("#paypal-button-container"); // Renderizamos el botón de PayPal dentro del contenedor
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
