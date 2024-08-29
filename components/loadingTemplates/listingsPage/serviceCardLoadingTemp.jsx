import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function ServiceCardLoadingTemp() {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceCardThumbnail}></View>

      <View style={styles.serviceCardDetailsBlock}>
        <View style={styles.serviceCardDetails}>
          <View style={styles.pcdTop}>
            <View style={styles.serviceCardTitle}></View>
            <View style={styles.serviceCardPrice}></View>
          </View>
          <View style={styles.pcdBottom}>
            <View style={styles.serviceCardLocation}></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  serviceCard: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serviceCardThumbnail: {
    width: 150,
    height: 120,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.black50,
  },
  serviceCardDetailsBlock: {
    width: screenWidth - (150 + 32),
    flexDirection: "row",
    gap: 8,
  },
  serviceElipsIcon: {
    width: 24,
    alignItems: "center",
  },
  serviceCardDetails: {
    width: screenWidth - (150 + 32 + 24 + 8),
    height: 120,
    gap: 12,
  },
  pcdTop: {
    width: "100%",
    gap: 12,
  },
  pcdBottom: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceCardTitle: {
    width: "100%",
    height: 14,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  serviceCardPrice: {
    width: "45%",
    height: 16,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  serviceCardLocation: {
    width: "65%",
    height: 12,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
});
