<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="900px">
    <v-card>
      <v-card-title class="pa-4 bg-blue-darken-3 text-white">Búsquedas Globales</v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="4">
            <v-select v-model="localFiltro.tipo" :items="opciones" item-title="text" item-value="value" label="Tipo"></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="localFiltro.query" label="Buscar..." @keyup.enter="$emit('buscar', localFiltro)"></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn block color="primary" @click="$emit('buscar', localFiltro)">Buscar</v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-list v-if="resultados.length > 0">
          <v-list-item v-for="(res, i) in resultados" :key="i" border class="mb-1">
            <v-list-item-title class="font-weight-bold">{{ res.titulo }}</v-list-item-title>
            <v-list-item-subtitle>{{ res.subtitulo }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
defineProps(['modelValue', 'resultados']);
const emit = defineEmits(['update:modelValue', 'buscar']);

const localFiltro = ref({ tipo: 'usuarios-por-tag', query: '' });
const opciones = [
  { text: 'Usuarios por Tag', value: 'usuarios-por-tag' },
  { text: 'Tareas por Tag', value: 'tareas-por-tag' },
  { text: 'Tags por Usuario', value: 'tags-por-usuario' }
];
</script>