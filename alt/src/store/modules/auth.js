import { supabase } from '@/services/supabase';
import jwtDecode from 'jwt-decode';

const state = {
  user: null,
  session: null
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
  async register({ commit, dispatch }, { email, password, firstName, lastName }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      // Register user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      // Create user profile
      if (data.user) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: 'user',
            created_at: new Date()
          }
        ]);
        
        // Set user in state
        await dispatch('fetchUser', data.user.id);
      }
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async login({ commit, dispatch }, { email, password }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.session) {
        commit('SET_SESSION', data.session);
        
        // Decode JWT to get user info
        const decodedToken = jwtDecode(data.session.access_token);
        
        // Fetch user profile
        await dispatch('fetchUser', decodedToken.sub);
      }
      
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
      
      if (error) throw error;
      
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
      
      // Get user profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        commit('SET_USER', data);
      }
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async initAuth({ commit, dispatch }) {
    try {
      // Get current session
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        commit('SET_SESSION', data.session);
        
        // Decode JWT to get user info
        const decodedToken = jwtDecode(data.session.access_token);
        
        // Fetch user profile
        await dispatch('fetchUser', decodedToken.sub);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
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
