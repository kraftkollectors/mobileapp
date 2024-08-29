import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function ArtisanLoadingTemp() {
  return (
    <View style={styles.artisanTab}>
      <View style={styles.artisanTabAvatar}></View>

      <View style={{ width: "100%", gap: 4, alignItems: "center" }}>
        <View
          style={{
            width: "100%",
            gap: 4,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={styles.artisanFullName}></View>
        </View>

        <View style={styles.artisanUserName}></View>
      </View>

      <View style={styles.artisanOccupation}></View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  artisanTab: {
    width: (screenWidth - (32 + 8)) / 2,
    minHeight: 208,
    backgroundColor: COLORS.whiteBG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black50,
    padding: 16,
    gap: 8,
    alignItems: "center",
  },
  artisanTabAvatar: {
    width: 72,
    height: 72,
    overflow: "hidden",
    borderRadius: 100,
    backgroundColor: COLORS.black50,
    marginBottom: 8,
  },
  artisanFullName: {
    width: "100%",
    height: 16,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  artisanUserName: {
    width: "35%",
    height: 12,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  artisanOccupation: {
    width: "65%",
    height: 14,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
});
