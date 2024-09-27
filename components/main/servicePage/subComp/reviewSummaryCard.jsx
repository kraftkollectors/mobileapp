import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../../constants/themes/colors";
import StarRatingDisplay from "../../../general/starRatingDisplay";
import { ROUNDTO } from "../../../../constants/utilities";
import ServiceReviewCard from "./reviewCard";
import ServiceSplitReviews from "./splitReviews";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  CheckLoginStatus,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../../constants/utilities/localStorage";

export default function ReviewSummaryCard({
  serviceId,
  rateModal,
  showRateModal,
  userData,
  serviceData,
}) {
  //CHECK IF LOGGED IN OR NOT
  const router = useRouter();
  const [isLogged, setIsLogged] = useState("");
  const [makeReview, setMakeReview] = useState(false);

  useEffect(() => {
    if (isLogged === "logged" || isLogged === "not-verified") {
      if (makeReview) {
        showRateModal(true);
        setMakeReview(false);
      }
    } else if (isLogged === "not-logged" && makeReview) {
      setMakeReview(false);
      router.push("/auth/signin/");
    } else {
      //SAVE CURRENT PATH
      StoreDataToMemory(
        LOCAL_STORAGE_PATH.redirectPath,
        `/main/service?_id=${serviceData?._id}`
      );

      //CHECK LOGIN STATUS
      CheckLoginStatus(setIsLogged);
    }
  }, [isLogged, makeReview, userData, serviceData]);
  //////
  //REVIEWS
  const [ratingsData, setRatingsData] = useState();
  const [totalReviews, setTotalReviews] = useState(0);
  const [overallRating, setOverallRating] = useState(0);

  //PAGINATION
  const [currentPgn, setCurPgn] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadMore, setLoadMore] = useState(false);

  //FETCH SERVICE RATINGS
  useEffect(() => {
    axios
      .get(END_POINT.getServiceRatings(serviceId, 1))
      .then((res) => {
        //MAIN DATA IN res.data.data.existingRecords
        let finalRes = res.data.data;

        if (res.data.statusCode === 201) {
          //GET TOTAL REVIEWS
          setTotalReviews(finalRes.totalDocuments);
          //GET RATINGS DATA
          setRatingsData(finalRes?.existingRecords);
          //GET CURRENT PAGE NUM
          setCurPgn(finalRes.currentPage);

          //CHECK IF LAST PAGE
          setHasNextPage(finalRes.hasNextPage);
        }
      })
      .catch((err) => {
        console.log("Error: ", err.response.data);
      });
  }, [rateModal]);

  useEffect(() => {
    if (loadMore) {
      setHasNextPage(false);

      axios
        .get(END_POINT.getServiceRatings(serviceId, currentPgn + 1))
        .then((res) => {
          //MAIN DATA IN res.data.data.existingRecords
          let finalRes = res.data.data;

          if (res.data.statusCode === 201) {
            //GET TOTAL REVIEWS
            setTotalReviews(finalRes.totalDocuments);
            //GET RATINGS DATA
            if (loadMore) {
              let newList = finalRes.existingRecords;
              setRatingsData((prev) => [...prev, ...newList]);
            } else {
              setRatingsData(finalRes?.existingRecords);
            }
            //GET CURRENT PAGE NUM
            setCurPgn(finalRes.currentPage);

            setTimeout(() => {
              //CHECK IF LAST PAGE
              setHasNextPage(finalRes.hasNextPage);

              setLoadMore(false);
            }, 1500);
          }
        })
        .catch((err) => {
          setLoadMore(false);
        });
    }
  }, [loadMore]);

  //STORE RATINGS
  const rateTemplate = [
    {
      rate: 1,
      value: 0,
    },
    {
      rate: 2,
      value: 0,
    },
    {
      rate: 3,
      value: 0,
    },
    {
      rate: 4,
      value: 0,
    },
    {
      rate: 5,
      value: 0,
    },
  ];

  const [reviewRatings, setReviewRatings] = useState();

  useEffect(() => {
    if (ratingsData) {
      //console.log("Current Ratings: ", ratingsData);
      setReviewRatings(rateTemplate);

      ratingsData.forEach((ratingD, index) => {
        setReviewRatings((prev) =>
          prev.map((item) =>
            item.rate === ratingD?.rating
              ? { ...item, value: item.value + 1 }
              : item
          )
        );
      });
    }
  }, [ratingsData]);

  useEffect(() => {
    if (reviewRatings) {
      //CALCULATE AVERAGE
      let aggr = 0;
      reviewRatings.forEach((item) => {
        aggr += Number(item.rate * item.value);
      });

      var finalAvr = ROUNDTO(aggr / totalReviews, 1).toFixed(1);

      setOverallRating(finalAvr);
    }
  }, [reviewRatings]);

  return (
    <View style={styles.reviewComp}>
      {/**TOP PREVIEW */}
      <View style={styles.rcTop}>
        <Text style={styles.reviewHeadCount}>
          {totalReviews} Review{totalReviews > 1 && "s"}
        </Text>
        {/** */}
        <View style={{ gap: 4 }}>
          <Text style={styles.rcTopOverall}>Overall rating</Text>
          {/** */}
          <View style={styles.rcTopAvgTab}>
            <Text style={styles.rcTopAvg}>
              {isNaN(overallRating) ? 0 : overallRating}
            </Text>
            <StarRatingDisplay rating={overallRating} starSize={20} />
          </View>
          {/** */}
          <ServiceSplitReviews
            totalReviews={totalReviews}
            reviewRatings={reviewRatings}
          />
        </View>
        {/** */}
        <>
          {userData?._id != serviceData?.userId && (
            <TouchableOpacity
              onPress={() => {
                setMakeReview(true);
              }}
              style={styles.writeReviewBtn}
            >
              {makeReview ? (
                <ActivityIndicator size={16} color={COLORS.black400} />
              ) : (
                <Text style={styles.writeReviewBtnText}>Write a review</Text>
              )}
            </TouchableOpacity>
          )}
        </>
      </View>

      {/**REVIEWS LIST */}
      <View>
        {ratingsData ? (
          <>
            {ratingsData.map((item, index) => (
              <ServiceReviewCard key={index} data={item} />
            ))}

            {hasNextPage && (
              <View style={styles.hasNxtPgTab}>
                {loadMore ? (
                  <TouchableOpacity style={styles.loadMoreBtn}>
                    <ActivityIndicator size={20} color={COLORS.black400} />

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={19}
                      color={COLORS.black400}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setLoadMore(true);
                    }}
                    style={styles.loadMoreBtn}
                  >
                    <Text style={styles.loadMoreBtnText}>Load more</Text>

                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={19}
                      color={COLORS.black400}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        ) : (
          <></>
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
  writeReviewBtn: {
    width: 164,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  writeReviewBtnText: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  loadMoreBtn: {
    width: 120,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadMoreBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black400,
  },
  hasNxtPgTab: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },
});
