<template>
  <div class="home">
    <section class="hero is-primary is-bold is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column is-6">
              <h1 class="title is-1">
                Track Your Fitness Journey
              </h1>
              <h2 class="subtitle is-3">
                Log activities, connect with friends, and achieve your goals
              </h2>
              <div class="buttons are-large mt-6">
                <router-link to="/register" class="button is-light is-outlined">
                  <span>Get Started</span>
                  <span class="icon">
                    <font-awesome-icon icon="arrow-right" />
                  </span>
                </router-link>
                <router-link to="/login" class="button is-light">
                  <span>Login</span>
                </router-link>
              </div>
            </div>
            <div class="column is-6">
              <div class="box has-text-centered p-6">
                <figure class="image is-4by3">
                  <img src="https://source.unsplash.com/random/800x600/?fitness" alt="Fitness" />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="title has-text-centered mb-6">Features</h2>
        <div class="columns">
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="has-text-centered mb-4">
                  <span class="icon is-large">
                    <font-awesome-icon icon="running" size="3x" />
                  </span>
                </div>
                <p class="title is-4 has-text-centered">Track Activities</p>
                <p class="has-text-centered">
                  Log your workouts, runs, and other fitness activities to keep track of your progress.
                </p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="has-text-centered mb-4">
                  <span class="icon is-large">
                    <font-awesome-icon icon="users" size="3x" />
                  </span>
                </div>
                <p class="title is-4 has-text-centered">Connect with Friends</p>
                <p class="has-text-centered">
                  Add friends, see their activities, and motivate each other to reach your fitness goals.
                </p>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card">
              <div class="card-content">
                <div class="has-text-centered mb-4">
                  <span class="icon is-large">
                    <font-awesome-icon icon="chart-bar" size="3x" />
                  </span>
                </div>
                <p class="title is-4 has-text-centered">Track Progress</p>
                <p class="has-text-centered">
                  View statistics and charts to visualize your progress over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HomeView'
});
</script>

<style scoped>
.hero {
  background-image: linear-gradient(141deg, #009e6c 0%, #00d1b2 71%, #00e7eb 100%);
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-content {
  flex-grow: 1;
}
</style>
