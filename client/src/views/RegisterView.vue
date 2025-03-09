<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-half">
        <h1 class="title">Register</h1>
        <div class="notification is-danger" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Name" v-model="name">
          </div>
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
        <button class="button is-primary" @click="registerUser">Register</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { register } from '../services/auth';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const registerUser = async () => {
  const result = await register(name.value, email.value, password.value);
  if (result === "Email already registered") {
    errorMessage.value = "This email is already registered.";
  } else if (result === "All fields are required") {
    errorMessage.value = "All fields are required.";
  } else if (result) {
    // Registration successful
    errorMessage.value = '';
    router.push('/'); // Redirect to home page after successful registration
  } else {
    errorMessage.value = "Registration failed.";
  }
};
</script>

<style scoped>
.container {
  margin-top: 2rem;
}
</style>
