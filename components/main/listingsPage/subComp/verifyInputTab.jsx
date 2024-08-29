import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function VerifyInputTab({
  label,
  input,
  setInput,
  placeholder,
  btmText,
  hasError,
  isNumeric,
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View style={styles.inputTab}>
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.black200}
          inputMode={isNumeric ? "numeric" : "text"}
          value={input}
          onChangeText={(text) => setInput(text)}
        />
      </View>

      {hasError ? (
        <Text style={styles.inputError}>{hasError}</Text>
      ) : (
        <>
          {btmText && btmText != "" ? (
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <View style={{ height: 24 }}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={24}
                  color={COLORS.black500}
                />
              </View>
              <Text style={styles.btmText}>{btmText}</Text>
            </View>
          ) : (
            <></>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBlock: {
    width: "100%",
    gap: 8,
    paddingVertical: 8,
  },
  inputLabel: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  inputError: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 10 : 12,
    lineHeight: 20,
    color: COLORS.redWarning,
  },
  inputTab: {
    width: "100%",
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
  },
  inputText: {
    height: "100%",
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: Platform.OS === "ios" ? 16 : 20,
    color: COLORS.black500,
    textTransform: "capitalize",
    width: screenWidth - (24 + 32),
  },
  btmText: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    color: COLORS.black500,
    width: screenWidth - (24 + 32 + 8),
  },
});
