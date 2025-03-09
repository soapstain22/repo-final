<template>
  <div class="profile">
    <div class="container">
      <h1 class="title">User Profile</h1>
      
      <div class="box">
        <div v-if="isLoading" class="has-text-centered my-6">
          <span class="icon is-large">
            <font-awesome-icon icon="spinner" spin size="2x" />
          </span>
          <p>Loading profile...</p>
        </div>
        
        <div v-else>
          <div class="columns">
            <div class="column is-4">
              <div class="box has-text-centered">
                <figure class="image is-128x128 mx-auto mb-4">
                  <span class="icon is-large">
                    <font-awesome-icon icon="user-circle" size="8x" />
                  </span>
                </figure>
                <h2 class="title is-4">{{ currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'User' }}</h2>
                <p class="subtitle is-6">{{ currentUser ? currentUser.email : '' }}</p>
                <p class="tag is-primary">{{ currentUser ? currentUser.role : 'user' }}</p>
              </div>
            </div>
            
            <div class="column is-8">
              <div class="box">
                <h3 class="title is-4">Edit Profile</h3>
                
                <div v-if="error" class="notification is-danger">
                  {{ error }}
                </div>
                
                <div v-if="success" class="notification is-success">
                  {{ success }}
                </div>
                
                <form @submit.prevent="updateProfile">
                  <div class="field">
                    <label class="label">First Name</label>
                    <div class="control">
                      <input
                        v-model="profileForm.firstName"
                        class="input"
                        type="text"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="field">
                    <label class="label">Last Name</label>
                    <div class="control">
                      <input
                        v-model="profileForm.lastName"
                        class="input"
                        type="text"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                      <input
                        v-model="profileForm.email"
                        class="input"
                        type="email"
                        placeholder="john@example.com"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div class="field">
                    <div class="control">
                      <button
                        type="submit"
                        class="button is-primary"
                        :class="{ 'is-loading': isSubmitting }"
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
              <div class="box mt-5">
                <h3 class="title is-4">Change Password</h3>
                
                <div v-if="passwordError" class="notification is-danger">
                  {{ passwordError }}
                </div>
                
                <div v-if="passwordSuccess" class="notification is-success">
                  {{ passwordSuccess }}
                </div>
                
                <form @submit.prevent="changePassword">
                  <div class="field">
                    <label class="label">Current Password</label>
                    <div class="control">
                      <input
                        v-model="passwordForm.currentPassword"
                        class="input"
                        type="password"
                        placeholder="********"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="field">
                    <label class="label">New Password</label>
                    <div class="control">
                      <input
                        v-model="passwordForm.newPassword"
                        class="input"
                        type="password"
                        placeholder="********"
                        required
                        minlength="8"
                      />
                    </div>
                    <p class="help">Password must be at least 8 characters long</p>
                  </div>
                  
                  <div class="field">
                    <label class="label">Confirm New Password</label>
                    <div class="control">
                      <input
                        v-model="passwordForm.confirmPassword"
                        class="input"
                        type="password"
                        placeholder="********"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="field">
                    <div class="control">
                      <button
                        type="submit"
                        class="button is-primary"
                        :class="{ 'is-loading': isChangingPassword }"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </form>
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

export default {
  name: 'ProfileView',
  setup() {
    const store = useStore();
    
    const error = ref('');
    const success = ref('');
    const passwordError = ref('');
    const passwordSuccess = ref('');
    const isSubmitting = ref(false);
    const isChangingPassword = ref(false);
    
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const isLoading = computed(() => store.getters.isLoading);
    
    const profileForm = ref({
      firstName: '',
      lastName: '',
      email: ''
    });
    
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    const updateProfile = async () => {
      try {
        isSubmitting.value = true;
        error.value = '';
        success.value = '';
        
        if (!profileForm.value.firstName || !profileForm.value.lastName) {
          error.value = 'First name and last name are required';
          isSubmitting.value = false;
          return;
        }
        
        const result = await store.dispatch('auth/updateProfile', {
          firstName: profileForm.value.firstName,
          lastName: profileForm.value.lastName
        });
        
        if (result.success) {
          success.value = 'Profile updated successfully';
        } else {
          error.value = result.error || 'Failed to update profile';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    const changePassword = async () => {
      try {
        isChangingPassword.value = true;
        passwordError.value = '';
        passwordSuccess.value = '';
        
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
          passwordError.value = 'New passwords do not match';
          isChangingPassword.value = false;
          return;
        }
        
        if (passwordForm.value.newPassword.length < 8) {
          passwordError.value = 'Password must be at least 8 characters long';
          isChangingPassword.value = false;
          return;
        }
        
        const result = await store.dispatch('auth/changePassword', {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        });
        
        if (result.success) {
          passwordSuccess.value = 'Password changed successfully';
          passwordForm.value = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
        } else {
          passwordError.value = result.error || 'Failed to change password';
        }
      } catch (err) {
        passwordError.value = err.message || 'An unexpected error occurred';
      } finally {
        isChangingPassword.value = false;
      }
    };
    
    onMounted(() => {
      if (currentUser.value) {
        profileForm.value = {
          firstName: currentUser.value.first_name,
          lastName: currentUser.value.last_name,
          email: currentUser.value.email
        };
      }
    });
    
    return {
      currentUser,
      isLoading,
      profileForm,
      passwordForm,
      error,
      success,
      passwordError,
      passwordSuccess,
      isSubmitting,
      isChangingPassword,
      updateProfile,
      changePassword
    };
  }
};
</script>

<style scoped>
.profile {
  padding: 2rem 0;
}

.image.is-128x128 {
  margin: 0 auto;
}
</style>
