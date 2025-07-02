import { View, Text, TextInput, TextStyle, StyleProp, StyleSheet } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'

export type inputProps = {
    labelValue:string|undefined,
    label:string,
    icon?:string,
    isPassword:boolean,
    handleChange?:((text: string) => void) | undefined,
}

const FormInput = ({labelValue,label,icon,handleChange,isPassword}:inputProps) => {
    return (
        <View style={styles.inputWrapper}>
            {icon && <Octicons name={icon as keyof typeof Octicons.glyphMap} size={20} color="#0005" />}
            <TextInput placeholder={label} style={styles.input}
                value={labelValue}
                onChangeText={handleChange}
                secureTextEntry={isPassword}
            />
        </View>
    )
}

export default FormInput 
const styles=StyleSheet.create({
    inputWrapper: {
        width: "100%",
        height: 55,
        backgroundColor: '#f7f9ef',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 8,
        marginBottom: 10
},
input: {
    color: "#0005",
    outline: 'none',
    padding: 2,
    width: '100%'
}})