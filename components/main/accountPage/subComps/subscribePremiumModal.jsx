import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";
import { Octicons } from "@expo/vector-icons";

export default function SubscribePremiumModal({ hideModal }) {
  return (
    <View style={styles.premiumModal}>
      <View style={styles.premiumCominSoonBlock}>
        <TouchableOpacity
          onPress={() => {
            hideModal();
          }}
          style={{ width: 24, marginLeft: "auto" }}
        >
          <Octicons name="x" size={24} color={COLORS.black500} />
        </TouchableOpacity>
        <View style={styles.premiumCominSoonBlockInner}>
          <Text style={styles.premiumCominSoonBlockText}>Coming Soon...</Text>
        </View>
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  premiumModal: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  premiumCominSoonBlock: {
    width: screenWidth - 32,
    borderRadius: 8,
    backgroundColor: COLORS.whiteBG,
    padding: 16,
  },
  premiumCominSoonBlockInner: {
    width: "100%",
    height: 136,
    alignItems: "center",
    justifyContent: "center",
  },
  premiumCominSoonBlockText: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.violetNormal,
  },
});
