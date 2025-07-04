import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-elements';
import FormInput from '../components/FormInput';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/navigation';

// ✅ Type navigation
type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { signup } = useAuth();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ToLogin = () => navigation.navigate('Login');

  const handleSignup = async () => {
    setIsLoading(true);
    setEmailError(null);
    setPasswordError(null);
    setUsernameError(null);

    if (!validateEmail(email)) {
      setEmailError('Email invalide');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError('Mot de passe trop court');
      setIsLoading(false);
      return;
    }

    if (username.trim().length < 3) {
      setUsernameError("Nom d'utilisateur trop court");
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup(username, email, password);
      if (success) {
        // Navigation automatique
      }
    } catch (error: any) {
      if (error.message.includes('email')) {
        setEmailError(error.message);
      } else if (error.message.includes('nom')) {
        setUsernameError(error.message);
      } else {
        setPasswordError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.container}
      >
        <View style={styles.subContainer}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez-nous pour gérer vos produits</Text>

          <FormInput
            icon="person"
            handleChange={setUsername}
            isPassword={false}
            labelValue={username}
            label="Nom d'utilisateur"
          />
          {usernameError && <Text style={styles.error}>{usernameError}</Text>}

          <FormInput
            icon="mail"
            handleChange={setEmail}
            isPassword={false}
            labelValue={email}
            label="Email"
          />
          {emailError && <Text style={styles.error}>{emailError}</Text>}

          <FormInput
            icon="shield-lock"
            handleChange={setPassword}
            isPassword
            labelValue={password}
            label="Mot de passe"
          />
          {passwordError && <Text style={styles.error}>{passwordError}</Text>}

          <Button
            title="S'inscrire"
            onPress={handleSignup}
            loading={isLoading}
            buttonStyle={styles.signupButton}
            titleStyle={{ fontWeight: '600' }}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={ToLogin}>
              <Text style={styles.loginLink}>Se connecter</Text>
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
    image: {
      width: '100%',
      height: 180,
      marginBottom: 16,
    },
    subContainer: {
      gap: 16,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#2f95dc',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 16,
    },
    error: {
      color: 'red',
      fontSize: 13,
      marginTop: -8,
      marginBottom: 4,
      marginLeft: 4,
    },
    signupButton: {
      backgroundColor: '#2f95dc',
      borderRadius: 12,
      paddingVertical: 12,
      marginTop: 8,
    },
    loginRow: {
      marginTop: 24,
      alignItems: 'center',
    },
    loginText: {
      fontSize: 14,
      color: '#333',
    },
    loginLink: {
      color: '#2f95dc',
      fontWeight: '600',
      marginTop: 4,
    },
  });
  