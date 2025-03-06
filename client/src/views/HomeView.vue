<script setup lang="ts">
import { ref } from 'vue';

const bestClass = 'Web Programming';
const totalActivities = ref(10);
const averageDuration = ref('30 minutes');
</script>

<template>
  <main>
    <h1 class="title">Welcome to {{ bestClass }}</h1>
    <div class="container">
      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <p class="title">{{ totalActivities }}</p>
              <p class="subtitle">Total Activities</p>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-content">
              <p class="title">{{ averageDuration }}</p>
              <p class="subtitle">Average Duration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
