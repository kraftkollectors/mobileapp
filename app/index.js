import React, { useState } from "react";
import { View, Dimensions, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import DefaultStatusBar from "../components/general/defaultStatusBar.comp.jsx";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../constants/utilities/localStorage.js";
import { COLORS } from "../constants/themes/colors.js";

const screenHeight = Dimensions.get("screen").height;
export default function App() {
  const currentAppVersion = process.env.EXPO_PUBLIC_APP_VERSION;
  const [socketConn, setSocketConn] = useState(false);
  const router = useRouter();

  function proceed() {
    router.replace("/main/home/");
  }

  async function saveCurrentLocation() {
    try {
      //CHECK FOR PERMISSION TO save LOCATION
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let currentLocation = await Location.getCurrentPositionAsync({});

        var lat = currentLocation?.coords?.latitude;
        var lng = currentLocation?.coords?.longitude;

        if (lat && lng) {
          let latLng = `${lat},${lng}`;
          StoreDataToMemory(LOCAL_STORAGE_PATH.deviceLatLng, latLng);
        }

        //CLEAR CHAT NOTICE
        StoreDataToMemory(LOCAL_STORAGE_PATH.hasUnreadChat, "");
      }
    } catch (error) {
      //
    }

    setTimeout(() => {
      proceed();
    }, 3500);
  }

  return (
    <>
      <DefaultStatusBar theme={"light"} setSocket={setSocketConn} />
      <SafeAreaView
        onLayout={() => {
          saveCurrentLocation();
        }}
        style={{
          height: screenHeight,
          width: "100%",
          backgroundColor: COLORS.whiteBG,
          flex: 1,
          justifyContent: "space-between",
          paddingBottom: 32,
        }}
      >
        <View style={{ height: screenHeight - 124, width: "100%" }}>
          <Image
            source={require("../assets/photos/splash.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View style={{ height: 48, width: "100%", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: COLORS.black300,
              textTransform: "uppercase",
            }}
          >
            VERSION - {currentAppVersion}
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}
