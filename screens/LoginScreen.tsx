import { View, Text, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import FormInput from '../components/FormInput';
import ErrorMessage from '../components/ErrorMessage';
import FormFieldError from '../components/FormFieldError';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../types/navigation';

// ✅ CORRECTION : Type de navigation spécifique pour Auth
type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  
  // ✅ NOUVEAU : État pour l'erreur globale de connexion
  const [globalError, setGlobalError] = useState<string | null>(null);

  // ✅ CORRECTION : Redirection automatique si déjà connecté
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('Utilisateur déjà connecté, redirection automatique...');
    }
  }, [isAuthenticated, isLoading]);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setGlobalError(null); // ✅ Effacer l'erreur globale lors de la saisie
    if (text.length === 0 || validateEmail(text)) {
      setEmailError(null);
    } else {
      setEmailError('Email invalide');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setGlobalError(null); // ✅ Effacer l'erreur globale lors de la saisie
    if (text.length === 0 || validatePassword(text)) {
      setPasswordError(null);
    } else {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
    }
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError('Email invalide');
    }
  };

  // ✅ NOUVEAU : Fonction pour effacer l'erreur globale
  const handleDismissGlobalError = () => {
    setGlobalError(null);
  };

  // ✅ CORRECTION : Navigation typée
  const ToSignup = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    // Validation des champs avant de continuer
    if (!email.trim()) {
      setEmailError('Email requis');
      return;
    }
    if (!password.trim()) {
      setPasswordError('Mot de passe requis');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Email invalide');
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoginLoading(true);
    setEmailError(null);
    setPasswordError(null);
    setGlobalError(null); // ✅ Effacer l'erreur globale avant tentative
    
    try {
      console.log('Tentative de connexion...', { email });
      const success = await login(email, password);
      
      if (success) {
        console.log('Connexion réussie, redirection automatique par RootNavigator');
        // ✅ CORRECTION : Pas de navigation manuelle nécessaire
        // Le RootNavigator détectera automatiquement isAuthenticated = true
        // et redirigera vers MainTabs
      } else {
        // ✅ NOUVEAU : Erreur globale au lieu d'erreur de champ
        setGlobalError('Échec de la connexion. Vérifiez vos identifiants.');
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      // ✅ AMÉLIORÉ : Gestion plus fine des erreurs
      if (error.message.includes('mot de passe') || error.message.includes('password')) {
        setPasswordError(error.message);
      } else if (error.message.includes('email') || error.message.includes('Email')) {
        setEmailError(error.message);
      } else {
        // ✅ NOUVEAU : Erreur globale pour les erreurs de connexion générales
        setGlobalError(
          error.message || 
          'Erreur de connexion. Vérifiez votre connexion internet et réessayez.'
        );
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ✅ CORRECTION : Afficher un loader si l'authentification est en cours
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Vérification de la session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Connectez-vous à votre compte pour gérer vos produits</Text>
          
          {/* ✅ NOUVEAU : Message d'erreur globale */}
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
            label="Mot de passe"
            onBlur={() => {}}
          />
          <FormFieldError error={passwordError} />

          <Button
            title="Se connecter"
            onPress={handleLogin}
            loading={loginLoading}
            buttonStyle={styles.loginButton}
            titleStyle={{ fontWeight: '600' }}
            disabled={loginLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
            <TouchableOpacity onPress={ToSignup}>
              <Text style={styles.signupLink}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

// ✅ STYLES AMÉLIORÉS
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
  // ✅ NOUVEAU : Style pour l'erreur globale
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
