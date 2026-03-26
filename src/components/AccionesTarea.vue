<template>
  <v-list-item>
    <template v-slot:prepend>
      <v-checkbox-btn
        v-model="item.completada"
        color="success"
        @change="$emit('patch', item)"
      ></v-checkbox-btn>
    </template>

    <v-list-item-title :class="{ 'text-decoration-line-through text-grey': item.completada }">
      {{ item.titulo }}
    </v-list-item-title>

    <template v-slot:append>
      <v-btn icon="mdi-delete-outline" color="error" variant="text" @click="$emit('delete', item.id)"></v-btn>
    </template>
  </v-list-item>
</template>

<script setup>
const props = defineProps(['item']);
defineEmits(['patch', 'delete']);
</script>