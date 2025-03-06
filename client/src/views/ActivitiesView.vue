<template>
  <div class="container">
    <h1 class="title">Activities</h1>
    <button class="button is-primary">Add Activity</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activities = ref([
  { id: 1, name: 'Running', date: '2024-01-01', duration: '30 minutes' },
  { id: 2, name: 'Swimming', date: '2024-01-02', duration: '45 minutes' },
]);
</script>
