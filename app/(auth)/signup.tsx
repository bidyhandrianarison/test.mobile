import { View, Text, SafeAreaView, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-elements'
import FormInput from '@/components/FormInput'
import { Redirect, useRouter } from 'expo-router'
import { validateEmail, validatePassword } from '@/utils/validation'
import { registerUser } from '@/services/authService'

const Signup = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const ToLogin = () => { router.push('/login') }
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

    const handlePasswordBlur = () => {
        if (!validatePassword(password)) {
            setPasswordError("Le mot de passe doit contenir au moins 6 caractères")
        }
    }
    const handleSignup = async () => {
        setIsLoading(true);
        setEmailError(null);
        setPasswordError(null);
        try{
            await registerUser(email, username, password);
            router.push('/(auth)/login')
        }catch (error: any) {
            if (error.message.includes('email')) {
                setEmailError(error.message);
            } else {
                setPasswordError(error.message);
            }
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container} >
                <View style={styles.subContainer} >
                    <Text style={styles.title}>Inscription</Text>
                    <FormInput
                        icon='person'
                        handleChange={(username) => setUsername(username)}
                        isPassword={false}
                        labelValue={username}
                        label="Nom d'utilisateur"
                    />
                    <FormInput
                        icon='person'
                        handleChange={handleEmailChange}
                        isPassword={false}
                        labelValue={email}
                        label='Email'
                        //@ts-ignore
                        onBlur={handleEmailBlur}
                    />
                    {emailError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{emailError}</Text>}

                    <FormInput
                        icon='shield-lock'
                        handleChange={handlePasswordChange}
                        isPassword={true}
                        labelValue={password}
                        label='Mot de passe'
                        //@ts-ignore
                        onBlur={handlePasswordBlur}
                    />
                    {passwordError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{passwordError}</Text>}

                    <Button title={"Créer mon compte"} onPress={handleSignup} />
                </View>

                <View>
                    <Text>Vous avez déjà un compte ?</Text>
                    <Button style={styles.outlineButton} title={"Se connecter"} onPress={ToLogin} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0005',
        backgroundColor: '#f7f9ef',


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
        fontSize: 24
    },
    outlineButton: {
        backgroundColor: 'white',
        color: 'black',
        width: '90%'


    }
})
export default Signup