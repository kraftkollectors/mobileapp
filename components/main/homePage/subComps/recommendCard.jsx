import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import {
  FORMATNUMBERWITHCOMMA,
  LOAD_SERVICE_THUMBNAIL,
} from "../../../../constants/utilities";
import { useRouter } from "expo-router";

export default function RecommendCard({ data }) {
  const router = useRouter();

  //SERVICE DETAILS
  function goToService() {
    router.navigate(`/main/service?_id=${data?._id}`);
  }

  return (
    <TouchableOpacity
      onPress={() => {
        goToService();
      }}
      style={styles.postCard}
    >
      <View style={styles.postCardThumbnail}>
        <Image
          source={LOAD_SERVICE_THUMBNAIL(data?.coverPhoto)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </View>

      <View style={styles.postCardDetails}>
        <View style={styles.pcdTop}>
          <Text style={styles.postCardTitle} numberOfLines={2}>
            {data?.title}
          </Text>
          <Text style={styles.postCardPrice}>
            N{" "}
            {data.estimatedPrice
              ? FORMATNUMBERWITHCOMMA(data?.estimatedPrice)
              : "------"}{" "}
            <Text style={styles.postCardCharge}>- {data?.charge}</Text>
          </Text>
        </View>
        <View style={styles.pcdBottom}>
          <Octicons name="location" size={16} color={COLORS.black200} />
          <Text style={styles.postCardLocation} numberOfLines={1}>
            {data?.state}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  postCard: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.whiteBG,
    borderRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: "row",
    alignItems: "center",
  },
  postCardThumbnail: {
    width: 150,
    height: 120,
    borderRadius: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.gray100,
  },
  postCardDetails: {
    width: screenWidth - (150 + 16),
    height: 120,
    gap: 12,
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  pcdTop: {
    width: "100%",
    gap: 4,
  },
  pcdBottom: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  postCardTitle: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black400,
    textTransform: "capitalize",
  },
  postCardPrice: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  postCardCharge: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black200,
    textTransform: "capitalize",
  },
  postCardLocation: {
    width: screenWidth - (16 + 4 + 150 + 16 + 32),
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black200,
    textTransform: "capitalize",
  },
});
