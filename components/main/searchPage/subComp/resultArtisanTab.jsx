import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../../constants/themes/colors";
import StarRatingDisplay from "../../../general/starRatingDisplay";
import { LOAD_PROFILE_THUMBNAIL } from "../../../../constants/utilities";
import { FETCH_SERVICE_ARTISAN } from "../../../../hooks/requests";
import { useRouter } from "expo-router";

export default function ResultArtisanTab({ data }) {
  const router = useRouter();
  //GET ARTISAN PROFILE
  const [artisanProfile, setArtisanProfile] = useState();
  useEffect(() => {
    if (data && data.isArtisan) {
      FETCH_SERVICE_ARTISAN(data?._id, setArtisanProfile);
    }
  }, [data]);
  //console.log(data);

  //GO TO PROFILE
  function goToProfile() {
    router.navigate(`/main/profile?_id=${data?._id}`);
  }

  return (
    <TouchableOpacity
      onPress={() => {
        goToProfile();
      }}
      style={styles.artisanTab}
    >
      <View style={styles.artisanTabAvatar}>
        <Image
          source={LOAD_PROFILE_THUMBNAIL(data?.image)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </View>

      <View style={{ gap: 4, alignItems: "center" }}>
        <View style={{ gap: 4, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.artisanFullName} numberOfLines={1}>
            {data?.firstName} {data?.lastName}
          </Text>
          {data?.isArtisan && (
            <View style={{ width: 16, height: 16 }}>
              <Image
                source={require("../../../../assets/icons/verified.png")}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          )}
        </View>
        <Text style={styles.artisanUserName} numberOfLines={1}>
          @{data?.userName}
        </Text>
      </View>

      <Text style={styles.artisanOccupation} numberOfLines={1}>
        {artisanProfile && artisanProfile?.areaOfSpecialization}
      </Text>

      <View style={{ gap: 4, flexDirection: "row" }}>
        <Text style={styles.artisanRating}>4.8</Text>
        <StarRatingDisplay starSize={14} rating={4.8} />
      </View>
    </TouchableOpacity>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  artisanTab: {
    width: (screenWidth - (32 + 8)) / 2,
    minHeight: 208,
    backgroundColor: COLORS.whiteBG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black50,
    padding: 16,
    gap: 8,
    alignItems: "center",
  },
  artisanTabAvatar: {
    width: 72,
    height: 72,
    overflow: "hidden",
    borderRadius: 100,
    backgroundColor: COLORS.gray100,
  },
  artisanFullName: {
    minWidth: "90%",
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: Platform.OS === "ios" ? 16 : 20,
    color: COLORS.black500,
  },
  artisanUserName: {
    width: "100%",
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: Platform.OS === "ios" ? 16 : 20,
    color: COLORS.black400,
  },
  artisanOccupation: {
    width: "100%",
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: Platform.OS === "ios" ? 16 : 20,
    color: COLORS.black400,
    textAlign: "center",
  },
  artisanRating: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 10 : 12,
    lineHeight: 16,
    color: COLORS.black900,
  },
});
