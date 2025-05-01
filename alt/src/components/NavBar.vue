<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        <strong>Fitness App</strong>
      </router-link>

      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': isMenuActive }"
        aria-label="menu"
        aria-expanded="false"
        @click="toggleMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
      <div class="navbar-start">
        <router-link v-if="isAuthenticated" class="navbar-item" to="/dashboard">
          Dashboard
        </router-link>
        <router-link v-if="isAuthenticated" class="navbar-item" to="/activities">
          Activities
        </router-link>
        <router-link v-if="isAuthenticated" class="navbar-item" to="/friends">
          Friends
        </router-link>
        <router-link v-if="isAdmin" class="navbar-item" to="/admin">
          Admin
        </router-link>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="field">
            <input
              id="switchDarkMode"
              type="checkbox"
              class="switch is-rounded is-primary"
              :checked="isDarkMode"
              @change="toggleDarkMode"
            />
            <label for="switchDarkMode">Dark Mode</label>
          </div>
        </div>
        
        <div class="navbar-item">
          <div class="buttons">
            <template v-if="isAuthenticated">
              <router-link class="button is-light" to="/profile">
                <span class="icon">
                  <i class="fas fa-user"></i>
                </span>
                <span>{{ currentUser ? currentUser.firstName : 'Profile' }}</span>
              </router-link>
              <button class="button is-danger" @click="logout">
                <span class="icon">
                  <i class="fas fa-sign-out-alt"></i>
                </span>
                <span>Logout</span>
              </button>
            </template>
            <template v-else>
              <router-link class="button is-primary" to="/register">
                <strong>Sign up</strong>
              </router-link>
              <router-link class="button is-light" to="/login">
                Log in
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'NavBar',
  setup() {
    const store = useStore();
    const router = useRouter();
    const isMenuActive = ref(false);
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const isAdmin = computed(() => store.getters['auth/isAdmin']);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const isDarkMode = computed(() => store.getters.isDarkMode);
    
    const toggleMenu = () => {
      isMenuActive.value = !isMenuActive.value;
    };
    
    const toggleDarkMode = () => {
      store.dispatch('toggleDarkMode');
    };
    
    const logout = async () => {
      try {
        const result = await store.dispatch('auth/logout');
        if (result.success) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
    return {
      isMenuActive,
      isAuthenticated,
      isAdmin,
      currentUser,
      isDarkMode,
      toggleMenu,
      toggleDarkMode,
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  margin-bottom: 1rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 3.5rem;
  height: 2rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch + label {
  margin-left: 0.5rem;
}
</style>
