import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Platform, ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import GeneralInfoComp from "../../../../components/main/accountPage/generalInfoComp";
import { styles } from "./settings.style";
import SettingInputTab from "../../../../components/main/accountPage/subComps/settingInputTab";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../../constants/utilities/localStorage";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import AlertBox from "../../../../components/general/alertBox";
import { AppStyle } from "../../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function GeneralInfo() {
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

  const [userData, setUserData] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  //FETCH USER DATA
  useEffect(() => {
    GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
    GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
  }, []);
  ///////////

  //USER INPUT
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  useEffect(() => {
    if (userData) {
      setFirstName(userData?.firstName);
      setLastName(userData?.lastName);
      console.log("refreshed n user");
    }
  }, [userData]);

  //TAKE ERRORS
  const [firstNameErr, setFirstNameErr] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");

  //CHECK USER INPUTS
  function checkInputs() {
    //CLEAR ERRORS
    setFirstNameErr("");
    setLastNameErr("");

    //CHECK INPUTS
    if (firstName === "" || firstName.length < 3) {
      setFirstNameErr("Please provide an actual name");
      return;
    }
    if (lastName === "" || lastName.length < 3) {
      setLastNameErr("Please provide an actual name");
      return;
    }

    //PROCEED IF NO ERROR
    setBtnIsLoading(true);
  }
  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        userEmail: `${userData?.email}`,
        firstName: `${firstName}`,
        lastName: `${lastName}`,
      };

      try {
        axios
          .patch(END_POINT.updateUserProfile(userData?._id), formData, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": accessToken,
            },
          })
          .then((res) => {
            //console.log(res.data);
            if (res.data.statusCode === 201) {
              let data = res.data.data.data;
              //UPDATE USER DATA
              StoreDataToMemory(LOCAL_STORAGE_PATH.userData, data);
              //SHOW ALERT
              popAlert(
                "success",
                "Profile Update Successful",
                "You have successfully made some changes to your profile information"
              );
            }
            setBtnIsLoading(false);
          })
          .catch((err) => {
            setBtnIsLoading(false);
            console.log("Error: ", err.response.data);
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
      <SettingsHeaderComp pageTitle={"General Info"} />

      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - (80 + 48),
          backgroundColor: COLORS.gray100,
          paddingVertical: 24,
          gap: 24,
        }}
      >
        {/**GENERAL INFO COMPONENT */}
        <GeneralInfoComp data={userData} />

        {/**CHANGE NAME */}
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={16}
          contentContainerStyle={styles.pageSection}
        >
          <SettingInputTab
            label={"First Name"}
            placeholder={"Ex. Johnson"}
            input={firstName}
            setInput={setFirstName}
            hasError={firstNameErr}
          />

          <SettingInputTab
            label={"Last Name"}
            placeholder={"Ex. Smith"}
            input={lastName}
            setInput={setLastName}
            hasError={lastNameErr}
          />

          <SaveBtn
            btnText={"Save Changes"}
            handleClick={() => checkInputs()}
            isLoading={btnIsLoading}
          />
        </KeyboardAwareScrollView>
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
