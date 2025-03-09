import { ref } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
}

const users = ref<User[]>([
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'password',
    role: 'user',
  },
  {
    id: 3,
    name: 'Friend User',
    email: 'friend@example.com',
    password: 'password',
    role: 'friend',
  },
]);

const loggedInUser = ref<User | null>(null);

const login = async (email: string, password?: string): Promise<User | null> => {
  const user = users.value.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    loggedInUser.value = user;
    return user;
  }
  return null;
};

const register = async (name: string, email: string, password?: string): Promise<User | null | string> => {
  if (users.value.find((u) => u.email === email)) {
    return "Email already registered";
  }
  if (!name || !email || !password) {
    return "All fields are required";
  }
  const newUser: User = {
    id: users.value.length + 1,
    name,
    email,
    password,
    role: 'user',
  };
  users.value.push(newUser);
  loggedInUser.value = newUser;
  return newUser;
};

const logout = async (): Promise<void> => {
  loggedInUser.value = null;
};

const isLoggedIn = (): boolean => {
  return loggedInUser.value !== null;
};

const getLoggedInUser = (): User | null => {
  return loggedInUser.value;
};

const getUsers = (): User[] => {
  return users.value;
};

const addUser = async (name: string, email: string, password?: string, role: string = 'user'): Promise<User | null> => {
    if (users.value.find((u) => u.email === email)) {
      return null;
    }
    const newUser: User = {
      id: users.value.length + 1,
      name,
      email,
      password,
      role,
    };
    users.value.push(newUser);
    return newUser;
  };

  const updateUser = async (id: number, name: string, email: string, password?: string, role: string = 'user'): Promise<User | null> => {
    const userIndex = users.value.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return null;
    }
    const updatedUser: User = {
      id,
      name,
      email,
      password,
      role,
    };
    users.value[userIndex] = updatedUser;
    return updatedUser;
  };

  const deleteUser = async (id: number): Promise<boolean> => {
    const userIndex = users.value.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      return false;
    }
    users.value.splice(userIndex, 1);
    return true;
  };

export { login, register, logout, isLoggedIn, getLoggedInUser, getUsers, addUser, updateUser, deleteUser };
