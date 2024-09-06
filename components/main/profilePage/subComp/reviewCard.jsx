import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../../../constants/themes/colors";
import StarRatingDisplay from "../../../general/starRatingDisplay";
import { useRouter } from "expo-router";
import {
  FETCH_SERVICE_DATA,
  FETCH_SERVICE_USER,
} from "../../../../hooks/requests";
import {
  FORMAT_DATE_SLASH,
  FORMATNUMBERWITHCOMMA,
  LOAD_PROFILE_THUMBNAIL,
  LOAD_SERVICE_THUMBNAIL,
} from "../../../../constants/utilities";

export default function ReviewCard({ data }) {
  const router = useRouter();

  const [reviewerDataIsLoading, setReviewerDataIsLoading] = useState(false);
  const [reviewerData, setReviewerData] = useState();

  const [serviceDataIsLoading, setServiceDataIsLoading] = useState(false);
  const [serviceData, setServiceData] = useState();

  //GOTO PROFILE
  function goToProfile() {
    router.push(`/main/profile/?_id=${reviewerData?._id}`);
  }

  //GO TO SERVICE
  function goToService() {
    router.push(`/main/service/?_id=${serviceData?._id}`);
  }

  return (
    <View
      onLayout={() => {
        FETCH_SERVICE_USER(
          data?.reviewerId,
          setReviewerData,
          setReviewerDataIsLoading,
          () => {}
        );

        FETCH_SERVICE_DATA(
          data?.serviceId,
          setServiceData,
          setServiceDataIsLoading,
          () => {}
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

        <TouchableOpacity
          onPress={() => {
            goToService();
          }}
          style={styles.reviewService}
        >
          <View style={styles.reviewServiceThumbnail}>
            <Image
              source={LOAD_SERVICE_THUMBNAIL(serviceData?.coverPhoto)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </View>

          <View style={{ gap: 8, width: "100%" }}>
            <Text style={styles.reviewServiceTag}>Reviewed</Text>
            <View style={{ gap: 4, width: "100%" }}>
              <Text style={styles.reviewServiceTitle} numberOfLines={1}>
                {serviceData?.title}
              </Text>
              {serviceData && (
                <Text style={styles.reviewServicePrice}>
                  N{FORMATNUMBERWITHCOMMA(serviceData?.estimatedPrice)} /{" "}
                  {serviceData?.charge}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
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
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  reviewBlock: {
    width: "100%",
    gap: 12,
  },
  reviewText: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black400,
  },
  reviewService: {
    width: "100%",
    flexDirection: "row",
    gap: 16,
  },
  reviewServiceThumbnail: {
    width: 140,
    height: 84,
    borderRadius: 2.14,
    backgroundColor: COLORS.gray100,
    overflow: "hidden",
  },
  reviewServiceTag: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  reviewServiceTitle: {
    width: screenWidth - (140 + 32 + 16),
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  reviewServicePrice: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black600,
  },
});
