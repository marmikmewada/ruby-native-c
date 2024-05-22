import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create((set) => ({
  isLoggedIn: false,
  userId: null,
  token: null,
  todos: [],
  loading: true, // Add loading state

  initialize: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Optionally, verify token validity by making a request to the backend
        const response = await fetch('http://192.168.1.102:5000/api/verifyToken', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          set({ isLoggedIn: true, userId: data.userId, token });
        } else {
          await AsyncStorage.removeItem('token');
          set({ isLoggedIn: false, userId: null, token: null });
        }
      } else {
        set({ loading: false }); // Set loading to false if no token is found
      }
    } catch (error) {
      console.error('Initialization failed:', error.message);
      set({ loading: false }); // Ensure loading state is set to false on error
    } finally {
      set({ loading: false }); // Ensure loading state is set to false after initialization attempt
    }
  },

  // Login function
  // Login function
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
    console.log(data.token);
    await AsyncStorage.setItem('token', data.token);
    
    // Fetch the token from AsyncStorage and log it
    const savedToken = await AsyncStorage.getItem('token');
    console.log('Token saved in AsyncStorage:', savedToken);

    set({ isLoggedIn: true, userId: data.userId, token: data.token }); // Update token in Zustand
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
},


  // Logout function
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      set({ isLoggedIn: false, userId: null, token: null });
    } catch (error) {
      console.error('Logout failed:', error.message);
      throw error;
    }
  },

  // Signup function
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

      return { success: true };
    } catch (error) {
      console.error('Signup failed:', error.message);
      throw error;
    }
  },

  // Add Todo function
  addTodo: async (newTodo) => {
    try {
      const token = useStore.getState().token;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://192.168.1.102:5000/api/todos', {
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

  // Update Todo function
  updateTodo: async (updatedTodo) => {
    try {
      const token = useStore.getState().token;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://192.168.1.102:5000/api/todos/${updatedTodo.id}`, {
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

  // Delete Todo function
  deleteTodo: async (todoId) => {
    try {
      const token = useStore.getState().token;
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`http://192.168.1.102:5000/api/todos/${todoId}`, {
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

  // Get All Todos function
  getAllTodos: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://192.168.1.102:5000/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        set((state) => ({
          todos: data || state.todos, // Update todos with fetched data or keep existing state
        }));
      } else {
        throw new Error(data.error || 'Failed to fetch todos');
      }
    } catch (error) {
      console.error('Error fetching todos:', error.message);
      throw error; // Rethrow error to propagate to the caller
    }
  },
}));

// Call initialize function to set initial state based on stored token
useStore.getState().initialize();

export default useStore;
