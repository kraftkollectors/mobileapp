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
import { COLORS } from "../../../../constants/themes/colors";
import { useRouter } from "expo-router";
import {
  CHECK_IS_ONLINE,
  CHECK_WITHIN_WORKTIME,
  LOAD_PROFILE_THUMBNAIL,
} from "../../../../constants/utilities";
import socketServices from "../../../../hooks/socket";
import { SOCKET_EVENTS } from "../../../../hooks/endpoints";
import {
  CheckLoginStatus,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../../constants/utilities/localStorage";

const screenWidth = Dimensions.get("screen").width;

export default function ProfileCard({
  profile,
  artisan,
  showUnavailableModal,
  userData,
  serviceData,
}) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState("");

  const [contactBtnIsLoading, setCntBtnIsLoading] = useState(false);
  const [messageBtnIsLoading, setMsgBtnIsLoading] = useState(false);

  const [attemptJoin, setAttemptJoin] = useState(false);

  //GOTO PROFILE
  function goToProfile() {
    router.navigate(`/main/profile?_id=${profile?._id}`);
  }

  //GOTO CHAT
  function joinChatRoom() {
    router.navigate(
      `/main/messages/chat?userId=${userData?._id}&guestId=${profile?._id}&fname=${profile?.firstName}&lname=${profile?.lastName}&thumbnail=${profile?.image}`
    );
  }

  useEffect(() => {
    if (isLogged === "logged" || isLogged === "not-verified") {
      if (attemptJoin) {
        setMsgBtnIsLoading(true);

        setTimeout(() => {
          setMsgBtnIsLoading(false);
          joinChatRoom();
        }, 3000);
        setAttemptJoin(false);
      }
    } else if (isLogged === "not-logged" && attemptJoin) {
      setAttemptJoin(false);
      router.push("/auth/signin/");
    } else {
      //SAVE CURRENT PATH
      StoreDataToMemory(
        LOCAL_STORAGE_PATH.redirectPath,
        `/main/service?_id=${serviceData?._id}`
      );

      //CHECK LOGIN STATUS
      CheckLoginStatus(setIsLogged);
    }
  }, [isLogged, attemptJoin, userData, profile, serviceData]);

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
        showUnavailableModal(true);
      } else {
        setNumberIsVisible(true);
      }

      setCntBtnIsLoading(false);
    }, 2000);
  }
  ////////////////////////////////

  return (
    <View style={styles.profileCard}>
      {/**TOP CARD */}
      <View>
        {/**PROFILE PHOTO */}
        <View style={styles.profilePhotoBlock}>
          <View style={styles.profilePhotoTab}>
            <View style={styles.profilePhotoTabInner}>
              <Image
                source={LOAD_PROFILE_THUMBNAIL(profile?.image)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </View>

            {/**ACTIVE STATE INDICATOR */}
            {profile &&
              profile?.lastSeen &&
              CHECK_IS_ONLINE(profile?.lastSeen) && (
                <View style={styles.activeStateIndicator}></View>
              )}
          </View>
        </View>

        {/**USER DETAILS */}
        <View style={styles.profileUserData}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <TouchableOpacity
              onPress={() => {
                goToProfile();
              }}
            >
              <Text style={styles.pudName}>
                {profile?.firstName} {profile?.lastName}
              </Text>
            </TouchableOpacity>

            {
              //CHECK IF USER VEIRIFIED
            }
            {profile.isArtisan && (
              <Image
                source={require("../../../../assets/icons/verified.png")}
                style={{ width: 16, height: 16, objectFit: "cover" }}
              />
            )}
          </View>

          <Text style={styles.pudRole}>{artisan?.areaOfSpecialization}</Text>

          <View style={styles.location}>
            <Octicons name="location" size={16} color={COLORS.black300} />
            <Text style={styles.pudLocation}>
              {!artisan?.state ? "unknown" : artisan?.state}
            </Text>
          </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    width: "100%",
    paddingVertical: 16,
    gap: 20,
    backgroundColor: COLORS.whiteBG,
  },
  profilePhotoBlock: {
    width: "100%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  profilePhotoTab: {
    width: 80,
    height: 80,
    borderRadius: 70,
    backgroundColor: COLORS.gray100,
  },
  profilePhotoTabInner: {
    width: 80,
    height: 80,
    borderRadius: 70,
    backgroundColor: COLORS.gray100,
    overflow: "hidden",
  },
  activeStateIndicator: {
    position: "absolute",
    bottom: 3,
    right: 2,
    width: 18.46,
    height: 18.46,
    borderRadius: 10,
    borderWidth: 1.67,
    borderColor: COLORS.whiteBG,
    backgroundColor: COLORS.greenSuccess,
  },
  profileUserData: {
    alignItems: "center",
    gap: 4,
  },
  pudName: {
    fontFamily: "EinaBold",
    fontSize: 20,
    lineHeight: 20,
    color: COLORS.black900,
    textTransform: "capitalize",
  },
  pudRole: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
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
    height: 40,
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
