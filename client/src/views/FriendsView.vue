<template>
  <div class="container">
    <h1 class="title">Friends Activities</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activities = ref([
  { id: 1, friend: 'John Doe', name: 'Running', date: '2024-01-01', duration: '30 minutes' },
  { id: 2, friend: 'Jane Smith', name: 'Swimming', date: '2024-01-02', duration: '45 minutes' },
]);
</script>
