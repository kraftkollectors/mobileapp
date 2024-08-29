import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function ListReviewCardLoadingTemp() {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewTop}>
        <View style={styles.reviewUserThumbnail}></View>
        <View style={styles.reviewUserDetails}>
          <View style={styles.reviewUserName}></View>
          <View style={styles.reviewDate}></View>
        </View>
      </View>
      <View style={{ gap: 10, marginTop: 16 }}>
        <View style={styles.reviewedBold}></View>
        <View style={styles.reviewedSkill}></View>
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
    paddingBottom: 32,
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
    backgroundColor: COLORS.black50,
    overflow: "hidden",
  },
  reviewUserDetails: {
    width: screenWidth - (32 + 8 + 40),
    gap: 8,
  },
  reviewUserName: {
    width: "70%",
    height: 14,
    backgroundColor: COLORS.black50,
    borderRadius: 20,
  },
  reviewDate: {
    width: "40%",
    height: 14,
    backgroundColor: COLORS.black50,
    borderRadius: 20,
  },
  reviewedBold: {
    width: "90%",
    height: 14,
    backgroundColor: COLORS.black50,
    borderRadius: 20,
  },
  reviewedSkill: {
    width: "75%",
    height: 14,
    backgroundColor: COLORS.black50,
    borderRadius: 20,
  },
});
