import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyles: any[] = [styles.button, styles[`size_${size}`]];
    
    switch (variant) {
      case 'primary':
        baseStyles.push(styles.primaryButton);
        break;
      case 'secondary':
        baseStyles.push(styles.secondaryButton);
        break;
      case 'outline':
        baseStyles.push(styles.outlineButton);
        break;
      case 'ghost':
        baseStyles.push(styles.ghostButton);
        break;
    }
    
    if (disabled) {
      baseStyles.push(styles.disabled);
    }
    
    if (style) {
      baseStyles.push(style);
    }
    
    return baseStyles;
  };

  const getTextStyle = () => {
    const textStyles: any[] = [styles.text, styles[`text_${size}`]];
    
    switch (variant) {
      case 'primary':
        textStyles.push(styles.primaryText);
        break;
      case 'secondary':
        textStyles.push(styles.secondaryText);
        break;
      case 'outline':
        textStyles.push(styles.outlineText);
        break;
      case 'ghost':
        textStyles.push(styles.ghostText);
        break;
    }
    
    return textStyles;
  };

  const getLoaderColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return '#fff';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getLoaderColor()} size="small" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  
  // Sizes
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
  },
  size_md: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: colors.primaryLight,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
  
  // Text
  text: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  text_sm: {
    fontSize: typography.sizes.sm,
  },
  text_md: {
    fontSize: typography.sizes.md,
  },
  text_lg: {
    fontSize: typography.sizes.lg,
  },
  
  // Text colors
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
});
