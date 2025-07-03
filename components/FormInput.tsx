import { View, Text, TextInput, TextStyle, StyleProp, StyleSheet, Platform, TextInputProps } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

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
            <TextInput placeholder={label} style={[styles.input, inputStyle]}
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
const styles=StyleSheet.create({
    inputWrapper: {
        width: "100%",
        height: 48,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.tabIconDefault,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 0,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    input: {
        color: Colors.light.text,
        fontSize: 16,
        flex: 1,
        paddingVertical: Platform.OS === 'ios' ? 10 : 6,
        backgroundColor: 'transparent',
    }
})