import { defineStore } from 'pinia';

export const useCitasStore = defineStore('citas', {
  state: () => ({
    tipoConsulta: '',
    fecha: '',
    hora: '',
    ubicacion: '',
    personal: ''
  }),
  actions: {
    guardarCita({ tipoConsulta, fecha, hora }) {
      this.tipoConsulta = tipoConsulta;
      this.fecha = fecha;
      this.hora = hora;
    },
    resetearCita() {
      this.tipoConsulta = '';
      this.fecha = '';
      this.hora = '';
      this.ubicacion = '';
      this.personal = '';
    }
  }
});