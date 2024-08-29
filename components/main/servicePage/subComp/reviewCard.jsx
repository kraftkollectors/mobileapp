import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../../../constants/themes/colors";
import StarRatingDisplay from "../../../general/starRatingDisplay";
import {
  FORMAT_DATE_SLASH,
  LOAD_PROFILE_THUMBNAIL,
} from "../../../../constants/utilities";
import { FETCH_SERVICE_USER } from "../../../../hooks/requests";
import { useRouter } from "expo-router";

export default function ServiceReviewCard({ data }) {
  const router = useRouter();

  const [reviewerDataIsLoading, setReviewerDataIsLoading] = useState(false);
  const [reviewerData, setReviewerData] = useState();

  //GOTO PROFILE
  function goToProfile() {
    router.navigate(`/main/profile?_id=${reviewerData?._id}`);
  }

  return (
    <View
      onLayout={() => {
        FETCH_SERVICE_USER(
          data?.reviewerId,
          setReviewerData,
          setReviewerDataIsLoading
        );
      }}
      style={styles.reviewCard}
    >
      <TouchableOpacity
        onPress={() => {
          goToProfile();
        }}
        style={styles.reviewTop}
      >
        <View style={styles.reviewUserThumbnail}>
          <Image
            source={LOAD_PROFILE_THUMBNAIL(reviewerData?.image)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </View>
        <View style={styles.reviewUserDetails}>
          <Text style={styles.reviewUserName}>
            {reviewerData?.firstName} {reviewerData?.lastName}
          </Text>
          <Text style={styles.reviewDate}>
            {FORMAT_DATE_SLASH(data?.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
      {/**REVIEW BLOCK */}
      <View style={styles.reviewBlock}>
        <View style={{ gap: 4 }}>
          <StarRatingDisplay rating={data?.rating} starSize={16} />
          <Text style={styles.reviewText}>{data?.review}</Text>
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  reviewCard: {
    width: "100%",
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  reviewTop: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  reviewUserThumbnail: {
    width: 48,
    height: 48,
    borderRadius: 40,
    backgroundColor: COLORS.gray100,
    overflow: "hidden",
  },
  reviewUserDetails: {
    gap: 4,
  },
  reviewUserName: {
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  reviewDate: {
    fontFamily: "EinaRegular",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  reviewBlock: {
    gap: 12,
  },
  reviewText: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black500,
  },
});
