import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function TitleBlockComp({
  activeGroup,
  setActiveGroup,
  search,
  setSearch,
}) {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.titleBlockHeading}>Messages</Text>

      {/**SEARCH TAB */}
      <View style={styles.tbSearchTab}>
        <View style={styles.tbSearchIcon}>
          <Octicons name="search" size={16} color={COLORS.black300} />
        </View>

        <TextInput
          style={styles.tbSearchInput}
          placeholder="Search for messages"
          placeholderTextColor={COLORS.black200}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
          }}
          enterKeyHint="search"
          returnKeyLabel="search"
          returnKeyType="search"
        />
      </View>

      {/**CHAT GROUPING */}
      <View style={styles.tbGroupTab}>
        <TouchableOpacity
          onPress={() => {
            setActiveGroup("all");
          }}
          style={[
            styles.tbGroup,
            activeGroup == "all"
              ? { backgroundColor: COLORS.blueLight }
              : { backgroundColor: COLORS.gray100 },
          ]}
        >
          <Text style={styles.tbGroupText}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActiveGroup("unread");
          }}
          style={[
            styles.tbGroup,
            activeGroup == "unread"
              ? { backgroundColor: COLORS.blueLight }
              : { backgroundColor: COLORS.gray100 },
          ]}
        >
          <Text style={styles.tbGroupText}>Unread</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: {
    width: "100%",
    padding: 16,
    gap: 20,
  },
  titleBlockHeading: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 20 : 22,
    lineHeight: 28,
    color: COLORS.black900,
  },
  tbSearchTab: {
    width: "100%",
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black200,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  tbSearchIcon: {
    width: 16,
    height: 16,
  },
  tbSearchInput: {
    width: screenWidth - (32 + 24 + 24 + 8),
    height: "100%",
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black500,
  },
  tbGroupTab: {
    width: "100%",
    gap: 10,
    flexDirection: "row",
  },
  tbGroup: {
    width: "auto",
    height: 32,
    borderRadius: 8,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tbGroupText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black400,
  },
});
