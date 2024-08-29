import { View, StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function ServiceLoadingTemp() {
  return (
    <View style={styles.serviceTab}>
      <View style={styles.serviceThumbnail}></View>

      <View style={styles.serviceDetails}>
        <View style={{ gap: 8 }}>
          <View style={styles.servicePrice}></View>
          <View style={styles.serviceTitle}></View>
        </View>
        <View style={styles.serviceLocation}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceTab: {
    width: 191,
    height: 240,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.whiteBG,
  },
  serviceThumbnail: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.black50,
  },
  serviceDetails: {
    width: "100%",
    height: 120,
    padding: 8,
    gap: 8,
    justifyContent: "space-between",
  },
  servicePrice: {
    width: "45%",
    height: 16,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  serviceTitle: {
    width: "85%",
    height: 12,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  serviceLocation: {
    width: "30%",
    height: 10,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
});
