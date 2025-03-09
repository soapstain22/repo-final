<template>
  <div class="admin-users">
    <div class="box">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h2 class="title is-4">User Management</h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button class="button is-primary" @click="openAddModal">
              <span class="icon">
                <font-awesome-icon icon="user-plus" />
              </span>
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="field">
        <div class="control has-icons-left">
          <input
            v-model="searchQuery"
            class="input"
            type="text"
            placeholder="Search users..."
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
        <p>Loading users...</p>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="has-text-centered my-6">
        <p>No users found.</p>
      </div>
      
      <div v-else class="table-container">
        <table class="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id.substring(0, 8) }}...</td>
              <td>{{ user.first_name }} {{ user.last_name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span
                  class="tag"
                  :class="{
                    'is-primary': user.role === 'admin',
                    'is-info': user.role === 'user'
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <div class="buttons are-small">
                  <button class="button is-info" @click="openEditModal(user)">
                    <span class="icon">
                      <font-awesome-icon icon="edit" />
                    </span>
                  </button>
                  <button
                    class="button is-danger"
                    @click="confirmDelete(user)"
                    :disabled="user.id === currentUser.id"
                  >
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
    
    <!-- Add/Edit User Modal -->
    <div class="modal" :class="{ 'is-active': isModalActive }">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ isEditing ? 'Edit User' : 'Add User' }}</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <div v-if="error" class="notification is-danger">
            {{ error }}
          </div>
          
          <div class="field">
            <label class="label">First Name</label>
            <div class="control">
              <input
                v-model="userForm.firstName"
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
                v-model="userForm.lastName"
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
                v-model="userForm.email"
                class="input"
                type="email"
                placeholder="john@example.com"
                required
                :disabled="isEditing"
              />
            </div>
          </div>
          
          <div class="field" v-if="!isEditing">
            <label class="label">Password</label>
            <div class="control">
              <input
                v-model="userForm.password"
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
            <label class="label">Role</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select v-model="userForm.role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-primary"
            :class="{ 'is-loading': isSubmitting }"
            @click="saveUser"
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
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          <p class="has-text-weight-bold mt-4">{{ selectedUser?.first_name }} {{ selectedUser?.last_name }}</p>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-danger"
            :class="{ 'is-loading': isSubmitting }"
            @click="deleteUser"
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AdminUsers',
  setup() {
    const store = useStore();
    
    const searchQuery = ref('');
    const isModalActive = ref(false);
    const isDeleteModalActive = ref(false);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const error = ref('');
    const selectedUser = ref(null);
    
    const userForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user'
    });
    
    const isLoading = computed(() => store.getters.isLoading);
    const users = computed(() => store.getters['users/allUsers']);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    
    const filteredUsers = computed(() => {
      if (!searchQuery.value) {
        return users.value;
      }
      
      const query = searchQuery.value.toLowerCase();
      return users.value.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return (
          fullName.includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
        );
      });
    });
    
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const openAddModal = () => {
      isEditing.value = false;
      userForm.value = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user'
      };
      error.value = '';
      isModalActive.value = true;
    };
    
    const openEditModal = (user) => {
      isEditing.value = true;
      selectedUser.value = user;
      userForm.value = {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      };
      error.value = '';
      isModalActive.value = true;
    };
    
    const closeModal = () => {
      isModalActive.value = false;
    };
    
    const confirmDelete = (user) => {
      selectedUser.value = user;
      isDeleteModalActive.value = true;
    };
    
    const closeDeleteModal = () => {
      isDeleteModalActive.value = false;
    };
    
    const saveUser = async () => {
      try {
        isSubmitting.value = true;
        error.value = '';
        
        if (!userForm.value.firstName || !userForm.value.lastName || !userForm.value.email) {
          error.value = 'All fields are required';
          isSubmitting.value = false;
          return;
        }
        
        if (!isEditing.value && (!userForm.value.password || userForm.value.password.length < 8)) {
          error.value = 'Password must be at least 8 characters long';
          isSubmitting.value = false;
          return;
        }
        
        if (isEditing.value) {
          // Update existing user
          const result = await store.dispatch('users/updateUser', {
            userId: selectedUser.value.id,
            userData: {
              firstName: userForm.value.firstName,
              lastName: userForm.value.lastName,
              role: userForm.value.role
            }
          });
          
          if (result.success) {
            closeModal();
          } else {
            error.value = result.error || 'Failed to update user';
          }
        } else {
          // Create new user
          const result = await store.dispatch('users/createUser', {
            firstName: userForm.value.firstName,
            lastName: userForm.value.lastName,
            email: userForm.value.email,
            password: userForm.value.password,
            role: userForm.value.role
          });
          
          if (result.success) {
            closeModal();
          } else {
            error.value = result.error || 'Failed to create user';
          }
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    const deleteUser = async () => {
      try {
        isSubmitting.value = true;
        
        // Prevent deleting yourself
        if (selectedUser.value.id === currentUser.value.id) {
          error.value = 'You cannot delete your own account';
          isSubmitting.value = false;
          return;
        }
        
        const result = await store.dispatch('users/deleteUser', selectedUser.value.id);
        
        if (result.success) {
          closeDeleteModal();
        } else {
          error.value = result.error || 'Failed to delete user';
        }
      } catch (err) {
        error.value = err.message || 'An unexpected error occurred';
      } finally {
        isSubmitting.value = false;
      }
    };
    
    onMounted(async () => {
      await store.dispatch('users/fetchUsers');
    });
    
    return {
      searchQuery,
      isModalActive,
      isDeleteModalActive,
      isEditing,
      isSubmitting,
      error,
      userForm,
      selectedUser,
      isLoading,
      users,
      filteredUsers,
      currentUser,
      formatDate,
      openAddModal,
      openEditModal,
      closeModal,
      confirmDelete,
      closeDeleteModal,
      saveUser,
      deleteUser
    };
  }
};
</script>
