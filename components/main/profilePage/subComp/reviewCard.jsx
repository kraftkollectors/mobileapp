import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import React from 'react'
import { COLORS } from '../../../../constants/themes/colors'
import StarRatingDisplay from '../../../general/starRatingDisplay'

export default function ReviewCard() {
    const userReview = "Lorem ipsum dolor sit amet consectetur. Purus sollicitudin bibendum orci neque augue non pulvinar volutpat. Sollicitudin lacus natoque amet integer. Sed magna lectus consectetur commodo quam aliquam. Ac nibh mi proin lacus tellus.";

    return (
        <View style={styles.reviewCard}>
            <View style={styles.reviewTop}>
                <View style={styles.reviewUserThumbnail}><Image source={require("../../../../assets/photos/no-profile.png")} style={{width: "100%", height: "100%", objectFit: "cover"}} /></View>
                <View style={styles.reviewUserDetails}>
                    <Text style={styles.reviewUserName}>Ayomide Joy Amber</Text>
                    <Text style={styles.reviewDate}>12/05/2024</Text>
                </View>
            </View>
            {/**REVIEW BLOCK */}
            <View style={styles.reviewBlock}>
                <View style={{gap: 4}}>
                    <StarRatingDisplay rating={4} starSize={16} />
                    <Text style={styles.reviewText}>{userReview}</Text>
                </View>

                <View style={styles.reviewService}>
                    <View style={styles.reviewServiceThumbnail}><Image source={require("../../../../assets/photos/no-service.png")} style={{width: "100%", height: "100%", objectFit: "cover"}} /></View>

                    <View style={{gap: 8}}>
                        <Text style={styles.reviewServiceTag}>Reviewed</Text>
                        <View style={{gap: 4}}>
                            <Text style={styles.reviewServiceTitle}>DJ Sets</Text>
                            <Text style={styles.reviewServicePrice}>N20,000 / session</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    reviewCard: {
        width: "100%",
        paddingVertical: 16,
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.black50
    },
    reviewTop: {
        width: "100%",
        flexDirection: "row",
        gap: 8
    },
    reviewUserThumbnail: {
        width: 48,
        height: 48,
        borderRadius: 40,
        backgroundColor: COLORS.gray100,
        overflow: "hidden"
    },
    reviewUserDetails: {
        gap: 4
    },
    reviewUserName: {
        fontFamily: "EinaSemiBold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black900
    },
    reviewDate: {
        fontFamily: "EinaSemiBold",
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.black300
    },
    reviewBlock: {
        gap: 12
    },
    reviewText: {
        fontFamily: "EinaRegular",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black400
    },
    reviewService: {
        width: "100%",
        flexDirection: "row",
        gap: 16
    },
    reviewServiceThumbnail: {
        width: 140,
        height: 84,
        borderRadius: 2.14,
        backgroundColor: COLORS.gray100,
        overflow: "hidden"
    },
    reviewServiceTag: {
        fontFamily: "EinaSemiBold",
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.black300
    },
    reviewServiceTitle: {
        fontFamily: "EinaRegular",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black900
    },
    reviewServicePrice: {
        fontFamily: "EinaBold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black600
    }
})