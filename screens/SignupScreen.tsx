import React, { useState } from 'react';
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
  
  // ✅ NOUVEAU : État pour l'erreur globale d'inscription
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const ToLogin = () => navigation.navigate('Login');

  // ✅ NOUVEAU : Fonctions de gestion des changements avec effacement d'erreur globale
  const handleUsernameChange = (text: string) => {
    setUsername(text);
    setGlobalError(null);
    if (text.trim().length >= 3 || text.length === 0) {
      setUsernameError(null);
    } else {
      setUsernameError("Nom d'utilisateur trop court (minimum 3 caractères)");
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setGlobalError(null);
    if (text.length === 0 || validateEmail(text)) {
      setEmailError(null);
    } else {
      setEmailError('Email invalide');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setGlobalError(null);
    if (text.length === 0 || validatePassword(text)) {
      setPasswordError(null);
    } else {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
    }
  };

  // ✅ NOUVEAU : Fonction pour effacer les messages
  const handleDismissGlobalError = () => {
    setGlobalError(null);
  };

  const handleDismissSuccess = () => {
    setSuccessMessage(null);
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setEmailError(null);
    setPasswordError(null);
    setUsernameError(null);
    setGlobalError(null);
    setSuccessMessage(null);

    // ✅ AMÉLIORÉ : Validation côté client plus détaillée
    let hasErrors = false;

    if (!username.trim()) {
      setUsernameError("Nom d'utilisateur requis");
      hasErrors = true;
    } else if (username.trim().length < 3) {
      setUsernameError("Nom d'utilisateur trop court (minimum 3 caractères)");
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError('Email requis');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Format d\'email invalide');
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError('Mot de passe requis');
      hasErrors = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      hasErrors = true;
    }

    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup(username, email, password);
      if (success) {
        // ✅ NOUVEAU : Message de succès avant redirection
        setSuccessMessage('Compte créé avec succès ! Redirection en cours...');
        
        // Attendre un peu pour que l'utilisateur voie le message
        setTimeout(() => {
          // Navigation automatique gérée par le RootNavigator
        }, 1500);
      } else {
        setGlobalError('Échec de la création du compte. Veuillez réessayer.');
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      
      // ✅ AMÉLIORÉ : Gestion plus fine des erreurs
      if (error.message.includes('email')) {
        setEmailError(error.message);
      } else if (error.message.includes('nom') || error.message.includes('username')) {
        setUsernameError(error.message);
      } else if (error.message.includes('mot de passe') || error.message.includes('password')) {
        setPasswordError(error.message);
      } else {
        // ✅ NOUVEAU : Erreur globale pour les erreurs générales
        setGlobalError(
          error.message || 
          'Erreur lors de la création du compte. Vérifiez votre connexion et réessayez.'
        );
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

          {/* ✅ NOUVEAU : Messages globaux (erreur et succès) */}
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
            label="Nom d'utilisateur"
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
            label="Mot de passe"
          />
          <FormFieldError error={passwordError} />

          <Button
            title="S'inscrire"
            onPress={handleSignup}
            loading={isLoading}
            buttonStyle={styles.signupButton}
            titleStyle={{ fontWeight: '600' }}
            disabled={isLoading}
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

// ✅ STYLES AMÉLIORÉS
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
  // ✅ NOUVEAU : Style pour les messages globaux
  globalMessage: {
    marginBottom: 8,
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
