import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";

export default function ServiceLoadingTemp() {
  return (
    <View style={styles.postCard}>
      <View style={styles.postCardThumbnail}></View>

      <View style={styles.postCardDetails}>
        <View style={styles.pcdTop}>
          <View style={styles.postCardTitle}></View>
          <View style={styles.postCardPrice}></View>
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  postCard: {
    width: screenWidth - 32,
    height: 120,
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
    height: 120,
    overflow: "hidden",
    backgroundColor: COLORS.black50,
  },
  postCardDetails: {
    width: screenWidth - (150 + 32),
    height: 120,
    gap: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  pcdTop: {
    width: "100%",
    gap: 12,
  },
  postCardTitle: {
    width: "90%",
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.black50,
  },
  postCardPrice: {
    width: "50%",
    height: 14,
    borderRadius: 8,
    backgroundColor: COLORS.black50,
  },
});
