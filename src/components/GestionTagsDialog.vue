<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500px">
    <v-card>
      <v-card-title class="bg-secondary text-white pa-4">Gestionar Etiquetas</v-card-title>
      <v-list v-if="tags.length > 0">
        <v-list-item v-for="tag in tags" :key="tag.id">
          <v-text-field v-model="tag.nombre" density="compact" hide-details variant="underlined"
            append-inner-icon="mdi-pencil" @change="$emit('editar', tag)"></v-text-field>
          <template v-slot:append>
            <v-btn icon="mdi-delete" size="small" variant="text" color="error"
              @click="$emit('eliminar', tag.id)"></v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-alert v-else type="info" class="ma-4">No hay etiquetas.</v-alert>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('update:modelValue', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps(['modelValue', 'tags']);
defineEmits(['update:modelValue', 'editar', 'eliminar']);
</script>