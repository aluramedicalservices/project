<template>
    <NavTopD />
    <!-- Profile -->
    <div class="flex items-center gap-x-3">
        <div class="shrink-0">
            <img class="shrink-0 size-16 rounded-full"
                src="https://images.unsplash.com/photo-1510706019500-d23a509eecd4?q=80&w=2667&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Avatar">
        </div>

        <div class="grow">
            <h1 class="text-lg font-medium text-gray-800 dark:text-neutral-200">
                Eliana Garcia
            </h1>
            <p class="text-sm text-gray-600 dark:text-neutral-400">
                Graphic Designer, Web designer/developer
            </p>
        </div>
    </div>
    <!-- End Profile -->

    <!-- Card Section -->
    <div class="max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <!-- Grid -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            <!-- Card -->
            <a class="group flex flex-col bg-white border shadow-sm rounded-xl hover:shadow-md focus:outline-none focus:shadow-md transition dark:bg-neutral-900 dark:border-neutral-800"
                href="#">
                <div class="p-4 md:p-5">
                    <div class="flex gap-x-5">
                        <svg class="mt-1 shrink-0 size-5 text-gray-800 dark:text-neutral-200"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>

                        <div class="grow">
                            <h3
                                class="group-hover:text-blue-600 font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:text-neutral-200">
                                Ask our community
                            </h3>
                            <p class="text-sm text-gray-500 dark:text-neutral-500">
                                Get help from 40k+ Preline users
                            </p>
                        </div>
                    </div>
                </div>
            </a>
            <!-- End Card -->
        </div>
        <!-- End Grid -->
    </div>
    <!-- End Card Section -->

    <div id="p-patients-home">
        <div id="s-welcome-card">
            <div>
                <img id="patient-profile-p" src="" alt="foto-paciente">
            </div>
            <div>
                <p id="plan-label"></p><br>
                <p>Bienvenido/a de nuevo,</p><br>
                <p>[nombre del paciente]</p>
            </div>
        </div>
        <div id="s-upcoming-appointments">
            <div>
                <div>
                    <h1 class="font-mono text-3xl font-bold underline">Próximas citas</h1>
                    <button><a href="#">Ver</a></button>
                </div>
                <p>Hoy es [fecha actual]</p>
            </div>
            <div class="appointments-container">
                <div class="appointment-info">
                    <a href="#">
                        <h2>[titulo-cita]</h2>
                        <p>[fecha]</p>
                        <p>[hora]</p>
                    </a>
                </div>
                <p><a href="#">Ver todas las citas</a></p>
            </div>

        </div>
    </div>

</template>

<script setup>
import NavTopD from '../../components/Doctor/NavTopD.vue';


</script>