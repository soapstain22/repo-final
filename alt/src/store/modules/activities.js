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
  ADD_ACTIVITY(state, activity) {
    activity.id = state.nextActivityId++; // Assign a unique ID
    state.activities.push(activity);
    state.userActivities.push(activity);
  },
  ADD_ACTIVITIES(state, activities) {
    activities.forEach(activity => {
      activity.id = state.nextActivityId++;
      state.activities.push(activity);
      state.userActivities.push(activity);
      state.activityData.push(activity);
    });
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

      // In-memory: filter activities by user ID
      const userActivities = state.activities.filter(activity => activity.user_id === userId);
      commit('SET_USER_ACTIVITIES', userActivities);

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
        throw new Error('You can only update your own activities');
      }

      // In-memory: update activity
      const updatedActivity = {
        ...activity,
        ...activityData
      };

      commit('UPDATE_ACTIVITY', updatedActivity);

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
