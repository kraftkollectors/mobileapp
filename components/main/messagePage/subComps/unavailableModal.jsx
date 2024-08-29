import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import { FORMAT_TIME_STRING_12H } from "../../../../constants/utilities";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function UnavailableModal({ hideModal, profile, artisan }) {
  return (
    <View style={styles.unavailableModalFrame}>
      <View style={styles.unavailableModalBox}>
        <TouchableOpacity onPress={hideModal} style={styles.modalCancelBtn}>
          <Octicons name="x" size={24} color={COLORS.black500} />
        </TouchableOpacity>

        <View style={styles.modalTextTab}>
          <Text style={styles.modalHeading}>Unavailable</Text>
          <Text style={styles.modalBody}>
            <Text style={styles.modalBodyBold}>
              {profile?.firstName} {profile?.lastName}
            </Text>{" "}
            is not available for calls right now. They are available from{" "}
            <Text style={styles.modalBodyBold}>
              {artisan?.workHourFrom
                ? FORMAT_TIME_STRING_12H(artisan?.workHourFrom)
                : artisan?.workHourFrom}
            </Text>{" "}
            to{" "}
            <Text style={styles.modalBodyBold}>
              {artisan?.workHourTo
                ? FORMAT_TIME_STRING_12H(artisan?.workHourTo)
                : artisan?.workHourTo}
            </Text>
            .
          </Text>
          <Text style={styles.modalBody}>
            You can leave a message for them to get back to you.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  unavailableModalFrame: {
    width: screenWidth,
    height: screenHeight,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableModalBox: {
    width: "100%",
    height: "auto",
    borderRadius: 8,
    backgroundColor: COLORS.whiteBG,
    paddingHorizontal: 16,
    paddingVertical: 32,
    gap: 8,
  },
  modalCancelBtn: {
    width: 24,
    height: 24,
    marginLeft: "auto",
  },
  modalTextTab: {
    width: "100%",
    gap: 16,
  },
  modalHeading: {
    fontFamily: "EinaBold",
    fontSize: 24,
    lineHeight: 40,
    color: COLORS.yellowNormal,
    textAlign: "center",
  },
  modalBody: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  modalBodyBold: {
    color: COLORS.black900,
  },
});
