<template>
  <div class="login">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-6-tablet is-5-desktop is-4-widescreen">
          <div class="box">
            <h1 class="title has-text-centered">Login</h1>

            <div v-if="error" class="notification is-danger">
              {{ error }}
            </div>

            <form @submit.prevent="handleLogin">
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
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>

            <div class="has-text-centered mt-4">
              <p>
                Don't have an account?
                <router-link to="/register">Sign up</router-link>
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
  name: 'LoginView',
  setup() {
    const store = useStore();
    const router = useRouter();

    const email = ref('');
    const password = ref('');
    const error = ref('');

    const isLoading = computed(() => store.getters.isLoading);

    // Redirect to dashboard if already logged in
    if (store.getters['auth/isAuthenticated']) {
      router.push('/dashboard');
    }

    const handleLogin = async () => {
      try {
        error.value = '';

        const result = await store.dispatch('auth/login', {
          email: email.value,
          password: password.value
        });

        if (result.success) {
          router.push('/dashboard');
        } else {
          error.value = result.error || 'Login failed. Please try again.';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred.';
      }
    };

    return {
      email,
      password,
      error,
      isLoading,
      handleLogin
    };
  }
};
</script>

<style scoped>
.login {
  padding: 2rem 0;
}

.box {
  margin-top: 2rem;
}
</style>
