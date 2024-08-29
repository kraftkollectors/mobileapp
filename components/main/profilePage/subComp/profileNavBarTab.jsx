import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";

export default function ProfileNavBarTab({ tabTitle, isActive, handleClick }) {
  return (
    <TouchableOpacity
      onPress={handleClick}
      style={[
        styles.navBTab,
        isActive
          ? { borderBottomColor: COLORS.blueNormal }
          : { borderBottomColor: "transparent" },
      ]}
    >
      <Text
        style={[
          styles.navBText,
          isActive ? { color: COLORS.black900 } : { color: COLORS.black300 },
        ]}
      >
        {tabTitle}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navBTab: {
    width: "auto",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderBottomWidth: 2,
  },
  navBText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 16,
    lineHeight: 24,
    textTransform: "capitalize",
  },
});
