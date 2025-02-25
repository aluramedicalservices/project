import { createRouter, createWebHistory } from 'vue-router';
import InicioPacientes from '../views/InicioPacientes.vue';
import Apertura from '../views/Apertura.vue'; 
import Registro1 from '../views/Registro1.vue'; 
import Registro2 from '../views/Registro2.vue'; 
import IniciarSesion from '@/views/IniciarSesion.vue';
import RecuperarContrasena from '@/views/RecuperarContrasena.vue';
import RestablecerContrasena from '@/views/RestablecerContrasena.vue';

const routes = [
  {
    path: '/',
    name: 'InicioPacientes',
    component: InicioPacientes,
  },
  {
    path: '/apertura',
    name: 'Apertura',
    component: Apertura,
  },
  {
    path: '/registro1',
    name: 'Registro1',
    component: Registro1,
  },
  {
    path: '/registro2',
    name: 'Registro2',
    component: Registro2,
  },
  {
    path: '/autenticacion',
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
