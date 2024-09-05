import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import { useRouter } from "expo-router";
import {
  FORMATNUMBERWITHCOMMA,
  TRUNCATESTRING,
} from "../../../../constants/utilities";

export default function ServiceTab({ data }) {
  const router = useRouter();

  //SERVICE DETAILS
  function goToService() {
    router.navigate(`/main/service?_id=${data?._id}`);
  }

  return (
    <TouchableOpacity
      onPress={() => {
        goToService();
      }}
      style={styles.serviceTab}
    >
      <View style={styles.serviceThumbnail}>
        <Image
          source={{ uri: `${data?.coverPhoto}` }}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </View>

      <View style={styles.serviceDetails}>
        <View style={{ gap: 8 }}>
          <Text style={styles.servicePrice}>
            N{" "}
            {data.estimatedPrice && FORMATNUMBERWITHCOMMA(data?.estimatedPrice)}{" "}
            <Text style={styles.serviceCharge}>- {data?.charge}</Text>
          </Text>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {data?.title}
          </Text>
        </View>

        <View style={styles.serviceBottom}>
          <Octicons name="location" size={16} color={COLORS.black200} />
          <Text style={styles.serviceLocation} numberOfLines={1}>
            {data?.state}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  serviceTab: {
    width: 191,
    height: 240,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.whiteBG,
  },
  serviceThumbnail: {
    width: "100%",
    height: 120,
    backgroundColor: COLORS.black50,
  },
  serviceDetails: {
    width: "100%",
    height: 120,
    padding: 8,
    gap: 8,
    justifyContent: "space-between",
  },
  serviceBottom: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  servicePrice: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  serviceCharge: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black200,
    textTransform: "capitalize",
  },
  serviceTitle: {
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black400,
    textTransform: "capitalize",
  },
  serviceLocation: {
    maxWidth: 191 - (16 + 4 + 16),
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black200,
    textTransform: "capitalize",
  },
});
