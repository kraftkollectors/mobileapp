import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function StickyTopBar({ isVerified, activeTab, setActiveTab }) {
  return (
    <View>
      <View style={styles.stickyBarTitleBlock}>
        <Text style={styles.stickyBarTitle}>My Services</Text>
      </View>

      <View
        style={[
          styles.stickyBar,
          isVerified
            ? { justifyContent: "space-between" }
            : { gap: 72, justifyContent: "center" },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setActiveTab("services");
          }}
          style={[
            styles.stickyBtn,
            activeTab == "services"
              ? { borderBottomColor: COLORS.blueNormal }
              : { borderBottomColor: COLORS.whiteBG },
          ]}
        >
          <Text
            style={[
              styles.stickyBtnText,
              activeTab == "services"
                ? { color: COLORS.blueNormal }
                : { color: COLORS.black300 },
            ]}
          >
            Services
          </Text>
        </TouchableOpacity>

        {isVerified ? (
          <TouchableOpacity
            onPress={() => {
              setActiveTab("reviews");
            }}
            style={[
              styles.stickyBtn,
              activeTab == "reviews"
                ? { borderBottomColor: COLORS.blueNormal }
                : { borderBottomColor: COLORS.whiteBG },
            ]}
          >
            <Text
              style={[
                styles.stickyBtnText,
                activeTab == "reviews"
                  ? { color: COLORS.blueNormal }
                  : { color: COLORS.black300 },
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}

        <TouchableOpacity
          onPress={() => {
            setActiveTab("saved");
          }}
          style={[
            styles.stickyBtn,
            activeTab == "saved"
              ? { borderBottomColor: COLORS.blueNormal }
              : { borderBottomColor: COLORS.whiteBG },
          ]}
        >
          <Text
            style={[
              styles.stickyBtnText,
              activeTab == "saved"
                ? { color: COLORS.blueNormal }
                : { color: COLORS.black300 },
            ]}
          >
            Saved
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyBarTitleBlock: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.blueNormal,
  },
  stickyBarTitle: {
    width: "auto",
    height: "auto",
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.whiteBG,
  },
  stickyBar: {
    width: "100%",
    height: Platform.OS === "ios" ? 52 : 46,
    paddingHorizontal: 16,
    backgroundColor: COLORS.whiteBG,
    flexDirection: "row",
  },
  stickyBtn: {
    height: "100%",
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  stickyBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
  },
});
