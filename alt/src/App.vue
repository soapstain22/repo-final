<template>
  <div id="app" :class="{ 'is-dark-mode': isDarkMode }">
    <nav-bar />
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  },
  setup() {
    const store = useStore();
    
    const isDarkMode = computed(() => store.getters.isDarkMode);
    
    onMounted(() => {
      // Initialize dark mode from localStorage
      store.dispatch('initDarkMode');
      
      // Initialize auth state
      store.dispatch('auth/initAuth');
    });
    
    return {
      isDarkMode
    };
  }
};
</script>

<style>
@import 'bulma/css/bulma.min.css';
/* Remove Oruga CSS import as it's causing issues */

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.is-dark-mode {
  background-color: #121212;
  color: #f5f5f5;
}

.is-dark-mode .card {
  background-color: #1e1e1e;
  color: #f5f5f5;
}

.is-dark-mode .navbar {
  background-color: #1e1e1e;
}

.is-dark-mode .navbar-item,
.is-dark-mode .navbar-link {
  color: #f5f5f5;
}

.is-dark-mode .navbar-dropdown {
  background-color: #1e1e1e;
}

.is-dark-mode .input,
.is-dark-mode .textarea,
.is-dark-mode .select select {
  background-color: #2d2d2d;
  color: #f5f5f5;
  border-color: #3d3d3d;
}

.is-dark-mode .button {
  background-color: #2d2d2d;
  color: #f5f5f5;
  border-color: #3d3d3d;
}

.is-dark-mode .button.is-primary {
  background-color: #485fc7;
  color: #fff;
}

.is-dark-mode .button.is-info {
  background-color: #3e8ed0;
  color: #fff;
}

.is-dark-mode .button.is-success {
  background-color: #48c78e;
  color: #fff;
}

.is-dark-mode .button.is-warning {
  background-color: #ffe08a;
  color: rgba(0, 0, 0, 0.7);
}

.is-dark-mode .button.is-danger {
  background-color: #f14668;
  color: #fff;
}

.is-dark-mode .table {
  background-color: #1e1e1e;
  color: #f5f5f5;
}

.is-dark-mode .table th {
  color: #f5f5f5;
}

.is-dark-mode .table tr:hover {
  background-color: #2d2d2d;
}

.is-dark-mode .modal-card-head,
.is-dark-mode .modal-card-foot {
  background-color: #1e1e1e;
  border-color: #3d3d3d;
}

.is-dark-mode .modal-card-body {
  background-color: #121212;
}

.container {
  padding: 1rem;
}

.card {
  margin-bottom: 1rem;
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.section {
  padding: 1.5rem;
}
</style>
