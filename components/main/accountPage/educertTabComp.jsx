import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../../constants/themes/colors'
import SimpleTabOption from '../../general/simpleTabOption'


export default function EducertTabComp({ data, typeName, showOptions, handleOptionVisibility, tab, visibleIndex, confirmDelete, commenceEdit }) {

    return (
        <View style={styles.eduTab}>
            <View style={styles.eduTopBar}>
                <Text style={styles.eduTitle}>{typeName}</Text>

                <TouchableOpacity onPress={handleOptionVisibility} style={styles.eduEllipsis}>
                    <Ionicons name="ellipsis-vertical" size={16} color={COLORS.black500} />
                </TouchableOpacity>

                {
                    showOptions && (visibleIndex == tab) ? 
                    <SimpleTabOption confirmDelete={()=>{confirmDelete(); handleOptionVisibility()}} commenceEdit={commenceEdit} /> :  
                    <></>
                }
            </View>

            <View style={{gap: 8}}>
                <Text style={styles.eduText1}>{typeName.toLowerCase() === "certification" ? data?.certificate : data?.university}</Text>
                <Text style={styles.eduText2}>{typeName.toLowerCase() === "certification" ? data?.certifiedBy : `${data?.degree} - ${data?.areaOfStudy}`}</Text>
                <Text style={styles.eduText2}>Year of Graduation - {data?.year}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    eduTab: {
        width: "100%",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.black50,
        gap: 12
    },
    eduTopBar: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative"
    },
    eduTitle: {
        fontFamily: "EinaBold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black900,
        textTransform: "capitalize"
    },
    eduEllipsis: {
        width: 24,
        height: 24
    },
    eduText1: {
        fontFamily: "EinaRegular",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black900
    },
    eduText2: {
        fontFamily: "EinaSemiBold",
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.black300
    }
})