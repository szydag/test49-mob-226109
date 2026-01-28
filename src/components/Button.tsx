import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

type ButtonProps = {
  label: string | React.ReactElement;
  color: string;
  action: () => void;
  variant?: 'default' | 'fab';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  label,
  color,
  action,
  variant = 'default',
  position,
  className = '',
  disabled = false,
}) => {
  const fabStyles = variant === 'fab' ? 'absolute rounded-full p-4 shadow-lg' : 'rounded-lg py-3 px-4';
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  }[position || ''] || '';

  return (
    <TouchableOpacity
      onPress={action}
      className={`bg-[${color}] ${fabStyles} ${positionStyles} ${disabled ? 'opacity-70' : ''} ${className}`}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {typeof label === 'string' ? (
        <Text className={`text-white text-lg font-semibold text-center ${variant === 'fab' ? 'text-2xl' : ''}`}>
          {label}
        </Text>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
};

export default Button;
