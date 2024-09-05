import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { COLORS } from "../constants/themes/colors";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../constants/utilities/localStorage";

SplashScreen.preventAutoHideAsync();

//HANDLE NOTIFICATION TAP
function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        StoreDataToMemory(LOCAL_STORAGE_PATH.notificationUrl, url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

const Layout = () => {
  useNotificationObserver();

  //LOAD FONTS
  const [fontsLoaded, fontError] = useFonts({
    EinaBold: require("../assets/fonts/EinaBold.ttf"),
    EinaSemiBold: require("../assets/fonts/EinaSemiBold.ttf"),
    EinaRegular: require("../assets/fonts/EinaRegular.ttf"),
  });

  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    SplashScreen.hideAsync();
    return null;
  }

  return (
    <Stack
      onLayout={() => {
        onLayoutRootView();
      }}
    />
  );
};

export default Layout;
