<template>
  <div class="friends">
    <div class="container">
      <h1 class="title">Friends</h1>
      
      <div class="columns">
        <div class="column is-8">
          <div class="box">
            <h2 class="title is-4">Your Friends</h2>
            
            <div class="field">
              <div class="control has-icons-left">
                <input
                  v-model="searchQuery"
                  class="input"
                  type="text"
                  placeholder="Search friends..."
                />
                <span class="icon is-small is-left">
                  <font-awesome-icon icon="search" />
                </span>
              </div>
            </div>
            
            <div v-if="isLoading" class="has-text-centered my-6">
              <span class="icon is-large">
                <font-awesome-icon icon="spinner" spin size="2x" />
              </span>
              <p>Loading friends...</p>
            </div>
            
            <div v-else-if="filteredFriends.length === 0" class="has-text-centered my-6">
              <p>You don't have any friends yet.</p>
              <p class="mt-4">Add friends by sending them a friend request.</p>
            </div>
            
            <div v-else>
              <div class="columns is-multiline">
                <div
                  v-for="friend in filteredFriends"
                  :key="friend.id"
                  class="column is-12-tablet is-6-desktop"
                >
                  <div class="card">
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
                          <p class="title is-5">{{ friend.profiles.first_name }} {{ friend.profiles.last_name }}</p>
                          <p class="subtitle is-6">{{ friend.profiles.email }}</p>
                        </div>
                      </div>
                    </div>
                    <footer class="card-footer">
                      <router-link :to="`/friends/${friend.friend_id}`" class="card-footer-item">
                        <span class="icon">
                          <font-awesome-icon icon="running" />
                        </span>
                        <span>View Activities</span>
                      </router-link>
                      <a class="card-footer-item" @click="confirmRemoveFriend(friend)">
                        <span class="icon has-text-danger">
                          <font-awesome-icon icon="user-minus" />
                        </span>
                        <span>Remove</span>
                      </a>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="box mt-5">
            <h2 class="title is-4">Friend Activities</h2>
            
            <div v-if="isLoading" class="has-text-centered my-6">
              <span class="icon is-large">
                <font-awesome-icon icon="spinner" spin size="2x" />
              </span>
              <p>Loading activities...</p>
            </div>
            
            <div v-else-if="friendActivities.length === 0" class="has-text-centered my-6">
              <p>No friend activities to show.</p>
            </div>
            
            <div v-else>
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
                          <p class="title is-5">{{ activity.profiles.first_name }} {{ activity.profiles.last_name }}</p>
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
        
        <div class="column is-4">
          <div class="box">
            <h3 class="title is-4">Add Friend</h3>
            
            <div v-if="error" class="notification is-danger">
              {{ error }}
            </div>
            
            <div v-if="success" class="notification is-success">
              {{ success }}
            </div>
            
            <form @submit.prevent="sendFriendRequest">
              <div class="field">
                <label class="label">Friend's Email</label>
                <div class="control has-icons-left">
                  <input
                    v-model="friendEmail"
                    class="input"
                    type="email"
                    placeholder="e.g. friend@example.com"
                    required
                  />
                  <span class="icon is-small is-left">
                    <font-awesome-icon icon="envelope" />
                  </span>
                </div>
              </div>
              
              <div class="field">
                <div class="control">
                  <button
                    type="submit"
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': isSubmitting }"
                  >
                    Send Friend Request
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <div class="box mt-5">
            <h3 class="title is-4">Friend Requests</h3>
            
            <div v-if="isLoading" class="has-text-centered my-6">
              <span class="icon is-large">
                <font-awesome-icon icon="spinner" spin size="2x" />
              </span>
              <p>Loading requests...</p>
            </div>
            
            <div v-else-if="friendRequests.length === 0" class="has-text-centered my-6">
              <p>No pending friend requests.</p>
            </div>
            
            <div v-else>
              <div
                v-for="request in friendRequests"
                :key="request.id"
                class="card mb-4"
              >
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
                      <p class="title is-5">{{ request.profiles.first_name }} {{ request.profiles.last_name }}</p>
                      <p class="subtitle is-6">{{ request.profiles.email }}</p>
                    </div>
                  </div>
                  <div class="buttons mt-4">
                    <button
                      class="button is-success"
                      :class="{ 'is-loading': isSubmitting && activeRequestId === request.id }"
                      @click="acceptFriendRequest(request)"
                    >
                      <span class="icon">
                        <font-awesome-icon icon="check" />
                      </span>
                      <span>Accept</span>
                    </button>
                    <button
                      class="button is-danger is-outlined"
                      :class="{ 'is-loading': isSubmitting && activeRequestId === request.id }"
                      @click="rejectFriendRequest(request)"
                    >
                      <span class="icon">
                        <font-awesome-icon icon="times" />
                      </span>
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Remove Friend Confirmation Modal -->
    <div class="modal" :class="{ 'is-active': isRemoveModalActive }">
      <div class="modal-background" @click="closeRemoveModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Remove Friend</p>
          <button class="delete" aria-label="close" @click="closeRemoveModal"></button>
        </header>
        <section class="modal-card-body">
          <p>Are you sure you want to remove this friend? This action cannot be undone.</p>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-danger"
            :class="{ 'is-loading': isSubmitting }"
            @click="removeFriend"
          >
            Remove
          </button>
          <button class="button" @click="closeRemoveModal">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'FriendsView',
  setup() {
    const store = useStore();
    
    const searchQuery = ref('');
    const friendEmail = ref('');
    const error = ref('');
    const success = ref('');
    const isSubmitting = ref(false);
    const isRemoveModalActive = ref(false);
    const selectedFriend = ref(null);
    const activeRequestId = ref(null);
    
    const isLoading = computed(() => store.getters.isLoading);
    const friends = computed(() => store.getters['friends/allFriends']);
    const friendRequests = computed(() => store.getters['friends/friendRequests']);
    const friendActivities = computed(() => store.getters['activities/friendActivities']);
    
    const filteredFriends = computed(() => {
      if (!searchQuery.value) {
        return friends.value;
      }
      
      const query = searchQuery.value.toLowerCase();
      return friends.value.filter(friend => {
        const fullName = `${friend.profiles.first_name} ${friend.profiles.last_name}`.toLowerCase();
        return (
          fullName.includes(query) ||
          friend.profiles.email.toLowerCase().includes(query)
        );
      });
    });
    
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
    
    const sendFriendRequest = async () => {
      try {
        isSubmitting.value = true;
        error.value = '';
        success.value = '';
        
        const result = await store.dispatch('friends/sendFriendRequest', friendEmail.value);
        
        if (result.success) {
          success.value = `Friend request sent to ${friendEmail.value}`;
          friendEmail.value = '';
        } else {
          error.value = result.error || 'Failed to send friend request';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    const acceptFriendRequest = async (request) => {
      try {
        isSubmitting.value = true;
        activeRequestId.value = request.id;
        
        const result = await store.dispatch('friends/acceptFriendRequest', request.id);
        
        if (!result.success) {
          error.value = result.error || 'Failed to accept friend request';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
        activeRequestId.value = null;
      }
    };
    
    const rejectFriendRequest = async (request) => {
      try {
        isSubmitting.value = true;
        activeRequestId.value = request.id;
        
        const result = await store.dispatch('friends/rejectFriendRequest', request.id);
        
        if (!result.success) {
          error.value = result.error || 'Failed to reject friend request';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
        activeRequestId.value = null;
      }
    };
    
    const confirmRemoveFriend = (friend) => {
      selectedFriend.value = friend;
      isRemoveModalActive.value = true;
    };
    
    const closeRemoveModal = () => {
      isRemoveModalActive.value = false;
    };
    
    const removeFriend = async () => {
      try {
        isSubmitting.value = true;
        
        const result = await store.dispatch('friends/removeFriend', selectedFriend.value.friend_id);
        
        if (result.success) {
          closeRemoveModal();
        } else {
          error.value = result.error || 'Failed to remove friend';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    onMounted(async () => {
      // Fetch friends
      await store.dispatch('friends/fetchFriends');
      
      // Fetch friend requests
      await store.dispatch('friends/fetchFriendRequests');
      
      // Fetch friend activities
      await store.dispatch('activities/fetchFriendActivities');
    });
    
    return {
      searchQuery,
      friendEmail,
      error,
      success,
      isSubmitting,
      isRemoveModalActive,
      activeRequestId,
      isLoading,
      friends,
      filteredFriends,
      friendRequests,
      friendActivities,
      getActivityIcon,
      formatDate,
      sendFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      confirmRemoveFriend,
      closeRemoveModal,
      removeFriend
    };
  }
};
</script>

<style scoped>
.friends {
  padding: 2rem 0;
}

.card {
  margin-bottom: 1rem;
}
</style>
