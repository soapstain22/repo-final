<template>
  <div class="activities">
    <div class="container">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h1 class="title">Activities</h1>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button is-primary" @click="openAddModal">
              <span class="icon">
                <font-awesome-icon icon="plus" />
              </span>
              <span>Add Activity</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="box">
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
        
        <div v-if="isLoading" class="has-text-centered my-6">
          <span class="icon is-large">
            <font-awesome-icon icon="spinner" spin size="2x" />
          </span>
          <p>Loading activities...</p>
        </div>
        
        <div v-else-if="filteredActivities.length === 0" class="has-text-centered my-6">
          <p>No activities found.</p>
          <button class="button is-primary mt-4" @click="openAddModal">
            Add Your First Activity
          </button>
        </div>
        
        <div v-else>
          <div class="columns is-multiline">
            <div
              v-for="activity in filteredActivities"
              :key="activity.id"
              class="column is-12-tablet is-6-desktop"
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
                  <div class="content">
                    <p>{{ activity.description }}</p>
                    <div class="tags">
                      <span class="tag is-primary">{{ activity.type }}</span>
                      <span class="tag is-info">{{ activity.duration }} min</span>
                      <span v-if="activity.distance" class="tag is-success">{{ activity.distance }} km</span>
                    </div>
                    <time>{{ formatDate(activity.created_at) }}</time>
                  </div>
                </div>
                <footer class="card-footer">
                  <a class="card-footer-item" @click="openEditModal(activity)">
                    <span class="icon">
                      <font-awesome-icon icon="edit" />
                    </span>
                    <span>Edit</span>
                  </a>
                  <a class="card-footer-item" @click="confirmDelete(activity)">
                    <span class="icon has-text-danger">
                      <font-awesome-icon icon="trash" />
                    </span>
                    <span>Delete</span>
                  </a>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Activity Modal -->
    <div class="modal" :class="{ 'is-active': isModalActive }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ isEditing ? 'Edit Activity' : 'Add Activity' }}</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <div v-if="error" class="notification is-danger">
            {{ error }}
          </div>
          
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input
                v-model="activityForm.title"
                class="input"
                type="text"
                placeholder="e.g. Morning Run"
                required
              />
            </div>
          </div>
          
          <div class="field">
            <label class="label">Type</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="activityForm.type">
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Walking">Walking</option>
                  <option value="Hiking">Hiking</option>
                  <option value="Gym">Gym</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <textarea
                v-model="activityForm.description"
                class="textarea"
                placeholder="Describe your activity..."
              ></textarea>
            </div>
          </div>
          
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Duration (minutes)</label>
                <div class="control">
                  <input
                    v-model.number="activityForm.duration"
                    class="input"
                    type="number"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Distance (km)</label>
                <div class="control">
                  <input
                    v-model.number="activityForm.distance"
                    class="input"
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-primary"
            :class="{ 'is-loading': isSubmitting }"
            @click="saveActivity"
          >
            {{ isEditing ? 'Update' : 'Save' }}
          </button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="modal" :class="{ 'is-active': isDeleteModalActive }">
      <div class="modal-background" @click="closeDeleteModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Delete</p>
          <button class="delete" aria-label="close" @click="closeDeleteModal"></button>
        </header>
        <section class="modal-card-body">
          <p>Are you sure you want to delete this activity? This action cannot be undone.</p>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-danger"
            :class="{ 'is-loading': isSubmitting }"
            @click="deleteActivity"
          >
            Delete
          </button>
          <button class="button" @click="closeDeleteModal">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ActivitiesView',
  setup() {
    const store = useStore();
    
    const searchQuery = ref('');
    const isModalActive = ref(false);
    const isDeleteModalActive = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const error = ref('');
    const selectedActivity = ref(null);
    
    const activityForm = ref({
      title: '',
      type: 'Running',
      description: '',
      duration: 30,
      distance: null
    });
    
    const isLoading = computed(() => store.getters.isLoading);
    const userActivities = computed(() => store.getters['activities/userActivities']);
    
    const filteredActivities = computed(() => {
      if (!searchQuery.value) {
        return userActivities.value;
      }
      
      const query = searchQuery.value.toLowerCase();
      return userActivities.value.filter(activity => {
        return (
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.type.toLowerCase().includes(query)
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
    
    const openAddModal = () => {
      isEditing.value = false;
      activityForm.value = {
        title: '',
        type: 'Running',
        description: '',
        duration: 30,
        distance: null
      };
      error.value = '';
      isModalActive.value = true;
    };
    
    const openEditModal = (activity) => {
      isEditing.value = true;
      selectedActivity.value = activity;
      activityForm.value = {
        title: activity.title,
        type: activity.type,
        description: activity.description,
        duration: activity.duration,
        distance: activity.distance
      };
      error.value = '';
      isModalActive.value = true;
    };
    
    const closeModal = () => {
      isModalActive.value = false;
    };
    
    const confirmDelete = (activity) => {
      selectedActivity.value = activity;
      isDeleteModalActive.value = true;
      
    };
    
    const closeDeleteModal = () => {
      isDeleteModalActive.value = false;
    };
    
    const saveActivity = async () => {
      try {
        isSubmitting.value = true;
        error.value = '';
        
        if (!activityForm.value.title) {
          error.value = 'Title is required';
          isSubmitting.value = false;
          return;
        }
        
        if (!activityForm.value.duration || activityForm.value.duration <= 0) {
          error.value = 'Duration must be greater than 0';
          isSubmitting.value = false;
          return;
        }
        
        if (isEditing.value) {
          // Update existing activity
          const result = await store.dispatch('activities/updateActivity', {
            activityId: selectedActivity.value.id,
            activityData: activityForm.value
          });
          
          if (result.success) {
            closeModal();
          } else {
            error.value = result.error || 'Failed to update activity';
          }
        } else {
          // Create new activity
          const result = await store.dispatch('activities/createActivity', activityForm.value);
          
          if (result.success) {
            closeModal();
          } else {
            error.value = result.error || 'Failed to create activity';
          }
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    const deleteActivity = async () => {
      closeDeleteModal();
      try {
      const { data, error } = await supabase
        .from('activities')
        .delete()
        .eq('id', selectedActivity.value.id);
        console.log(data);
        console.log(error);
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    onMounted(async () => {
      await store.dispatch('activities/fetchUserActivities');
    });
    
    return {
      searchQuery,
      isModalActive,
      isDeleteModalActive,
      isEditing,
      isSubmitting,
      error,
      activityForm,
      isLoading,
      filteredActivities,
      getActivityIcon,
      formatDate,
      openAddModal,
      openEditModal,
      closeModal,
      confirmDelete,
      closeDeleteModal,
      saveActivity,
      deleteActivity
    };
  }
};
</script>

<style scoped>
.activities {
  padding: 2rem 0;
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
