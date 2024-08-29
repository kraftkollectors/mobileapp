import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS } from '../../constants/themes/colors'

export default function StarRatingDisplay({ rating, starSize }) {
    return (
        <View style={styles.starDisplay}>
            <MaterialCommunityIcons name={rating >= 0.01 && rating < 1 ? "star-half-full" : rating >= 1 ? "star" : "star-outline"} size={starSize} color={COLORS.yellowStar} />

            <MaterialCommunityIcons name={rating >= 1.01 && rating < 2 ? "star-half-full" : rating >= 2 ? "star" : "star-outline"} size={starSize} color={COLORS.yellowStar} />

            <MaterialCommunityIcons name={rating >= 2.01 && rating < 3 ? "star-half-full" : rating >= 3 ? "star" : "star-outline"} size={starSize} color={COLORS.yellowStar} />

            <MaterialCommunityIcons name={rating >= 3.01 && rating < 4 ? "star-half-full" : rating >= 4 ? "star" : "star-outline"} size={starSize} color={COLORS.yellowStar} />

            <MaterialCommunityIcons name={rating >= 4.01 && rating < 5 ? "star-half-full" : rating >= 5 ? "star" : "star-outline"} size={starSize} color={COLORS.yellowStar} />

        </View>
    )
}

const styles = StyleSheet.create({
    starDisplay: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    }
})