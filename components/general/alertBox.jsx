import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import React, { useEffect } from "react";
import { COLORS } from "../../constants/themes/colors";

export default function AlertBox({ status, heading, message, showAlert }) {
  useEffect(() => {
    setTimeout(() => {
      showAlert(false);
    }, 10000);
  });

  return (
    <View
      style={[
        styles.alertBox,

        status === "success"
          ? { borderColor: COLORS.greenSuccess }
          : { borderColor: COLORS.redWarning },
      ]}
    >
      <Text style={styles.alertHeading}>{heading}</Text>
      <Text style={styles.alertMsg}>{message}</Text>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;
const styles = StyleSheet.create({
  alertBox: {
    width: screenWidth - 16,
    minHeight: 60,
    height: "auto",
    borderRadius: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 1,
    borderBottomWidth: 4,
    padding: 8,
    gap: 4,
    backgroundColor: COLORS.whiteBG,
    position: "absolute",
    zIndex: 1000,
    top: 96,
    left: 8,
    right: 8,
  },
  alertHeading: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black900,
  },
  alertMsg: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black400,
  },
});
