<template>
  <div>
    <PayPalButtons
      v-if="isPaypalReady"
      :create-order="createOrder"
      :onApprove="onApprove"
      :onError="onError"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

// Aquí configuramos el estado de la integración
const isPaypalReady = ref(false);
const { isLoaded } = usePayPalScriptReducer();

// Cuando se carga el script de PayPal
onMounted(() => {
  if (isLoaded) {
    isPaypalReady.value = true;
  }
});

// Crear la orden de pago
const createOrder = (data, actions) => {
  return actions.order.create({
    purchase_units: [
      {
        amount: {
          value: "10.00", // Cambia el valor a lo que se va a cobrar
        },
      },
    ],
  });
};

// Manejar la aprobación del pago
const onApprove = (data, actions) => {
  return actions.order.capture().then((details) => {
    console.log("Pago exitoso", details);
    // Aquí puedes registrar el pago o hacer alguna otra acción
  });
};

// Manejar errores en el pago
const onError = (error) => {
  console.log("Error de pago", error);
};
</script>

<style scoped>
/* Estilos opcionales */
</style>
