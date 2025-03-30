import { defineStore } from 'pinia';
import { supabase } from '@/config/supabase';

export const useCitasStore = defineStore('citas', {
  state: () => ({
    citas: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async cargarCitasDoctor(doctorId) {
      this.loading = true;
      this.error = null;
      
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_type,
            appointment_date,
            appointment_time,
            status,
            user_id,
            patients:user_id(nombre, apellido_paterno, apellido_materno),
            especialidad,
            google_meet_link,
            ubicacion
          `)
          .eq('doctor_id', doctorId)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (error) throw error;
        
        this.citas = data.map(cita => ({
          ...cita,
          paciente_nombre: cita.patients 
            ? `${cita.patients.nombre} ${cita.patients.apellido_paterno || ''} ${cita.patients.apellido_materno || ''}`.trim()
            : 'No asignado'
        }));
        
      } catch (error) {
        this.error = error.message;
        console.error('Error cargando citas:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async actualizarEstadoCita(citaId, estado) {
      try {
        const { error } = await supabase
          .from('appointments')
          .update({ status: estado })
          .eq('id', citaId);

        if (error) throw error;
        
        // Actualizar estado localmente
        const citaIndex = this.citas.findIndex(c => c.id === citaId);
        if (citaIndex !== -1) {
          this.citas[citaIndex].status = estado;
        }
        
        return true;
      } catch (error) {
        console.error('Error actualizando estado:', error);
        return false;
      }
    },
    
    async agregarHistorialClinico(datos) {
      try {
        const { error } = await supabase
          .from('historial_clinico')
          .insert(datos);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error agregando historial:', error);
        return false;
      }
    }
  },
  
  getters: {
    citasPendientes: (state) => {
      const hoy = new Date().toISOString().split('T')[0];
      return state.citas.filter(cita => 
        ['agendada', 'en_proceso'].includes(cita.status) && 
        cita.appointment_date >= hoy
      );
    },
    
    citasCompletadas: (state) => {
      return state.citas.filter(cita => 
        cita.status === 'completada'
      ).sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
    }
  }
});