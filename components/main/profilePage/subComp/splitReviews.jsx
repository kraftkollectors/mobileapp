import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Octicons } from '@expo/vector-icons';
import { COLORS } from '../../../../constants/themes/colors';


const SplitRevTab = ({ data, total }) => {
    let level = ((data.value / total) * 100);

    return (
        <View style={styles.srTab}>
            <View style={styles.groupTab}>
                <Text style={styles.groupType}>{data.rate}</Text>
                <Octicons name="star-fill" size={12} color={COLORS.black400} />
            </View>

            <View style={styles.percentTrack}>
                <View style={[styles.percentLevel, {width: level>0 ? `${level}%` : 0}]}></View>
            </View>

            <Text style={styles.curTotal}>{data.value}</Text>
        </View>
    )
}
export default function SplitReviews({ totalReviews, reviewRatings }) {

    return (
        <View style={styles.splitBlock}>
        {
            reviewRatings ? 
            reviewRatings.map((item, index) => <SplitRevTab key={index} data={item} total={totalReviews} />) :
            <></>
        }
           

        </View>
    )
}

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    splitBlock: {
        width: "100%",
        paddingHorizontal: 8,
        gap: 4
    },
    srTab: {
        width: "100%",
        height: 24,
        gap: 14,
        flexDirection: "row",
        alignItems: "center"
    },
    curTotal: {
        fontFamily: "EinaRegular",
        fontSize: 16,
        lineHeight: 21,
        color: COLORS.black900
    },
    groupTab: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    groupType: {
        fontFamily: "EinaSemiBold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black400
    },
    percentTrack: {
        width: (screenWidth - (16 + 28 + 16 + 30 + 42)),
        height: 6,
        borderRadius: 8,
        backgroundColor: COLORS.gray300
    },
    percentLevel: {
        height: 6,
        borderRadius: 8,
        backgroundColor: COLORS.yellowStar
    }
})