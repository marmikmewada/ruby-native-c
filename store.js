import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create((set) => ({
  isLoggedIn: false,
  userId: null,
  token: null,
  todos: [],

  login: async (username, password) => {
    try {
      const response = await fetch('http://192.168.1.102:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Login failed:', response.status, data.error || 'Unknown error');
        throw new Error(data.error || 'Login failed');
      }
  
      await AsyncStorage.setItem('token', data.token);
      set({ isLoggedIn: true, userId: data.userId, token: data.token });
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  },
  
  

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove token from storage on logout
      set({ isLoggedIn: false, userId: null, token: null });
    } catch (error) {
      console.error('Logout failed:', error.message);
      throw error;
    }
  },

  signup: async (username, password) => {
    try {
      const response = await fetch('http://192.168.1.102:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      // Signup successful, proceed with successful signup action
      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error.message);
      throw error;
    }
  },
  

  addTodo: async (newTodo) => {
    try {
      const token = useStore.getState().token;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://192.168.1.102:5000/todos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      const data = await response.json();
      if (response.ok) {
        set((state) => ({ todos: [...state.todos, data] }));
      } else {
        throw new Error(data.error || 'Failed to add todo');
      }
    } catch (error) {
      console.error('Error adding todo:', error.message);
      throw error;
    }
  },

  updateTodo: async (updatedTodo) => {
    try {
      const token = useStore.getState().token;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://192.168.1.102:5000/todos/${updatedTodo.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      const data = await response.json();
      if (response.ok) {
        set((state) => ({
          todos: state.todos.map((todo) => (todo.id === data.id ? data : todo)),
        }));
      } else {
        throw new Error(data.error || 'Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error.message);
      throw error;
    }
  },

  deleteTodo: async (todoId) => {
    try {
      const token = useStore.getState().token;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://192.168.1.102:5000/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== todoId),
        }));
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error.message);
      throw error;
    }
  },

  getAllTodos: async (userId) => {
    try {
      const token = useStore.getState().token;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://192.168.1.102:5000/todos?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        set({ todos: data });
      } else {
        throw new Error(data.error || 'Failed to fetch todos');
      }
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      throw error;
    }
  },
}));

export default useStore;
