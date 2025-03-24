import { createRouter, createWebHistory } from 'vue-router';

// Vistas generales de la app
import Apertura from '../views/Apertura.vue';
import Registro from '../views/Registro.vue';
import Cuestionario1 from '../views/Cuestionario1.vue';
import Cuestionario2 from '../views/Cuestionario2.vue';
import IniciarSesion from '../views/IniciarSesion.vue';
import RecuperarContrasena from '../views/RecuperarContrasena.vue';
import RestablecerContrasena from '../views/RestablecerContrasena.vue';

// Vistas Portal de Pacientes
import InicioPacientes from '../views/vista_paciente/InicioPacientes.vue';
import AgendarCita from '../views/vista_paciente/AgendarCita.vue';
import ConfirmarCita from '../views/vista_paciente/ConfirmarCita.vue';
import ProximasCitas from '../views/vista_paciente/ProximasCitas.vue';
import DetallesProximaCita from '../views/vista_paciente/DetallesProximaCita.vue';
import AgendarCitaOnline from '../views/vista_paciente/AgendarCitaOnline.vue';
import AgendarCitaEnfermeria from '../views/vista_paciente/AgendarCitaEnfermeria.vue';
import AgendarCitaEspecialista from '../views/vista_paciente/AgendarCitaEspecialista.vue';
import Notificaciones from '../views/vista_paciente/Notificaciones.vue';
import HistorialClinico from '../views/vista_paciente/HistorialClinico.vue';

// Vistas Portal de Doctor
import InicioDoctor from '../views/vista_doctor/InicioDoctor.vue';
import Agenda from '../views/vista_doctor/Agenda.vue';
import DetallesCitaD from '../views/vista_doctor/DetallesCitaD.vue';
import ComenzarViaje from '../views/vista_doctor/ComenzarViaje.vue';
import Viaje from '../views/vista_doctor/Viaje.vue';
import RegistroCita from '../views/vista_doctor/RegistroCita.vue';


const routes = [
  {
    path: '/',
    name: 'Apertura',
    component: Apertura,
  },
  {
    path: '/dashboard-paciente',
    name: 'InicioPacientes',
    component: InicioPacientes,
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
  },
  {
    path: '/cuestionario-1',
    name: 'Cuestionario1',
    component: Cuestionario1,
  },
  {
    path: '/cuestionario-2',
    name: 'Cuestionario2',
    component: Cuestionario2,
  },
  {
    path: '/iniciar-sesion',
    name: 'IniciarSesion',
    component: IniciarSesion,
  },
  {
    path: '/recuperar-contrasena',
    name: 'RecuperarContrasena',
    component: RecuperarContrasena,
  },
  {
    path: '/restablecer-contrasena',
    name: 'RestablecerContrasena',
    component: RestablecerContrasena,
  },
  {
    path: '/agendar-citas',
    name: 'AgendarCita',
    component: AgendarCita,
  },
  {
    path: '/confirmar-cita',
    name: 'ConfirmarCita',
    component: ConfirmarCita,
  },
  {
    path: '/proximas-citas',
    name: 'ProximasCitas',
    component: ProximasCitas,
  },
  {
    path: '/detalles-proxima-cita',
    name: 'DetallesProximaCita',
    component: DetallesProximaCita,
  },
  {
    path: '/dashboard-doctor',
    name: 'InicioDoctor',
    component: InicioDoctor,
  },
  {
    path: '/agenda',
    name: 'Agenda',
    component: Agenda,
  },
  {
    path: '/detalles-cita',
    name: 'DetallesCitaD',
    component: DetallesCitaD,
  },
  {
    path: '/comenzar-viaje',
    name: 'ComenzarViaje',
    component: ComenzarViaje,
  },
  {
    path: '/viaje',
    name: 'Viaje',
    component: Viaje,
  },
  {
    path: '/cita-registro',
    name: 'RegistroCita',
    component: RegistroCita,
  },
  {
    path: '/agendar-cita-online',
    name: 'AgendarCitaOnline',
    component: AgendarCitaOnline,
  },
  {
    path: '/agendar-cita-enfermeria',
    name: 'AgendarCitaEnfermeria',
    component: AgendarCitaEnfermeria,
  },
  {
    path: '/agendar-cita-especialista',
    name: 'AgendarCitaEspecialista',
    component: AgendarCitaEspecialista,
  },
  {
    path: '/notificaciones-paciente',
    name: 'NotificacionesPaciente',
    component: Notificaciones,
  },
  {
    path: '/historial-clinico',
    name: 'HistorialClinico',
    component: HistorialClinico,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;