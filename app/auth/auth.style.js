import React from "react";
import { Dimensions, Platform, StyleSheet } from "react-native";
import { COLORS } from "../../constants/themes/colors";

const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: Platform.OS === "ios" ? screenHeight + 32 : screenHeight,
    backgroundColor: COLORS.blueDark,
    position: "relative",
  },
  topPart: {
    width: "100%",
    height: screenHeight - 300,
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
  },
  onboardImgTab: {
    width: "100%",
    height: "100%",
  },
  onboardImg: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
  },
  innerBlock: {
    width: "100%",
    height: screenHeight,
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
  },
  bottomPart: {
    width: "100%",
    height: "auto",
  },
  whiteLogoTab: {
    width: 154.5,
    height: 48,
    marginLeft: 16,
    marginBottom: 32,
  },
  whiteLogoImg: {
    width: "100%",
    height: "100%",
    objectFit: "fill",
  },
  whiteFrameCont: {
    width: "100%",
    minHeight: Platform.OS === "ios" ? 392 : 424,
    backgroundColor: COLORS.whiteBG,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: Platform.OS === "ios" ? 48 : 92,
    gap: 24,
  },
  headingTextCont: {
    gap: 4,
  },
  headingText: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.black900,
  },
  subTextTab: {
    flexDirection: "row",
    gap: 3,
  },
  subText: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: COLORS.black900,
  },
  subTextLink: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    color: COLORS.blueNormal,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  verifyText: {
    fontFamily: "EinaRegular",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    color: COLORS.black900,
  },
  verifyTextLink: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black900,
  },
  choiceBlock: {
    gap: 12,
    width: "100%",
    marginBottom: 32,
  },
  baseTextTab: {
    maxWidth: "100%",
    flexDirection: "row",
    gap: 3,
    justifyContent: "center",
    textAlign: "center",
  },
  baseText: {
    maxWidth: "100%",
    fontFamily: "EinaRegular",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    color: COLORS.black300,
  },
  baseTextLink: {
    maxWidth: "100%",
    fontFamily: "EinaRegular",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    color: COLORS.black300,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  backBtn: {
    width: 20,
    height: 20,
  },
  backBtnImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  forgotText: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black500,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
});

export default styles;
