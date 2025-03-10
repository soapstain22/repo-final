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
  ADD_FRIENDS(state, friends) {
    state.friendData.push(...friends);
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
        .filter(friend => (friend.user_id === userId || friend.friend_id === userId) && friend.status === 'accepted')
        .map(friend => {
          // If the current user is the friend_id, we need to display the user_id's info
          const otherUserId = friend.user_id === userId ? friend.friend_id : friend.user_id;
          const user = rootGetters['users/getUserById'](otherUserId);
          return {
            ...friend,
            friend_id: otherUserId, // Ensure the friend_id is always the other user
            profiles: user ? {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email
            } : {
              id: otherUserId,
              first_name: 'Unknown',
              last_name: 'User',
              email: ''
            }
          };
        });

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
        .map(request => {
          const user = rootGetters['users/getUserById'](request.user_id);
          return {
            ...request,
            profiles: user ? {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email
            } : {
              id: request.user_id,
              first_name: 'Unknown',
              last_name: 'User',
              email: ''
            }
          };
        });

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

      const allUsers = rootGetters['users/allUsers'];
      const friend = allUsers.find(user => user.email === friendEmail);

      if (!friend) {
        throw new Error('User not found');
      }

      // Don't allow sending friend request to self
      if (friend.id === userId) {
        throw new Error('Cannot send friend request to yourself');
      }

      const existingRequest = state.friendData.find(
        request =>
          (request.user_id === userId && request.friend_id === friend.id) ||
          (request.user_id === friend.id && request.friend_id === userId)
      );

      if (existingRequest) {
        throw new Error('Friend request already sent or friendship already exists');
      }

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

      const requestIndex = state.friendData.findIndex(request => request.id === requestId);
      
      if (requestIndex === -1) {
        throw new Error('Friend request not found');
      }
      
      const request = state.friendData[requestIndex];

      if (request.friend_id !== userId) {
        throw new Error('You can only accept your own friend requests');
      }

      // Update the existing request instead of creating a new object
      state.friendData[requestIndex] = {
        ...request,
        status: 'accepted'
      };

      const user = rootGetters['users/getUserById'](request.user_id);
      commit('ADD_FRIEND', {
        ...request,
        status: 'accepted',
        friend_id: request.user_id, // Set friend_id to the user who sent the request
        profiles: user ? {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        } : {
          id: request.user_id,
          first_name: 'Unknown',
          last_name: 'User',
          email: ''
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

      const request = state.friendData.find(request => request.id === requestId);

      if (!request) {
        throw new Error('Friend request not found');
      }

      if (request.friend_id !== userId) {
        throw new Error('You can only reject your own friend requests');
      }

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

      state.friendData = state.friendData.filter(
        friend => !(
          (friend.user_id === userId && friend.friend_id === friendId) || 
          (friend.user_id === friendId && friend.friend_id === userId)
        )
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
