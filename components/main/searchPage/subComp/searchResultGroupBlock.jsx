import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";

export default function SearchResultGroupBlock({
  activeGroup,
  setActiveGroup,
}) {
  return (
    <View style={styles.srGroupBlock}>
      <TouchableOpacity
        style={[
          styles.srGroupTab,
          activeGroup === "services"
            ? { borderBottomColor: COLORS.blueNormal }
            : { borderBottomColor: COLORS.whiteBG },
        ]}
        onPress={() => {
          setActiveGroup("services");
        }}
      >
        <Text
          style={[
            styles.srGroupText,
            activeGroup === "services"
              ? { color: COLORS.blueNormal }
              : { color: COLORS.black300 },
          ]}
        >
          Services
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.srGroupTab,
          activeGroup === "artisans"
            ? { borderBottomColor: COLORS.blueNormal }
            : { borderBottomColor: COLORS.whiteBG },
        ]}
        onPress={() => {
          setActiveGroup("artisans");
        }}
      >
        <Text
          style={[
            styles.srGroupText,
            activeGroup === "artisans"
              ? { color: COLORS.blueNormal }
              : { color: COLORS.black300 },
          ]}
        >
          Artisans
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  srGroupBlock: {
    width: "100%",
    height: Platform.OS === "ios" ? 52 : 44,
    backgroundColor: COLORS.whiteBG,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 86,
  },
  srGroupTab: {
    width: "auto",
    height: "100%",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  srGroupText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
  },
});
