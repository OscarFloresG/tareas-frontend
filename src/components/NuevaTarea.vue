<template>
  <v-card class="pa-5 mb-6" elevation="3" >
    <v-card-title class="text-h6 pb-4">
      Agregar Nueva Tarea
    </v-card-title>
    
    <v-form @submit.prevent="enviar">
      <v-row dense>
        <v-col cols="12" sm="9">
          <v-text-field
            v-model="titulo"
            label="Nueva tarea..."
            @keyup.enter="enviar"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" sm="3">
          <v-btn
            color="primary"
            size="large"
            block
            :disabled="!titulo.trim()"
            @click="enviar"
          >
            Guardar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

const titulo = ref('');
const emit = defineEmits(['post']);

const enviar = () => {
  if (titulo.value.trim()) {
    emit('post', titulo.value);
    titulo.value = ''; 
  }
};
</script>