<template>
    <NavTop />
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
        <div id="s-request-appointment">
            <h2>Solicitar cita</h2>
            <div class="request-appointment-options">
                <div id="request-online-appointment">
                    <a href="#">
                        <i>icono</i>
                        <br>
                        <h3>Online</h3>
                    </a>
                </div>
                <div id="request-nursing-appointment">
                    <a href="#">
                        <i>icono</i>
                        <br>
                        <h3>Enfermería</h3>
                    </a>
                </div>
                <div id="request-specialist-appointment">
                    <a href="#">
                        <i>icono</i>
                        <br>
                        <h3>Especialista</h3>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <NavBottom />
</template>

<script setup>
// Aquí podrías importar componentes si los necesitas
    import NavTop from '../../components/Paciente/NavTop.vue';
    import NavBottom from '../../components/Paciente/NavBottom.vue';
</script>

<style scoped>
/* Estilos específicos de esta vista */
</style>