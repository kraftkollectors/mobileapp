import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import {
  FORMATNUMBERWITHCOMMA,
  LOAD_SERVICE_THUMBNAIL,
} from "../../../../constants/utilities";
import { useRouter } from "expo-router";

export default function ResultServiceTab({ data }) {
  const router = useRouter();

  //GO TO SERVICE
  function goToService() {
    router.navigate(`/main/service?_id=${data?._id}&ref=search`);
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
              : "------"}
          </Text>
        </View>
        <View style={styles.pcdBottom}>
          <Octicons name="location" size={16} color={COLORS.black200} />
          <Text style={styles.postCardLocation}>{data?.state}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  postCard: {
    width: "100%",
    height: Platform.OS === "ios" ? 150 : 120,
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  postCardThumbnail: {
    width: 150,
    height: "100%",
    overflow: "hidden",
    backgroundColor: COLORS.gray100,
  },
  postCardDetails: {
    width: screenWidth - (150 + 32),
    height: "100%",
    justifyContent: "space-between",
    gap: 12,
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
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
    textTransform: "capitalize",
  },
  postCardPrice: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  postCardLocation: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black200,
    textTransform: "capitalize",
  },
});
