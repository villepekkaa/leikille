import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 active:bg-primary-700';
      case 'secondary':
        return 'bg-secondary-600 active:bg-secondary-700';
      case 'outline':
        return 'bg-transparent border-2 border-primary-600 active:bg-primary-50';
      default:
        return 'bg-primary-600';
    }
  };

  const getTextStyles = () => {
    return variant === 'outline' ? 'text-primary-600' : 'text-white';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-4 px-6 rounded-lg ${getVariantStyles()} ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#dc2626' : '#fff'} />
      ) : (
        <Text className={`text-center font-semibold text-base ${getTextStyles()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
