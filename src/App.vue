<template>
  <v-app>
    <v-container v-if="!estaAutenticado" class="fill-height justify-center">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card width="400" class="pa-6" elevation="4">
            <v-card-title class="text-center text-h5 mb-4">Tareas - Acceso Seguro</v-card-title>

            <v-form @submit.prevent="login">
              <v-text-field v-model="credenciales.email" label="Correo" prepend-inner-icon="mdi-email"
                variant="outlined"></v-text-field>
              <v-text-field v-model="credenciales.password" label="Contraseña" prepend-inner-icon="mdi-lock"
                type="password" variant="outlined"></v-text-field>
              <v-btn color="primary" block size="large" :loading="cargando" @click="login">Entrar</v-btn>
            </v-form>

            <v-divider class="my-6">o accede con</v-divider>

            <div class="d-flex justify-center mb-4">
              <div id="googleButton"></div>
            </div>

            <v-btn variant="text" color="secondary" block @click="loginFalso">
              Simulación (Bypass)
            </v-btn>

            <v-alert v-if="mensajeError" type="error" class="mt-4" variant="tonal">
              {{ mensajeError }}
            </v-alert>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else style="max-width: 900px">
      <v-toolbar flat color="transparent" class="mb-4">
        <v-avatar color="primary" size="32" class="mr-3">
          <v-icon color="white">mdi-account</v-icon>
        </v-avatar>
        <div>
          <div class="text-subtitle-2 font-weight-bold">{{ usuarioEmail }}</div>
          <v-chip size="x-small" :color="usuarioRol === 'admin' ? 'red' : 'green'" label>
            {{ usuarioRol.toUpperCase() }}
          </v-chip>
        </div>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" color="error" size="small" @click="logout">Cerrar Sesión</v-btn>
      </v-toolbar>

      <v-card v-if="usuarioRol === 'admin'" class="pa-4 mb-6" variant="flat" border>
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-btn block color="blue-darken-2" prepend-icon="mdi-account-group" @click="abrirGestionUsuarios">
              Gestionar Usuarios
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn block color="blue-darken-1" variant="outlined" prepend-icon="mdi-database-search"
              @click="mostrarBusquedaAvanzada = true">
              Búsquedas Globales
            </v-btn>
          </v-col>
        </v-row>
      </v-card>

      <v-card class="pa-4 mb-6" variant="outlined">
        <v-row align="center" dense>
          <v-col cols="12" sm="8">
            <v-select v-model="tagsFiltro" :items="listaTagsTotal" item-title="nombre" item-value="id"
              label="Filtrar por etiquetas..." multiple chips variant="plain" hide-details></v-select>
          </v-col>
          <v-col cols="6" sm="2">
            <v-btn block color="secondary" @click="buscarPorTags">Filtrar</v-btn>
          </v-col>
          <v-col cols="6" sm="2">
            <v-btn block variant="outlined" color="primary" @click="mostrarGestionTags = true">Tags</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <NuevaTarea :listaTagsTotal="listaTagsTotal" @post="ejecutarPost" />

      <ListaTareas :items="tareas" @patch="ejecutarPatch">
        <template v-slot:default="{ tarea }">
          <AccionesTarea :item="tarea" @delete="ejecutarDelete" />
        </template>
      </ListaTareas>

      <GestionUsuariosDialog v-model="mostrarDialogoUsuarios" :usuarios="usuariosAdmin" @cambiar-rol="cambiarRol"
        @alternar-estado="alternarEstadoUsuario" />

      <BusquedaAvanzadaDialog v-model="mostrarBusquedaAvanzada" :resultados="resultadosAvanzados"
        @buscar="ejecutarBusquedaAvanzada" />

      <GestionTagsDialog v-model="mostrarGestionTags" :tags="listaTagsTotal" @editar="editarTag"
        @eliminar="eliminarTag" />

      <v-snackbar v-model="snackbar.mostrar" :color="snackbar.color">
        {{ snackbar.mensaje }}
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script setup>
/* global google */
import { ref, onMounted } from 'vue';
import api, { setCsrfToken } from './services/api';

// IMPORTACIÓN DE COMPONENTES (Asegúrate que los nombres coincidan con tus archivos)
import ListaTareas from './components/ListaTareas.vue';
import NuevaTarea from './components/NuevaTarea.vue';
import AccionesTarea from './components/AccionesTarea.vue';
import GestionUsuariosDialog from './components/GestionUsuariosDialog.vue';
import BusquedaAvanzadaDialog from './components/BusquedaAvanzadaDialog.vue';
import GestionTagsDialog from './components/GestionTagsDialog.vue';

// CONFIGURACIÓN
const GOOGLE_CLIENT_ID = "948584455737-mdo21clvguvi3ht5hu5acasu7k6s4o8f.apps.googleusercontent.com";

