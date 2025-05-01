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
                <h2 class="title is-4">{{ currentUser ? `${currentUser.user_metadata.firstName} ${currentUser.user_metadata.lastName}` : 'User' }}</h2>
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

                <form @submit.prevent="updateName">
                  <div class="field">
                    <label class="label">First Name</label>
                    <div class="control">
                      <input
                        v-model="profileForm.firstName"
                        class="input"
                        type="text"
                        placeholder="First Name"
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
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>

                  <div class="field">
                    <div class="control">
                      <button
                        type="submit"
                        class="button is-primary"
                        :class="{ 'is-loading': isUpdatingName }"
                      >
                        Update Name
                      </button>
                    </div>
                  </div>
                </form>

                <form @submit.prevent="changePassword">
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
import { supabase } from '@/supabase';

export default {
  name: 'ProfileView',
  setup() {
    const store = useStore();

    const error = ref('');
    const success = ref('');
    const passwordError = ref('');
    const passwordSuccess = ref('');
    const isChangingPassword = ref(false);

    const currentUser = computed(() => store.getters['auth/currentUser']);
    const isLoading = computed(() => store.getters.isLoading);

    const profileForm = ref({
      firstName: '',
      lastName: '',
      email: ''
    });

    const passwordForm = ref({
      newPassword: '',
      confirmPassword: ''
    });

    const isUpdatingName = ref(false);

    const updateName = async () => {
      try {
        isUpdatingName.value = true;
        error.value = '';
        success.value = '';

        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            firstName: profileForm.value.firstName,
            lastName: profileForm.value.lastName
          }
        });

        if (updateError) {
          error.value = updateError.message || 'Failed to update profile';
        } else {
          success.value = 'Profile updated successfully';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isUpdatingName.value = false;
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

        const { error } = await supabase.auth.updateUser({
          password: passwordForm.value.newPassword,
        })

        if (error) {
          passwordError.value = error.message || 'Failed to change password';
        } else {
          passwordSuccess.value = 'Password changed successfully';
          passwordForm.value = {
            newPassword: '',
            confirmPassword: ''
          };
        }
      } catch (err) {
        passwordError.value = err.message || 'An unexpected error occurred';
      } finally {
        isChangingPassword.value = false;
      }
    };

    onMounted(async () => {
      try {
        isLoading.value = true;
        error.value = '';

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          error.value = userError.message || 'Failed to fetch user profile';
        } else {
          profileForm.value = {
            firstName: user.user_metadata.firstName || '',
            lastName: user.user_metadata.lastName || ''
          };
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isLoading.value = false;
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
      isChangingPassword,
      changePassword,
      updateName,
      isUpdatingName
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
