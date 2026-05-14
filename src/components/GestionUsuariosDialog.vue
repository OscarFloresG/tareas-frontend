<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="800px">
    <v-card>
      <v-card-title class="pa-4 bg-primary text-white d-flex align-center">
        <v-icon start>mdi-account-cog</v-icon> Gestión de Usuarios
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="$emit('update:modelValue', false)"></v-btn>
      </v-card-title>
      <v-table hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usuarios" :key="user.id" :class="{ 'text-grey': !user.activo }">
            <td>{{ user.email }}</td>
            <td><v-chip :color="user.rol === 'admin' ? 'red' : 'green'" size="x-small" label>{{ user.rol }}</v-chip>
            </td>
            <td><v-icon :color="user.activo ? 'success' : 'error'">{{ user.activo ? 'mdi-check-circle' :
                'mdi-minus-circle' }}</v-icon></td>
            <td class="text-right">
              <v-btn icon="mdi-shield-sync" size="x-small" color="primary" variant="text"
                @click="$emit('cambiar-rol', user)"></v-btn>
              <v-btn :icon="user.activo ? 'mdi-account-off' : 'mdi-account-check'"
                :color="user.activo ? 'error' : 'success'" size="x-small" variant="text"
                @click="$emit('alternar-estado', user)"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps(['modelValue', 'usuarios']);
defineEmits(['update:modelValue', 'cambiar-rol', 'alternar-estado']);
</script>