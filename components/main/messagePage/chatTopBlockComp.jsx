import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { Octicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import UnavailableModal from "./subComps/unavailableModal";
import {
  CHECK_IS_ONLINE,
  CHECK_WITHIN_WORKTIME,
  FORMAT_TIME_LAST_SEEN,
  LOAD_PROFILE_THUMBNAIL,
} from "../../../constants/utilities";
import {
  FETCH_SERVICE_ARTISAN,
  FETCH_SERVICE_USER,
} from "../../../hooks/requests";

const screenWidth = Dimensions.get("screen").width;

export default function ChatTopBlockComp({
  guestId,
  firstName,
  lastName,
  image,
  isTyping,
}) {
  const router = useRouter();
  const [guestData, setGuestData] = useState();
  const [guestArtisanProfile, setGuestArtisanProfile] = useState();
  const [guestDataLoading, setGuestDataLoading] = useState(false);
  const [contactBtnIsLoading, setCntBtnIsLoading] = useState(false);

  useEffect(() => {
    FETCH_SERVICE_USER(guestId, setGuestData, setGuestDataLoading, () => {});
  }, []);
  useEffect(() => {
    if (guestData && guestData?.isArtisan) {
      FETCH_SERVICE_ARTISAN(guestId, setGuestArtisanProfile);
    }
  }, [guestData]);

  function goBack() {
    router.back();
  }

  function goToProfile() {
    router.navigate(`/main/profile?_id=${guestId}`);
  }

  //SHOW/HIDE UNAVAILABLE MODAL
  const [unavailableModalIsVisible, setUnavailableModalIsVisible] =
    useState(false);
  function showUnavailableModal() {
    setUnavailableModalIsVisible(true);
  }
  function hideUnavailableModal() {
    setUnavailableModalIsVisible(false);
  }
  ////////////////////////////////
  //SHOW/HIDE UNAVAILABLE MODAL
  function showContactNumber() {
    setCntBtnIsLoading(true);
    //CHECK IF WITHIN WORK TIME
    let dt = new Date();
    let curTime = `${String(dt.getHours()).padStart(2, "0")}:00`;

    let isWorkHour = CHECK_WITHIN_WORKTIME(
      curTime,
      guestArtisanProfile?.workHourFrom,
      guestArtisanProfile?.workHourTo
    );

    setTimeout(() => {
      if (isWorkHour === false || !guestArtisanProfile?.phoneNumber) {
        showUnavailableModal();
      } else {
        //OPEN CALL APP
        Linking.openURL(`tel:${guestArtisanProfile?.phoneNumber}`);
      }

      setCntBtnIsLoading(false);
    }, 2000);
  }
  ////////////////////////////////

  return (
    <>
      <View style={{ width: "100%" }}>
        <View style={styles.chatTopBlock}>
          <TouchableOpacity
            onPress={() => {
              goBack();
            }}
            style={styles.backBtn}
          >
            <Octicons name="arrow-left" size={20} color={COLORS.blueNormal} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              goToProfile();
            }}
            style={styles.topUserData}
          >
            <View style={styles.topUserThumbnail}>
              <View style={styles.topUserThumbnailImg}>
                <Image
                  source={LOAD_PROFILE_THUMBNAIL(image)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </View>
              {/**CHECK IF USER ONLINE OR OFFLINE */}
              {guestData &&
                guestData?.lastSeen &&
                CHECK_IS_ONLINE(guestData?.lastSeen) && (
                  <View style={styles.topUserThumbnailOnline}></View>
                )}
            </View>

            <View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Text style={styles.topUserName}>
                  {firstName} {lastName}
                </Text>
                {
                  //CHECK IF USER VEIRIFIED
                }
                {guestData && guestData?.isArtisan && (
                  <Image
                    source={require("../../../assets/icons/verified.png")}
                    style={{ width: 16, height: 16, objectFit: "cover" }}
                  />
                )}
              </View>
              {guestDataLoading || !guestData ? (
                <Text style={styles.topUserLastSeen}>Tap to see profile</Text>
              ) : (
                <>
                  {isTyping ? (
                    <Text
                      style={[
                        styles.topUserLastSeen,
                        { color: COLORS.blueNormal },
                      ]}
                    >
                      Typing...
                    </Text>
                  ) : (
                    <>
                      {guestData && guestData?.lastSeen && (
                        <>
                          {CHECK_IS_ONLINE(guestData?.lastSeen) ? (
                            <Text style={styles.topUserLastSeen}>Online</Text>
                          ) : (
                            <Text style={styles.topUserLastSeen}>
                              {guestData?.lastSeen &&
                                FORMAT_TIME_LAST_SEEN(guestData?.lastSeen)}
                            </Text>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              showContactNumber();
            }}
            style={styles.phoneBtn}
          >
            {contactBtnIsLoading ? (
              <ActivityIndicator size={"small"} color={COLORS.blueNormal} />
            ) : (
              <MaterialCommunityIcons
                name="phone"
                size={20}
                color={COLORS.blueNormal}
              />
            )}
          </TouchableOpacity>
        </View>

        {/**NO PAY WARNING */}
        <View style={styles.noPayBatch}>
          <Octicons name="alert" size={20} color={COLORS.yellowNormal} />
          <Text style={styles.noPayText}>
            Do not pay in advance until your work is completed
          </Text>
        </View>
      </View>
      {/**UNAVAILABLE MODAL */}
      {unavailableModalIsVisible && (
        <UnavailableModal
          hideModal={() => {
            hideUnavailableModal();
          }}
          profile={guestData}
          artisan={guestArtisanProfile}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  chatTopBlock: {
    width: "100%",
    height: 72,
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  backBtn: {
    width: 20,
    height: 20,
  },
  phoneBtn: {
    width: 44,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.blueNormal,
  },
  noPayBatch: {
    width: "100%",
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.yellowLight,
  },
  noPayText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.yellowNormal,
  },
  topUserData: {
    width: screenWidth - (20 + 44 + 24 + 32),
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  topUserThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 40,
    position: "relative",
  },
  topUserThumbnailImg: {
    width: 44,
    height: 44,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: COLORS.gray50,
    position: "relative",
  },
  topUserThumbnailOnline: {
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
  topUserName: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black900,
    textTransform: "capitalize",
  },
  topUserLastSeen: {
    fontFamily: "EinaRegular",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black400,
  },
});
