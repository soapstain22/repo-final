import { supabase } from '@/services/supabase';

const state = {
  users: [],
  selectedUser: null
};

const getters = {
  allUsers: state => state.users,
  selectedUser: state => state.selectedUser
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
  async fetchUsers({ commit }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      commit('SET_USERS', data);
      
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      commit('SET_SELECTED_USER', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async createUser({ commit }, userData) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      // Create user profile
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            role: userData.role || 'user',
            created_at: new Date()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      commit('ADD_USER', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async updateUser({ commit }, { userId, userData }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      commit('UPDATE_USER', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async deleteUser({ commit }, userId) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      // Delete user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;
      
      // Delete user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
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
