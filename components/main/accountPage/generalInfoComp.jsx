import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { COLORS } from '../../../constants/themes/colors'
import { FORMAT_DATE_MEMBER_SINCE } from '../../../constants/utilities'


const screenWidth = Dimensions.get('screen').width

export default function GeneralInfoComp({ data }) { 

    return (
        <View style={styles.generalInfoComp}>
            <View style={[styles.gicTab, {borderBottomWidth: 1, borderBottomColor: COLORS.black50}]}>
                <Text style={styles.gicTabHead}>Member Since</Text>
                <Text style={styles.gicTabValue}>{FORMAT_DATE_MEMBER_SINCE(data?.createdAt)}</Text>
            </View>

            <View style={styles.gicTab}>
                <Text style={styles.gicTabHead}>Email</Text>
                <Text style={styles.gicTabValue}>{data?.email}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    generalInfoComp: {
        width: "100%",
        backgroundColor: COLORS.whiteBG,
        paddingVertical: 8,
        paddingLeft: 16,
        borderColor: COLORS.black50,
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    gicTab: {
        width: (screenWidth - 16),
        height: 64,
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 4
    },
    gicTabHead: {
        fontFamily: "EinaSemiBold",
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.black200
    },
    gicTabValue: {
        fontFamily: "EinaSemiBold",
        fontSize: 16,
        lineHeight: 16,
        color: COLORS.black500
    }
})