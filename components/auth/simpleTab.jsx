import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import React from "react";
import { COLORS } from "../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function SimpleTab() {
  return (
    <View style={styles.dorTab}>
      <View style={styles.dorLine}></View>
      <Text style={styles.dorText}>or</Text>
      <View style={styles.dorLine}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  dorTab: {
    flexDirection: "row",
    gap: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  dorText: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black300,
  },
  dorLine: {
    height: 1,
    width: (screenWidth - (36 + 32)) / 2,
    backgroundColor: COLORS.black50,
  },
});
