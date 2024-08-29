import { View, Text, StyleSheet, TextInput, Image, Dimensions } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/themes/colors'

const screenWidth = Dimensions.get('screen').width;

export default function GenInputTab({label, input, setInput, placeholder, hasError, lowerCase, isNumeric}) {
    return (
        <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{label}</Text>

            <View style={[styles.inputTab, hasError ? {borderColor: COLORS.redWarning} : {borderColor: COLORS.black100}]}>
                <TextInput 
                    style={[styles.inputText, lowerCase && {textTransform: "lowercase"}]}
                    placeholder={placeholder}
                    placeholderTextColor={hasError ? COLORS.redWarning : COLORS.black300}
                    value={input}
                    onChangeText={text => setInput(text)}
                    autoCorrect={false}
                    autoCapitalize='none'
                    inputMode={isNumeric ? 'numeric' : 'text'}
                />
            </View>

            {
                hasError && <Text style={styles.inputError}>{hasError}</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputBlock: {
        width: "100%",
        gap: 8
    },
    inputLabel: {
        fontFamily: "EinaSemiBold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black400
    },
    inputError: {
        fontFamily: "EinaRegular",
        fontSize: 12,
        lineHeight: 20,
        color: COLORS.redWarning
    },
    inputTab: {
        width: "100%",
        height: 44,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.black100,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12
    },
    inputIcon: {
        width: 20,
        height: 20
    },
    inputText: {
        fontFamily: "EinaRegular",
        fontSize: 14,
        lineHeight: 16,
        color: COLORS.black500,
        width: (screenWidth - (24 + 32))
    }
})