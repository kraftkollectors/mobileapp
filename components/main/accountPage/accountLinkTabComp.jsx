import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import { useRouter } from "expo-router";
import {
  LOCAL_STORAGE_PATH,
  RemoveDataFromMemory,
} from "../../../constants/utilities/localStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("screen").width;

export default function AccountLinkTabComp({
  label,
  pathUrl,
  isPhone,
  phoneNumber,
  isLogout,
}) {
  const router = useRouter();
  const [isLoggingOut, setILO] = useState(false);
  const [tryLogOut, setTLO] = useState(false);

  useEffect(() => {
    if (tryLogOut) {
      setILO(true);

      //REMOVE USERDATA FROM STORAGE
      try {
        RemoveDataFromMemory(LOCAL_STORAGE_PATH.userData);
      } catch (error) {
        //
      }

      setTimeout(() => {
        console.log("user logged out");
        setTLO(false);
        setILO(false);

        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace("/main/home/");
      }, 10000);
    }
  }, [tryLogOut]);

  function goToPath(path) {
    switch (path) {
      case "logout":
        setTLO(true);
        break;

      default:
        router.navigate(`/main/account/settings/${path}`);
        break;
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        goToPath(pathUrl);
      }}
      style={styles.linkTab}
    >
      <View style={styles.linkTitleCont}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 24, height: 24, overflow: "hidden" }}>
            <Image
              source={
                pathUrl === "" || pathUrl === "description"
                  ? require("../../../assets/icons/account.png")
                  : pathUrl === "phone"
                  ? require("../../../assets/icons/phone.png")
                  : pathUrl === "social"
                  ? require("../../../assets/icons/social.png")
                  : pathUrl === "occupation" ||
                    pathUrl === "education" ||
                    pathUrl === "certification"
                  ? require("../../../assets/icons/briefcase.png")
                  : pathUrl === "message" || pathUrl === "work"
                  ? require("../../../assets/icons/clock.png")
                  : pathUrl === "password"
                  ? require("../../../assets/icons/key.png")
                  : pathUrl === "notification"
                  ? require("../../../assets/icons/bell.png")
                  : pathUrl === "support"
                  ? require("../../../assets/icons/support.png")
                  : pathUrl === "logout"
                  ? require("../../../assets/icons/logout.png")
                  : require("../../../assets/icons/lock.png")
              }
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </View>
          <Text
            style={[
              styles.linkLabel,
              isLogout
                ? { color: COLORS.redWarning }
                : { color: COLORS.black500 },
            ]}
          >
            {label}
          </Text>
        </View>

        {isPhone ? <Text style={styles.linkPhone}>{phoneNumber}</Text> : <></>}
      </View>

      {isLogout ? (
        <View style={styles.linkBtn}>
          {isLoggingOut && (
            <ActivityIndicator size={"small"} color={COLORS.redWarning} />
          )}
        </View>
      ) : (
        <View style={styles.linkBtn}>
          <Octicons name="chevron-right" size={20} color={COLORS.black200} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linkTab: {
    width: "100%",
    height: 56,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkTitleCont: {
    width: screenWidth - (32 + 24 + 24 + 12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkLabel: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    textTransform: "capitalize",
  },
  linkPhone: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 24,
    color: COLORS.black300,
  },
  linkBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
