<template>
  <v-card >
    <v-list v-if="items.length > 0">
      <slot v-for="t in items" :key="t.id" :tarea="t"></slot>
    </v-list>
    <v-card-text v-else class="text-center py-8">No hay tareas.</v-card-text>
  </v-card>
</template>

<script setup>
defineProps(['items']);
</script>