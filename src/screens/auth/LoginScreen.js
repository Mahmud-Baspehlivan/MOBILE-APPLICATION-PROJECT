import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Input, Button } from '../../components/common';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: null }));
                  }
                }}
                error={errors.email}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: null }));
                  }
                }}
                error={errors.password}
                secureTextEntry
                placeholder="Enter your password"
              />

              <Button 
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableWithoutFeedback 
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.footerLink}>Sign Up</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: SIZES.padding * 2,
    justifyContent: 'center',
  },
  header: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.regular,
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  form: {
    marginVertical: SIZES.padding,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding,
  },
  footerText: {
    ...FONTS.regular,
    color: COLORS.gray,
    fontSize: SIZES.font,
  },
  footerLink: {
    ...FONTS.medium,
    color: COLORS.primary,
    fontSize: SIZES.font,
  },
});

export default LoginScreen;