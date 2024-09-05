import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../../../constants/themes/colors";
import { useRouter } from "expo-router";
import {
  CHECK_IS_ONLINE,
  FORMAT_TIME_AGO,
  LOAD_PROFILE_THUMBNAIL,
} from "../../../../constants/utilities";
import {
  FETCH_SERVICE_ARTISAN,
  FETCH_SERVICE_USER,
} from "../../../../hooks/requests";

const screenWidth = Dimensions.get("screen").width;

export default function ChatThread({ data, id }) {
  const router = useRouter();
  const [guestData, setGuestData] = useState();
  const [guestArtisanProfile, setGuestArtisanProfile] = useState();
  const [guestDataLoading, setGuestDataLoading] = useState(false);

  const guestId =
    id === data?.messageDoc.receiverId
      ? data?.messageDoc.senderId
      : data?.messageDoc.receiverId;

  useEffect(() => {
    FETCH_SERVICE_USER(guestId, setGuestData, setGuestDataLoading, () => {});
  }, []);
  useEffect(() => {
    if (guestData && guestData?.isArtisan) {
      FETCH_SERVICE_ARTISAN(guestId, setGuestArtisanProfile);
    }
  }, [guestData]);

  //GOTO CHAT
  function joinChatRoom() {
    router.navigate(
      `/main/messages/chat?userId=${id}&guestId=${data?._id}&fname=${data?.firstName}&lname=${data?.lastName}&thumbnail=${data?.image}`
    );
  }

  return (
    <TouchableOpacity
      onPress={() => {
        joinChatRoom();
      }}
      style={styles.chatThread}
    >
      <View style={styles.chatThreadThumbnail}>
        <View style={styles.chatThreadThumbnailImg}>
          <Image
            source={LOAD_PROFILE_THUMBNAIL(data?.image)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </View>
        {/**CHECK IF USER ONLINE OR OFFLINE */}
        {guestData &&
          guestData?.lastSeen &&
          CHECK_IS_ONLINE(guestData?.lastSeen) && (
            <View style={styles.chatThreadThumbnailOnline}></View>
          )}
      </View>

      <View style={styles.ctDetails}>
        <View style={styles.ctdCont}>
          <View
            style={{
              maxWidth: screenWidth - (48 + 12 + 32 + 4 + 92),
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={styles.ctdUserName} numberOfLines={1}>
              {data?.firstName} {data?.lastName}
            </Text>
            {
              //CHECK IF USER VEIRIFIED
            }
            {guestData && guestData.isArtisan && (
              <Image
                source={require("../../../../assets/icons/verified.png")}
                style={{ width: 16, height: 16, objectFit: "cover" }}
              />
            )}
          </View>

          <Text style={styles.ctdTimeAgo}>
            {FORMAT_TIME_AGO(data?.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.ctdCont}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {data?.messageDoc.senderId === id && (
              <Text style={styles.ctdLastChatYou}>You: </Text>
            )}
            {data?.messageDoc.type === "file" && (
              <Ionicons
                name="image"
                size={16}
                color={
                  data?.messageDoc.receiverId === id &&
                  data?.messageDoc.status != "seen"
                    ? COLORS.black500
                    : COLORS.black300
                }
              />
            )}
            <Text
              style={[
                styles.ctdLastChat,
                data?.messageDoc.receiverId === id &&
                data?.messageDoc.status != "seen"
                  ? { fontFamily: "EinaBold", color: COLORS.black500 }
                  : { fontFamily: "EinaRegular", color: COLORS.black300 },
              ]}
              numberOfLines={1}
            >
              {data?.lastMessage}
            </Text>
          </View>

          {/*<View style={styles.ctdUnread}>
            <Text style={styles.ctdUnreadText}>2</Text>
          </View>*/}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatThread: {
    width: "100%",
    height: 80,
    padding: 16,
    flexDirection: "row",
    gap: 12,
  },
  chatThreadThumbnail: {
    width: 48,
    height: 48,
    position: "relative",
  },
  chatThreadThumbnailImg: {
    width: 48,
    height: 48,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: COLORS.gray50,
    position: "relative",
  },
  chatThreadThumbnailOnline: {
    width: 16,
    height: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.whiteBG,
    backgroundColor: COLORS.greenSuccess,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  ctDetails: {
    width: screenWidth - (48 + 12 + 32),
    height: 48,
    justifyContent: "center",
    gap: 4,
  },
  ctdCont: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  ctdUserName: {
    maxWidth: "95%",
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  ctdTimeAgo: {
    fontFamily: "EinaSemiBold",
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.black200,
  },
  ctdLastChatYou: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  ctdLastChat: {
    width: screenWidth - (48 + 12 + 32 + 20 + 8),
    fontSize: 14,
    lineHeight: 20,
  },
  ctdUnread: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: COLORS.blueNormal,
    alignItems: "center",
    justifyContent: "center",
  },
  ctdUnreadText: {
    fontFamily: "EinaRegular",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.whiteBG,
  },
});
