<template>
  <!--
  <Disclosure as="nav" class="bg-medblue" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button type="button" class="relative rounded-full bg-medblue p-1 text-white hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <BellIcon class="size-6" aria-hidden="true" />
          </button>

         
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
-->

  <div id="nav-top" class="text-noxgrey">
    <div id="nav-menu" class="bg-medblue flex flex-row justify-between py-4 px-6">
      <div id="icono-menu-hamburguesa" class="text-white">
        <Menu />
      </div>
      <div id="icono-notificaciones" class="text-white">
        <Bell />
      </div>
    </div>

    <div id="menu-desplegable">
      <div>
        <AluraLogo />
        <hr>
        
        <ul>
          <li>
            <House />
            <p>Inicio</p>
          </li>
          <li>
            <CalendarPlus />
            <p>Agendar cita</p>
          </li>
          <li>
            <Clipboard />
            <p>Historial clínico</p>
          </li>
          <li>
            <CreditCard />
            <p>Mis pagos</p>
          </li>
        </ul>

        <hr>

        <ul>
          <li>
            <User />
            <p>Mi perfil</p>
          </li>
          <li>
            <BookHeart />
            <p>Planes disponibles</p>
          </li>
          <li>
            <Settings />
            <p>Configuración</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]
  */
import { Bell } from 'lucide-vue-next';
import { Menu } from 'lucide-vue-next';
import { House } from 'lucide-vue-next';
import { CalendarPlus } from 'lucide-vue-next';
import { Clipboard } from 'lucide-vue-next';
import { CreditCard } from 'lucide-vue-next';
import { User } from 'lucide-vue-next';
import { BookHeart } from 'lucide-vue-next';
import { Settings } from 'lucide-vue-next';

import AluraLogo from '../AluraLogo.vue';

</script>