<template>
  <div class="min-h-screen bg-[#E0F9FC] p-4 pt-20 pb-32">
    <NavTop />

    <div class="max-w-md mx-auto">
      <div class="bg-[#F0F9FE] shadow-lg rounded-xl p-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#76C7D0] opacity-10 rounded-bl-full"></div>
        <h1 class="text-3xl font-bold text-[#5B5EA7] text-center mb-8">Mi Perfil</h1>

        <form @submit.prevent="actualizarPerfil" class="space-y-6">
          <!-- Foto de Perfil Mejorada -->
          <div class="flex items-center justify-center mb-8">
            <div class="relative group">
              <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-[#76C7D0] shadow-lg transition-all duration-300 group-hover:border-[#5B5EA7]">
                <img
                  :src="previewImage || user.foto_url || '/default-avatar.png'"
                  alt="Foto de Perfil"
                  class="w-full h-full object-cover"
                />
              </div>
              <label for="profile-pic" class="absolute bottom-0 right-0 bg-[#5B5EA7] text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-[#76C7D0] transition-all duration-300">
                <i class="fas fa-camera"></i>
                <input type="file" id="profile-pic" class="hidden" accept="image/*" @change="subirFotoPerfil" />
              </label>
            </div>
          </div>

          <!-- Campos del formulario con nuevo estilo -->
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Nombre</label>
              <input v-model="user.nombre" type="text" class="input-field" />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Apellido Paterno</label>
              <input v-model="user.apellido_paterno" type="text" class="input-field" />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Apellido Materno</label>
              <input v-model="user.apellido_materno" type="text" class="input-field" />
            </div>
            <div class="col-span-2">
              <label class="block text-[#5B5EA7] font-medium mb-1">Correo</label>
              <input
                v-model="user.correo"
                type="email"
                readonly
                class="input-field bg-gray-200 cursor-not-allowed"
              />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Teléfono</label>
              <input v-model="user.telefono" type="text" class="input-field" />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Sexo</label>
              <select v-model="user.sexo" class="input-field">
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-[#5B5EA7] font-medium mb-1">Fecha de Nacimiento</label>
              <input v-model="user.fecha_nacimiento" type="date" class="input-field" />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Calle</label>
              <input v-model="user.calle" type="text" class="input-field" />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Número Exterior</label>
              <input v-model="user.numero_exterior" type="text" class="input-field" />
            </div>
            <div class="col-span-2">
              <label class="block text-[#5B5EA7] font-medium mb-1">Colonia</label>
              <input v-model="user.colonia" type="text" class="input-field" />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Ciudad</label>
              <input v-model="user.ciudad" type="text" class="input-field" />
            </div>
            <div class="col-span-2 md:col-span-1">
              <label class="block text-[#5B5EA7] font-medium mb-1">Código Postal (CP)</label>
              <input v-model="user.cp" type="text" class="input-field" />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#5B5EA7] text-white font-medium py-3 rounded-full hover:bg-[#76C7D0] transition-all duration-300 flex items-center justify-center space-x-2">
            <span v-if="loading">Actualizando...</span>
            <span v-else>Guardar Cambios</span>
          </button>
        </form>
      </div>
    </div>

    <NavBottom />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/config/supabase';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';
import NavTop from '../../components/comp_paciente/NavTop.vue';

export default {
  components: {
    NavBottom,
    NavTop,
  },
  setup() {
    const user = ref({});
    const loading = ref(false);
    const previewImage = ref(null);

    const obtenerUsuario = async () => {
      const { data } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      user.value = userData;
    };

    const subirFotoPerfil = async (event) => {
      const file = event.target.files[0];
      if (file) {
        previewImage.value = URL.createObjectURL(file);
        
        loading.value = true;
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          loading.value = false;
          return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}_${Date.now()}.${fileExt}`;

        try {
          const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          user.value.foto_url = publicUrl;
          await actualizarPerfil();
        } catch (error) {
          console.error("Error en la subida:", error);
        } finally {
          loading.value = false;
        }
      }
    };

    const actualizarPerfil = async () => {
      loading.value = true;
      try {
        await supabase.from('users').update(user.value).eq('id', user.value.id);
        alert('¡Perfil actualizado con éxito!');
      } catch (error) {
        console.error("Error actualizando:", error);
        alert('Error al actualizar el perfil');
      } finally {
        loading.value = false;
      }
    };

    onMounted(obtenerUsuario);

    return { 
      user, 
      loading,
      previewImage,
      subirFotoPerfil, 
      actualizarPerfil 
    };
  },
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background-color: white;
  outline: none;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #76C7D0;
  box-shadow: 0 0 0 3px rgba(118, 199, 208, 0.1);
}

.input-field:hover {
  border-color: #5B5EA7;
}
</style>
