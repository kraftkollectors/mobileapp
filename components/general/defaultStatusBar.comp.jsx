import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { COLORS } from "../../constants/themes/colors";
import socketServices from "../../hooks/socket";
import { UPDATE_LAST_SEEN } from "../../hooks/requests";
import { SOCKET_EVENTS } from "../../hooks/endpoints";
import { PROCESS_NEW_MESSAGE_NOTICE } from "../../hooks/notifications";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../constants/utilities/localStorage";

export default function DefaultStatusBar({
  theme,
  setSocket,
  socketConnect,
  userId,
  accessToken,
}) {
  const [statusBackgroundColor, setStatusBackgroundColor] = useState("");
  const [statusBarStyle, setStatusBarStyle] = useState("dark");
  const [systemNotification, setSystemNotification] = useState(false);
  const [hasNotificationUrl, setHNU] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (theme === "dark") {
      setStatusBackgroundColor(COLORS.blueDark);
      setStatusBarStyle("light");
    } else if (theme === "blue") {
      setStatusBackgroundColor(COLORS.blueNormal);
      setStatusBarStyle("light");
    } else {
      setStatusBackgroundColor(COLORS.whiteBG);
      setStatusBarStyle("dark");
    }

    GetDataFromMemory(
      LOCAL_STORAGE_PATH.systemNotification,
      setSystemNotification
    );

    GetDataFromMemory(LOCAL_STORAGE_PATH.notificationUrl, setHNU);

    socketServices.initializeSocket(setSocket);
  }, []);

  //NOTIFICATION HANDLER
  useEffect(() => {
    if (hasNotificationUrl && hasNotificationUrl.length > 1) {
      StoreDataToMemory(LOCAL_STORAGE_PATH.notificationUrl, "");

      setTimeout(() => {
        console.log("sending: ", hasNotificationUrl);
        router.navigate(hasNotificationUrl);
      }, 1500);
    }
  }, [hasNotificationUrl]);

  useEffect(() => {
    if (userId && accessToken) {
      //UPDATE LAST SEEN
      setInterval(() => {
        UPDATE_LAST_SEEN(userId, accessToken);
      }, 60000);
    }

    if (userId && socketConnect) {
      //ALERT SERVER I'M READY
      socketServices.emit(SOCKET_EVENTS.emit.login_room, {
        userId: userId,
      });
    }
  }, [userId, accessToken, socketConnect]);

  //LISTEN FOR NEW MESSAGES

  useEffect(() => {
    if (socketConnect && userId) {
      socketServices.on(SOCKET_EVENTS.on.received_message, (res) => {
        //SAVE NOTIFICATION
        StoreDataToMemory(LOCAL_STORAGE_PATH.hasUnreadChat, "yes");

        if (systemNotification) {
          // SEND NOTIFICATION
          PROCESS_NEW_MESSAGE_NOTICE(userId, res.data);
        }
      });
    }
  }, [socketConnect, systemNotification, userId]);

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={statusBackgroundColor}
        style={statusBarStyle}
        translucent={true}
      />
      <Stack.Screen
        options={{
          headerShown: false,
          navigationBarHidden: false,
          navigationBarColor: statusBackgroundColor,
          animation: "none",
        }}
      />
    </>
  );
}
