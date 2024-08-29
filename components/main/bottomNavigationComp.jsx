import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants/themes/colors";
import { Octicons, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../constants/utilities/localStorage";

export default function BottomNavigationComp({ activePage, userData }) {
  const router = useRouter();
  const [hasUnreadMsg, setHUM] = useState(false);

  useEffect(() => {
    if (userData) {
      GetDataFromMemory(LOCAL_STORAGE_PATH.hasUnreadChat, setHUM);

      setInterval(() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.hasUnreadChat, setHUM);
      }, 5000);
    }
  }, [userData]);

  function goToPage(path) {
    router.navigate(`/main/${path}`);
  }

  return (
    <View style={styles.bottomNav}>
      <View style={styles.bottomInnerNav}>
        <TouchableOpacity
          onPress={() => {
            goToPage("home");
          }}
          style={styles.navTab}
        >
          <View style={styles.navIcon}>
            <Octicons
              name="home"
              size={20}
              color={activePage == "home" ? COLORS.blueNormal : COLORS.black200}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activePage == "home"
                ? { color: COLORS.blueNormal }
                : { color: COLORS.black200 },
            ]}
          >
            home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            goToPage("search");
          }}
          style={styles.navTab}
        >
          <View style={styles.navIcon}>
            <Octicons
              name="search"
              size={20}
              color={
                activePage == "search" ? COLORS.blueNormal : COLORS.black200
              }
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activePage == "search"
                ? { color: COLORS.blueNormal }
                : { color: COLORS.black200 },
            ]}
          >
            search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            goToPage("messages");
          }}
          style={styles.navTab}
        >
          <View style={styles.navIcon}>
            <Octicons
              name="mail"
              size={20}
              color={
                activePage == "messages" ? COLORS.blueNormal : COLORS.black200
              }
            />
            {hasUnreadMsg && <View style={styles.navIndicator}></View>}
          </View>
          <Text
            style={[
              styles.navLabel,
              activePage == "messages"
                ? { color: COLORS.blueNormal }
                : { color: COLORS.black200 },
            ]}
          >
            messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            goToPage("listings");
          }}
          style={styles.navTab}
        >
          <View style={styles.navIcon}>
            <FontAwesome6
              name="heart"
              size={20}
              color={
                activePage == "listings" ? COLORS.blueNormal : COLORS.black200
              }
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activePage == "listings"
                ? { color: COLORS.blueNormal }
                : { color: COLORS.black200 },
            ]}
          >
            Services
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            goToPage("account");
          }}
          style={styles.navTab}
        >
          <View style={styles.navPhoto}>
            <Image
              source={
                userData && userData.image
                  ? { uri: `${userData?.image}` }
                  : require("../../assets/icons/profile-avatar.png")
              }
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              activePage == "account"
                ? { color: COLORS.blueNormal }
                : { color: COLORS.black200 },
            ]}
          >
            profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    width: "100%",
    height: Platform.OS === "ios" ? 96 : 124,
    backgroundColor: COLORS.whiteBG,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray50,
    padding: 16,
  },
  bottomInnerNav: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navTab: {
    width: Platform.OS === "ios" ? 64 : 60,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    width: 20,
    height: 20,
    position: "relative",
  },
  navPhoto: {
    width: 24,
    height: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    overflow: "hidden",
  },
  navLabel: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 20,
    textTransform: "capitalize",
  },
  navIndicator: {
    width: 10,
    height: 10,
    borderRadius: 16,
    backgroundColor: COLORS.blueNormal,
    position: "absolute",
    top: -2,
    right: -3,
  },
});
