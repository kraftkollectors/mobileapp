import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants/themes/colors";

export default function ChoiceTab({ choice, choiceFunction }) {
  const [photoIcon, setPhotoIcon] = useState(
    require("../../assets/icons/mail.png")
  );

  useEffect(() => {
    switch (choice) {
      case "google":
        setPhotoIcon(require("../../assets/icons/google.png"));
        break;
      case "facebook":
        setPhotoIcon(require("../../assets/icons/facebook.png"));
        break;

      default:
        setPhotoIcon(require("../../assets/icons/mail.png"));
        break;
    }
  }, [choice]);

  return (
    <TouchableOpacity onPress={choiceFunction} style={styles.choiceTab}>
      <View style={styles.iconTab}>
        <Image
          source={photoIcon}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </View>

      <Text style={styles.choiceText}>Continue with {choice}</Text>

      <View style={styles.iconTab}></View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  choiceTab: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black50,
    paddingHorizontal: 12,
  },
  iconTab: {
    width: 24,
    height: 24,
  },
  choiceText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black400,
    textTransform: "capitalize",
  },
});
