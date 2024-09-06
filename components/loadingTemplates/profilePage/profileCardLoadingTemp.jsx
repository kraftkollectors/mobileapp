import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("screen").width;

export default function ProfileCardLoadingTemp() {
  const router = useRouter();

  function goBack() {
    router.back();
  }
  return (
    <View style={styles.profileCard}>
      {/**BACK BTN */}
      <View style={styles.profileBackBtnTab}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
          style={styles.profileBackBtn}
        >
          <Octicons name="chevron-left" size={24} color={COLORS.black300} />
        </TouchableOpacity>
      </View>

      {/**TOP CARD */}
      <View>
        {/**PROFILE PHOTO */}
        <View style={styles.profilePhotoBlock}>
          <View style={styles.profilePhotoTab}>
            <View style={styles.profileThumbnailImg}></View>
            {/**CHECK IF USER ONLINE OR OFFLINE */}
            <View style={styles.profileThumbnailOnline}></View>
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

        {/**PROFILE NAV BAR */}
        <View style={styles.profileNavBar}>
          <View style={styles.pnbText}></View>
          <View style={styles.pnbText}></View>
          <View style={styles.pnbText}></View>
          <View style={styles.pnbText}></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    width: "100%",
    paddingTop: 0,
    gap: 20,
    backgroundColor: COLORS.whiteBG,
  },
  profileBackBtnTab: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  profileBackBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePhotoBlock: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePhotoTab: {
    width: 120,
    height: 120,
    position: "relative",
  },
  profileThumbnailImg: {
    width: 120,
    height: 120,
    borderRadius: 90,
    overflow: "hidden",
    backgroundColor: COLORS.gray50,
  },
  profileThumbnailOnline: {
    width: 18.46,
    height: 18.46,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.whiteBG,
    backgroundColor: COLORS.black50,
    position: "absolute",
    bottom: 8,
    right: 8,
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
    height: 36,
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
  profileNavBar: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: 24,
  },
  pnbText: {
    width: 45,
    height: 10,
    borderRadius: 20,
    backgroundColor: COLORS.black50,
  },
});
