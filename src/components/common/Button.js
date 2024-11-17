import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary',
  loading = false,
  disabled = false,
  ...props 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === 'secondary' && styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? COLORS.white : COLORS.primary} />
      ) : (
        <Text style={[
          styles.buttonText,
          type === 'secondary' && styles.secondaryButtonText,
          disabled && styles.disabledButtonText,
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.base,
    minHeight: 48,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    ...FONTS.medium,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGray,
    borderColor: COLORS.lightGray,
  },
  disabledButtonText: {
    color: COLORS.gray,
  },
});

export default Button;