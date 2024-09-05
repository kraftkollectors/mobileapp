import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { Octicons, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import SimpleTabOption from "../../../general/simpleTabOption";
import {
  FORMATNUMBERWITHCOMMA,
  LOAD_SERVICE_THUMBNAIL,
} from "../../../../constants/utilities";
import { useRouter } from "expo-router";
import SavedRemoveTabOption from "./savedRemoveTabOption";

export default function ServiceCard({
  data,
  showOptions,
  handleOptionVisibility,
  tab,
  typeName,
  visibleIndex,
  confirmDelete,
  userData,
  accessToken,
  refreshList,
  toDelete,
}) {
  const router = useRouter();

  function goToService() {
    router.navigate(`/main/service?_id=${data?._id}`);
  }

  function startEdit(id) {
    router.navigate(`/main/listings/edit/?_id=${id}`);
    handleOptionVisibility();
  }

  return (
    <TouchableOpacity
      onPress={() => {
        goToService();
      }}
      style={styles.serviceCard}
    >
      <View style={styles.serviceCardThumbnail}>
        <Image
          source={LOAD_SERVICE_THUMBNAIL(data?.coverPhoto)}
          style={{ width: "100%", height: "100%", objectFit: "fill" }}
        />
      </View>

      <View style={styles.serviceCardDetailsBlock}>
        <View style={styles.serviceCardDetails}>
          <View style={styles.pcdTop}>
            <Text style={styles.serviceCardTitle} numberOfLines={2}>
              {data?.title}
            </Text>
            <Text style={styles.serviceCardPrice}>
              N {FORMATNUMBERWITHCOMMA(data?.estimatedPrice)}{" "}
              <Text style={styles.serviceCardCharge}>- {data?.charge}</Text>
            </Text>
          </View>
          <View style={styles.pcdBottom}>
            <Text style={styles.serviceCardLocation}>{data?.subCategory}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleOptionVisibility}
          style={styles.serviceElipsIcon}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={16}
            color={COLORS.black400}
          />
        </TouchableOpacity>

        {showOptions && visibleIndex == tab ? (
          <>
            {typeName === "saved" ? (
              <SavedRemoveTabOption
                userData={userData}
                serviceData={data}
                accessToken={accessToken}
                handleOptionVisibility={() => {
                  handleOptionVisibility();
                }}
                refreshList={() => {
                  refreshList();
                }}
              />
            ) : (
              <SimpleTabOption
                confirmDelete={() => {
                  confirmDelete();
                  handleOptionVisibility();
                  toDelete(data?._id);
                }}
                commenceEdit={() => {
                  startEdit(data?._id);
                }}
              />
            )}
          </>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  serviceCard: {
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  serviceCardThumbnail: {
    width: 150,
    height: 120,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: COLORS.gray100,
  },
  serviceCardDetailsBlock: {
    width: screenWidth - (150 + 32),
    flexDirection: "row",
    gap: 8,
  },
  serviceElipsIcon: {
    width: 24,
    alignItems: "center",
  },
  serviceCardDetails: {
    width: screenWidth - (150 + 32 + 24 + 8),
    height: 120,
    gap: 12,
  },
  pcdTop: {
    width: "100%",
    gap: 12,
  },
  pcdBottom: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  serviceCardTitle: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black400,
  },
  serviceCardPrice: {
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black600,
  },
  serviceCardCharge: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.black200,
    textTransform: "capitalize",
  },
  serviceCardLocation: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black200,
  },
});
