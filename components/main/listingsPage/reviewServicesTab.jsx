import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ListReviewCard from "./subComp/reviewCard";
import { FETCH_ARTISAN_REVIEWS } from "../../../hooks/requests";
import ListReviewCardLoadingTemp from "../../loadingTemplates/listingsPage/reviewCardLoadingTemp";
import { COLORS } from "../../../constants/themes/colors";

export default function ReviewServicesTab({ userData }) {
  //DUMMY DATA
  const [reviewList, setReviewList] = useState();
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      FETCH_ARTISAN_REVIEWS(
        userData?._id,
        setReviewsLoading,
        setReviewList,
        false
      );
    }
  }, [userData]);

  return (
    <View>
      {reviewList && reviewList.length > 0 ? (
        reviewList.map((item, index) => (
          <ListReviewCard key={index} data={item} />
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
  );
}
