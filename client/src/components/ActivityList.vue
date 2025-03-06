<template>
  <ul>
    <li v-for="activity in activities" :key="activity.id">
      {{ activity.name }} - {{ activity.date }} - {{ activity.duration }}
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Activity {
  id: number;
  name: string;
  date: string;
  duration: string;
}

defineProps<{
  activities: Activity[];
}>();
</script>
</write_to_file>
