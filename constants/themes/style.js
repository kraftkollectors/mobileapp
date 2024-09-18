import { Dimensions, Platform, StyleSheet } from "react-native";

export const screenWidth = Dimensions.get("screen").width;
export const screenHeight = Dimensions.get("screen").height;

export const AppStyle = StyleSheet.create({
  safeArea: {
    width: screenWidth,
    height: Platform.OS === "ios" ? screenHeight + 32 : screenHeight,
    flex: 1,
  },
});
