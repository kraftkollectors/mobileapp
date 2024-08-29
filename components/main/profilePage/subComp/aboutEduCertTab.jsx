import { View, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";

export default function AboutEduCertTab({ index, fullLength, typeName, data }) {
  return (
    <View
      style={[
        styles.aecTab,
        index == fullLength
          ? { borderBottomWidth: 0 }
          : { borderBottomWidth: 1 },
      ]}
    >
      <Text style={styles.aecTitle}>
        {typeName.toLowerCase() === "certification"
          ? data?.certificate
          : data?.university}
      </Text>
      <Text style={styles.aecSub}>
        {typeName.toLowerCase() === "certification"
          ? data?.certifiedBy
          : `${data?.degree} - ${data?.areaOfStudy}`}
      </Text>
      <Text style={styles.aecBase}>Year of Graduation - {data?.year}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aecTab: {
    width: "100%",
    gap: 8,
    borderBottomColor: COLORS.gray100,
    paddingVertical: 8,
  },
  aecTitle: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black900,
    textTransform: "capitalize",
  },
  aecSub: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  aecBase: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
});
