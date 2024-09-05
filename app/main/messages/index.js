import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../constants/themes/colors";
import TitleBlockComp from "../../../components/main/messagePage/titleBlockComp";
import ChatThreadsComp from "../../../components/main/messagePage/chatThreadsComp";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";
import { FETCH_CHAT_THREADS } from "../../../hooks/requests";
import socketServices from "../../../hooks/socket";
import { SOCKET_EVENTS } from "../../../hooks/endpoints";

const screenHeight = Dimensions.get("screen").height;

export default function Messages() {
  const [socketConn, setSocketConn] = useState(false);
  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState();
  const [threadsLoading, setThreadsLoading] = useState(true);

  const [chatThreads, setChatThreads] = useState();

  useEffect(() => {
    if (userData && socketConn) {
      //ALERT SERVER I'M READY
      socketServices.emit(SOCKET_EVENTS.emit.login_room, {
        userId: userData?._id,
      });
    } else {
      setThreadsLoading(false);
    }
  }, [userData, socketConn]);

  useEffect(() => {
    if (socketConn) {
      //SERVER IS AWARE THAT I AM READY
      socketServices.on(SOCKET_EVENTS.on.logged_in, (res) => {
        // I AM READY
        if (res?.message.toLowerCase() === "user logged") {
          FETCH_CHAT_THREADS(
            userData?._id,
            accessToken,
            setChatThreads,
            setThreadsLoading,
            false
          );

          //CLEAR CHAT NOTICE
          StoreDataToMemory(LOCAL_STORAGE_PATH.hasUnreadChat, false);
        }
      });

      setInterval(() => {
        socketServices.on(SOCKET_EVENTS.on.sent_message, (res) => {
          // rearrange the chat heads - move this chat room to the top
          FETCH_CHAT_THREADS(
            userData?._id,
            accessToken,
            setChatThreads,
            setThreadsLoading,
            true
          );
        });
      }, 10000);

      socketServices.on(SOCKET_EVENTS.on.received_message, (res) => {
        // rearrange the chat heads - move this chat room to the top
        FETCH_CHAT_THREADS(
          userData?._id,
          accessToken,
          setChatThreads,
          setThreadsLoading,
          true
        );
      });
    }
  }, [socketConn]);

  /////////////////////
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (refreshing && userData && socketConn) {
      FETCH_CHAT_THREADS(
        userData?._id,
        accessToken,
        setChatThreads,
        setThreadsLoading,
        true
      );
    }
  }, [refreshing]);

  //FILTERS
  const [readView, setReadView] = useState("all"); //all, unread
  const [searchThreads, setSearchThreads] = useState("");

  return (
    <SafeAreaView
      style={{
        height: Platform.OS === "ios" ? screenHeight + 32 : screenHeight,
        backgroundColor: COLORS.whiteBG,
      }}
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
      }}
    >
      <DefaultStatusBar
        theme={"light"}
        setSocket={setSocketConn}
        socketConnect={socketConn}
        userId={userData && userData?._id}
        accessToken={accessToken}
      />
      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight:
            Platform.OS === "ios"
              ? screenHeight - (124 + 18)
              : screenHeight - (124 + 34),
          backgroundColor: COLORS.whiteBG,
          paddingBottom: 30,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/**TITLE BLOCK */}
        <TitleBlockComp
          activeGroup={readView}
          setActiveGroup={setReadView}
          search={searchThreads}
          setSearch={setSearchThreads}
        />

        {/**CHAT THREADS */}
        <ChatThreadsComp
          threads={chatThreads}
          isLoading={threadsLoading}
          userData={userData}
          activeGroup={readView}
          searchQuery={searchThreads}
        />
      </ScrollView>

      {/**NAVIGATION */}
      <BottomNavigationComp activePage={"messages"} />
    </SafeAreaView>
  );
}
