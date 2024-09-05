import { View, StyleSheet } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function ServiceDetailsLoadingTemp() {
  return (
    <View style={styles.serviceDetailComp}>
      <View style={styles.sdcTop}>
        <View style={styles.serviceTitle}></View>
        <View style={styles.servicePrice}></View>

        <View style={styles.serviceCategoryTab}>
          <View style={styles.serviceCategory}></View>
          <View style={styles.serviceCategorySplit}></View>
          <View style={styles.serviceCategory}></View>
        </View>
      </View>

      <View style={styles.sdcBtm}>
        <View style={styles.serviceDesc}></View>
        <View style={styles.serviceDesc}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceDetailComp: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    paddingVertical: 17,
    paddingHorizontal: 16,
  },
  sdcTop: {
    width: "100%",
    paddingVertical: 12,
    paddingBottom: 16,
    marginBottom: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  serviceTitle: {
    width: "85%",
    height: 18,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  servicePrice: {
    width: "25%",
    height: 14,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  sdcBtm: {
    width: "100%",
    paddingVertical: 12,
    gap: 8,
  },
  serviceDesc: {
    width: "100%",
    height: 10,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  serviceCategoryTab: {
    width: "auto",
    alignSelf: "flex-start",
    height: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: COLORS.gray200,
  },
  serviceCategory: {
    width: 80,
    height: 8,
    borderRadius: 20,
    backgroundColor: COLORS.black100,
  },
  serviceCategorySplit: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.black100,
  },
});
