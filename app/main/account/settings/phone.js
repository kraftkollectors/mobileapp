import { Dimensions, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import { styles } from "./settings.style";
import SettingInputTab from "../../../../components/main/accountPage/subComps/settingInputTab";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import { FETCH_SERVICE_ARTISAN } from "../../../../hooks/requests";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../../constants/utilities/localStorage";
import AlertBox from "../../../../components/general/alertBox";
import { AppStyle } from "../../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function ChangePhone() {
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
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (artisanProfile && artisanProfile.phoneNumber) {
      setPhoneNumber(artisanProfile?.phoneNumber);
    }
  }, [artisanProfile]);

  //TAKE ERRORS
  const [phoneErr, setPhoneErr] = useState("");

  function validateInputs() {
    //CLEAR ERRORS
    setPhoneErr("");

    if (phoneNumber.trim() === "" || phoneNumber.length < 8) {
      setPhoneErr("Please provide an accurate phone number");
      return;
    }

    //CONTINUE IF NO ERROR
    setBtnIsLoading(true);
  }

  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        userId: `${userData?._id}`,
        userEmail: `${userData?.email}`,
        phoneNumber: `${phoneNumber.trim()}`,
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
                "You have successfully changed your phone number"
              );
            }
          })
          .catch((err) => {
            console.log("Error: ", err.response.data);
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
      style={[
        AppStyle.safeArea,
        {
          backgroundColor: COLORS.whiteBG,
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

      {/**SETTINGS HEADER */}
      <SettingsHeaderComp pageTitle={"Change Phone Number"} />

      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - (80 + 48),
          backgroundColor: COLORS.gray100,
          paddingVertical: 24,
          gap: 24,
        }}
      >
        {/**CHANGE PHONE */}
        <View style={styles.pageSection}>
          <SettingInputTab
            label={"Phone Number"}
            placeholder={"Ex. 0123456789"}
            isNumber={true}
            input={phoneNumber}
            setInput={setPhoneNumber}
            hasError={phoneErr}
          />

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
