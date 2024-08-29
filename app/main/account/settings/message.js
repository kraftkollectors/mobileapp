import { Dimensions, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import { styles } from "./settings.style";
import SettingTextareaTab from "../../../../components/main/accountPage/subComps/settingTextareaTab";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import { FETCH_SERVICE_ARTISAN } from "../../../../hooks/requests";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../../constants/utilities/localStorage";
import AlertBox from "../../../../components/general/alertBox";

const screenHeight = Dimensions.get("screen").height;

export default function AwayMessage() {
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

  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState("");
  const [artisanProfile, setArtisanProfile] = useState();

  useEffect(() => {
    if (userData && userData.isArtisan) {
      FETCH_SERVICE_ARTISAN(userData?._id, setArtisanProfile);
    }
  }, [userData]);

  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [awayMessage, setAwayMessage] = useState("");

  useEffect(() => {
    if (artisanProfile && artisanProfile.awayMessage) {
      setAwayMessage(artisanProfile?.awayMessage);
    }
  }, [artisanProfile]);

  //TAKE ERRORS
  const [msgErr, setMsgErr] = useState("");

  function validateInputs() {
    //CLEAR ERRORS
    setMsgErr("");

    if (awayMessage.trim() === "") {
      setMsgErr("What should we show your clients if you aren't available?");
      return;
    }

    let numOfWords = awayMessage.trim().split(" ");
    if (numOfWords.length < 5) {
      setMsgErr("Away message must be atleast 5 words long");
      return;
    }

    //CONTINUE IF NO ERROR
    setBtnIsLoading(true);
  }

  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        awayMessage: `${awayMessage.trim()}`,
        userId: `${userData?._id}`,
        userEmail: `${userData?.email}`,
      };

      try {
        axios
          .patch(END_POINT.updateArtisanProfile(userData?._id), formData, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${accessToken}`,
            },
          })
          .then((res) => {
            //console.log(res.data);
            setBtnIsLoading(false);
            if (res.data.statusCode === 201) {
              //SHOW ALERT
              popAlert(
                "success",
                "Profile Update Successful",
                "You have successfully updated your away message"
              );
            }
          })
          .catch((err) => {
            console.log(err.response.data);
            setBtnIsLoading(false);
            //SHOW ALERT
            popAlert(
              "error",
              "Profile Update Failed",
              "Something went wrong. Please try again"
            );
          });
      } catch (error) {
        setBtnIsLoading(false);
        console.log("Net Error: ", error.message);
        //SHOW ALERT
        popAlert(
          "error",
          "Profile Update Failed",
          "Network Error. Check your connection and try again"
        );
      }
    }
  }, [btnIsLoading]);

  return (
    <SafeAreaView
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
      }}
      style={{
        height: Platform.OS === "ios" ? screenHeight + 32 : screenHeight,
        backgroundColor: COLORS.whiteBG,
      }}
    >
      <DefaultStatusBar
        theme={"light"}
        setSocket={setSocketConn}
        socketConnect={socketConn}
        userId={userData && userData?._id}
        accessToken={accessToken}
      />

      {/**SETTINGS HEADER */}
      <SettingsHeaderComp pageTitle={"Away Message"} />

      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - (80 + 48),
          backgroundColor: COLORS.gray100,
          paddingVertical: 24,
          gap: 24,
        }}
      >
        {/**AWAY MESSAGE */}
        <View style={styles.pageSection}>
          <SettingTextareaTab
            label={"Away Message"}
            placeholder={"Ex. Thank you for reaching out"}
            input={awayMessage}
            setInput={setAwayMessage}
            hasError={msgErr}
          />

          <Text
            style={{
              fontFamily: "EinaSemiBold",
              fontSize: 14,
              lineHeight: 20,
              color: COLORS.black300,
            }}
          >
            Set your away message to automatically reply when you are offline.
          </Text>

          <SaveBtn
            btnText={"Save Changes"}
            handleClick={() => {
              validateInputs();
            }}
            isLoading={btnIsLoading}
          />
        </View>
      </ScrollView>

      {/**ALERT BOX */}
      {isAlert && (
        <AlertBox
          status={alertStat}
          heading={alertHeading}
          message={alertMsg}
          showAlert={showAlert}
        />
      )}

      {/**NAVIGATION */}
      <BottomNavigationComp activePage={"account"} />
    </SafeAreaView>
  );
}
