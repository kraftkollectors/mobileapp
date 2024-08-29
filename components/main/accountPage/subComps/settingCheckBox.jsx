import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import { COLORS } from '../../../../constants/themes/colors'

export default function SettingCheckBox({ checkTitle, checkOption, setOption }) {
    return (
        <TouchableOpacity onPress={()=>{setOption(prev => !prev)}} style={styles.checkBlock}>
            <View style={[styles.checkBox, checkOption ? {backgroundColor: COLORS.black900} : {backgroundColor: COLORS.whiteBG}]}>
                <Octicons name="check" size={16} color={COLORS.whiteBG} />
            </View>
            <Text style={styles.checkText}>{checkTitle}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    checkBlock: {
        width: "auto",
        height: 24,
        flexDirection: "row",
        gap: 12,
        alignItems: "center"
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: COLORS.black50
    },
    checkText: {
        fontFamily: "EinaRegular",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black900
    }
})