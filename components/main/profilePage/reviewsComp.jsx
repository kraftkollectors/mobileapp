import { View, Text, Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/themes/colors";
import SplitReviews from "./subComp/splitReviews";
import StarRatingDisplay from "../../general/starRatingDisplay";
import { ROUNDTO } from "../../../constants/utilities";
import ReviewCard from "./subComp/reviewCard";
import ListReviewCardLoadingTemp from "../../loadingTemplates/listingsPage/reviewCardLoadingTemp";
import {
  FETCH_ARTISAN_REVIEWS,
  FETCH_ARTISAN_REVIEWS_COUNT,
} from "../../../hooks/requests";

export default function ReviewsComp({ profile }) {
  const [reviewList, setReviewList] = useState();
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const [reviewRatingsRaw, setReviewRatingsRaw] = useState();
  const [reviewRatings, setReviewRatings] = useState();
  const [totalReviews, setTotalReviews] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [reviewsRatingLoading, setReviewsRatingLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      FETCH_ARTISAN_REVIEWS(
        profile?._id,
        setReviewsLoading,
        setReviewList,
        false
      );

      FETCH_ARTISAN_REVIEWS_COUNT(
        profile?._id,
        setReviewsRatingLoading,
        setReviewRatingsRaw,
        setTotalReviews
      );
    }
  }, [profile]);

  useEffect(() => {
    if (reviewRatingsRaw) {
      let cloneArr = [
        {
          value: 1,
          rate: reviewRatingsRaw["1"],
        },
        {
          value: 2,
          rate: reviewRatingsRaw["2"],
        },
        {
          value: 3,
          rate: reviewRatingsRaw["3"],
        },
        {
          value: 4,
          rate: reviewRatingsRaw["4"],
        },
        {
          value: 5,
          rate: reviewRatingsRaw["5"],
        },
      ];

      setReviewRatings(cloneArr);
    }
  }, [reviewRatingsRaw]);

  useEffect(() => {
    if (reviewRatings) {
      //CALCULATE AVERAGE
      let aggr = 0;

      reviewRatings.forEach((item) => {
        aggr += Number(item.value * item.rate);
      });

      var finalAvr = ROUNDTO(aggr / totalReviews, 1).toFixed(1);

      setOverallRating(finalAvr);
    }
  }, [reviewRatings]);

  return (
    <View style={styles.reviewComp}>
      {/**TOP PREVIEW */}
      <View style={styles.rcTop}>
        <Text style={styles.reviewHeadCount}>{totalReviews} Reviews</Text>
        {/** */}
        <View style={{ gap: 4 }}>
          <Text style={styles.rcTopOverall}>Overall rating</Text>
          {/** */}
          <View style={styles.rcTopAvgTab}>
            <Text style={styles.rcTopAvg}>{overallRating}</Text>
            <StarRatingDisplay rating={overallRating} starSize={20} />
          </View>
          {/** */}
          <SplitReviews
            totalReviews={totalReviews}
            reviewRatings={reviewRatings}
          />
        </View>
        {/** */}
      </View>

      {/**REVIEWS LIST */}
      <View>
        {reviewList && reviewList.length > 0 ? (
          reviewList.map((item, index) => (
            <ReviewCard key={index} data={item} />
          ))
        ) : (
          <>
            {reviewsLoading ? (
              <>
                <ListReviewCardLoadingTemp />
                <ListReviewCardLoadingTemp />
              </>
            ) : (
              <View
                style={{
                  width: "100%",
                  height: 240,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "EinaSemiBold",
                    fontSize: 14,
                    color: COLORS.black300,
                    textAlign: "center",
                  }}
                >
                  No reviews found
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  reviewComp: {
    width: "100%",
    paddingHorizontal: 16,
    gap: 10,
    backgroundColor: COLORS.whiteBG,
  },
  rcTop: {
    width: "100%",
    paddingVertical: 16,
    gap: 12,
  },
  reviewHeadCount: {
    fontFamily: "EinaBold",
    fontSize: 24,
    lineHeight: 28,
    color: COLORS.black900,
  },
  rcTopOverall: {
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black400,
  },
  rcTopAvgTab: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  rcTopAvg: {
    fontFamily: "EinaBold",
    fontSize: 20,
    lineHeight: 28,
    color: COLORS.black900,
  },
});
