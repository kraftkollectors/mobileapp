import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function ListingConfirmDeleteComp({
  confirm,
  cancel,
  deleting,
}) {
  return (
    <View style={styles.pagePopupBlock}>
      <View style={styles.pageModalTab}>
        <Text style={styles.pageModalTitle}>Confirm Deletion</Text>
        <Text style={styles.pageModalText}>
          Are you sure you want to delete this item?
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            marginTop: 24,
          }}
        >
          {deleting ? (
            <TouchableOpacity
              style={[
                styles.pageModalBtn,
                {
                  backgroundColor: COLORS.redWarning,
                  borderColor: COLORS.redWarning,
                },
              ]}
            >
              <ActivityIndicator size={"small"} color={COLORS.whiteBG} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={confirm}
              style={[
                styles.pageModalBtn,
                {
                  backgroundColor: COLORS.redWarning,
                  borderColor: COLORS.redWarning,
                },
              ]}
            >
              <Text
                style={[styles.pageModalBtnText, { color: COLORS.whiteBG }]}
              >
                Delete
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={cancel}
            style={[
              styles.pageModalBtn,
              { backgroundColor: "transparent", borderColor: COLORS.black400 },
            ]}
          >
            <Text style={[styles.pageModalBtnText, { color: COLORS.black400 }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagePopupBlock: {
    width: screenWidth,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pageModalTab: {
    width: 331,
    height: "auto",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.whiteBG,
    borderRadius: 8,
    gap: 8,
    alignItems: "center",
  },
  pageModalTitle: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.redWarning,
  },
  pageModalText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black400,
    maxWidth: "80%",
    textAlign: "center",
  },
  pageModalBtn: {
    width: 150,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pageModalBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
  },
});
