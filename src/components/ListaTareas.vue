<template>
  <v-card elevation="2" class="rounded-lg">
    <v-list v-if="items.length > 0" lines="two">
      <template v-for="t in items" :key="t.id">
        <v-list-item class="py-3">

          <template v-slot:prepend>
            <v-checkbox-btn v-model="t.completada" color="success" @change="$emit('patch', t)"></v-checkbox-btn>
          </template>

          <v-list-item-title :class="{ 'text-decoration-line-through text-grey': t.completada }"
            class="text-h6 font-weight-medium">
            {{ t.titulo }}
          </v-list-item-title>

          <v-list-item-subtitle class="mt-2">
            <template v-if="t.tags && t.tags.length > 0">
              <v-chip v-for="tag in t.tags" :key="tag.id" size="x-small" color="secondary" variant="flat"
                class="mr-1 font-weight-bold" label>
                <v-icon start icon="mdi-tag" size="10"></v-icon>
                {{ tag.nombre.toUpperCase() }}
              </v-chip>
            </template>
            <span v-else class="text-caption text-grey-lighten-1">Sin etiquetas</span>
          </v-list-item-subtitle>

          <template v-slot:append>
            <slot :tarea="t"></slot>
          </template>
        </v-list-item>
        <v-divider inset></v-divider>
      </template>
    </v-list>

    <v-card-text v-else class="text-center py-12">
      <v-icon size="64" color="grey-lighten-2">mdi-clipboard-text-outline</v-icon>
      <div class="text-h6 text-grey-lighten-1 mt-2">No hay tareas pendientes</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Recibimos las tareas como prop
defineProps(['items']);

// Emitimos 'patch' cuando se cambia el estado del checkbox
defineEmits(['patch']);
</script>

<style scoped>
/* Ajuste opcional para que el checkbox no se vea tan pegado */
:deep(.v-checkbox-btn) {
  margin-inline-end: 16px;
}
</style>