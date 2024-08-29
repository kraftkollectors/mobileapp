import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../../../constants/themes/colors";
import {
  FORMAT_CHAT_TIME,
  LOAD_SERVICE_THUMBNAIL,
} from "../../../../constants/utilities";
import socketServices from "../../../../hooks/socket";
import { SOCKET_EVENTS } from "../../../../hooks/endpoints";

export default function ChatComp({
  data,
  userData,
  socketConnected,
  showPhotos,
}) {
  const isMine =
    userData?._id === data?.sender?._id || userData?._id === data?.senderId;
  const hasPhoto = data?.type === "file";

  //MARK RECIEVED CHAT AS SEEN
  async function markSeen() {
    socketServices.emit(SOCKET_EVENTS.emit.mark_seen, {
      senderId: data?.sender?._id,
      receiverId: data?.receiver?._id,
      chatId: data?._id,
      status: "seen",
    });
  }

  useEffect(() => {
    if (socketConnected) {
      if (data?.receiver?._id === userData?._id && data?.status != "seen") {
        markSeen();
      }
    }
  }, [socketConnected]);

  return (
    <View
      style={[
        styles.chatComp,
        isMine ? styles.chatIsMine : styles.chatIsNotMine,
      ]}
    >
      {hasPhoto && (
        <TouchableOpacity
          onPress={() => {
            showPhotos([...data?.data]);
          }}
          style={styles.chatPhoto}
        >
          <Image
            source={LOAD_SERVICE_THUMBNAIL(data?.data[0])}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {data?.data.length > 1 && (
            <View
              style={[
                styles.chatPhotoTag,
                isMine
                  ? { backgroundColor: COLORS.blueLight }
                  : { backgroundColor: COLORS.whiteBG },
              ]}
            >
              <Text style={styles.chatPhotoTagText}>
                +{data?.data.length - 1} Photo
                {data?.data.length - 1 === 1 ? "" : "s"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      {data?.message && !hasPhoto && (
        <View style={[{ flex: 1, flexGrow: 1 }]}>
          <Text style={styles.chatText}>{data?.message}</Text>
        </View>
      )}
      <View style={styles.chatMetaTab}>
        <Text style={styles.chatDateTime}>
          {data ? FORMAT_CHAT_TIME(data?.timestamp) : "----"}
        </Text>
        {isMine && (
          <Ionicons
            name={
              data?.status === "seen"
                ? "checkmark-done-outline"
                : "checkmark-outline"
            } //checkmark-outline && checkmark-done-outline
            size={16}
            color={COLORS.black300}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatComp: {
    width: "auto",
    minWidth: 130,
    maxWidth: "80%",
    height: "auto",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  chatText: {
    width: "100%",
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  chatMetaTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  chatDateTime: {
    fontFamily: "EinaRegular",
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.black300,
    letterSpacing: 1.2,
  },
  chatIsMine: {
    backgroundColor: COLORS.blueLight,
    marginLeft: "auto",
  },
  chatIsNotMine: {
    backgroundColor: COLORS.whiteBG,
    marginRight: "auto",
  },
  chatPhoto: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.black50,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  chatPhotoTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chatPhotoTagText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    color: COLORS.black500,
  },
});
