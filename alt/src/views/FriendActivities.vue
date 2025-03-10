<template>
  <div class="friend-activities">
    <div class="container">
      <h1 class="title">Friend Activities</h1>
      <div v-if="isLoading" class="has-text-centered my-6">
        <span class="icon is-large">
          <font-awesome-icon icon="spinner" spin size="2x" />
        </span>
        <p>Loading activities...</p>
      </div>
      <div v-else-if="friendActivities.length === 0" class="has-text-centered my-6">
        <p>No activities to show for this friend.</p>
      </div>
      <div v-else-if="friendActivities">
        <div class="columns is-multiline">
          <div
            v-for="activity in friendActivities"
            :key="activity.id"
            class="column is-12"
          >
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  {{ activity.title }}
                </p>
                <div class="card-header-icon">
                  <span class="icon">
                    <font-awesome-icon :icon="getActivityIcon(activity.type)" />
                  </span>
                </div>
              </header>
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
                    <p class="title is-5">{{ activity.profiles ? activity.profiles.first_name + ' ' + activity.profiles.last_name : '' }}</p>
                    <p class="subtitle is-6">{{ formatDate(activity.created_at) }}</p>
                  </div>
                </div>
                <div class="content">
                  <p>{{ activity.description }}</p>
                  <div class="tags">
                    <span class="tag is-primary">{{ activity.type }}</span>
                    <span class="tag is-info">{{ activity.duration }} min</span>
                    <span v-if="activity.distance" class="tag is-success">{{ activity.distance }} km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'FriendActivities',
  setup() {
    const store = useStore();
    const route = useRoute();

    const isLoading = computed(() => store.getters.isLoading);
    const friendActivities = computed(() => store.getters['activities/friendActivities']);

    const getActivityIcon = (type) => {
      const icons = {
        Running: 'running',
        Cycling: 'bicycle',
        Swimming: 'swimmer',
        Walking: 'walking',
        Hiking: 'hiking',
        Gym: 'dumbbell',
        Yoga: 'om',
        Other: 'star'
      };

      return icons[type] || 'star';
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    onMounted(async () => {
      const friendId = route.params.id;
      // Fetch friends to get the user ID
      await store.dispatch('friends/fetchFriends');
      const friends = store.getters['friends/allFriends'];
      console.log('Friends:', friends);
      const friend = friends.find(friend => friend.friend_id === friendId);

      if (friend) {
        console.log('Friend:', friend);
        await store.dispatch('activities/fetchFriendActivities', friend.profiles.id);
      } else {
        console.error('Friend not found');
      }
    });

    return {
      isLoading,
      friendActivities,
      getActivityIcon,
      formatDate
    };
  }
};
</script>

<style scoped>
.friend-activities {
  padding: 2rem 0;
}

.card {
  margin-bottom: 1rem;
}
</style>
