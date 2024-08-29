import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function ProfileCardLoadingTemp() {
  return (
    <View style={styles.profileCard}>
      {/**TOP CARD */}
      <View>
        {/**PROFILE PHOTO */}
        <View style={styles.profilePhotoBlock}>
          <View style={styles.profilePhotoTab}>
            <View style={styles.profilePhotoTabInner}></View>

            {/**ACTIVE STATE INDICATOR */}
            <View style={styles.activeStateIndicator}></View>
          </View>
        </View>

        {/**USER DETAILS */}
        <View style={styles.profileUserData}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={styles.pudName}></View>
          </View>

          <View style={styles.pudRole}></View>

          <View style={styles.location}>
            <View style={styles.pudLocation}></View>
          </View>
        </View>

        {/**CTA */}
        <View style={styles.ctaBlock}>
          <View style={[styles.ctaTab, { backgroundColor: COLORS.black50 }]}>
            <View
              style={[styles.ctaText, { backgroundColor: COLORS.black200 }]}
            ></View>
          </View>

          <View style={[styles.ctaTab, { backgroundColor: COLORS.whiteBG }]}>
            <View
              style={[styles.ctaText, { backgroundColor: COLORS.black50 }]}
            ></View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    width: "100%",
    paddingVertical: 16,
    gap: 20,
    backgroundColor: COLORS.whiteBG,
  },
  profilePhotoBlock: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePhotoTab: {
    width: 80,
    height: 80,
    borderRadius: 70,
    backgroundColor: COLORS.gray100,
  },
  profilePhotoTabInner: {
    width: 80,
    height: 80,
    borderRadius: 70,
    backgroundColor: COLORS.gray100,
    overflow: "hidden",
  },
  activeStateIndicator: {
    position: "absolute",
    bottom: 3,
    right: 2,
    width: 18.46,
    height: 18.46,
    borderRadius: 10,
    borderWidth: 1.67,
    borderColor: COLORS.whiteBG,
    backgroundColor: COLORS.black50,
  },
  profileUserData: {
    alignItems: "center",
    gap: 4,
  },
  pudName: {
    width: "85%",
    height: 18,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  pudRole: {
    width: "55%",
    height: 12,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  pudLocation: {
    width: "25%",
    height: 12,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
  ctaBlock: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ctaTab: {
    width: (screenWidth - (8 + 32)) / 2,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black50,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    width: "55%",
    height: 12,
    borderRadius: 20,
  },
});
