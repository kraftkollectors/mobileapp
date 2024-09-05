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
  LOAD_PROFILE_THUMBNAIL,
} from "../../../../constants/utilities";

export default function ListReviewCard({ data }) {
  const router = useRouter();

  const [reviewerDataIsLoading, setReviewerDataIsLoading] = useState(false);
  const [reviewerData, setReviewerData] = useState();

  const [serviceDataIsLoading, setServiceDataIsLoading] = useState(false);
  const [serviceData, setServiceData] = useState();

  //GOTO PROFILE
  function goToProfile() {
    router.navigate(`/main/profile?_id=${reviewerData?._id}`);
  }

  //GO TO SERVICE
  function goToService() {
    router.navigate(`/main/service?_id=${serviceData?._id}`);
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {reviewerDataIsLoading || !reviewerData ? (
              <View style={styles.reviewUserNameLoading}></View>
            ) : (
              <Text numberOfLines={1} style={styles.reviewUserName}>
                {reviewerData?.firstName} {reviewerData?.lastName}
              </Text>
            )}
            {
              //CHECK IF USER VEIRIFIED
            }
            {reviewerData?.isArtisan && (
              <Image
                source={require("../../../../assets/icons/verified.png")}
                style={{ width: 16, height: 16, objectFit: "cover" }}
              />
            )}
          </View>
          <Text style={styles.reviewDate}>
            {FORMAT_DATE_SLASH(data?.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={{ gap: 4 }}>
        <Text style={styles.reviewedBold}>Reviewed</Text>
        <TouchableOpacity
          onPress={() => {
            goToService();
          }}
        >
          <Text style={styles.reviewedSkill}>{serviceData?.title}</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    backgroundColor: COLORS.whiteBG,
  },
  reviewTop: {
    width: "100%",
    flexDirection: "row",
    gap: 8,
  },
  reviewUserThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: COLORS.gray100,
    overflow: "hidden",
  },
  reviewUserDetails: {
    gap: 4,
  },
  reviewUserName: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black900,
  },
  reviewDate: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  reviewedBold: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  reviewedSkill: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black900,
  },
  reviewBlock: {
    gap: 12,
  },
  reviewText: {
    fontFamily: "EinaRegular",
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black500,
  },
  reviewUserNameLoading: {
    height: 14,
    width: "70%",
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
});
