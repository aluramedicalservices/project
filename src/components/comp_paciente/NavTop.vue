<template>
  <div id="nav-top" class="text-noxgrey fixed top-0 left-0 w-full z-50">
    <div id="nav-menu" class="bg-medblue flex flex-row justify-between py-4 px-6">
      <div id="icono-menu-hamburguesa" class="text-white" @click="toggleMenu">
        <Menu />
      </div>
      <div @click="irANotificaciones" id="icono-notificaciones" class="text-white">
        <Bell />
      </div>
    </div>

    <!-- Menu Desplegable con transición para abrir y cerrar -->
    <div id="menu-desplegable"
      :class="{ 'transform -translate-x-full': !isMenuOpen, 'transform translate-x-0': isMenuOpen }"
      class="z-60 fixed inset-0 bg-white text-noxgrey font-nunito w-3/4 sm:w-64 transition-transform ease-in-out duration-300">
      <div class="px-8 py-8 relative">
        <!-- Icono de cerrar (X) en la esquina superior derecha -->
        <div id="icono-cerrar" class="absolute top-4 right-4 text-2xl cursor-pointer" @click="closeMenu">
          <X />
        </div>

        <AluraLogo class="w-40 h-auto"/>
        <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

        <ul class="space-y-8">
          <li @click="$router.push('/dashboard-paciente')" 
          class="flex items-center space-x-4 cursor-pointer">
            <House class="w-4 h-4" />
            <p>Inicio</p>
          </li>
          <li @click="$router.push('/agendar-citas')"
          class="flex items-center space-x-4 cursor-pointer">
            <CalendarPlus class="w-4 h-4" />
            <p>Agendar cita</p>
          </li>
          <li @click="$router.push('/proximas-citas')"
          class="flex items-center space-x-4 cursor-pointer">
            <CalendarHeart class="w-4 h-4"/>            
            <p>Próximas citas</p>
          </li>
          <li @click="$router.push(`/historial-clinico/${userId}`)"
          class="flex items-center space-x-4 cursor-pointer">
            <Clipboard class="w-4 h-4" />
            <p>Historial clínico</p>
          </li>
          <li @click="$router.push('/#')"
          class="flex items-center space-x-4 cursor-pointer">
            <CreditCard class="w-4 h-4" />
            <p>Mis pagos</p>
          </li>
        </ul>

        <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

        <ul class="space-y-8">
          <li @click="$router.push(`/perfil/${userId}`)"
          class="flex items-center space-x-4 cursor-pointer">
            <User class="w-4 h-4" />
            <p>Mi perfil</p>
          </li> 
          <li @click="$router.push('/planes-disponibles')"
          class="flex items-center space-x-4 cursor-pointer">
            <BookHeart class="w-4 h-4" />
            <p>Planes disponibles</p>
          </li>
          <li @click="cerrarSesion"
          class="flex items-center space-x-4 cursor-pointer text-red-500">
            <LogOut class="w-4 h-4" />
            <p>Cerrar sesión</p>
          </li>
        </ul>

        <hr class="w-full h-[1px] my-6 bg-gray-300 border-0">

      </div>
    </div>
  </div>
</template>

<script>
import { Bell, Menu, House, CalendarPlus, CalendarHeart, Clipboard, CreditCard, User, BookHeart, X, LogOut } from 'lucide-vue-next';
import AluraLogo from '../AluraLogo.vue';

export default {
  components: {
    Bell,
    Menu,
    House,
    CalendarPlus,
    CalendarHeart,
    Clipboard,
    CreditCard,
    User,
    BookHeart,
    X, // Icono de "X" para cerrar
    AluraLogo,
    LogOut
  },
  data() {
    return {
      isMenuOpen: false, // Estado para controlar si el menú está abierto o cerrado
    };
  },
  methods: {
    // Función para alternar el estado del menú
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    // Función para cerrar el menú al hacer clic en la "X"
    closeMenu() {
      this.isMenuOpen = false;
    },
    irANotificaciones() {
      this.$router.push('/notificaciones-paciente');  // ← Aquí navegas a la vista de notificaciones
    },
    cerrarSesion() {
      // Aquí puedes agregar la lógica de cierre de sesión
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
/* Estilo opcional para el overlay cuando el menú está abierto */
#menu-desplegable {
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}
</style>