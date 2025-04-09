<template>
    <div id="vista_agendar_cita" class="lg:pl-64 flex flex-col justify-between min-h-screen font-nunito text-noxgrey bg-white">
      <NavTop />
      <div id="contendor_padre_agendar_citas" class="w-5/6 lg:w-23/24 max-w-[1700px] mx-auto py-20">
        
        <TituloPrincipal texto="Agendar una cita"/>
        
        <div class=" flex flex-col lg:flex-row justify-center space-x-4 py-4 space-y-4 lg:space-y-0">
            <div id="agendar_especialista" @click="irAAgendarCitaEspecialista"
            class="flex flex-col items-center space-y-4 bg-medbluelight p-8 rounded-lg cursor-pointer border-2 border-medbluelight hover:border-medbluefocus hover:shadow-lg hover:bg-medbluefocus! hover:text-white! w-full lg:w-1/3">
            <Stethoscope class="w-16 lg:w-24 h-auto "/>
            <p class="font-montserrat font-semibold text-lg">Cita con especialista</p>
            </div>
    
            <div id="agendar_online" @click="irAAgendarCitaOnline"
            class="flex flex-col items-center space-y-4 bg-medbluelight p-8 rounded-lg cursor-pointer border-2 border-medbluelight hover:border-medbluefocus hover:shadow-lg hover:bg-medbluefocus! hover:text-white! w-full lg:w-1/3">
            <LaptopMinimal class="w-16 lg:w-24 h-auto "/>
            <p class="font-montserrat font-semibold">Cita online</p>
            </div>
    
            <div id="agendar_domicilio" @click="irAAgendarCitaDomicilio"
            class="flex flex-col items-center space-y-4 bg-medbluelight p-8 rounded-lg cursor-pointer border-2 border-medbluelight hover:border-medbluefocus hover:shadow-lg hover:bg-medbluefocus! hover:text-white! w-full lg:w-1/3">
            <DoorOpen class="w-16 lg:w-24 h-auto "/>
            <p class="font-montserrat font-semibold">Cita a domicilio</p>
            </div>
        </div>
      </div>
      <NavBottom class="lg:hidden"/>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

import NavTop from '../../components/comp_paciente/NavTop.vue';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import TituloPrincipal from '@/components/TituloPrincipal.vue';

import { Stethoscope, LaptopMinimal, DoorOpen } from 'lucide-vue-next';

const irAAgendarCitaEspecialista = () => {
  router.push('/agendar-cita-especialista')
}

const irAAgendarCitaOnline = () => {
  router.push('/agendar-cita-online')
}

const irAAgendarCitaDomicilio = () => {
  router.push('/agendar-cita-enfermeria')
}
</script>