<template>
  <div id="nav-top" class="text-noxgrey">
    <div id="nav-menu" class="bg-medblue flex flex-row justify-between py-4 px-6">
      <div id="icono-menu-hamburguesa" class="text-white" @click="toggleMenu">
        <Menu />
      </div>
      <div id="icono-notificaciones" class="text-white">
        <Bell />
      </div>
    </div>

    <!-- Menu Desplegable con transición para abrir y cerrar -->
    <div
      id="menu-desplegable"
      :class="{'transform -translate-x-full': !isMenuOpen, 'transform translate-x-0': isMenuOpen}"
      class="fixed inset-0 bg-white text-noxgrey font-nunito w-3/4 sm:w-64 transition-transform ease-in-out duration-300 z-50"
    >
      <div class="px-4 py-6 relative">
        <!-- Icono de cerrar (X) en la esquina superior derecha -->
        <div
          id="icono-cerrar"
          class="absolute top-4 right-4 text-2xl cursor-pointer"
          @click="closeMenu"
        >
          <X />
        </div>

        <AluraLogo />
        <hr class="my-4">

        <ul class="space-y-6">
          <li class="flex items-center space-x-4">
            <House class="w-4 h-4" />
            <p>Inicio</p>
          </li>
          <li class="flex items-center space-x-4">
            <CalendarPlus class="w-4 h-4"/>
            <p>Agendar cita</p>
          </li>
          <li class="flex items-center space-x-4">
            <Clipboard class="w-4 h-4"/>
            <p>Historial clínico</p>
          </li>
          <li class="flex items-center space-x-4">
            <CreditCard class="w-4 h-4"/>
            <p>Mis pagos</p>
          </li>
        </ul>

        <hr class="my-4">

        <ul class="space-y-6">
          <li class="flex items-center space-x-4">
            <User class="w-4 h-4"/>
            <p>Mi perfil</p>
          </li>
          <li class="flex items-center space-x-4">
            <BookHeart class="w-4 h-4"/>
            <p>Planes disponibles</p>
          </li>
          <li class="flex items-center space-x-4">
            <Settings class="w-4 h-4"/>
            <p>Configuración</p>
          </li>
        </ul>

        <hr class="my-4">

      </div>
    </div>
  </div>
</template>

<script>
import { Bell, Menu, House, CalendarPlus, Clipboard, CreditCard, User, BookHeart, Settings, X } from 'lucide-vue-next';
import AluraLogo from '../AluraLogo.vue';

export default {
  components: {
    Bell,
    Menu,
    House,
    CalendarPlus,
    Clipboard,
    CreditCard,
    User,
    BookHeart,
    Settings,
    X, // Icono de "X" para cerrar
    AluraLogo
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
