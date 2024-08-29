import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";
import { useRouter } from "expo-router";

export default function BecomeArtisanAdBoardComp() {
  const router = useRouter();

  function goToListing() {
    router.navigate("/main/listings/");
  }
  return (
    <View style={{ padding: 16 }}>
      <View style={styles.boardContainer}>
        <Text style={styles.boardTitle}>
          Ready to <Text style={{ color: COLORS.yellowNormal }}>Showcase</Text>{" "}
          Your <Text style={{ color: COLORS.yellowNormal }}>Kraft</Text>?
        </Text>

        <Text style={styles.boardSub}>
          Create your artisan profile today and let your talent shine.
        </Text>

        <TouchableOpacity
          onPress={() => {
            goToListing();
          }}
          style={styles.boardActBtn}
        >
          <Text style={styles.boardActBtnText}>Become an artisan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: COLORS.blueNormal,
    borderRadius: 12,
    alignItems: "center",
    gap: 32,
  },
  boardTitle: {
    fontFamily: "EinaBold",
    fontSize: 21,
    lineHeight: 28,
    color: COLORS.whiteBG,
  },
  boardSub: {
    fontFamily: "EinaRegular",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.whiteBG,
    textAlign: "center",
  },
  boardActBtn: {
    width: "100%",
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.whiteBG,
    alignItems: "center",
    justifyContent: "center",
  },
  boardActBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.blueDark,
  },
});
