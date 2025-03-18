<template>
    <div id="vista_historial_clinico">
        <NavTop />
        <Titulo texto="Historial clínico" />
            <!--Contenedor de la lista del historial de las citas-->
            <div id="historial_de_citas">
                <div id="contenedor_cita_pasada">
                    <h3>{{tituloDeLaCita}}</h3> <!--Agregar el titulo de la cita-->
                    <ul>
                        <li class="flex items-center space-x-4">
                            <Calendar class="w-4 h-4"/>
                            <p>Fecha: {{fechaDeLaCita}}</p> <!--Agregar la fecha de la cita-->
                        </li>
                        <li class="flex items-center space-x-4">
                            <Calendar class="w-4 h-4"/>
                            <p>Personal: {{nombreDelDcotor}}</p> <!--Agregar el nombre del doctor/enfermero-->
                        </li>
                        <li class="flex items-center space-x-4">
                            <Calendar class="w-4 h-4"/>
                            <p>Modalidad: {{fechaDeLaCita}}</p> <!--Agregar el tipo de modalidad-->
                        </li>
                    </ul>
                    <button class="w-full font-nunito bg-healingblue text-noxgrey mb-2 my-1 py-3  rounded-full px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Ver detalles de la cita</button>
                    <button class="w-full font-nunito mb-2 my-1 py-3  rounded-full px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium border border-transparent hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                        Descargar archivo</button>
                </div>
            </div>
        <NavBottom />
    </div>

    <!-- PRUEBA DE POPUP -->
    <button @click="showPopup = true">Mostrar popup</button>

    <PopupMessage
    v-if="showPopup"
    :icon="CheckCircle"
    iconClass="text-green-500"
    title="¡Operación exitosa!"
    message="Tu cita fue agendada correctamente."
    primaryLabel="Aceptar"
    :onPrimaryAction="handlePrimaryAction"
    secondaryLabel="Cancelar"
    :onSecondaryAction="handleSecondaryAction"
    />

</template>

<script setup>
import Titulo from '../../components/Titulo.vue';
import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';

import PopupMessage from '@/components/PopupMessage.vue';
import { CheckCircle, AlertCircle } from 'lucide-vue-next';
import { Calendar } from 'lucide-vue-next';

import { ref } from 'vue'

const showPopup = ref(false)
const handlePrimaryAction = () => {
  console.log('Acción principal confirmada')
  showPopup.value = false
}

const handleSecondaryAction = () => {
  console.log('Acción secundaria cancelada')
  showPopup.value = false
}
</script>