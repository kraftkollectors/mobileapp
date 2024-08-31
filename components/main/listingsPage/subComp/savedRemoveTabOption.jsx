import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import { MAKE_SERVICE_FAVOURITE } from "../../../../hooks/requests";

export default function SavedRemoveTabOption({
  userData,
  serviceData,
  accessToken,
  handleOptionVisibility,
  refreshList,
}) {
  const [isFavourite, setIsFavourite] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (favLoading) {
      MAKE_SERVICE_FAVOURITE(
        userData?._id,
        userData?.email,
        serviceData?._id,
        accessToken,
        isFavourite,
        setIsFavourite,
        setFavLoading
      );
    }

    if (!isFavourite) {
      refreshList();
      handleOptionVisibility();
    }
  }, [favLoading, userData]);

  return (
    <View style={styles.optionTab}>
      <TouchableOpacity
        onPress={() => setFavLoading(true)}
        style={styles.optionBtn}
      >
        <Text style={[styles.optionText, { color: COLORS.redWarning }]}>
          Remove
        </Text>
        {favLoading ? (
          <ActivityIndicator size={"small"} color={COLORS.redWarning} />
        ) : (
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color={COLORS.redWarning}
          />
        )}
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
