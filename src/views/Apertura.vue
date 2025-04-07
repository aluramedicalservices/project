<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white text-noxgrey">
        <div id="login" class="flex flex-col w-full max-w-md px-6 text-center space-y-16 py-12">
            <AluraLogo class="w-64 mx-auto hover:scale-105 transition-transform duration-300" />

            <div class="flex flex-col space-y-6">
                <div class="space-y-4">
                    <h1 class="font-nunito text-xl font-bold">
                        ¡Bienvenido/a a Alura Medical Services!
                    </h1>
                    <p class="font-nunito text-lg font-normal leading-relaxed px-4">
                        Tu salud en las mejores manos, con atención médica de calidad hasta la puerta de tu hogar.
                    </p>
                </div>
                <div class="space-y-3 w-full max-w-sm mx-auto">
                    <button 
                        @click="$router.push('/iniciar-sesion')"
                        class="bg-medblue hover:bg-medblue/90 text-white w-full py-3 inline-flex justify-center items-center rounded-full transition-colors duration-300 shadow-md hover:shadow-lg">
                        Iniciar sesión
                    </button>
                    <button 
                        @click="$router.push('/registro')"
                        class="bg-medbluelight hover:bg-medbluelight/90 w-full py-3 inline-flex justify-center items-center rounded-full transition-colors duration-300 shadow-md hover:shadow-lg">
                        Registrarse
                    </button>
                </div>
            </div>
            <p class="text-gray-600">© Alura 2025.</p>
        </div>
    </div>
</template>

<script setup>
import AluraLogo from '../components/AluraLogo.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>