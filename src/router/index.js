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
import InicioPacientes from '../views/paciente/InicioPacientes.vue';
import AgendarCita from '../views/paciente/AgendarCita.vue';
import ConfirmarCita from '../views/paciente/ConfirmarCita.vue';
import ProximasCitas from '../views/paciente/ProximasCitas.vue';
import DetallesProximaCita from '../views/paciente/DetallesProximaCita.vue';
import AgendarCitaOnline from '../views/paciente/AgendarCitaOnline.vue';
import AgendarCitaEnfermeria from '../views/paciente/AgendarCitaEnfermeria.vue';
import AgendarCitaEspecialista from '../views/paciente/AgendarCitaEspecialista.vue';
import Notificaciones from '../views/paciente/Notificaciones.vue';
import HistorialClinico from '../views/paciente/HistorialClinico.vue';
import Perfil from '../views/paciente/Perfil.vue';
import PlanesDisponibles from '../views/paciente/PlanesDisponibles.vue';  

// Vistas Portal de Doctor
import InicioDoctor from '../views/doctor/InicioDoctor.vue';
import Agenda from '../views/doctor/Agenda.vue';
import DetallesCitaD from '../views/doctor/DetallesCitaD.vue';
import ComenzarViaje from '../views/doctor/ComenzarViaje.vue';
import Viaje from '../views/doctor/Viaje.vue';
import RegistroCita from '../views/doctor/RegistroCita.vue';
import CitasAgendadas from '../views/doctor/CitasAgendadas.vue';
import NotificacionesD from '../views/doctor/NotificacionesD.vue';
import HistorialCitas from '../views/doctor/HistorialCitas.vue';
import Pacientes from '../views/doctor/Pacientes.vue';
import HistorialClinicoDoctor from '../views/doctor/HistorialClinicoDoctor.vue';
import PerfilDoctor from '../views/doctor/PerfilDoctor.vue';

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
    path: '/detalles-de-cita/:id',
    name: 'DetallesProximaCita',
    component: DetallesProximaCita,
    props: true, 
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
    path: '/detalles-cita:id',
    name: 'DetallesCitaD',
    component: DetallesCitaD,
  },
  {
    path: '/comenzar-viaje:id',
    name: 'ComenzarViaje',
    component: ComenzarViaje,
  },
  {
    path: '/viaje:id',
    name: 'Viaje',
    component: Viaje,
  },
  {
    path: '/registro-cita/:id',
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
    path: '/historial-clinico/:id',
    name: 'HistorialClinico',
    component: HistorialClinico,
  },
  {
    path: '/perfil/:id',
    name: 'Perfil',
    component: Perfil,
  },
  {
    path: '/planes-disponibles', 
    name: 'PlanesDisponibles',
    component: PlanesDisponibles,
  },
  {
    path: '/citas-agendadas',
    name: 'CitasAgendadas',
    component: CitasAgendadas,
  },
  {
    path: '/notificaciones-medicas',
    name: 'NotificacionesMedicas',
    component: NotificacionesD,
  },
  {
    path: '/historial-citas',
    name: 'HistorialCitas',
    component: HistorialCitas,
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: Pacientes,
  },
  {
    path: '/doctor/historial-clinico/:id',
    name: 'HistorialClinicoDoctor',
    component: HistorialClinicoDoctor,
    props: true
  },
  {
    path: '/doctor/perfil/:id',
    name: 'PerfilDoctor',
    component: PerfilDoctor,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;