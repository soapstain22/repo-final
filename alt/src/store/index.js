import { createStore } from 'vuex';
import auth from './modules/auth';
import users from './modules/users';
import activities from './modules/activities';
import friends from './modules/friends';

export default createStore({
  state: {
    darkMode: true,
    loading: false,
    error: null
  },
  getters: {
    isDarkMode: state => state.darkMode,
    isLoading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    SET_DARK_MODE(state, value) {
      state.darkMode = value;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    }
  },
  actions: {
    toggleDarkMode({ commit, state }) {
      commit('SET_DARK_MODE', !state.darkMode);
      // Save preference to localStorage
      localStorage.setItem('darkMode', !state.darkMode);
    },
    initDarkMode({ commit }) {
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode !== null) {
        commit('SET_DARK_MODE', darkMode === 'true');
      }
    }
  },
  modules: {
    auth,
    users,
    activities,
    friends
  }
});
