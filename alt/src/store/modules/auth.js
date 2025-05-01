import { supabase } from '@/supabase';

const state = {
  user: null,
  session: null,
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
  }
};

const actions = {
  async register({ commit }, { email, password, firstName, lastName }) {
    try {
      commit('SET_LOADING', true, { root: true });

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            firstName: firstName,
            lastName: lastName,
            role: 'user'
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      commit('SET_USER', data.user);
      commit('SET_SESSION', data.session);

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

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      commit('SET_USER', data.user);
      commit('SET_SESSION', data.session);

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

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      commit('CLEAR_USER');

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async fetchUser({ commit }) {
    try {
      commit('SET_LOADING', true, { root: true });

      const { data: { user, session }, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error(error.message);
      }

      commit('SET_USER', user);
      commit('SET_SESSION', session);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async initAuth({ dispatch }) {
    await dispatch('fetchUser');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
