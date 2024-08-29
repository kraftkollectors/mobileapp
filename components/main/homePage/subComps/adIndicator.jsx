import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS } from '../../../../constants/themes/colors';

export default function AdIndicator({ totalDots, activeDot }) {
    
    let dotComp = [];
    for(let i = 1; i < totalDots+1; i++){
        dotComp.push(i);
    }

    return (
        <View style={styles.indicatorCont}>
        {
            dotComp.map(item => <View key={item} style={[styles.indicatorDot, item == activeDot ? {backgroundColor: COLORS.black500} : {backgroundColor: COLORS.black100}]}></View>)
        }
        </View>
    )
}

const styles = StyleSheet.create({
    indicatorCont: {
        width: "auto",
        flexDirection: "row",
        gap: 8
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4
    }
})