import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import { COLORS } from "../../../constants/themes/colors";
import ChatTopBlockComp from "../../../components/main/messagePage/chatTopBlockComp";
import ChatBottomBlockComp from "../../../components/main/messagePage/chatBottomBlockComp";
import { useLocalSearchParams } from "expo-router";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";
import {
  FETCH_CHATS,
  FETCH_MORE_CHATS,
  UPLOAD_PORTFOLIO_PHOTOS,
} from "../../../hooks/requests";
import ChatComp from "../../../components/main/messagePage/subComps/chatComp";
import socketServices from "../../../hooks/socket";
import { SOCKET_EVENTS } from "../../../hooks/endpoints";
import AlertBox from "../../../components/general/alertBox";
import ViewPhotoComp from "../../../components/main/messagePage/viewPhotoComp";
import { AppStyle } from "../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function ChatsPage() {
  const scrollViewRef = useRef();
  const [socketConn, setSocketConn] = useState(false);
  //ALERTS
  const [isAlert, showAlert] = useState(false);
  const [alertStat, setAlertStat] = useState("success");
  const [alertHeading, setAlertHead] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  function popAlert(status, heading, msg) {
    setAlertStat(status);
    setAlertHead(heading);
    setAlertMsg(msg);
    showAlert(true);
  }
  ///////////////////////////////////////////////

  const local = useLocalSearchParams();
  const userId = local?.userId;
  const guestId = local?.guestId;
  const fname = local?.fname;
  const lname = local?.lname;
  const thumbnail = local?.thumbnail;

  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState("");
  //FETCH USER DATA
  useEffect(() => {
    GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
    GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
  }, []);
  ///////////

  const [messages, setMessages] = useState();
  const [messageLoading, setMessageLoading] = useState(true);

  useEffect(() => {
    if (userData && accessToken) {
      //ALERT SERVER I'M READY
      const data = { senderId: userData?._id, receiverId: guestId };
      socketServices.emit(SOCKET_EVENTS.emit.join_room, data);
    }
  }, [userData, accessToken]);

  const [typing, setTyping] = useState(false);
  const [myChat, setMyChat] = useState("");
  const [myPhotos, setMyPhotos] = useState();
  const [photosLoading, setPhotosLoading] = useState(false);

  useEffect(() => {
    if (socketConn) {
      if (myChat && myChat.length > 0) {
        socketServices.emit(SOCKET_EVENTS.emit.start_typing, {
          senderId: userData ? userData?._id : userId,
          receiverId: guestId,
        });
      } else {
        socketServices.emit(SOCKET_EVENTS.emit.stop_typing, {
          senderId: userData ? userData?._id : userId,
          receiverId: guestId,
        });
      }
    }
  }, [myChat, socketConn]);

  async function sendMessage() {
    if (socketConn && myChat && myChat.trim().length > 0) {
      socketServices.emit(SOCKET_EVENTS.emit.send_message, {
        message: `${myChat.trim()}`,
        senderId: `${userData ? userData?._id : userId}`,
        receiverId: `${guestId}`,
        type: "text",
        data: `${myChat.trim()}`,
      });
      //CLEAR CHAT INPUT
      setMyChat("");
    }
  }

  async function sendMessageFile(files) {
    setPhotosLoading(true);
    UPLOAD_PORTFOLIO_PHOTOS(files, setMyPhotos, popAlert);
  }

  useEffect(() => {
    if (myPhotos && myPhotos.length > 0) {
      if (socketConn) {
        socketServices.emit(SOCKET_EVENTS.emit.send_message, {
          message: `${myPhotos.length} file${myPhotos.length > 1 ? "s" : ""}`,
          senderId: `${userData ? userData?._id : userId}`,
          receiverId: `${guestId}`,
          type: "file",
          data: myPhotos,
        });
        //CLEAR CHAT INPUT
        setMyChat("");
        setMyPhotos();
        setPhotosLoading(false);
      }
    }
  }, [myPhotos]);

  const [lastMsgTime, setLMT] = useState("");
  const [hasNxtPgn, setHNP] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [moreMsgIsLoading, setMMIL] = useState(false);

  useEffect(() => {
    if (loadMore && hasNxtPgn) {
      FETCH_MORE_CHATS(
        userData ? userData?._id : userId,
        guestId,
        accessToken,
        setMessages,
        setMMIL,
        setHNP,
        lastMsgTime,
        setLMT
      );

      setLoadMore(false);
    }
  }, [loadMore, hasNxtPgn]);

  //***SOCKET EVENTS***//
  useEffect(() => {
    if (socketConn) {
      //JOINING ROOM
      socketServices.on(SOCKET_EVENTS.on.joined_room, (data) => {
        FETCH_CHATS(
          userData ? userData?._id : userId,
          guestId,
          accessToken,
          setMessages,
          setMessageLoading,
          setHNP,
          setLMT
        );
      });

      //TYPING
      socketServices.on(SOCKET_EVENTS.on.started_typing, (res) => {
        res.senderId === guestId && setTyping(true);
      });
      socketServices.on(SOCKET_EVENTS.on.stopped_typing, (res) => {
        res.senderId === guestId && setTyping(false);
      });

      //MESSAGES
      socketServices.on(SOCKET_EVENTS.on.new_message, (res) => {
        if (res && res.data) {
          setMessages((prev) => [...prev, res.data]);
        }
      });
    }
  }, [socketConn]);
  /////////////////////

  const [viewPhotos, setViewPhotos] = useState();

  //GROUPING MESSAGES HANDLE
  const [groupedMessages, setGroupedMessages] = useState([]);
  useEffect(() => {
    if (messages) {
      // Callback function to Group Elements
      function stripDate(timestamp) {
        var dt = new Date(timestamp);
        var seconds = Math.floor((new Date() - dt) / 1000);

        var interval = seconds / 86400;

        if (interval > 1) {
          if (interval >= 2) {
            return `${String(dt.getDate()).padStart(2, "0")}/${String(
              dt.getMonth() + 1
            ).padStart(2, "0")}/${dt.getFullYear()}`;
          }
          return "Yesterday";
        } else {
          return "Today";
        }
      }

      let newClone = Object.values(
        messages.reduce((grp, item) => {
          if (!grp[stripDate(item?.timestamp)])
            grp[stripDate(item?.timestamp)] = {
              date: stripDate(item?.timestamp),
              chats: [],
            };
          grp[stripDate(item?.timestamp)].chats.push(item);
          return grp;
        }, {})
      );
      setGroupedMessages([...newClone]);
    }
  }, [messages]);

  return (
    <SafeAreaView
      style={[
        AppStyle.safeArea,
        {
          backgroundColor: COLORS.whiteBG,
          flexDirection: "column",
          justifyContent: "space-between",
        },
      ]}
    >
      <DefaultStatusBar
        theme={"light"}
        setSocket={setSocketConn}
        socketConnect={socketConn}
        userId={userData && userData?._id}
        accessToken={accessToken}
      />

      {/**TOP BAR */}
      <ChatTopBlockComp
        guestId={guestId}
        firstName={fname}
        lastName={lname}
        image={thumbnail}
        isTyping={typing}
      />

      {/**CHAT DISPLAY */}

      <ScrollView
        contentContainerStyle={{
          width: "100%",
          minHeight: screenHeight - (160 + 72),
          paddingVertical: 30,
          paddingHorizontal: 16,
          gap: 8,
        }}
        ref={scrollViewRef}
        onContentSizeChange={(w, h) => {
          let sh = screenHeight - (72 + 160);

          scrollViewRef?.current?.scrollTo({
            x: 0,
            y: sh,
            animated: true,
          });

          if (messages && messages?.length <= 10) {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
          }
        }}
      >
        {hasNxtPgn && (
          <View style={styles.hasNxtPgTab}>
            {moreMsgIsLoading ? (
              <TouchableOpacity style={styles.loadMoreBtn}>
                <ActivityIndicator size={20} color={COLORS.black300} />

                <MaterialCommunityIcons
                  name="chevron-up"
                  size={19}
                  color={COLORS.black300}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setLoadMore(true);
                }}
                style={styles.loadMoreBtn}
              >
                <Text style={styles.loadMoreBtnText}>See more</Text>

                <MaterialCommunityIcons
                  name="chevron-up"
                  size={19}
                  color={COLORS.black300}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        <>
          {groupedMessages &&
            groupedMessages.map((itm, indx) => (
              <View key={indx} style={styles.groupContainer}>
                <View style={styles.groupDateBlock}>
                  <View style={styles.groupDateTab}>
                    <Text style={styles.groupDate}>{itm.date}</Text>
                  </View>
                </View>

                <View style={styles.chatGroups}>
                  {itm?.chats.map((item, index) => (
                    <ChatComp
                      key={index}
                      data={item}
                      userData={userData}
                      socketConnected={socketConn}
                      showPhotos={setViewPhotos}
                    />
                  ))}
                </View>
              </View>
            ))}
        </>
      </ScrollView>

      {messageLoading && (
        <View
          style={{
            width: "100%",
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Text
            style={{
              fontFamily: "EinaSemiBold",
              fontSize: 14,
              color: COLORS.black200,
            }}
          >
            Loading messages...
          </Text>
          <ActivityIndicator size={"small"} color={COLORS.black200} />
        </View>
      )}

      {/**BOTTOM BAR */}
      <ChatBottomBlockComp
        typedText={myChat}
        setTypedText={setMyChat}
        sendMessage={() => {
          sendMessage();
        }}
        sendPhoto={sendMessageFile}
        popAlert={popAlert}
        isLoading={photosLoading}
      />

      {/**VIEW PHOTO */}
      {viewPhotos && (
        <ViewPhotoComp
          guestName={`${fname} ${lname}`}
          photoList={viewPhotos}
          setPhotoList={setViewPhotos}
        />
      )}

      {/**ALERT BOX */}
      {isAlert && (
        <AlertBox
          status={alertStat}
          heading={alertHeading}
          message={alertMsg}
          showAlert={showAlert}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadMoreBtn: {
    width: 120,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadMoreBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black400,
  },
  hasNxtPgTab: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
  },
  chatGroups: {
    width: "100%",
    gap: 8,
  },
  groupContainer: {
    width: "100%",
  },
  groupDateBlock: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 32,
    paddingBottom: 24,
  },
  groupDateTab: {
    width: "auto",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.black50,
    borderRadius: 4,
  },
  groupDate: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black200,
  },
});
