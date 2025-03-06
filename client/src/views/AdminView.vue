<template>
  <div class="container">
    <h1 class="title">Admin Area</h1>
    <button class="button is-primary">Add User</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const users = ref([
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' },
]);
</script>
