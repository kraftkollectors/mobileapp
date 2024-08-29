import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import { useRouter } from "expo-router";
import {
  CHECK_SERVICE_IS_FAVOURITE,
  MAKE_SERVICE_FAVOURITE,
} from "../../../hooks/requests";
import {
  CheckLoginStatus,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";

export default function PageTopBarComp({ userData, serviceData, accessToken }) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState("");

  const [isFavourite, setIsFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  useEffect(() => {
    if (isLogged === "logged" || isLogged === "not-verified") {
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
      } else {
        if (userData && serviceData) {
          CHECK_SERVICE_IS_FAVOURITE(
            userData?._id,
            serviceData?._id,
            setIsFavourite
          );
        }
      }
    } else if (isLogged === "not-logged" && favLoading) {
      setFavLoading(false);
      router.push("/auth/signin/");
    } else {
      //SAVE CURRENT PATH
      StoreDataToMemory(
        LOCAL_STORAGE_PATH.redirectPath,
        `/main/service?_id=${serviceData?._id}`
      );

      //CHECK LOGIN STATUS
      CheckLoginStatus(setIsLogged);
    }
  }, [isLogged, favLoading, userData, serviceData]);

  function goBack() {
    router.back();
  }

  return (
    <View style={styles.topBarComp}>
      <TouchableOpacity
        onPress={() => {
          goBack();
        }}
      >
        <AntDesign name="arrowleft" size={24} color={COLORS.black500} />
      </TouchableOpacity>

      <View style={styles.actionBar}>
        {/**SHARE */}
        <TouchableOpacity style={styles.actionBtn}>
          <AntDesign name="sharealt" size={20} color={COLORS.black500} />
        </TouchableOpacity>
        {/**SAVE */}
        <TouchableOpacity
          onPress={() => {
            setFavLoading(true);
          }}
          style={styles.actionBtn}
        >
          {favLoading ? (
            <ActivityIndicator size={"small"} color={COLORS.black500} />
          ) : (
            <>
              {isFavourite ? (
                <AntDesign name="heart" size={20} color={COLORS.blueNormal} />
              ) : (
                <AntDesign name="hearto" size={20} color={COLORS.black500} />
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBarComp: {
    width: "100%",
    height: 60,
    padding: 16,
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  actionBtn: {
    width: 36,
    height: 36,
    backgroundColor: COLORS.whiteBG,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black50,
    alignItems: "center",
    justifyContent: "center",
  },
});
