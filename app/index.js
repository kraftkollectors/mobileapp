import React, { useState } from "react";
import { View, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import DefaultStatusBar from "../components/general/defaultStatusBar.comp";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../constants/utilities/localStorage";

const screenHeight = Dimensions.get("screen").height;
export default function App() {
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
        style={{ height: screenHeight, width: "100%" }}
      >
        <View style={{ height: screenHeight, width: "100%" }}>
          <Image
            source={require("../assets/photos/splash.png")}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      </SafeAreaView>
    </>
  );
}
