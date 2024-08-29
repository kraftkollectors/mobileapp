import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  Platform,
  Keyboard,
} from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function ProfileTextareaTab({
  label,
  input,
  setInput,
  placeholder,
  hasError,
}) {
  const handleKeyDown = (e) => {
    if (e.nativeEvent.key == "Enter") {
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.inputBlock}>
      {label == "" ? <></> : <Text style={styles.inputLabel}>{label}</Text>}

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
          inputMode={"text"}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
          ref={(ref) => (this.input = ref)}
          onKeyPress={handleKeyDown}
          enterKeyHint={"done"}
          returnKeyType={"done"}
          returnKeyLabel={"done"}
        />
      </View>

      {hasError && <Text style={styles.inputError}>{hasError}</Text>}
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
    color: COLORS.black200,
  },
  inputError: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 10 : 12,
    lineHeight: 20,
    color: COLORS.redWarning,
  },
  inputTab: {
    width: "100%",
    height: 136,
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
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black500,
    width: screenWidth - (24 + 32 + 32),
    height: "100%",
    minHeight: 136,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
});
