import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddTodoScreen from '../screens/AddTodoScreen';
import TodoDetailScreen from '../screens/TodoDetailScreen';
import { colors } from '../theme/colors';

// Define the types for your navigation parameters
export type RootStackParamList = {
  Home: undefined;
  AddTodo: { todoId?: string; initialData?: { title: string; description?: string; completed?: boolean } } | undefined;
  TodoDetail: { todoId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTodo" component={AddTodoScreen} />
        <Stack.Screen name="TodoDetail" component={TodoDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
