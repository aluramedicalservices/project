<template>
  <div class="bg-gray-100 min-h-screen flex items-center justify-center p-6">
    <div class="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
      <h1 class="text-2xl font-bold text-center mb-6">Perfil del Usuario</h1>

      <form @submit.prevent="actualizarPerfil" class="space-y-4">
        <div class="flex items-center justify-center">
          <label for="profile-pic" class="relative cursor-pointer">
            <img
              :src="user.foto_url || '/default-avatar.png'"
              alt="Foto de Perfil"
              class="w-24 h-24 rounded-full border-4 border-blue-400 object-cover mb-4"
            />
            <input type="file" id="profile-pic" class="hidden" @change="subirFotoPerfil" />
            <div class="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1">
              <i class="fas fa-camera"></i>
            </div>
          </label>
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Nombre</label>
          <input v-model="user.nombre" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Apellido Paterno</label>
          <input v-model="user.apellido_paterno" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Apellido Materno</label>
          <input v-model="user.apellido_materno" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Correo</label>
          <input v-model="user.correo" type="email" readonly class="input-field bg-gray-200 cursor-not-allowed" />
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Teléfono</label>
          <input v-model="user.telefono" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Sexo</label>
          <select v-model="user.sexo" class="input-field">
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Fecha de Nacimiento</label>
          <input v-model="user.fecha_nacimiento" type="date" class="input-field" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-600 font-medium">Calle</label>
            <input v-model="user.calle" type="text" class="input-field" />
          </div>

          <div>
            <label class="block text-gray-600 font-medium">Número Exterior</label>
            <input v-model="user.numero_exterior" type="text" class="input-field" />
          </div>
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Colonia</label>
          <input v-model="user.colonia" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Ciudad</label>
          <input v-model="user.ciudad" type="text" class="input-field" />
        </div>

        <div>
          <label class="block text-gray-600 font-medium">Código Postal (CP)</label>
          <input v-model="user.cp" type="text" class="input-field" />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Actualizar Perfil
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { supabase } from '@/config/supabase';
import NavBottom from '../../components/comp_paciente/NavBottom.vue';

export default {
  setup() {
    const user = ref({});

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
  const user = supabase.auth.user(); // Verifica el usuario autenticado

  if (!user) {
    console.error("Usuario no autenticado");
    return; // No continuar si no hay usuario autenticado
  }

  if (file) {
    const fileName = `${user.id}_${Date.now()}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("Error subiendo la imagen: ", error);
    } else {
      const { publicURL, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error obteniendo la URL pública: ", urlError);
      } else {
        user.value.foto_url = publicURL;
      }
    }
  }
};


    const actualizarPerfil = async () => {
      await supabase.from('users').update(user.value).eq('id', user.value.id);
      alert('Perfil actualizado con éxito');
    };

    onMounted(obtenerUsuario);

    return { user, subirFotoPerfil, actualizarPerfil };
  },
};
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #3b82f6;
  background-color: white;
}
</style>
