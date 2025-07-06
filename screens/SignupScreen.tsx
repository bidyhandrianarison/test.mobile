import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
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
 * Navigation prop type for the signup screen
 */
type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

/**
 * SignupScreen component handles user registration
 * 
 * Features:
 * - Username, email, and password validation
 * - Real-time form validation
 * - Global error and success message handling
 * - Navigation to login screen
 * - Automatic redirection after successful signup
 * - Authentication guards to prevent authenticated users from accessing
 */
const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup, isAuthenticated, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Redirects authenticated users automatically and prevents access
   */
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Authenticated user accessing signup screen - should be redirected by RootNavigator');
      // The RootNavigator will handle the redirection automatically
      // This is just for logging and debugging
    }
  }, [isAuthenticated, isLoading]);

  /**
   * Navigates to the login screen
   */
  const navigateToLogin = () => navigation.navigate('Login');

  /**
   * Handles username input changes with validation
   * @param text - The username text entered by user
   */
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    clearErrorsOnInput(setGlobalError, setUsernameError);
    if (text.trim().length >= 3 || text.length === 0) {
      setUsernameError(null);
    } else {
      setUsernameError("Username too short (minimum 3 characters)");
    }
  };

  /**
   * Handles email input changes with validation
   * @param text - The email text entered by user
   */
  const handleEmailChange = (text: string) => {
    setEmail(text);
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
    clearErrorsOnInput(setGlobalError, setPasswordError);
    if (text.length === 0 || validatePassword(text)) {
      setPasswordError(null);
    } else {
      setPasswordError('Password must contain at least 6 characters');
    }
  };

  /**
   * Dismisses the global error message
   */
  const handleDismissGlobalError = () => {
    setGlobalError(null);
  };

  /**
   * Dismisses the success message
   */
  const handleDismissSuccess = () => {
    setSuccessMessage(null);
  };

  /**
   * Handles the signup form submission
   * Validates all fields and attempts user registration
   */
    const handleSignup = async () => {
    setSignupLoading(true);
        setEmailError(null);
        setPasswordError(null);
        setUsernameError(null);
    setGlobalError(null);
    setSuccessMessage(null);

    // Enhanced client-side validation
    let hasErrors = false;

    if (!username.trim()) {
      setUsernameError("Username required");
      hasErrors = true;
    } else if (username.trim().length < 3) {
      setUsernameError("Username too short (minimum 3 characters)");
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError('Email required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError('Password required');
      hasErrors = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must contain at least 6 characters');
      hasErrors = true;
    }

    if (hasErrors) {
      setSignupLoading(false);
      return;
    }
        
        try {
            const success = await signup(username, email, password);
            if (success) {
        setSuccessMessage('Account created successfully! Redirecting...');
        
        // Wait a bit for user to see the message
        setTimeout(() => {
          // Automatic navigation handled by RootNavigator
        }, 1500);
      } else {
        setGlobalError('Failed to create account. Please try again.');
            }
        } catch (error: any) {
      console.error('Signup error:', error);
      
      // Use the new error handling utility
      const authError = mapAuthError(error);
      
      if (authError.field === 'email') {
        setEmailError(authError.message);
      } else if (authError.field === 'username') {
        setUsernameError(authError.message);
      } else if (authError.field === 'password') {
        setPasswordError(authError.message);
            } else {
        setGlobalError(authError.message);
            }
        } finally {
      setSignupLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.container}
      >
                <View style={styles.subContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to manage your products</Text>

          <ErrorMessage
            message={globalError}
            onDismiss={handleDismissGlobalError}
            style={styles.globalMessage}
          />
          
          <ErrorMessage
            message={successMessage}
            type="info"
            onDismiss={handleDismissSuccess}
            style={styles.globalMessage}
          />
                    
                    <FormInput
            icon="person"
            handleChange={handleUsernameChange}
                        isPassword={false}
                        labelValue={username}
            label="Username"
                    />
          <FormFieldError error={usernameError} />
                    
                    <FormInput
            icon="mail"
            handleChange={handleEmailChange}
                        isPassword={false}
                        labelValue={email}
            label="Email"
                    />
          <FormFieldError error={emailError} />
                    
                    <FormInput
            icon="shield-lock"
            handleChange={handlePasswordChange}
            isPassword
                        labelValue={password}
            label="Password"
                    />
          <FormFieldError error={passwordError} />

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={signupLoading}
            buttonStyle={styles.signupButton}
            titleStyle={{ fontWeight: '600' }}
            disabled={signupLoading}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
                </View>
            </View>
      </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
    backgroundColor: '#f0f4ff',
    },
    container: {
        flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    },
    subContainer: {
    gap: 16,
    },
    title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2f95dc',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  globalMessage: {
    marginBottom: 8,
  },
  signupButton: {
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
  loginLink: {
    color: '#2f95dc',
    fontWeight: '600',
    marginTop: 4,
  },
});
