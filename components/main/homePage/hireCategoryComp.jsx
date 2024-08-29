import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function HireCategoryComp() {
  const [serviceCategories, setServiceCategories] = useState([
    "illustration",
    "graphics design",
    "online tutor",
    "plumber",
    "electrician",
    "car wash",
    "fashion designer",
    "builder",
  ]);

  return (
    <View style={styles.hireCont}>
      <View style={styles.hireBlockCont}>
        <TouchableOpacity style={styles.hireTabUpper}></TouchableOpacity>
        <TouchableOpacity style={styles.hireTabUpper}></TouchableOpacity>
      </View>

      <View style={styles.hireBlockCont}>
        <TouchableOpacity style={styles.hireTabLower}></TouchableOpacity>
        <TouchableOpacity style={styles.hireTabLower}></TouchableOpacity>
        <TouchableOpacity style={styles.hireTabLower}></TouchableOpacity>
        <TouchableOpacity style={styles.hireTabLower}></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hireCont: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
  },
  hireBlockCont: {
    width: "100%",
    height: "auto",
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  hireTabUpper: {
    minWidth: (screenWidth - (8 + 32)) / 2,
    width: (screenWidth - (8 + 32)) / 2,
    height: (screenWidth - (3 * 8 + 32)) / 4,
    padding: 5,
    backgroundColor: COLORS.whiteBG,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  hireTabLower: {
    minWidth: (screenWidth - (3 * 8 + 32)) / 4,
    width: (screenWidth - (3 * 8 + 32)) / 4,
    height: (screenWidth - (3 * 8 + 32)) / 4,
    padding: 5,
    backgroundColor: COLORS.whiteBG,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  hireTabText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 10 : 12,
    lineHeight: Platform.OS === "ios" ? 14 : 18,
    color: COLORS.black1000,
    textTransform: "capitalize",
    textAlign: "center",
  },
});
