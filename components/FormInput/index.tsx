import { View, Text, TextInput, TextStyle, StyleProp, StyleSheet, Platform, TextInputProps } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import Colors from '../../constants/Colors'
import styles from './styles'

export type inputProps = {
    labelValue:string|undefined,
    label:string,
    icon?:string,
    isPassword?:boolean,
    handleChange?:((text: string) => void) | undefined,
    inputStyle?: StyleProp<TextStyle>,
    placeholderTextColor?: string,
} & TextInputProps;

const FormInput = ({labelValue,label,icon,handleChange,isPassword=false, inputStyle, placeholderTextColor, ...rest}:inputProps) => {
    const theme = Colors.light;
    return (
        <View style={styles.inputWrapper}>
            {icon && <Octicons name={icon as keyof typeof Octicons.glyphMap} size={20} color={theme.tint} style={{marginRight: 6}} />}
            <TextInput placeholder={rest.placeholder || label} style={[styles.input, inputStyle]}
                value={labelValue}
                onChangeText={handleChange}
                secureTextEntry={isPassword}
                placeholderTextColor={placeholderTextColor || '#8ca0b3'}
                {...rest}
            />
        </View>
    )
}

export default FormInput 