<template>
  <div class="search-component">
    <o-autocomplete
      v-model="query"
      :data="filteredData"
      placeholder="Search..."
      icon="search"
      :loading="isLoading"
      :clear-on-select="true"
      dropdown-position="bottom"
      class="is-fullwidth"
      @select="onSelect"
    >
      <template #empty>No results found</template>
      <template #item="{ option }">
        <div class="media">
          <div class="media-left">
            <span class="icon">
              <font-awesome-icon :icon="getIcon(option.type)" />
            </span>
          </div>
          <div class="media-content">
            <div>
              <span class="has-text-weight-bold">{{ option.title || option.name }}</span>
              <span v-if="option.type" class="tag is-small is-primary ml-2">{{ option.type }}</span>
            </div>
            <div class="is-size-7">{{ option.description || option.email || '' }}</div>
          </div>
        </div>
      </template>
    </o-autocomplete>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'SearchComponent',
  props: {
    type: {
      type: String,
      default: 'all', // 'all', 'activities', 'users', 'friends'
      validator: (value) => ['all', 'activities', 'users', 'friends'].includes(value)
    }
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    
    const query = ref('');
    const isLoading = ref(false);
    
    const activities = computed(() => store.getters['activities/allActivities']);
    const users = computed(() => store.getters['users/allUsers']);
    const friends = computed(() => store.getters['friends/allFriends']);
    
    const filteredData = computed(() => {
      if (!query.value) {
        return [];
      }
      
      const searchQuery = query.value.toLowerCase();
      let results = [];
      
      if (props.type === 'all' || props.type === 'activities') {
        const filteredActivities = activities.value.filter(activity => {
          return (
            activity.title.toLowerCase().includes(searchQuery) ||
            (activity.description && activity.description.toLowerCase().includes(searchQuery)) ||
            activity.type.toLowerCase().includes(searchQuery)
          );
        }).map(activity => ({
          ...activity,
          category: 'activity'
        }));
        
        results = [...results, ...filteredActivities];
      }
      
      if (props.type === 'all' || props.type === 'users') {
        const filteredUsers = users.value.filter(user => {
          const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
          return (
            fullName.includes(searchQuery) ||
            user.email.toLowerCase().includes(searchQuery)
          );
        }).map(user => ({
          ...user,
          name: `${user.first_name} ${user.last_name}`,
          category: 'user'
        }));
        
        results = [...results, ...filteredUsers];
      }
      
      if (props.type === 'all' || props.type === 'friends') {
        const filteredFriends = friends.value.filter(friend => {
          const fullName = `${friend.profiles.first_name} ${friend.profiles.last_name}`.toLowerCase();
          return (
            fullName.includes(searchQuery) ||
            friend.profiles.email.toLowerCase().includes(searchQuery)
          );
        }).map(friend => ({
          ...friend,
          name: `${friend.profiles.first_name} ${friend.profiles.last_name}`,
          email: friend.profiles.email,
          category: 'friend'
        }));
        
        results = [...results, ...filteredFriends];
      }
      
      return results.slice(0, 10); // Limit to 10 results
    });
    
    const getIcon = (type) => {
      const activityIcons = {
        Running: 'running',
        Cycling: 'bicycle',
        Swimming: 'swimmer',
        Walking: 'walking',
        Hiking: 'hiking',
        Gym: 'dumbbell',
        Yoga: 'om'
      };
      
      if (type in activityIcons) {
        return activityIcons[type];
      }
      
      const categoryIcons = {
        activity: 'running',
        user: 'user',
        friend: 'user-friends'
      };
      
      return categoryIcons[type] || 'star';
    };
    
    const onSelect = (option) => {
      if (!option) return;
      
      if (option.category === 'activity') {
        // Navigate to activity details
        router.push(`/activities/${option.id}`);
      } else if (option.category === 'user') {
        // Navigate to user profile (admin only)
        router.push(`/admin/users/${option.id}`);
      } else if (option.category === 'friend') {
        // Navigate to friend's activities
        router.push(`/friends/${option.friend_id}`);
      }
      
      // Clear the search
      query.value = '';
    };
    
    // Fetch data when component is mounted
    watch(
      () => props.type,
      async () => {
        isLoading.value = true;
        
        try {
          if (props.type === 'all' || props.type === 'activities') {
            await store.dispatch('activities/fetchActivities');
          }
          
          if (props.type === 'all' || props.type === 'users') {
            await store.dispatch('users/fetchUsers');
          }
          
          if (props.type === 'all' || props.type === 'friends') {
            await store.dispatch('friends/fetchFriends');
          }
        } catch (error) {
          console.error('Error fetching search data:', error);
        } finally {
          isLoading.value = false;
        }
      },
      { immediate: true }
    );
    
    return {
      query,
      isLoading,
      filteredData,
      getIcon,
      onSelect
    };
  }
};
</script>

<style scoped>
.search-component {
  width: 100%;
}
</style>
