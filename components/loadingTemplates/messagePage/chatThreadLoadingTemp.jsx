import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function ChatThreadLoadingTemp() {
  return (
    <View style={styles.chatThread}>
      <View style={styles.chatThreadThumbnail}>
        <View style={styles.chatThreadThumbnailImg}></View>
        {/**CHECK IF USER ONLINE OR OFFLINE */}
        <View style={styles.chatThreadThumbnailOnline}></View>
      </View>

      <View style={styles.ctDetails}>
        <View style={styles.ctdCont}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={styles.ctdUserName} numberOfLines={1}></View>
          </View>
        </View>

        <View style={styles.ctdCont}>
          <View style={[styles.ctdLastChat]}></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatThread: {
    width: "100%",
    height: 80,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  chatThreadThumbnail: {
    width: 48,
    height: 48,
    position: "relative",
  },
  chatThreadThumbnailImg: {
    width: 48,
    height: 48,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: COLORS.gray50,
    position: "relative",
  },
  chatThreadThumbnailOnline: {
    width: 16,
    height: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.whiteBG,
    backgroundColor: COLORS.black50,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  ctDetails: {
    width: screenWidth - (48 + 12 + 32),
    height: 48,
    gap: 8,
  },
  ctdCont: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  ctdUserName: {
    width: "85%",
    height: 14,
    borderRadius: 16,
    backgroundColor: COLORS.black50,
  },
  ctdLastChat: {
    width: "45%",
    height: 12,
    borderRadius: 16,
    backgroundColor: COLORS.black50,
  },
});
