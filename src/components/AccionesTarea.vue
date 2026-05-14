<template>
  <div class="d-flex align-center">
    <v-btn 
      icon="mdi-delete-outline" 
      color="error" 
      variant="text" 
      density="comfortable"
      @click="$emit('delete', item.id)"
    ></v-btn>
  </div>
</template>

<script setup>
const props = defineProps(['item']);
defineEmits(['delete']); // Eliminamos patch porque el checkbox ya no está aquí
</script>