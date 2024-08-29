import { View, Text, StyleSheet, TextInput, Image, Dimensions } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants/themes/colors'

const screenWidth = Dimensions.get('screen').width;

export default function EmailInputTab({input, setInput, hasError}) {
    return (
        <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>Email</Text>

            <View style={[styles.inputTab, hasError ? {borderColor: COLORS.redWarning} : {borderColor: COLORS.black100}]}>
                <View style={styles.inputIcon}>
                {
                    hasError ?
                    <Image source={require('../../assets/icons/mail-error.png')} style={{width: "100%", height: "100%", objectFit: "contain"}} /> :
                    <Image source={require('../../assets/icons/mail2.png')} style={{width: "100%", height: "100%", objectFit: "contain"}} />
                }
                </View>

                <TextInput 
                    style={styles.inputText}
                    placeholder='Email Address'
                    placeholderTextColor={hasError ? COLORS.redWarning : COLORS.black300}
                    value={input}
                    onChangeText={text => setInput(text)}
                    autoCorrect={false}
                    autoCapitalize='none'
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
        width: (screenWidth - (20 + 8 + 24 + 32)),
        textTransform: "lowercase"
    }
})