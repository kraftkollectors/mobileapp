import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { COLORS } from "../../../constants/themes/colors";
import ProfileNavBarTab from "./subComp/profileNavBarTab";
import { useRouter } from "expo-router";
import {
  CHECK_IS_ONLINE,
  CHECK_WITHIN_WORKTIME,
  FORMAT_DATE_MEMBER_SINCE,
  LOAD_PROFILE_THUMBNAIL,
} from "../../../constants/utilities";
import socketServices from "../../../hooks/socket";
import { SOCKET_EVENTS } from "../../../hooks/endpoints";

const screenWidth = Dimensions.get("screen").width;

export default function ProfileCardComp({
  isVisible,
  setIsVisible,
  setShowModal,
  profile,
  artisan,
  userData,
}) {
  const router = useRouter();
  const [contactBtnIsLoading, setCntBtnIsLoading] = useState(false);
  const [messageBtnIsLoading, setMsgBtnIsLoading] = useState(false);

  const [attemptJoin, setAttemptJoin] = useState(false);

  function goBack() {
    router.back();
  }

  //GOTO CHAT
  function joinChatRoom() {
    router.navigate(
      `/main/messages/chat?userId=${userData?._id}&guestId=${profile?._id}&fname=${profile?.firstName}&lname=${profile?.lastName}&thumbnail=${profile?.image}`
    );
  }

  useEffect(() => {
    socketServices.on(SOCKET_EVENTS.on.joined_room, (data) => {
      console.log("Socket return: ", data);
    });
  }, []);

  useEffect(() => {
    if (attemptJoin) {
      setMsgBtnIsLoading(true);

      const data = { senderId: userData?._id, receiverId: profile?._id };
      socketServices.emit(SOCKET_EVENTS.emit.join_room, data);

      setAttemptJoin(false);
      setTimeout(() => {
        joinChatRoom();
        setMsgBtnIsLoading(false);
      }, 2500);
    }
  }, [attemptJoin]);

  //SHOW/HIDE UNAVAILABLE MODAL
  const [numberIsVisible, setNumberIsVisible] = useState(false);
  function showContactNumber() {
    setCntBtnIsLoading(true);
    //CHECK IF WITHIN WORK TIME
    let dt = new Date();
    let curTime = `${String(dt.getHours()).padStart(2, "0")}:00`;

    let isWorkHour = CHECK_WITHIN_WORKTIME(
      curTime,
      artisan?.workHourFrom,
      artisan?.workHourTo
    );

    setTimeout(() => {
      if (isWorkHour === false || !artisan?.phoneNumber) {
        setShowModal(true);
      } else {
        setNumberIsVisible(true);
      }

      setCntBtnIsLoading(false);
    }, 2000);
  }
  ////////////////////////////////

  return (
    <View style={styles.profileCard}>
      {/**BACK BTN */}
      <View style={styles.profileBackBtnTab}>
        <TouchableOpacity
          onPress={() => {
            goBack();
          }}
          style={styles.profileBackBtn}
        >
          <Octicons name="chevron-left" size={24} color={COLORS.black300} />
        </TouchableOpacity>
      </View>

      {/**TOP CARD */}
      <View>
        {/**PROFILE PHOTO */}
        <View style={styles.profilePhotoBlock}>
          <View style={styles.profilePhotoTab}>
            <View style={styles.profileThumbnailImg}>
              <Image
                source={LOAD_PROFILE_THUMBNAIL(profile?.image)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </View>
            {/**CHECK IF USER ONLINE OR OFFLINE */}
            {profile &&
              profile?.lastSeen &&
              CHECK_IS_ONLINE(profile?.lastSeen) && (
                <View style={styles.profileThumbnailOnline}></View>
              )}
          </View>
        </View>

        {/**USER DETAILS */}
        <View style={styles.profileUserData}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={styles.pudName}>
              {profile?.firstName} {profile?.lastName}
            </Text>
            {
              //CHECK IF USER VEIRIFIED
            }
            {profile.isArtisan && (
              <Image
                source={require("../../../assets/icons/verified.png")}
                style={{ width: 16, height: 16, objectFit: "cover" }}
              />
            )}
          </View>
          {artisan && (
            <>
              <Text style={styles.pudRole}>
                {artisan?.areaOfSpecialization}
              </Text>
              {artisan.state && (
                <View style={styles.location}>
                  <Octicons name="location" size={16} color={COLORS.black300} />
                  <Text style={styles.pudLocation}>{artisan?.state}</Text>
                </View>
              )}
            </>
          )}
          <Text style={styles.pudMeme}>
            Member Since {FORMAT_DATE_MEMBER_SINCE(profile?.createdAt)}
          </Text>
        </View>

        {/**CTA */}
        <View style={styles.ctaBlock}>
          <TouchableOpacity
            style={[styles.ctaTab, { backgroundColor: COLORS.blueNormal }]}
            onPress={() => {
              setAttemptJoin(true);
            }}
          >
            {messageBtnIsLoading ? (
              <ActivityIndicator size={"small"} color={COLORS.whiteBG} />
            ) : (
              <>
                <Octicons name="mail" size={20} color={COLORS.whiteBG} />
                <Text style={[styles.ctaText, { color: COLORS.whiteBG }]}>
                  Message
                </Text>
              </>
            )}
          </TouchableOpacity>

          {numberIsVisible ? (
            <TouchableOpacity
              style={[styles.ctaTab, { backgroundColor: COLORS.whiteBG }]}
              onPress={() => {
                Linking.openURL(`tel:${artisan?.phoneNumber}`);
              }}
            >
              <MaterialCommunityIcons
                name="phone-outline"
                size={20}
                color={COLORS.blueNormal}
              />
              <Text style={[styles.ctaText, { color: COLORS.blueNormal }]}>
                {artisan?.phoneNumber}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                showContactNumber();
              }}
              style={[styles.ctaTab, { backgroundColor: COLORS.whiteBG }]}
            >
              {contactBtnIsLoading ? (
                <ActivityIndicator size={"small"} color={COLORS.blueNormal} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="phone-outline"
                    size={20}
                    color={COLORS.blueNormal}
                  />
                  <Text style={[styles.ctaText, { color: COLORS.blueNormal }]}>
                    Show Contact
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/**BOTTOM NAV BAR */}
      <View style={styles.profileNavBar}>
        <ProfileNavBarTab
          tabTitle={"posts"}
          isActive={isVisible == "post" ? true : false}
          handleClick={() => setIsVisible("post")}
        />

        <ProfileNavBarTab
          tabTitle={"contact info"}
          isActive={isVisible == "contact" ? true : false}
          handleClick={() => setIsVisible("contact")}
        />

        <ProfileNavBarTab
          tabTitle={"about me"}
          isActive={isVisible == "about" ? true : false}
          handleClick={() => setIsVisible("about")}
        />

        <ProfileNavBarTab
          tabTitle={"reviews"}
          isActive={isVisible == "review" ? true : false}
          handleClick={() => setIsVisible("review")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    width: "100%",
    paddingTop: 0,
    gap: 20,
    backgroundColor: COLORS.whiteBG,
  },
  profileBackBtnTab: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  profileBackBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  profileNavBar: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  profilePhotoBlock: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePhotoTab: {
    width: 120,
    height: 120,
    position: "relative",
  },
  profileThumbnailImg: {
    width: 120,
    height: 120,
    borderRadius: 90,
    overflow: "hidden",
    backgroundColor: COLORS.gray50,
  },
  profileThumbnailOnline: {
    width: 18.46,
    height: 18.46,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.whiteBG,
    backgroundColor: COLORS.greenSuccess,
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  profileUserData: {
    alignItems: "center",
    gap: 4,
  },
  pudName: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.black900,
    textTransform: "capitalize",
  },
  pudRole: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black300,
    textTransform: "capitalize",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  pudLocation: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
    textTransform: "capitalize",
  },
  pudMeme: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black200,
  },
  ctaBlock: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  ctaTab: {
    width: (screenWidth - (8 + 32)) / 2,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.blueNormal,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
  },
});
