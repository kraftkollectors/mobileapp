import { Alert, Dimensions, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import SettingInputTab from "../../../../components/main/accountPage/subComps/settingInputTab";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import { styles } from "./settings.style";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../../constants/utilities/localStorage";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import AlertBox from "../../../../components/general/alertBox";
import { AppStyle } from "../../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function ChangePassword() {
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

  //TAKE INPUTS
  //const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState("");
  const [retypedPassword, setRetypedPassword] = useState("");

  //TAKE ERRORS
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [retypedPasswordErr, setRetypedPasswordErr] = useState("");

  //CHECK INPUT
  function validateInputs() {
    //
    setNewPasswordErr("");
    setRetypedPasswordErr("");
    if (newPassword === "" || newPassword.length < 8) {
      setNewPasswordErr("Must be atleast 8 characters long");
      return;
    }

    if (retypedPassword === "") {
      setRetypedPasswordErr("Please confirm your new password to continue");
      return;
    }
    if (retypedPassword != newPassword) {
      setRetypedPasswordErr("Ensure both passwords are a perfect match");
      return;
    }

    //PROCEED IF NO ERROR
    setBtnIsLoading(true);
  }
  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        userEmail: `${userData?.email}`,
        password: `${newPassword}`,
      };

      try {
        axios
          .patch(END_POINT.updateUserPassword(userData?._id), formData, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": accessToken,
            },
          })
          .then((res) => {
            setBtnIsLoading(false);
            //console.log(res.data);
            if (res.data.statusCode === 201) {
              //SHOW ALERT
              popAlert(
                "success",
                "Profile Update Successful",
                "You have successfully changed your account password"
              );
            }
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
      <SettingsHeaderComp pageTitle={"Change Password"} />

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
          {/*<SettingInputTab label={'Old Password'} placeholder={'Old Password'} />*/}
          <SettingInputTab
            label={"New Password"}
            placeholder={"New Password"}
            input={newPassword}
            setInput={setNewPassword}
            hasError={newPasswordErr}
          />
          <SettingInputTab
            label={"Retype Password"}
            placeholder={"Retype Password"}
            input={retypedPassword}
            setInput={setRetypedPassword}
            hasError={retypedPasswordErr}
          />

          <SaveBtn
            btnText={"Save Changes"}
            handleClick={() => validateInputs()}
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
