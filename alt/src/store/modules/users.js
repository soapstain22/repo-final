const state = {
  users: [],
  selectedUser: null
};

const getters = {
  allUsers: state => state.users,
  selectedUser: state => state.selectedUser,
  getUserById: state => userId => state.users.find(user => user.id === userId)
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_SELECTED_USER(state, user) {
    state.selectedUser = user;
  },
  ADD_USER(state, user) {
    state.users.push(user);
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser);
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter(user => user.id !== userId);
  }
};

const actions = {
  async fetchUsers({ commit, rootState }) {
    try {
      commit('SET_LOADING', true, { root: true });

      // In-memory: get all users from auth state
      const users = rootState.auth.users;

      // Add dummy accounts
      rootState.auth.users.push({
        id: 'funny',
        email: 'funny@gmail.com',
        password: 'password',
        firstName: 'Funny',
        lastName: 'User',
        role: 'user',
        created_at: new Date()
      });

      rootState.auth.users.push({
        id: 'test',
        email: 'test@gmail.gov',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        created_at: new Date()
      });

      commit('SET_USERS', users);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async fetchUser({ commit, rootState }, userId) {
    try {
      commit('SET_LOADING', true, { root: true });

      // In-memory: find user by ID from auth state
      const user = rootState.auth.users.find(user => user.id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      commit('SET_SELECTED_USER', user);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async createUser({ commit, rootState }, userData) {
    try {
      commit('SET_LOADING', true, { root: true });

      // In-memory: create new user (add to auth state)
      const newUser = {
        id: Math.random().toString(36).substring(2, 15),
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'user',
        created_at: new Date()
      };

      rootState.auth.users.push(newUser);
      commit('ADD_USER', newUser);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async updateUser({ commit, rootState }, { userId, userData }) {
    try {
      commit('SET_LOADING', true, { root: true });

      // In-memory: find user by ID and update properties
      const userIndex = rootState.auth.users.findIndex(user => user.id === userId);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser = {
        ...rootState.auth.users[userIndex],
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      };

      rootState.auth.users[userIndex] = updatedUser;
      commit('UPDATE_USER', updatedUser);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async deleteUser({ commit, rootState }, userId) {
    try {
      commit('SET_LOADING', true, { root: true });

      // In-memory: delete user from auth state
      rootState.auth.users = rootState.auth.users.filter(user => user.id !== userId);
      commit('REMOVE_USER', userId);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
