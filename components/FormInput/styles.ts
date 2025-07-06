import { StyleSheet, Platform } from 'react-native'
import Colors from '../../constants/Colors'

const styles = StyleSheet.create({
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

export default styles 