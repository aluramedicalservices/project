<template>
  <!-- Navbar superior -->
  <div id="nav-top" class="fixed left-0 top-0 text-noxgrey w-full z-10">
    <div class="lg:w-full bg-medblue flex flex-row justify-between items-center py-1 px-6">
      <div id="icono-menu-hamburguesa" class="py-2 text-noxgrey lg:hidden" @click="toggleMenu">
        <Menu />
      </div>
      <div id="logo-alura" class="hidden lg:block text-noxgrey py-2">
        <img src="/alura-logo-white.png" alt="Alura Logo" style="height:40px">
      </div>
      <div id="icono-notificaciones" @click="irANotificaciones" class="py-2 text-white flex space-x-2 cursor-pointer">
        <p class="hidden md:flex">Notificaciones</p>
        <Bell />
      </div>
    </div>
  </div>

  <!-- Menú lateral -->
  <div id="menu-desplegable" :class="{
    'transform -translate-x-full lg:translate-x-0': !isMenuOpen,
    'transform translate-x-0': isMenuOpen
  }"
    class="bg-slate-100! lg:fixed lg:inset-y-16 lg:h-screen lg:left-0 lg:w-64 lg:block z-60 fixed inset-0 text-noxgrey font-nunito w-3/4 sm:w-64 transition-transform ease-in-out duration-300 shadow-lg lg:shadow-none border border-gray-200">

    <div class="px-6 py-8 relative">
      <!-- Icono de cerrar en móvil -->
      <div id="icono-cerrar" class="absolute top-4 right-4 text-2xl cursor-pointer lg:hidden" @click="closeMenu">
        <X />
      </div>

      <AluraLogo class="lg:hidden w-32 h-auto" />
      <hr class="lg:hidden w-full h-[1px] my-6 bg-gray-200 border-0">

      <ul class="sm:space-y-2 lg:space-y-1 text-noxgrey">
        <li @click="$router.push('/dashboard-paciente')"
          :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/dashboard-doctor') }"
          class="flex items-center space-x-4 cursor-pointer p-2">
          <House class="w-4 h-4" />
          <p>Inicio</p>
        </li>

        <li @click="$router.push('/agendar-citas')"
          :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/agendar-citas') }"
          class="flex items-center space-x-4 cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
          <CalendarPlus class="w-4 h-4" />
          <p>Agendar cita</p>
        </li>

        <li @click="$router.push('/proximas-citas')"
          :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/proximas-citas') }"
          class="flex items-center space-x-4 cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
          <Cross class="w-4 h-4" />
          <p>Próximas citas</p>
        </li>

        <li @click="$router.push(`/historial-clinico/${userId}`)"
          :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/historial-clinico/${userId}') }"
          class="flex items-center space-x-4 cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
          <History class="w-4 h-4" />
          <p>Historial clínico</p>
        </li>

        <li @click="$router.push('/planes-disponibles')"
          :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/planes-disponibles') }"
          class="flex items-center space-x-4 cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
          <Users class="w-4 h-4" />
          <p>Mis pagos</p>
        </li>
      </ul>

      <hr class="w-full h-[1px] my-4 bg-gray-200 border-0">

      <ul class="sm:space-y-2 lg:space-y-1 text-noxgrey">
        <li @click="$router.push(`/perfil/${userId}`)"
        :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/perfil/${userId}') }"
          class="flex items-center space-x-4 cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
          <User class="w-4 h-4" />
          <p>Mi perfil</p>
        </li>

        <li @click="$router.push('/planes-disponibles')"
        :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/planes-disponibles') }"
          class="flex items-center space-x-4 cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
          <User class="w-4 h-4" />
          <p>Planes disponibles</p>
        </li>

        <li @click="cerrarSesion" 
        :class="{ 'bg-gray-200 text-noxgrey font-bold rounded-lg': isActive('/#') }"
          class="flex items-center space-x-4 cursor-pointer p-2 hover:bg-gray-100 hover:rounded-lg">
          <LogOut class="w-4 h-4" />
          <p>Cerrar sesión</p>
        </li>
      </ul>

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
      isMenuOpen: false, // Estado del menú móvil
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    irANotificaciones() {
      this.$router.push('/notificaciones-medicas');
    },
    cerrarSesion() {
      this.$router.push('/');
    },
    isActive(route) {
      return this.$route.path === route;
    }

  }
}
</script>

<style scoped>
/* El menú siempre visible en desktop no necesita sombra */
#menu-desplegable {
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
}

@media (min-width: 1024px) {
  #menu-desplegable {
    box-shadow: none;
  }
}
</style>