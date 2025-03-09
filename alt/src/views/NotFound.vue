<template>
  <div class="not-found">
    <div class="container has-text-centered">
      <div class="box">
        <h1 class="title is-1">404</h1>
        <h2 class="subtitle is-3">Page Not Found</h2>
        <p class="mb-5">The page you are looking for doesn't exist or has been moved.</p>
        <router-link to="/" class="button is-primary">
          <span class="icon">
            <font-awesome-icon icon="home" />
          </span>
          <span>Go Home</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFoundView'
});
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.box {
  max-width: 500px;
  margin: 0 auto;
  padding: 3rem;
}

.title {
  font-size: 5rem;
  color: #ff3860;
}
</style>
