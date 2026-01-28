import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import axios from 'axios';
import { API_BASE_URL } from '../config';

type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [fetchTodos])
  );

  const handleItemClick = (todo: Todo) => {
    navigation.navigate('TodoDetail', { todoId: todo.id });
  };

  const handleAddTodo = () => {
    navigation.navigate('AddTodo');
  };

  const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => (
    <TouchableOpacity
      onPress={() => handleItemClick(todo)}
      className="flex-row items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-sm"
    >
      <View className="flex-1 mr-4">
        <Text className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {todo.title}
        </Text>
        {todo.description && (
          <Text className={`text-sm text-gray-500 ${todo.completed ? 'line-through' : ''}`}>
            {todo.description.substring(0, 50)}{todo.description.length > 50 ? '...' : ''}
          </Text>
        )}
      </View>
      <View
        className={`w-5 h-5 rounded-full border-2 ${todo.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
      />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="My Todos" color={colors.primary} />
      <View className="flex-1 p-4">
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} className="mt-8" />
        ) : error ? (
          <Text className="text-red-500 text-center mt-8 text-lg">{error}</Text>
        ) : todos.length === 0 ? (
          <Text className="text-center text-gray-500 text-lg mt-8">No todos yet. Add one!</Text>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TodoItem todo={item} />}
            className="flex-1"
          />
        )}
      </View>
      <Button
        label="Add New Todo"
        color={colors.primary}
        action={handleAddTodo}
        variant="fab"
        position="bottom-right"
      />
    </View>
  );
};

export default HomeScreen;
