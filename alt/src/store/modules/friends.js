import { supabase } from '@/services/supabase';

const state = {
  friends: [],
  friendRequests: []
};

const getters = {
  allFriends: state => state.friends,
  friendRequests: state => state.friendRequests
};

const mutations = {
  SET_FRIENDS(state, friends) {
    state.friends = friends;
  },
  SET_FRIEND_REQUESTS(state, requests) {
    state.friendRequests = requests;
  },
  ADD_FRIEND(state, friend) {
    state.friends.push(friend);
  },
  REMOVE_FRIEND(state, friendId) {
    state.friends = state.friends.filter(friend => friend.id !== friendId);
  },
  REMOVE_FRIEND_REQUEST(state, requestId) {
    state.friendRequests = state.friendRequests.filter(request => request.id !== requestId);
  }
};

const actions = {
  async fetchFriends({ commit, rootGetters }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('friends')
        .select('*, profiles:friend_id(id, first_name, last_name, email)')
        .eq('user_id', userId)
        .eq('status', 'accepted');
      
      if (error) throw error;
      
      commit('SET_FRIENDS', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async fetchFriendRequests({ commit, rootGetters }) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('friends')
        .select('*, profiles:user_id(id, first_name, last_name, email)')
        .eq('friend_id', userId)
        .eq('status', 'pending');
      
      if (error) throw error;
      
      commit('SET_FRIEND_REQUESTS', data);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async sendFriendRequest({ commit, rootGetters }, friendEmail) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', friendEmail)
        .single();
      
      if (userError) throw userError;
      
      if (!userData) {
        throw new Error('User not found');
      }
      
      // Check if friend request already exists
      const { data: existingRequest, error: checkError } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', userId)
        .eq('friend_id', userData.id);
      
      if (checkError) throw checkError;
      
      if (existingRequest && existingRequest.length > 0) {
        throw new Error('Friend request already sent');
      }
      
      // Send friend request
      const { error } = await supabase
        .from('friends')
        .insert([
          {
            user_id: userId,
            friend_id: userData.id,
            status: 'pending',
            created_at: new Date()
          }
        ]);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async acceptFriendRequest({ commit, rootGetters }, requestId) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Get the friend request
      const { data: requestData, error: requestError } = await supabase
        .from('friends')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (requestError) throw requestError;
      
      if (requestData.friend_id !== userId) {
        throw new Error('You can only accept your own friend requests');
      }
      
      // Update the friend request status
      const { data, error } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select('*, profiles:user_id(id, first_name, last_name, email)')
        .single();
      
      if (error) throw error;
      
      // Create the reverse friendship
      const { error: reverseError } = await supabase
        .from('friends')
        .insert([
          {
            user_id: userId,
            friend_id: requestData.user_id,
            status: 'accepted',
            created_at: new Date()
          }
        ]);
      
      if (reverseError) throw reverseError;
      
      commit('ADD_FRIEND', data);
      commit('REMOVE_FRIEND_REQUEST', requestId);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async rejectFriendRequest({ commit, rootGetters }, requestId) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Get the friend request
      const { data: requestData, error: requestError } = await supabase
        .from('friends')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (requestError) throw requestError;
      
      if (requestData.friend_id !== userId) {
        throw new Error('You can only reject your own friend requests');
      }
      
      // Delete the friend request
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
      
      commit('REMOVE_FRIEND_REQUEST', requestId);
      
      return { success: true };
    } catch (error) {
      commit('SET_ERROR', error.message, { root: true });
      return { success: false, error: error.message };
    } finally {
      commit('SET_LOADING', false, { root: true });
    }
  },
  
  async removeFriend({ commit, rootGetters }, friendId) {
    try {
      commit('SET_LOADING', true, { root: true });
      
      const userId = rootGetters['auth/currentUser']?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Delete the friendship
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId);
      
      if (error) throw error;
      
      // Delete the reverse friendship
      const { error: reverseError } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', userId);
      
      if (reverseError) throw reverseError;
      
      commit('REMOVE_FRIEND', friendId);
      
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
