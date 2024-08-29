import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import React from "react";
import { UIActivityIndicator } from "react-native-indicators";
import { COLORS } from "../../../../constants/themes/colors";

export default function ModalBtn({ btnText, handleClick, isLoading }) {
  return (
    <>
      {isLoading ? (
        <TouchableOpacity style={styles.btnTabLoading}>
          <Text style={styles.btnText}>Please Wait...</Text>
          <View>
            <UIActivityIndicator color={COLORS.whiteBG} size={24} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btnTab} onPress={handleClick}>
          <Text style={styles.btnText}>{btnText}</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  btnTab: {
    width: "100%",
    height: 44,
    backgroundColor: COLORS.black900,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginTop: 16,
  },
  btnText: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.whiteBG,
  },
  btnTabLoading: {
    width: "100%",
    height: 44,
    backgroundColor: COLORS.black200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 4,
    marginTop: 16,
  },
});
