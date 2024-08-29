import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function SettingInputTab({
  label,
  input,
  setInput,
  placeholder,
  isNumber,
  hasError,
}) {
  return (
    <View style={styles.inputBlock}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}

      <View
        style={[
          styles.inputTab,
          hasError
            ? { borderColor: COLORS.redWarning }
            : { borderColor: COLORS.black100 },
        ]}
      >
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.black100}
          value={input}
          onChangeText={(text) => setInput(text)}
          inputMode={isNumber ? "numeric" : "text"}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {hasError && (
        <Text style={[styles.inputBtmText, { color: COLORS.redWarning }]}>
          {hasError}
        </Text>
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
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black200,
  },
  inputBtmText: {
    fontFamily: "EinaRegular",
    fontSize: 12,
    lineHeight: 20,
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
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black500,
    width: screenWidth - (24 + 32),
  },
});
