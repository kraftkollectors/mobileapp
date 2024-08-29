import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function RecommendCardLoadingTemp() {
  return (
    <View style={styles.postCard}>
      <View style={styles.postCardThumbnail}></View>

      <View style={styles.postCardDetails}>
        <View style={styles.pcdTop}>
          <View style={styles.postCardTitle}></View>
          <View style={styles.postCardPrice}></View>
        </View>
        <View style={styles.pcdBottom}>
          <View style={styles.postCardLocation}></View>
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  postCard: {
    width: "100%",
    height: 120,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: "row",
    alignItems: "center",
  },
  postCardThumbnail: {
    width: 150,
    height: 120,
    overflow: "hidden",
    backgroundColor: COLORS.black50,
  },
  postCardDetails: {
    width: screenWidth - (150 + 16),
    height: 120,
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
    width: "85%",
    height: 14,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  postCardPrice: {
    width: "45%",
    height: 14,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  postCardLocation: {
    width: "35%",
    height: 12,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
});
