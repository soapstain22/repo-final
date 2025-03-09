<template>
  <div class="dashboard">
    <div class="container">
      <h1 class="title">Dashboard</h1>
      
      <div class="columns">
        <div class="column is-8">
          <div class="box">
            <h2 class="title is-4">Welcome, {{ currentUser ? currentUser.first_name : 'User' }}!</h2>
            <p class="subtitle">Here's your fitness summary</p>
            
            <div class="columns is-multiline mt-4">
              <div class="column is-6">
                <div class="card">
                  <div class="card-content">
                    <div class="level">
                      <div class="level-left">
                        <div>
                          <p class="heading">Recent Activities</p>
                          <p class="title is-4">{{ userActivities.length }}</p>
                        </div>
                      </div>
                      <div class="level-right">
                        <span class="icon is-large has-text-primary">
                          <font-awesome-icon icon="running" size="2x" />
                        </span>
                      </div>
                    </div>
                    <router-link to="/activities" class="button is-primary is-outlined is-fullwidth mt-4">
                      View All
                    </router-link>
                  </div>
                </div>
              </div>
              
              <div class="column is-6">
                <div class="card">
                  <div class="card-content">
                    <div class="level">
                      <div class="level-left">
                        <div>
                          <p class="heading">Friends</p>
                          <p class="title is-4">{{ friends.length }}</p>
                        </div>
                      </div>
                      <div class="level-right">
                        <span class="icon is-large has-text-info">
                          <font-awesome-icon icon="users" size="2x" />
                        </span>
                      </div>
                    </div>
                    <router-link to="/friends" class="button is-info is-outlined is-fullwidth mt-4">
                      View All
                    </router-link>
                  </div>
                </div>
              </div>
              
              <div class="column is-12">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">
                      Activity Stats
                    </p>
                  </header>
                  <div class="card-content">
                    <div v-if="userActivities.length === 0" class="has-text-centered">
                      <p>No activities recorded yet.</p>
                      <router-link to="/activities" class="button is-primary mt-4">
                        Add Your First Activity
                      </router-link>
                    </div>
                    <div v-else>
                      <div class="columns is-multiline">
                        <div class="column is-6">
                          <div class="box has-background-primary-light">
                            <p class="heading has-text-centered">Total Activities</p>
                            <p class="title has-text-centered">{{ userActivities.length }}</p>
                          </div>
                        </div>
                        <div class="column is-6">
                          <div class="box has-background-info-light">
                            <p class="heading has-text-centered">This Week</p>
                            <p class="title has-text-centered">{{ activitiesThisWeek }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="column is-4">
          <div class="box">
            <h3 class="title is-4">Friend Activity</h3>
            
            <div v-if="friendActivities.length === 0" class="has-text-centered">
              <p>No friend activities to show.</p>
              <router-link to="/friends" class="button is-info is-outlined mt-4">
                Find Friends
              </router-link>
            </div>
            
            <div v-else>
              <div v-for="(activity, index) in recentFriendActivities" :key="index" class="card mb-4">
                <div class="card-content">
                  <div class="media">
                    <div class="media-left">
                      <figure class="image is-48x48">
                        <span class="icon is-large">
                          <font-awesome-icon icon="user-circle" size="3x" />
                        </span>
                      </figure>
                    </div>
                    <div class="media-content">
                      <p class="title is-5">{{ activity.profiles.first_name }} {{ activity.profiles.last_name }}</p>
                      <p class="subtitle is-6">{{ activity.title }}</p>
                    </div>
                  </div>
                  <div class="content">
                    <p>{{ activity.description }}</p>
                    <time>{{ formatDate(activity.created_at) }}</time>
                  </div>
                </div>
              </div>
              
              <div class="has-text-centered mt-4">
                <router-link to="/friends" class="button is-info is-outlined">
                  View All Friend Activities
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DashboardView',
  setup() {
    const store = useStore();
    
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const userActivities = computed(() => store.getters['activities/userActivities']);
    const friendActivities = computed(() => store.getters['activities/friendActivities']);
    const friends = computed(() => store.getters['friends/allFriends']);
    
    const recentFriendActivities = computed(() => {
      return friendActivities.value.slice(0, 3);
    });
    
    const activitiesThisWeek = computed(() => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      return userActivities.value.filter(activity => {
        const activityDate = new Date(activity.created_at);
        return activityDate >= oneWeekAgo;
      }).length;
    });
    
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    onMounted(async () => {
      // Fetch user activities
      await store.dispatch('activities/fetchUserActivities');
      
      // Fetch friend activities
      await store.dispatch('activities/fetchFriendActivities');
      
      // Fetch friends
      await store.dispatch('friends/fetchFriends');
    });
    
    return {
      currentUser,
      userActivities,
      friendActivities,
      recentFriendActivities,
      friends,
      activitiesThisWeek,
      formatDate
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}

.card {
  height: 100%;
}
</style>
