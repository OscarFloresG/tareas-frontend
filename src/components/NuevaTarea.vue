<template>
  <v-card class="pa-5 mb-6" elevation="3">
    <v-card-title class="text-h6 pb-2">
      <v-icon start color="primary">mdi-plus-circle</v-icon>
      Agregar Nueva Tarea
    </v-card-title>

    <v-form @submit.prevent="enviar">
      <v-row dense>
        <v-col cols="12">
          <v-text-field v-model="titulo" label="¿Qué tarea tienes pendiente?" variant="outlined" density="comfortable"
            prepend-inner-icon="mdi-format-title" @keyup.enter="enviar"></v-text-field>
        </v-col>

        <v-col cols="12" sm="9">
          <v-combobox v-model="tagsSeleccionados" :items="listaTagsDisponibles" item-title="nombre" item-value="id"
            label="Asignar Etiquetas (Escribe para crear una nueva)" multiple chips variant="outlined"
            @update:model-value="verificarNuevasEtiquetas"></v-combobox>
        </v-col>

        <v-col cols="12" sm="3">
          <v-btn color="primary" size="large" block height="48" elevation="2" :disabled="!titulo.trim()"
            @click="enviar">
            Guardar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'; // Agregamos computed
import api from '../services/api';

const titulo = ref('');
const tagsSeleccionados = ref([]);
const tagsDisponibles = ref([]);
const emit = defineEmits(['post']);

// SOLUCIÓN AL ERROR DE CONSOLA: Definimos la variable que usa el template
const listaTagsDisponibles = computed(() => tagsDisponibles.value);

const cargarTags = async () => {
  try {
    const res = await api.get('/tags');
    tagsDisponibles.value = res.data.data || res.data;
  } catch (e) {
    console.error("Error al cargar etiquetas:", e);
  }
};

const verificarNuevasEtiquetas = async (seleccion) => {
  // Usamos un bucle for tradicional para manejar la asincronía correctamente
  for (let i = 0; i < seleccion.length; i++) {
    const item = seleccion[i];
    if (typeof item === 'string') {
      try {
        const res = await api.post('/tags', { nombre: item });
        // Reemplazamos el texto por el objeto que viene de la DB
        tagsSeleccionados.value[i] = res.data.data;
        await cargarTags();
      } catch (e) {
        console.error("Error al crear etiqueta:", e);
      }
    }
  }
};

onMounted(cargarTags);

const enviar = () => {
  if (titulo.value.trim()) {
    // IMPORTANTE: Enviamos solo los IDs de los tags seleccionados
    const tagIds = tagsSeleccionados.value.map(tag => tag.id || tag);

    emit('post', {
      titulo: titulo.value,
      tags: tagIds // Ahora enviamos [1, 2] en lugar de [{id:1...}]
    });

    titulo.value = '';
    tagsSeleccionados.value = [];
  }
};
</script>