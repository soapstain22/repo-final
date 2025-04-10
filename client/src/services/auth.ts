import { ref } from 'vue';
import { supabase } from './supabase';

const loggedInUser = ref<any | null>(null);

const login = async (email: string, password?: string): Promise<any | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: password || '',
  });

  if (error) {
    console.error('Login error:', error.message);
    return null;
  }

  loggedInUser.value = data.user;
  return data.user;
};

const register = async (name: string, email: string, password?: string): Promise<any | null | string> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: password || '',
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    console.error('Registration error:', error.message);
    return error.message;
  }

  loggedInUser.value = data.user;
  return data.user;
};

const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  loggedInUser.value = null;
};

const isLoggedIn = (): boolean => {
  return loggedInUser.value !== null;
};

const getLoggedInUser = (): any | null => {
  return supabase.auth.currentUser;
};

export { login, register, logout, isLoggedIn, getLoggedInUser };
