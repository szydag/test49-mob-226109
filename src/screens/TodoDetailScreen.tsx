import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, ActivityIndicator, Switch } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import Button from '../components/Button';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import { API_BASE_URL } from '../config';

type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

type TodoDetailScreenRouteProp = RouteProp<RootStackParamList, 'TodoDetail'>;
type TodoDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TodoDetail'>;

const TodoDetailScreen: React.FC = () => {
  const navigation = useNavigation<TodoDetailScreenNavigationProp>();
  const route = useRoute<TodoDetailScreenRouteProp>();
  const { todoId } = route.params;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTodo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Todo>(`${API_BASE_URL}/todos/${todoId}`);
      setTodo(response.data);
    } catch (err) {
      console.error('Failed to fetch todo details:', err);
      setError('Failed to load todo details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [todoId]);

  useFocusEffect(
    useCallback(() => {
      fetchTodo();
    }, [fetchTodo])
  );

  const handleToggleCompleted = useCallback(async (newValue: boolean) => {
    if (!todo) return;
    setIsUpdating(true);
    try {
      const updatedTodo = { ...todo, completed: newValue };
      await axios.put(`${API_BASE_URL}/todos/${todoId}`, updatedTodo);
      setTodo(updatedTodo);
      Alert.alert('Success', `Todo marked as ${newValue ? 'completed' : 'incomplete'}.`);
    } catch (err) {
      console.error('Failed to update todo completion status:', err);
      Alert.alert('Error', 'Failed to update todo status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  }, [todo, todoId]);

  const handleDeleteTodo = useCallback(async () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/todos/${todoId}`);
              Alert.alert('Success', 'Todo deleted successfully!');
              navigation.goBack();
            } catch (err) {
              console.error('Failed to delete todo:', err);
              Alert.alert('Error', 'Failed to delete todo. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [todoId, navigation]);

  const handleEditTodo = useCallback(() => {
    if (todo) {
      navigation.navigate('AddTodo', { todoId: todo.id, initialData: { title: todo.title, description: todo.description, completed: todo.completed } });
    }
  }, [todo, navigation]);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header title="Todo Details" color={colors.primary} showBack />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !todo) {
    return (
      <View className="flex-1 bg-gray-50">
        <Header title="Todo Details" color={colors.primary} showBack />
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-lg text-center">{error || 'Todo not found.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Todo Details" color={colors.primary} showBack />
      <ScrollView className="flex-1 p-4">
        <View className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <Text className="text-sm text-gray-500 font-medium">Title</Text>
          <Text className="text-2xl font-bold text-gray-900 mt-1 mb-4">{todo.title}</Text>

          <Text className="text-sm text-gray-500 font-medium">Description</Text>
          <Text className="text-base text-gray-800 mt-1 mb-4">{todo.description || 'No description provided.'}</Text>

          <View className="flex-row items-center justify-between py-2 border-t border-gray-200 mt-2">
            <Text className="text-base text-gray-900">Completed</Text>
            <Switch
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={todo.completed ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleCompleted}
              value={todo.completed}
              disabled={isUpdating}
            />
          </View>
        </View>

        <Button
          label="Edit Todo"
          color={colors.primary}
          action={handleEditTodo}
          className="mb-4"
        />
        <Button
          label="Delete Todo"
          color="#DC2626" // Red color for delete
          action={handleDeleteTodo}
        />
      </ScrollView>
    </View>
  );
};

export default TodoDetailScreen;
