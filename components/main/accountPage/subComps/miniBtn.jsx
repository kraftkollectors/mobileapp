import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import { COLORS } from '../../../../constants/themes/colors'

export default function MiniBtn({ handleClick }) {
    return (
        <TouchableOpacity onPress={handleClick} style={styles.miniBtn}>
            <Text style={styles.btnText}>Add New</Text>
            <Octicons name="plus" size={16} color={COLORS.whiteBG} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    miniBtn: {
        width: "auto",
        height: 36,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: COLORS.black500,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    btnText: {
        fontFamily: "EinaSemiBold",
        fontSize: 12,
        lineHeight: 20,
        color: COLORS.whiteBG
    }
})