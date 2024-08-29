import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Feather, Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";

export default function SearchBlockComp({
  input,
  setInput,
  doneTyping,
  clearSearch,
}) {
  return (
    <View style={styles.searchBlockComp}>
      <View style={styles.searchInputBlock}>
        <Feather name="search" size={24} color={COLORS.black400} />

        <View style={styles.searchInpTab}>
          <TextInput
            style={styles.searchInput}
            placeholderTextColor={COLORS.black200}
            placeholder="What are you looking for?"
            inputMode="text"
            value={input}
            onChangeText={(text) => {
              setInput(text);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            onEndEditing={() => {
              doneTyping(true);
            }}
            onSubmitEditing={() => {
              doneTyping(true);
            }}
          />
        </View>

        {input.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              clearSearch();
            }}
          >
            <Octicons name="x" size={24} color={COLORS.black300} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  searchBlockComp: {
    width: "100%",
    height: 96,
    backgroundColor: COLORS.blueNormal,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  searchInputBlock: {
    width: "100%",
    height: 48,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black100,
    backgroundColor: COLORS.whiteBG,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInpTab: {
    width: screenWidth - (32 + 24 + 16 + 48),
    height: 24,
  },
  searchInput: {
    width: "100%",
    height: "100%",
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
});
