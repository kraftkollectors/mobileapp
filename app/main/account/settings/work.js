import { Dimensions, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import SettingSelectTab from "../../../../components/main/accountPage/subComps/settingSelectTab";
import { styles } from "./settings.style";
import SettingCheckBox from "../../../../components/main/accountPage/subComps/settingCheckBox";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import { WORK_TIME_LIST } from "../../../../constants/json";
import { FORMAT_TIME_STRING_12H } from "../../../../constants/utilities";
import { FETCH_SERVICE_ARTISAN } from "../../../../hooks/requests";
import AlertBox from "../../../../components/general/alertBox";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../../constants/utilities/localStorage";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import { AppStyle } from "../../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function WorkHour() {
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
  const timeFrameArray = WORK_TIME_LIST();

  //COLLECTED DATA
  const [workHourFrom, setWorkHourFrom] = useState("");
  const [workHourTo, setWorkHourTo] = useState("");
  const [dontShowContact, setDontShowContact] = useState(true);

  useEffect(() => {
    if (artisanProfile) {
      setWorkHourFrom(artisanProfile?.workHourFrom);
      setWorkHourTo(artisanProfile?.workHourTo);
    }
  }, [artisanProfile]);

  //TAKE ERRORS
  const [workErr, setWorkErr] = useState("");

  function validateInputs() {
    //CLEAR ERRORS
    setWorkErr("");

    if (!workHourFrom || !workHourTo) {
      setWorkErr(
        "You can not proceed with any of the time field being undecided"
      );
      return;
    }

    //CONTINUE IF NO ERROR
    setBtnIsLoading(true);
  }

  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        workHourFrom: `${workHourFrom}`,
        workHourTo: `${workHourTo}`,
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
                "You have successfully updated your work time"
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
      <SettingsHeaderComp pageTitle={"Work Hour"} />

      {/**PAGE DISPLAY */}
      <View
        style={{
          minHeight: screenHeight - (80 + 48),
          backgroundColor: COLORS.gray100,
          paddingVertical: 24,
          gap: 24,
        }}
      >
        {/**WORK HOUR */}
        <View style={[styles.pageSection, { gap: 12 }]}>
          <View style={{ width: "100%", flexDirection: "row", gap: 8 }}>
            <View style={styles.workHoursTab}>
              <SettingSelectTab
                label={"Opening Hour"}
                placeholder={"Select..."}
                selectList={timeFrameArray}
                selectedItem={
                  workHourFrom && FORMAT_TIME_STRING_12H(workHourFrom)
                }
                setSelectedItem={setWorkHourFrom}
              />
            </View>

            <View style={styles.workHoursTab}>
              <SettingSelectTab
                label={"Closing Hour"}
                placeholder={"Select..."}
                selectList={timeFrameArray}
                selectedItem={workHourTo && FORMAT_TIME_STRING_12H(workHourTo)}
                setSelectedItem={setWorkHourTo}
              />
            </View>
          </View>

          {workErr && <Text style={styles.errorText}>{workErr}</Text>}

          <SettingCheckBox
            checkTitle={"Don't show contact after work hour"}
            checkOption={dontShowContact}
            setOption={setDontShowContact}
          />

          <SaveBtn
            btnText={"Save changes"}
            isLoading={btnIsLoading}
            handleClick={() => {
              validateInputs();
            }}
          />
        </View>
      </View>

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
