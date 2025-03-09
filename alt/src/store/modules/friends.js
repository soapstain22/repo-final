const state = {
  friends: [],
  friendRequests: [],
  // In-memory storage for friend-related data
  friendData: []
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
    state.friends = state.friends.filter(friend => friend.friend_id !== friendId);
  },
  REMOVE_FRIEND_REQUEST(state, requestId) {
    state.friendRequests = state.friendRequests.filter(request => request.id !== requestId);
  },
  ADD_FRIEND_REQUEST(state, request) {
    state.friendRequests.push(request);
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

      // In-memory: filter friends by user ID and status
      const friends = state.friendData
        .filter(friend => friend.user_id === userId && friend.status === 'accepted')
        .map(friend => ({
          ...friend,
          profiles: {
            id: friend.friend_id,
            first_name: 'Friend', // Replace with actual friend data
            last_name: 'Name',
            email: 'friend@example.com'
          }
        }));

      commit('SET_FRIENDS', friends);

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

      // In-memory: filter friend requests by user ID and status
      const friendRequests = state.friendData
        .filter(request => request.friend_id === userId && request.status === 'pending')
        .map(request => ({
          ...request,
          profiles: {
            id: request.user_id,
            first_name: 'Request', // Replace with actual user data
            last_name: 'Sender',
            email: 'sender@example.com'
          }
        }));

      commit('SET_FRIEND_REQUESTS', friendRequests);

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

      // In-memory: find user by email (replace with actual user data retrieval)
      const friend = { id: 'friend123', email: friendEmail }; // Replace with actual user data

      if (!friend) {
        throw new Error('User not found');
      }

      // In-memory: check if friend request already exists
      const existingRequest = state.friendData.find(
        request => request.user_id === userId && request.friend_id === friend.id
      );

      if (existingRequest) {
        throw new Error('Friend request already sent');
      }

      // In-memory: send friend request
      const newRequest = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: userId,
        friend_id: friend.id,
        status: 'pending',
        created_at: new Date()
      };

      state.friendData.push(newRequest);
      commit('ADD_FRIEND_REQUEST', newRequest);

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

      // In-memory: get the friend request
      const request = state.friendData.find(request => request.id === requestId);

      if (!request) {
        throw new Error('Friend request not found');
      }

      if (request.friend_id !== userId) {
        throw new Error('You can only accept your own friend requests');
      }

      // In-memory: update the friend request status
      request.status = 'accepted';

      // In-memory: create the reverse friendship
      const reverseFriendship = {
        id: Math.random().toString(36).substring(2, 15),
        user_id: userId,
        friend_id: request.user_id,
        status: 'accepted',
        created_at: new Date()
      };

      state.friendData.push(reverseFriendship);

      commit('ADD_FRIEND', {
        ...request,
        profiles: {
          id: request.user_id,
          first_name: 'Request', // Replace with actual user data
          last_name: 'Sender',
          email: 'sender@example.com'
        }
      });
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

      // In-memory: get the friend request
      const request = state.friendData.find(request => request.id === requestId);

      if (!request) {
        throw new Error('Friend request not found');
      }

      if (request.friend_id !== userId) {
        throw new Error('You can only reject your own friend requests');
      }

      // In-memory: delete the friend request
      state.friendData = state.friendData.filter(request => request.id !== requestId);

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

      // In-memory: delete the friendship
      state.friendData = state.friendData.filter(
        friend => !(friend.user_id === userId && friend.friend_id === friendId) && !(friend.user_id === friendId && friend.friend_id === userId)
      );

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
