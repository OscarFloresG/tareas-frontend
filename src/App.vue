<template>
  <v-app>
    <v-container v-if="!estaAutenticado" class="fill-height justify-center">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card width="400" class="pa-6">
              <v-card-title class="text-center text-h5 mb-4">
                Tareas - Acceso
              </v-card-title>
              
              <v-form @submit.prevent="login">
                <v-text-field
                  v-model="credenciales.email"
                  label="Correo electrónico"
                  prepend-inner-icon="mdi-email"
                  type="email"
                ></v-text-field>

                <v-text-field
                  v-model="credenciales.password"
                  label="Contraseña"
                  prepend-inner-icon="mdi-lock"
                  type="password"
                  @keyup.enter="login"
                ></v-text-field>

                <v-btn 
                  color="primary" 
                  block 
                  size="large" 
                  class="mt-4"
                  :loading="cargando"
                  @click="login"
                >
                  Entrar
                </v-btn>
              </v-form>
              
              <v-alert v-if="mensajeError" type="error" class="mt-4" variant="tonal">
                {{ mensajeError }}
              </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else style="max-width: 600px">
      <v-toolbar flat color="transparent" class="mb-4">
        <v-icon color="primary" class="mr-2">mdi-account-circle</v-icon>
        <v-toolbar-title class="text-body-1 font-weight-bold">
          {{ usuarioEmail }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" color="error" size="small" @click="logout">
          Cerrar Sesión
        </v-btn>
      </v-toolbar>

      <NuevaTarea @post="ejecutarPost" />

      <ListaTareas :items="tareas">
        <template v-slot:default="{ tarea }">
          <AccionesTarea 
            :item="tarea" 
            @patch="ejecutarPatch" 
            @delete="ejecutarDelete" 
          />
        </template>
      </ListaTareas>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api, { setCsrfToken } from './services/api';

// Importación de componentes hijos
import ListaTareas from './components/ListaTareas.vue';
import NuevaTarea from './components/NuevaTarea.vue';
import AccionesTarea from './components/AccionesTarea.vue';

const tareas = ref([]);
const estaAutenticado = ref(false);
const usuarioEmail = ref('');
const cargando = ref(false);
const mensajeError = ref('');

const credenciales = ref({
  email: '',
  password: ''
});


const login = async () => {
  if (!credenciales.value.email || !credenciales.value.password) {
    mensajeError.value = "Por favor, completa todos los campos.";
    return;
  }

  cargando.value = true;
  mensajeError.value = '';

  try {
    // El backend recibe email/password, valida y responde con JSON + Cookie HTTP-Only
    const res = await api.post('/auth/login', credenciales.value);
    
    // Guardamos el CSRF Token
    setCsrfToken(res.data.csrfToken);
    
    // Actualizamos estado de la UI
    usuarioEmail.value = res.data.usuario.email;
    estaAutenticado.value = true;
    
    // Limpiamos el formulario
    credenciales.value.password = '';
    
    // Cargamos los datos iniciales
    await ejecutarGet();
    
  } catch (error) {
    console.error("Error en login:", error);
    mensajeError.value = error.response?.data?.message || "Error al conectar con el servidor";
  } finally {
    cargando.value = false;
  }
};

const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    // Limpiamos todo el estado local
    estaAutenticado.value = false;
    tareas.value = [];
    usuarioEmail.value = '';
    setCsrfToken(''); // Borramos el token CSRF de la memoria
  }
};


const ejecutarGet = async () => {
  try {
    const res = await api.get('/tareas');
    tareas.value = res.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      estaAutenticado.value = false; // Token expirado o invalido
    }
  }
};

const ejecutarPost = async (titulo) => {
  try {
    await api.post('/tareas', { titulo });
    await ejecutarGet(); // Refrescar lista
  } catch (error) {
    console.error("Error al crear tarea:", error);
  }
};

const ejecutarPatch = async (item) => {
  try {
    await api.patch(`/tareas/${item.id}`, { completada: item.completada });
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    // Si falla, revertimos el cambio visual (opcional)
    await ejecutarGet();
  }
};

const ejecutarDelete = async (id) => {
  try {
    await api.delete(`/tareas/${id}`);
    await ejecutarGet();
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
  }
};


</script>