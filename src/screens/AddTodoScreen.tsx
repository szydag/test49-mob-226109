import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/AppNavigator';
import axios from 'axios';
import { API_BASE_URL } from '../config';

type AddTodoScreenRouteProp = RouteProp<RootStackParamList, 'AddTodo'>;
type AddTodoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddTodo'>;

const AddTodoScreen: React.FC = () => {
  const navigation = useNavigation<AddTodoScreenNavigationProp>();
  const route = useRoute<AddTodoScreenRouteProp>();
  const todoId = route.params?.todoId;
  const initialData = route.params?.initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSaveTodo = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Todo title cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const todoData = { title, description };
      if (todoId) {
        // Update existing todo
        await axios.put(`${API_BASE_URL}/todos/${todoId}`, todoData);
        Alert.alert('Success', 'Todo updated successfully!');
      } else {
        // Create new todo
        await axios.post(`${API_BASE_URL}/todos`, todoData);
        Alert.alert('Success', 'Todo added successfully!');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save todo:', error);
      Alert.alert('Error', 'Failed to save todo. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [title, description, todoId, navigation]);

  return (
    <View className="flex-1 bg-gray-50">
      <Header title={todoId ? 'Edit Todo' : 'Add Todo'} color={colors.primary} showBack />
      <ScrollView className="flex-1 p-4">
        <Input
          id="todoTitle"
          label="Title"
          placeholder="Enter todo title"
          value={title}
          onChangeText={setTitle}
          className="mb-4"
        />
        <Input
          id="todoDescription"
          label="Description"
          placeholder="Enter todo description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="mb-6 h-32"
        />
        <Button
          label={loading ? <ActivityIndicator color="#fff" /> : "Save Todo"}
          color={colors.primary}
          action={handleSaveTodo}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

export default AddTodoScreen;
