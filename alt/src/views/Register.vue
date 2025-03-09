<template>
  <div class="register">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-6-tablet is-5-desktop is-4-widescreen">
          <div class="box">
            <h1 class="title has-text-centered">Sign Up</h1>
            
            <div v-if="error" class="notification is-danger">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleRegister">
              <div class="field">
                <label class="label">First Name</label>
                <div class="control has-icons-left">
                  <input
                    v-model="firstName"
                    class="input"
                    type="text"
                    placeholder="John"
                    required
                  />
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="user" />
                  </span>
                </div>
              </div>
              
              <div class="field">
                <label class="label">Last Name</label>
                <div class="control has-icons-left">
                  <input
                    v-model="lastName"
                    class="input"
                    type="text"
                    placeholder="Doe"
                    required
                  />
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="user" />
                  </span>
                </div>
              </div>
              
              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left">
                  <input
                    v-model="email"
                    class="input"
                    type="email"
                    placeholder="e.g. johndoe@example.com"
                    required
                  />
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="envelope" />
                  </span>
                </div>
              </div>
              
              <div class="field">
                <label class="label">Password</label>
                <div class="control has-icons-left">
                  <input
                    v-model="password"
                    class="input"
                    type="password"
                    placeholder="********"
                    required
                    minlength="8"
                  />
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="lock" />
                  </span>
                </div>
                <p class="help">Password must be at least 8 characters long</p>
              </div>
              
              <div class="field">
                <label class="label">Confirm Password</label>
                <div class="control has-icons-left">
                  <input
                    v-model="confirmPassword"
                    class="input"
                    type="password"
                    placeholder="********"
                    required
                  />
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="lock" />
                  </span>
                </div>
              </div>
              
              <div class="field">
                <div class="control">
                  <button
                    type="submit"
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    :disabled="!isFormValid"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
            
            <div class="has-text-centered mt-4">
              <p>
                Already have an account?
                <router-link to="/login">Login</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterView',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    
    const isLoading = computed(() => store.getters.isLoading);
    
    const isFormValid = computed(() => {
      return (
        firstName.value.trim() !== '' &&
        lastName.value.trim() !== '' &&
        email.value.trim() !== '' &&
        password.value.length >= 8 &&
        password.value === confirmPassword.value
      );
    });
    
    const handleRegister = async () => {
      try {
        error.value = '';
        
        if (password.value !== confirmPassword.value) {
          error.value = 'Passwords do not match';
          return;
        }
        
        const result = await store.dispatch('auth/register', {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value
        });
        
        if (result.success) {
          router.push('/dashboard');
        } else {
          error.value = result.error || 'Registration failed. Please try again.';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred.';
      }
    };
    
    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      error,
      isLoading,
      isFormValid,
      handleRegister
    };
  }
};
</script>

<style scoped>
.register {
  padding: 2rem 0;
}

.box {
  margin-top: 2rem;
}
</style>
