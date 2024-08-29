import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

export default function UnverifiedServiceTab({ beginVerification }) {
  return (
    <View style={styles.serviceTab}>
      <View style={styles.innerBox}>
        <Text style={styles.question}>
          Ready to setup artisan profile on KraftKollectors?
        </Text>

        <TouchableOpacity onPress={beginVerification} style={styles.tabBtn}>
          <Text style={styles.btnText}>Verify account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  serviceTab: {
    width: "100%",
    height: 164,
    backgroundColor: COLORS.whiteBG,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
  },
  innerBox: {
    width: 270,
    gap: 20,
    alignItems: "center",
  },
  question: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black300,
    textAlign: "center",
  },
  tabBtn: {
    width: 165,
    height: Platform.OS === "ios" ? 48 : 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.blueNormal,
    borderRadius: 4,
  },
  btnText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.whiteBG,
  },
});
