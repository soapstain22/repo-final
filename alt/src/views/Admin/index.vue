<template>
  <div class="admin">
    <div class="container">
      <h1 class="title">Admin Dashboard</h1>
      
      <div class="tabs is-boxed">
        <ul>
          <li :class="{ 'is-active': activeTab === 'users' }">
            <a @click="activeTab = 'users'">
              <span class="icon">
                <font-awesome-icon icon="users" />
              </span>
              <span>Users</span>
            </a>
          </li>
          <li :class="{ 'is-active': activeTab === 'activities' }">
            <a @click="activeTab = 'activities'">
              <span class="icon">
                <font-awesome-icon icon="running" />
              </span>
              <span>Activities</span>
            </a>
          </li>
          <li :class="{ 'is-active': activeTab === 'stats' }">
            <a @click="activeTab = 'stats'">
              <span class="icon">
                <font-awesome-icon icon="chart-bar" />
              </span>
              <span>Statistics</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div v-if="!isAdmin" class="notification is-danger">
        <p>You do not have permission to access this area.</p>
        <router-link to="/dashboard" class="button is-light mt-4">
          Return to Dashboard
        </router-link>
      </div>
      
      <div v-else-if="activeTab === 'users'">
        <router-view name="users" />
      </div>
      
      <div v-else-if="activeTab === 'activities'">
        <div class="box">
          <h2 class="title is-4">All Activities</h2>
          <p class="subtitle">View and manage all user activities</p>
          
          <div v-if="isLoading" class="has-text-centered my-6">
            <span class="icon is-large">
              <font-awesome-icon icon="spinner" spin size="2x" />
            </span>
            <p>Loading activities...</p>
          </div>
          
          <div v-else>
            <div class="field">
              <div class="control has-icons-left">
                <input
                  v-model="searchQuery"
                  class="input"
                  type="text"
                  placeholder="Search activities..."
                />
                <span class="icon is-small is-left">
                  <font-awesome-icon icon="search" />
                </span>
              </div>
            </div>
            
            <div class="table-container">
              <table class="table is-fullwidth is-striped is-hoverable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in filteredActivities" :key="activity.id">
                    <td>{{ activity.id }}</td>
                    <td>{{ activity.user_id }}</td>
                    <td>{{ activity.title }}</td>
                    <td>{{ activity.type }}</td>
                    <td>{{ activity.duration }} min</td>
                    <td>{{ formatDate(activity.created_at) }}</td>
                    <td>
                      <div class="buttons are-small">
                        <button class="button is-danger" @click="deleteActivity(activity.id)">
                          <span class="icon">
                            <font-awesome-icon icon="trash" />
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="activeTab === 'stats'">
        <div class="box">
          <h2 class="title is-4">System Statistics</h2>
          
          <div class="columns is-multiline">
            <div class="column is-3">
              <div class="box has-background-primary-light">
                <p class="heading has-text-centered">Total Users</p>
                <p class="title has-text-centered">{{ users.length }}</p>
              </div>
            </div>
            <div class="column is-3">
              <div class="box has-background-link-light">
                <p class="heading has-text-centered">Total Activities</p>
                <p class="title has-text-centered">{{ activities.length }}</p>
              </div>
            </div>
            <div class="column is-3">
              <div class="box has-background-success-light">
                <p class="heading has-text-centered">Admin Users</p>
                <p class="title has-text-centered">{{ adminUsers.length }}</p>
              </div>
            </div>
            <div class="column is-3">
              <div class="box has-background-warning-light">
                <p class="heading has-text-centered">Activities Today</p>
                <p class="title has-text-centered">{{ activitiesToday }}</p>
              </div>
            </div>
          </div>
          
          <div class="columns">
            <div class="column is-6">
              <div class="box">
                <h3 class="title is-5">Activity Types</h3>
                <div class="content">
                  <ul>
                    <li v-for="(count, type) in activityTypes" :key="type">
                      {{ type }}: {{ count }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="column is-6">
              <div class="box">
                <h3 class="title is-5">Recent Registrations</h3>
                <div class="content">
                  <ul>
                    <li v-for="user in recentUsers" :key="user.id">
                      {{ user.first_name }} {{ user.last_name }} ({{ formatDate(user.created_at) }})
                    </li>
                  </ul>
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
import { useRouter } from 'vue-router';

export default {
  name: 'AdminView',
  setup() {
    const store = useStore();
    const router = useRouter();
    
    const activeTab = ref('users');
    const searchQuery = ref('');
    
    const isAdmin = computed(() => store.getters['auth/isAdmin']);
    const isLoading = computed(() => store.getters.isLoading);
    const users = computed(() => store.getters['users/allUsers']);
    const activities = computed(() => store.getters['activities/allActivities']);
    
    const adminUsers = computed(() => {
      return users.value.filter(user => user.role === 'admin');
    });
    
    const recentUsers = computed(() => {
      return [...users.value]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    });
    
    const filteredActivities = computed(() => {
      if (!searchQuery.value) {
        return activities.value;
      }
      
      const query = searchQuery.value.toLowerCase();
      return activities.value.filter(activity => {
        return (
          activity.title.toLowerCase().includes(query) ||
          activity.type.toLowerCase().includes(query) ||
          activity.user_id.toLowerCase().includes(query)
        );
      });
    });
    
    const activitiesToday = computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return activities.value.filter(activity => {
        const activityDate = new Date(activity.created_at);
        return activityDate >= today;
      }).length;
    });
    
    const activityTypes = computed(() => {
      const types = {};
      
      activities.value.forEach(activity => {
        if (types[activity.type]) {
          types[activity.type]++;
        } else {
          types[activity.type] = 1;
        }
      });
      
      return types;
    });
    
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const deleteActivity = async (activityId) => {
      if (confirm('Are you sure you want to delete this activity?')) {
        await store.dispatch('activities/deleteActivity', activityId);
      }
    };
    
    onMounted(async () => {
      if (isAdmin.value) {
        // Fetch all users
        await store.dispatch('users/fetchUsers');
        
        // Fetch all activities
        await store.dispatch('activities/fetchActivities');
      } else {
        // Redirect non-admin users
        router.push('/dashboard');
      }
    });
    
    return {
      activeTab,
      searchQuery,
      isAdmin,
      isLoading,
      users,
      activities,
      adminUsers,
      recentUsers,
      filteredActivities,
      activitiesToday,
      activityTypes,
      formatDate,
      deleteActivity
    };
  }
};
</script>

<style scoped>
.admin {
  padding: 2rem 0;
}

.tabs {
  margin-bottom: 2rem;
}
</style>
