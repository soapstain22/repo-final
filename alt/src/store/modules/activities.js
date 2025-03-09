import { supabase } from '@/services/supabase';

const state = {
  activities: [],
  selectedActivity: null,
  userActivities: [],
  friendActivities: []
};

const getters = {
  allActivities: state => state.activities,
  selectedActivity: state => state.selectedActivity,
  userActivities: state => state.userActivities,
  friendActivities: state => state.friendActivities
};

const mutations = {
  SET_ACTIVITIES(state, activities) {
    state.activities = activities;
  },
  SET_SELECTED_ACTIVITY(state, activity) {
    state.selectedActivity = activity;
  },
  SET_USER_ACTIVITIES(state, activities) {
    state.userActivities = activities;
  },
  SET_FRIEND_ACTIVITIES(state, activities) {
    state.friendActivities = activities;
  },
  ADD_ACTIVITY(state, activity) {
    state.activities.push(activity);
    state.userActivities.push(activity);
  },
  UPDATE_ACTIVITY(state, updatedActivity) {
    const index = state.activities.findIndex(activity => activity.id === updatedActivity.id);
    if (index !== -1) {
      state.activities.splice(index, 1, updatedActivity);
    }
    
    const userIndex = state.userActivities.findIndex(activity => activity.id === updatedActivity.id);
    if (userIndex !== -1) {
      state.userActivities.splice(userIndex, 1, updatedActivity);
    }
  },
  REMOVE_ACTIVITY(state, activityId) {
    state.activities = state.activities.filter(activity => activity.id !== activityId);
    state.userActivities = state.userActivities.filter(activity => activity.id !== activityId);
  }
};

const actions = {
  async fetchActivities({ commit }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      commit('SET_ACTIVITIES', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async fetchUserActivities({ commit, rootGetters }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      commit('SET_USER_ACTIVITIES', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async fetchFriendActivities({ commit, rootGetters }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // First get user's friends
      const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', userId);
      
      if (friendsError) throw friendsError;
      
      if (!friendsData.length) {
        commit('SET_FRIEND_ACTIVITIES', []);
        return { success: true };
      }
      
      const friendIds = friendsData.map(friend => friend.friend_id);
      
      // Then get activities from those friends
      const { data, error } = await supabase
        .from('activities')
        .select('*, profiles:user_id(first_name, last_name)')
        .in('user_id', friendIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      commit('SET_FRIEND_ACTIVITIES', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async fetchActivity({ commit }, activityId) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', activityId)
        .single();
      
      if (error) throw error;
      
      commit('SET_SELECTED_ACTIVITY', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async createActivity({ commit, rootGetters }, activityData) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('activities')
        .insert([
          {
            ...activityData,
            user_id: userId,
            created_at: new Date()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      commit('ADD_ACTIVITY', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async updateActivity({ commit, rootGetters }, { activityId, activityData }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Check if activity belongs to user
      const { data: activityCheck, error: checkError } = await supabase
        .from('activities')
        .select('user_id')
        .eq('id', activityId)
        .single();
      
      if (checkError) throw checkError;
      
      if (activityCheck.user_id !== userId) {
        throw new Error('You can only update your own activities');
      }
      
      const { data, error } = await supabase
        .from('activities')
        .update(activityData)
        .eq('id', activityId)
        .select()
        .single();
      
      if (error) throw error;
      
      commit('UPDATE_ACTIVITY', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async deleteActivity({ commit, rootGetters }, activityId) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Check if activity belongs to user
      const { data: activityCheck, error: checkError } = await supabase
        .from('activities')
        .select('user_id')
        .eq('id', activityId)
        .single();
      
      if (checkError) throw checkError;
      
      if (activityCheck.user_id !== userId) {
        throw new Error('You can only delete your own activities');
      }
      
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);
      
      if (error) throw error;
      
      commit('REMOVE_ACTIVITY', activityId);
      
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
