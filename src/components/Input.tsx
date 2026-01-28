import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  id: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
};

const Input: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  className = '',
  ...rest
}) => {
  return (
    <View className={`w-full ${className}`}>
      <Text className="text-base text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        id={id}
        className={`border border-gray-300 rounded-lg p-3 text-base text-gray-800 bg-white
          ${multiline ? 'h-24' : 'h-12'}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
    </View>
  );
};

export default Input;
