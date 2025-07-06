import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import FormInput from '../components/FormInput';
import ErrorMessage from '../components/ErrorMessage';
import FormFieldError from '../components/FormFieldError';
import LoadingSpinner from '../components/LoadingSpinner';
import { validateEmail, validatePassword } from '../utils/validation';
import { mapAuthError, clearErrorsOnInput } from '../utils/errorHandling';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/navigation';
import { t } from '../utils/translations';

/**
 * Navigation prop type for the login screen
 */
type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

/**
 * LoginScreen component handles user authentication
 * 
 * Features:
 * - Email and password validation
 * - Real-time form validation
 * - Global error handling
 * - Automatic redirection for authenticated users
 * - Navigation to signup screen
 * - Authentication guards to prevent authenticated users from accessing
 */
const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  /**
   * Redirects authenticated users automatically and prevents access
   */
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Authenticated user accessing login screen - should be redirected by RootNavigator');
      // The RootNavigator will handle the redirection automatically
      // This is just for logging and debugging
    }
  }, [isAuthenticated, isLoading]);

  /**
   * Handles email input changes with validation
   * @param text - The email text entered by user
   */
  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear global error when user starts typing
    clearErrorsOnInput(setGlobalError, setEmailError);
    if (text.length === 0 || validateEmail(text)) {
      setEmailError(null);
    } else {
      setEmailError('Invalid email');
    }
  };

  /**
   * Handles password input changes with validation
   * @param text - The password text entered by user
   */
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear global error when user starts typing
    clearErrorsOnInput(setGlobalError, setPasswordError);
    if (text.length === 0 || validatePassword(text)) {
      setPasswordError(null);
    } else {
      setPasswordError('Password must contain at least 6 characters');
    }
  };

  /**
   * Validates email on blur event
   */
  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email');
    }
  };

  /**
   * Dismisses the global error message
   */
  const handleDismissGlobalError = () => {
    setGlobalError(null);
  };

  /**
   * Navigates to the signup screen
   */
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  };

  /**
   * Handles the login form submission
   * Validates all fields and attempts user authentication
   */
    const handleLogin = async () => {
    // Validate all fields before proceeding
    if (!email.trim()) {
      setEmailError('Email required');
      return;
    }
    if (!password.trim()) {
      setPasswordError('Password required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must contain at least 6 characters');
      return;
    }

    setLoginLoading(true);
        setEmailError(null);
        setPasswordError(null);
    setGlobalError(null);
    
        try {
      console.log('Attempting login...', { email });
            const success = await login(email, password);
      
            if (success) {
        console.log('Login successful, automatic redirection by RootNavigator');
        // RootNavigator will automatically detect isAuthenticated = true
        // and redirect to MainTabs
      } else {
        setGlobalError('Invalid email or password. Please check your credentials.');
            }
        } catch (error: any) {
      console.error('Login error:', error);
      
      // Use the new error handling utility
      const authError = mapAuthError(error);
      
      if (authError.field === 'email') {
        setEmailError(authError.message);
      } else if (authError.field === 'password') {
        setPasswordError(authError.message);
            } else {
        setGlobalError(authError.message);
            }
        } finally {
      setLoginLoading(false);
    }
  };

    return (
        <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Sign in to your account to manage your products</Text>
          
          <ErrorMessage
            message={globalError}
            onDismiss={handleDismissGlobalError}
            style={styles.globalError}
          />
        </View>

        <View style={styles.form}>
                    <FormInput
            icon="person"
            handleChange={handleEmailChange}
                        isPassword={false}
                        labelValue={email}
            label="Email"
            onBlur={handleEmailBlur}
                    />
          <FormFieldError error={emailError} />

                    <FormInput
            icon="shield-lock"
            handleChange={handlePasswordChange}
                        isPassword={true}
                        labelValue={password}
            label="Password"
            onBlur={() => {}}
          />
          <FormFieldError error={passwordError} />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loginLoading}
            buttonStyle={styles.loginButton}
            titleStyle={{ fontWeight: '600' }}
            disabled={loginLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={styles.signupLink}>Create account</Text>
            </TouchableOpacity>
                </View>
            </View>
      </KeyboardAvoidingView>
        </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeContainer: {
        flex: 1,
    backgroundColor: '#f0f4ff',
    },
    container: {
        flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    },
    title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2f95dc',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  globalError: {
    marginTop: 16,
    marginBottom: 8,
  },
  form: {
    gap: 16,
  },
  loginButton: {
    backgroundColor: '#2f95dc',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#333',
  },
  signupLink: {
    color: '#2f95dc',
    fontWeight: '600',
    marginTop: 4,
  },
});
