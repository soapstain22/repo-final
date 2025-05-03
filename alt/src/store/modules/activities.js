import { supabase } from "@/supabase";


const state = {
  activities: [],
  selectedActivity: null,
  userActivities: [],
  friendActivities: [],
  nextActivityId: 1 // Track the next available activity ID
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
  async ADD_ACTIVITY(state, activity) {
    console.log('Adding activity:', activity);
    console.log(state);
    
    (activity);
    try {
      const { data, error } = await supabase
        .from('activities')
        .insert([{
          user_id: activity.user_id,
          description: activity.description,
          duration: activity.duration,
          date: activity.date,
          created_at: activity.created_at,
          distance: activity.distance,
          title: activity.title
        }]);

      if (error) {
        console.error('Error inserting activity:', error);
        // Handle the error appropriately, e.g., by dispatching an error mutation
      } else {
        console.log('Activity inserted:', data);
        // Optionally, update the local state with the new activity.
        // state.activities.push(activity);
        // state.userActivities.push(activity);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      // Handle the error appropriately
    }
  },
  async UPDATE_ACTIVITY(state, activity) {
    console.log('Adding activity:', activity);
    console.log(state);
    
    (activity);
    try {
      const { data, error } = await supabase
        .from('activities')
        .update([{
          user_id: activity.user_id,
          description: activity.description,
          duration: activity.duration,
          date: activity.date,
          created_at: activity.created_at,
          distance: activity.distance,
          title: activity.title
        }]);

      if (error) {
        console.error('Error inserting activity:', error);
        // Handle the error appropriately, e.g., by dispatching an error mutation
      } else {
        console.log('Activity inserted:', data);
        // Optionally, update the local state with the new activity.
        // state.activities.push(activity);
        // state.userActivities.push(activity);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      // Handle the error appropriately
    }
  },
  async REMOVE_ACTIVITY(state, activityId) {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) {
        console.error('Error deleting activity:', error);
        // Handle the error appropriately, e.g., by dispatching an error mutation
      } else {
        console.log('Activity deleted');
        state.userActivities = state.userActivities.filter(a => a.id !== activityId);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      // Handle the error appropriately
    }
  },
  SET_NEXT_ACTIVITY_ID(state, nextId) {
    state.nextActivityId = nextId;
  }
};

const actions = {
  async fetchActivities({ commit }) {
    try {
      commit('SET_LOADING', true, { root: true });

      // In-memory: return all activities
      commit('SET_ACTIVITIES', state.activities);

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

      const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId);

      if (error) {
      console.error('Error fetching user activities:', error);
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
      }

      commit('SET_USER_ACTIVITIES', activities);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }

  },

  async fetchFriendActivities({ commit, rootGetters, rootState }, friendId) {
    try {
      commit('SET_LOADING', true, { root: true });

      const userId = rootGetters['auth/currentUser']?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Get the user_id from the users store
      const friend = rootState.users.users.find(user => user.id === friendId);

      if (!friend) {
        throw new Error('Friend not found');
      }

      // In-memory: filter activities by friend ID
      const friendActivities = state.activities.filter(activity => activity.user_id === friend.id);
      commit('SET_FRIEND_ACTIVITIES', friendActivities);

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

      // In-memory: find activity by ID
      const activity = state.activities.find(activity => activity.id === activityId);

      if (!activity) {
        throw new Error('Activity not found');
      }

      commit('SET_SELECTED_ACTIVITY', activity);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async createActivity({ commit, rootGetters }, activityData) {
    console.log(commit, rootGetters, activityData);
    
    try {
      commit('SET_LOADING', true, { root: true });

      const userId = rootGetters['auth/currentUser']?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      // In-memory: create new activity
      const newActivity = {
        ...activityData,
        user_id: userId,
        created_at: new Date()
      };

      commit('ADD_ACTIVITY', newActivity);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },

  async updateActivity({ commit, rootGetters }, { activityId, activityData }) {
    console.log(commit, rootGetters, activityId, activityData);
    try {
      commit('SET_LOADING', true, { root: true });

      const userId = rootGetters['auth/currentUser']?.id;

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const updateData = { ...activityData };

      const { data, error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', activityId)
        .select();

      if (error) {
        console.error('Error updating activity:', error);
        commit('SET_ERROR', error.message, { root: true });
        return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
        throw new Error('Activity not found');
      }

      commit('SET_SELECTED_ACTIVITY', data[0]);
      commit('SET_USER_ACTIVITIES', state.userActivities.map(activity => activity.id === activityId ? data[0] : activity));
      commit('SET_ACTIVITIES', state.activities.map(activity => activity.id === activityId ? data[0] : activity));

      return { success: true, data: data[0] };
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

      // In-memory: check if activity belongs to user
      const activity = state.activities.find(activity => activity.id === activityId);

      if (!activity) {
        throw new Error('Activity not found');
      }

      if (activity.user_id !== userId) {
        throw new Error('You can only delete your own activities');
      }

      // In-memory: delete activity
      commit('REMOVE_ACTIVITY', activityId);

      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  setNextActivityId({ commit }, nextId) {
    commit('SET_NEXT_ACTIVITY_ID', nextId);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
