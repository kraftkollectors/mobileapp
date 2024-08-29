import React from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { COLORS } from "../../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export const styles = StyleSheet.create({
  pageSection: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: COLORS.black50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  notificationSubTitle: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  workHoursTab: {
    width: (screenWidth - (32 + 8)) / 2,
  },
  supportSocialBlock: {
    width: "auto",
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  supportSocialText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  supportSocialIconBlock: {
    width: "auto",
    flexDirection: "row",
    gap: 12,
  },
  supportSocialIcon: {
    width: 32,
    height: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.black100,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataFoundTab: {
    width: "100%",
    height: "100%",
    minHeight: 150,
    backgroundColor: COLORS.whiteBG,
    alignItems: "center",
    justifyContent: "center",
  },
  noDataFoundText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black400,
  },
  errorText: {
    fontFamily: "EinaRegular",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.redWarning,
  },
});
