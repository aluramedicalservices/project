<template>
  <div id="vista_detallescita_dashboardmedico"
    class="flex flex-col justify-between min-h-screen font-nunito text-noxgrey">
    <NavTopD />
    <div id="comenzarViaje" class="bg-fondo text-noxgrey w-4/5 max-w-[1200px] mx-auto py-20 pb-32 text-center">
      <Titulo texto="Viaje" />
      <br>

      <div id="mapa_contenedor" class="text-center">
        <div id="mapa_tiempo_real" class="">
          //Aqui irá el mapa en tiempo real
        </div>

        <ul>
          <li><span class="font-bold">Ubicación: </span>
            <br>{{ ubicacionPaciente }}hola
          </li>
          <li><span class="font-bold">Hora de la cita: </span>
            <br>{{ horaDeCita }}hola
          </li>
        </ul>
      </div>

      <!--Viaje (comenzar): Esta parte solo debe aparecer cuando aun no inicia el viaje (ver figma)-->
      <div>
        <BotonMorado texto="Comenzar el viaje" />
        <p><span class="font-bold">Duración estimada del viaje: </span>
          <br>{{ horaDeCita }}hola
        </p>
      </div>

      <!--Viaje (en curso): Esta parte solo debe aparecer cuando el viaje esta en curso(ver figma)-->
      <div id="horaestimada-container" class="border border-gray-200 rounded-xl shadow-2xs p-2 space-y-2 w-full">
        <div id="horaestimada-c-hijo"
          class="border border-vitalblue rounded-xl shadow-2xs py-4 px-6 bg-vitalblue w-full text-center space-y-4">
          <p><span class="font-bold">Hora de llegada estimada: </span>
          <br>{{ horaDeCita }}hola
          </p>
        </div>
      </div>

      <button><a href="#">Cancelar cita</a></button>

    </div>
    <NavBottomD />
  </div>
</template>

<script setup>
import NavTopD from '../../components/comp_doctor/NavTopD.vue';
import NavBottomD from '../../components/comp_doctor/NavBottomD.vue';
import Titulo from '../../components/Titulo.vue';
import BotonMorado from '@/components/BotonMorado.vue';

/*
import GoogleMap from "../../components/MapView.vue";

export default {
  name: "App",
  components: {
    GoogleMap,
  },
};
 */

</script>