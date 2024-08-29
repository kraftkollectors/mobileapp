import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../constants/themes/colors";

export default function SimpleTabOption({
  confirmDelete,
  commenceEdit,
  onlyDelete,
  deleteAltText,
}) {
  return (
    <View style={styles.optionTab}>
      {onlyDelete ? (
        <></>
      ) : (
        <TouchableOpacity
          onPress={() => commenceEdit()}
          style={[
            styles.optionBtn,
            { borderBottomWidth: 1, borderBottomColor: COLORS.black50 },
          ]}
        >
          <Text style={[styles.optionText, { color: COLORS.blueNormal }]}>
            Edit
          </Text>
          <MaterialCommunityIcons
            name="square-edit-outline"
            size={20}
            color={COLORS.blueNormal}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => confirmDelete()}
        style={styles.optionBtn}
      >
        <Text style={[styles.optionText, { color: COLORS.redWarning }]}>
          {onlyDelete ? deleteAltText : "Delete"}
        </Text>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={20}
          color={COLORS.redWarning}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  optionTab: {
    width: 150,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black50,
    backgroundColor: COLORS.whiteBG,
    position: "absolute",
    top: 30,
    right: 10,
    zIndex: 10,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowOpacity: 0.3,
    shadowRadius: 0.1,
    shadowOffset: [0, 0],
    elevation: 3,
  },
  optionBtn: {
    width: "100%",
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
  },
});
