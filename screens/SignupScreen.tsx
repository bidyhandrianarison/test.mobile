import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import FormInput from '../components/FormInput';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
    const navigation = useNavigation();
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const ToLogin = () => navigation.navigate('Login' as never);

    const handleSignup = async () => {
        setIsLoading(true);
        setEmailError(null);
        setPasswordError(null);
        setUsernameError(null);
        
        try {
            const success = await signup(username, email, password);
            if (success) {
                // La navigation sera gérée automatiquement
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
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.title}>Créer un compte</Text>
                    
                    <FormInput
                        icon='person'
                        handleChange={setUsername}
                        isPassword={false}
                        labelValue={username}
                        label="Nom d\'utilisateur"
                    />
                    {usernameError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{usernameError}</Text>}
                    
                    <FormInput
                        icon='mail'
                        handleChange={setEmail}
                        isPassword={false}
                        labelValue={email}
                        label='Email'
                    />
                    {emailError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{emailError}</Text>}
                    
                    <FormInput
                        icon='shield-lock'
                        handleChange={setPassword}
                        isPassword={true}
                        labelValue={password}
                        label='Mot de passe'
                    />
                    {passwordError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{passwordError}</Text>}

                    <Button title="S'inscrire" onPress={handleSignup} loading={isLoading} />
                </View>

                <View>
                    <Text>Vous avez déjà un compte ?</Text>
                    <Button style={styles.outlineButton} title="Se connecter" onPress={ToLogin} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0005',
        backgroundColor: '#f7f9ef'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50
    },
    subContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        marginBottom: 20
    },
    outlineButton: {
        backgroundColor: 'white',
        color: 'black',
        width: '90%'
    }
});

export default SignupScreen;
