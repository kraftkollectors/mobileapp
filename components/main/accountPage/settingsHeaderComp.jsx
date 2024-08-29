import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons'
import { COLORS } from '../../../constants/themes/colors'
import { useRouter } from 'expo-router'

export default function SettingsHeaderComp({ pageTitle }) {
    const router = useRouter();

    function goBack(){
        router.back();
    }

    return (
        <View style={styles.settingHeaderBar}>
            <TouchableOpacity onPress={()=>{goBack()}} style={styles.settingBackBtn}>
                <Octicons name="chevron-left" size={24} color={COLORS.black500} />
            </TouchableOpacity>

            <Text style={styles.settingTitle}>{pageTitle}</Text>

            <View style={styles.settingBackBtn}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    settingHeaderBar: {
        width: "100%",
        height: 48,
        backgroundColor: COLORS.whiteBG,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16
    },
    settingBackBtn: {
        width: 24,
        height: 24,
        alignItems: "flex-start"
    },
    settingTitle: {
        fontFamily: "EinaBold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black500
    }
})