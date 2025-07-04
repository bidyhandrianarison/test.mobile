import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-elements'
import FormInput from '../components/FormInput'
import { validateEmail, validatePassword } from '../utils/validation'
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { login } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const handleEmailChange = (text: string) => {
        setEmail(text)
        if (text.length === 0 || validateEmail(text)) {
            setEmailError(null)
        } else {
            setEmailError("Email invalide")
        }
    }

    const handleEmailBlur = () => {
        if (!validateEmail(email)) {
            setEmailError("Email invalide")
        }
    }

    const handlePasswordChange = (text: string) => {
        setPassword(text)
        if (text.length === 0 || validatePassword(text)) {
            setPasswordError(null)
        } else {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères")
        }
    }

    const ToSignup = () => navigation.navigate('Signup' as never);

    const handleLogin = async () => {
        setIsLoading(true);
        setEmailError(null);
        setPasswordError(null);
        try {
            const success = await login(email, password);
            if (success) {
                // La navigation sera gérée automatiquement par le RootNavigator
            }
        } catch (error: any) {
            if (error.message.includes('mot de passe')) {
                setPasswordError(error.message);
            } else {
                setEmailError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container} >
                <View style={styles.subContainer} >
                    <Text style={styles.title}>Connexion</Text>
                    <FormInput
                        icon='person'
                        handleChange={handleEmailChange}
                        isPassword={false}
                        labelValue={email}
                        label='Email'
                        onBlur={handleEmailBlur}
                    />
                    {emailError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{emailError}</Text>}
                    <FormInput
                        icon='shield-lock'
                        handleChange={handlePasswordChange}
                        isPassword={true}
                        labelValue={password}
                        label='Mot de passe'
                        onBlur={handleEmailBlur}
                    />
                    {passwordError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{passwordError}</Text>}

                    <Button title={"Se connecter"} onPress={handleLogin} loading={isLoading} />
                </View>

                <View>
                    <Text>Vous n'avez pas de compte ?</Text>
                    <Button style={styles.outlineButton} title={"Créer un compte"} onPress={ToSignup} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer:{
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
})

export default LoginScreen
