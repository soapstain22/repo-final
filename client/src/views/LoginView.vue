<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-half">
        <h1 class="title">Login</h1>
        <div class="notification is-danger" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" type="email" placeholder="Email" v-model="email">
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" placeholder="Password" v-model="password">
          </div>
        </div>
        <button class="button is-primary" @click="loginUser">Login</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../services/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const loginUser = async () => {
  const user = await login(email.value, password.value);
  if (user) {
    // Login successful
    errorMessage.value = '';
    router.push('/'); // Redirect to home page after successful login
  } else {
    // Login failed
    errorMessage.value = 'Invalid email or password.';
  }
};
</script>

<style scoped>
.container {
  margin-top: 2rem;
}
</style>
