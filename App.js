import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen'; // Adjust path as necessary
import SignupScreen from './SignupScreen'; // Adjust path as necessary
import TodoScreen from './TodoScreen'; // Adjust path as necessary
import useStore from './store'; // Adjust path as necessary

const Stack = createStackNavigator();

export default function App() {
  const { isLoggedIn } = useStore();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <Stack.Screen name="Todo" component={TodoScreen} />
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
