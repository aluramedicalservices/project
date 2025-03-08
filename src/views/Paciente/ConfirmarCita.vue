<template>
  <NavTop />
  <div id="Confirm_appointment">
    <Titulo texto="Confirmar cita" />

    <ul>
      <li>
        <span class="icon">📅</span> Fecha: <strong>{{ fechaSeleccionada }}</strong>
      </li>
      <li>
        <span class="icon">⏰</span> Hora: <strong>{{ hourOption }}</strong>
      </li>
      <li>
        <span class="icon">🩺</span> Modalidad: <strong>{{ appointment_type }}</strong>
      </li>
    </ul>

    <hr />

    <div class="buttons">
      <button @click="confirmarCita" class="btn-confirmar">Confirmar</button>
      <button @click="cancelarCita" class="btn-cancelar">Cancelar</button>
    </div>
  </div>
  <NavBottom />
</template>

<script>
import NavTop from '../../components/Paciente/NavTop.vue';
import NavBottom from '../../components/Paciente/NavBottom.vue';
import Titulo from '../../components/Titulo.vue';
import { supabase } from '@/config/supabase';

export default {
  components: {
    Titulo,
    NavTop,
    NavBottom,
  },
  data() {
    return {
      appointment_type: this.$route.query.modalidad || 'Pendiente',
      fechaSeleccionada: this.$route.query.fecha || 'Pendiente',
      hourOption: this.$route.query.hora || 'Pendiente',
    };
  },
  methods: {
    async confirmarCita() {
      // Obtener el usuario autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('Debes iniciar sesión para agendar una cita.');
        return;
      }

      // Insertar datos en Supabase
      const { error } = await supabase.from('appointments').insert([
        {
          user_id: user.id,
          appointment_type: this.appointment_type,
          appointment_date: this.fechaSeleccionada,
          appointment_time: this.hourOption,
        },
      ]);

      if (error) {
        console.error('Error al agendar la cita:', error);
        alert('Hubo un problema al agendar la cita. Inténtalo de nuevo.');
      } else {
        alert(`Cita confirmada para el ${this.fechaSeleccionada} a las ${this.hourOption}.`);
        this.$router.push('/dashboard-paciente');
      }
    },
    cancelarCita() {
      this.$router.push('/agendar-cita');
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

.icon {
  margin-right: 5px;
}

.btn-confirmar {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-confirmar:hover {
  background-color: #0056b3;
}

.btn-cancelar {
  background-color: #dc3545;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-cancelar:hover {
  background-color: #c82333;
}
</style>