const state = {
  user: null,
  session: null,
  users: [] // In-memory user storage
};

const getters = {
  isAuthenticated: state => !!state.user,
  isAdmin: state => state.user && state.user.role === 'admin',
  currentUser: state => state.user
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_SESSION(state, session) {
    state.session = session;
  },
  CLEAR_USER(state) {
    state.user = null;
    state.session = null;
  },
  ADD_USER(state, user) {
    state.users.push(user);
  }
};

const actions = {
  async register({ commit, dispatch }, { email, password, firstName, lastName }) {
    try {
      commit('SET_LOADING', true, { root: true });

      // Check if user already exists
      const existingUser = state.users.find(user => user.email === email);
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substring(2, 15), // Generate a random ID
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date()
      };
      
      commit('ADD_USER', newUser);
      
      // Set user in state
      await dispatch('fetchUser', newUser.id);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async login({ commit }, { email, password }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      // Find user in in-memory storage
      const user = state.users.find(user => user.email === email && user.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      commit('SET_USER', user);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async logout({ commit }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      commit('CLEAR_USER');
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async fetchUser({ commit }, userId) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      // Find user in in-memory storage
      const user = state.users.find(user => user.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      commit('SET_USER', user);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async initAuth() {
    // No need to initialize auth from Supabase
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
