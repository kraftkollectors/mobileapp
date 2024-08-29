import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import ModalBtn from "./modalBtn";
import { FORMAT_TIME_STRING_12H } from "../../../../constants/utilities";
import { useRouter } from "expo-router";
import {
  CheckLoginStatus,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../../constants/utilities/localStorage";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function UnavailableModal({
  hideModal,
  profile,
  artisan,
  serviceData,
  userData,
}) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState("");

  const [messageBtnIsLoading, setMsgBtnIsLoading] = useState(false);

  const [attemptJoin, setAttemptJoin] = useState(false);

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
          hideModal();
          joinChatRoom();
        }, 3000);
        setAttemptJoin(false);
      }
    } else if (isLogged === "not-logged" && attemptJoin) {
      setAttemptJoin(false);
      hideModal();
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
  }, [isLogged, attemptJoin, profile, serviceData]);

  return (
    <View style={styles.popupModalFrame}>
      <View style={styles.popupModalBox}>
        <TouchableOpacity onPress={hideModal} style={styles.modalCancelBtn}>
          <Octicons name="x" size={24} color={COLORS.black500} />
        </TouchableOpacity>

        <View style={styles.modalTextTab}>
          <Text style={styles.modalHeading}>Unavailable</Text>
          <Text style={styles.modalBody}>
            <Text style={styles.modalBodyBold}>
              {profile?.firstName} {profile?.lastName}
            </Text>{" "}
            is not available for calls right now. They are available from{" "}
            <Text style={styles.modalBodyBold}>
              {artisan && artisan?.workHourFrom
                ? FORMAT_TIME_STRING_12H(artisan?.workHourFrom)
                : artisan?.workHourFrom}
            </Text>{" "}
            to{" "}
            <Text style={styles.modalBodyBold}>
              {artisan && artisan?.workHourTo
                ? FORMAT_TIME_STRING_12H(artisan?.workHourTo)
                : artisan?.workHourTo}
            </Text>
            .
          </Text>
          <Text style={styles.modalBody}>
            You can leave a message for them to get back to you.
          </Text>
        </View>

        <ModalBtn
          btnText={"Leave a Message"}
          isLoading={messageBtnIsLoading}
          handleClick={() => {
            setAttemptJoin(true);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popupModalFrame: {
    width: screenWidth,
    height: screenHeight,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  popupModalBox: {
    width: "100%",
    height: "auto",
    borderRadius: 8,
    backgroundColor: COLORS.whiteBG,
    paddingHorizontal: 16,
    paddingVertical: 32,
    gap: 8,
  },
  modalCancelBtn: {
    width: 24,
    height: 24,
    marginLeft: "auto",
  },
  modalTextTab: {
    width: "100%",
    gap: 16,
  },
  modalHeading: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 22 : 24,
    lineHeight: 40,
    color: COLORS.yellowNormal,
    textAlign: "center",
  },
  modalBody: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
  modalBodyBold: {
    color: COLORS.black900,
  },
});
