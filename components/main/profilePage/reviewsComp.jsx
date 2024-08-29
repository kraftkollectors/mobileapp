import { View, Text, Dimensions, StyleSheet } from 'react-native' 
import React from 'react' 
import { COLORS } from '../../../constants/themes/colors'; 
import SplitReviews from './subComp/splitReviews';
import StarRatingDisplay from '../../general/starRatingDisplay';
import { ROUNDTO } from '../../../constants/utilities';
import ReviewCard from './subComp/reviewCard';

export default function ReviewsComp() {
    //DEMO DATA
    const totalReviews = 400;
    //DEMO DATA
    const reviewRatings = [
        {
            'rate': 5,
            'value': 300
        },
        {
            'rate': 4,
            'value': 50
        },
        {
            'rate': 3,
            'value': 10
        },
        {
            'rate': 2,
            'value': 10
        },
        {
            'rate': 1,
            'value': 30
        }
    ];
    //CALCULATE AVERAGE
    let aggr = 0;
    reviewRatings.forEach(item => {
        aggr += Number(item.rate * item.value);
    })

    var finalAvr = ROUNDTO((aggr / totalReviews), 1).toFixed(1);

    const overallRating = finalAvr;

    //REVIEWS
    const reviewList = ['1','2','3','4'];

    return (
        <View style={styles.reviewComp}>
            {/**TOP PREVIEW */} 
            <View style={styles.rcTop}> 
                <Text style={styles.reviewHeadCount}>{totalReviews} Reviews</Text>
                {/** */}
                <View style={{gap: 4}}>
                    <Text style={styles.rcTopOverall}>Overall rating</Text>
                    {/** */}
                    <View style={styles.rcTopAvgTab}>
                        <Text style={styles.rcTopAvg}>{overallRating}</Text> 
                        <StarRatingDisplay rating={overallRating} starSize={20} />
                    </View>
                    {/** */}
                    <SplitReviews totalReviews={totalReviews} reviewRatings={reviewRatings} />
                </View>
                {/** */}
            </View>

            {/**REVIEWS LIST */}
            <View>
            {
                reviewList ? 
                reviewList.map((item, index) => <ReviewCard key={index} />) :
                <></>
            }
            </View>
        </View>
    )
}

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    reviewComp: {
        width: "100%",
        paddingHorizontal: 16,
        gap: 10,
        backgroundColor: COLORS.whiteBG
    },
    rcTop: {
        width: "100%",
        paddingVertical: 16,
        gap: 12
    },
    reviewHeadCount: {
        fontFamily: "EinaBold",
        fontSize: 24,
        lineHeight: 28,
        color: COLORS.black900
    },
    rcTopOverall: {
        fontFamily: "EinaSemiBold",
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.black400
    },
    rcTopAvgTab: {
        flexDirection: "row",
        gap: 16,
        alignItems: "center"
    },
    rcTopAvg: {
        fontFamily: "EinaBold",
        fontSize: 20,
        lineHeight: 28,
        color: COLORS.black900
    }
})