// ESTADOS
const tareas = ref([]);
const estaAutenticado = ref(false);
const usuarioEmail = ref('');
const usuarioRol = ref('user');
const cargando = ref(false);
const mensajeError = ref('');
const credenciales = ref({ email: '', password: '' });
const tagsFiltro = ref([]);
const listaTagsTotal = ref([]);
const snackbar = ref({ mostrar: false, mensaje: '', color: 'success' });

// ESTADOS DIÁLOGOS
const mostrarDialogoUsuarios = ref(false);
const usuariosAdmin = ref([]);
const mostrarBusquedaAvanzada = ref(false);
const mostrarGestionTags = ref(false);
const resultadosAvanzados = ref([]);

// FUNCIONES AUXILIARES
const notify = (msg, color = 'success') => {
  snackbar.value = { mostrar: true, mensaje: msg, color };
};

const procesarLoginExitoso = async (data) => {
  setCsrfToken(data.csrfToken);
  usuarioEmail.value = data.usuario.email;
  usuarioRol.value = data.usuario.rol;
  estaAutenticado.value = true;
  await cargarTagsGlobales();
  await ejecutarGet();
};

// --- LÓGICA DE GOOGLE AUTH ---
const inicializarGoogle = () => {
  const el = document.getElementById("googleButton");
  if (el && typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await api.post('/auth/google/callback', { googleToken: response.credential });
          await procesarLoginExitoso(res.data);
        } catch (e) {
          notify("Error en autenticación con Google", "error");
        }
      }
    });
    google.accounts.id.renderButton(el, { theme: "outline", size: "large", width: "340" });
  }
};

// --- LÓGICA DE ADMINISTRACIÓN ---
const abrirGestionUsuarios = async () => {
  const res = await api.get('/admin/usuarios');
  usuariosAdmin.value = res.data.data;
  mostrarDialogoUsuarios.value = true;
};

const cambiarRol = async (user) => {
  const nuevoRol = user.rol === 'admin' ? 'user' : 'admin';
  await api.patch(`/admin/usuarios/${user.id}`, { rol: nuevoRol });
  notify("Rol actualizado");
  await abrirGestionUsuarios();
};

const alternarEstadoUsuario = async (user) => {
  await api.patch(`/admin/usuarios/${user.id}/estado`);
  notify("Estado de usuario actualizado");
  await abrirGestionUsuarios();
};

const ejecutarBusquedaAvanzada = async (filtro) => {
  const res = await api.get(`/admin/busqueda-avanzada?tipo=${filtro.tipo}&query=${filtro.query}`);
  resultadosAvanzados.value = res.data.data.map(item => ({
    titulo: item.titulo || item.nombre || item.email,
    subtitulo: item.email || (item.persona ? `De: ${item.persona.email}` : 'Sistema')
  }));
};

// --- LÓGICA DE TAGS ---
const cargarTagsGlobales = async () => {
  const res = await api.get('/tags');
  listaTagsTotal.value = res.data.data || res.data;
};

const editarTag = async (tag) => {
  await api.patch(`/tags/${tag.id}`, { nombre: tag.nombre });
  notify("Etiqueta actualizada");
  await cargarTagsGlobales();
};

const eliminarTag = async (id) => {
  try {
    await api.delete(`/tags/${id}`);
    notify("Etiqueta eliminada");
    await cargarTagsGlobales();
  } catch (e) {
    notify("No se puede eliminar: etiqueta en uso", "error");
  }
};

// --- LÓGICA DE TAREAS ---
const ejecutarGet = async () => {
  try {
    const res = await api.get('/tareas');
    tareas.value = res.data.data || res.data;
  } catch (e) {
    estaAutenticado.value = false;
  }
};

const ejecutarPost = async (datos) => {
  await api.post('/tareas', datos);
  notify("Tarea creada con éxito");
  await ejecutarGet();
  await cargarTagsGlobales();
};

const ejecutarPatch = async (item) => {
  await api.patch(`/tareas/${item.id}`, { completada: item.completada });
};

const ejecutarDelete = async (id) => {
  await api.delete(`/tareas/${id}`);
  notify("Tarea eliminada", "info");
  await ejecutarGet();
};

const buscarPorTags = async () => {
  if (tagsFiltro.value.length === 0) return ejecutarGet();
  const res = await api.get(`/tareas/buscar-tags?tagIds=${tagsFiltro.value.join(',')}`);
  tareas.value = res.data.data;
};

// --- SESIÓN ---
const login = async () => {
  cargando.value = true;
  try {
    const res = await api.post('/auth/login', credenciales.value);
    await procesarLoginExitoso(res.data);
  } catch (e) {
    mensajeError.value = "Correo o contraseña incorrectos";
  } finally {
    cargando.value = false;
  }
};

const loginFalso = async () => {
  const res = await api.get('/auth/login-test');
  await procesarLoginExitoso(res.data);
};

const logout = async () => {
  await api.post('/auth/logout');
  estaAutenticado.value = false;
};

onMounted(() => {
  // Esperamos un momento para que el DOM se rinda antes de montar Google
  setTimeout(inicializarGoogle, 1000);
});
</script>