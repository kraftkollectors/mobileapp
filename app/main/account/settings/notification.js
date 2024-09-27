import { Dimensions, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import { styles } from "./settings.style";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import SettingCheckBox from "../../../../components/main/accountPage/subComps/settingCheckBox";
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

export default function ManageNotification() {
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
  const [systemNotification, setSystemNotification] = useState(false);
  //FETCH USER DATA
  useEffect(() => {
    GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
    GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
    GetDataFromMemory(
      LOCAL_STORAGE_PATH.systemNotification,
      setSystemNotification
    );
  }, []);
  ///////////

  //OPTIONS
  const [messages, setMessages] = useState(false);
  const [reviews, setReviews] = useState(false);

  useEffect(() => {
    if (userData) {
      setMessages(userData?.notify);
      setReviews(userData?.notifyReview);
    }
  }, [userData]);

  //MAKE CHANGES
  useEffect(() => {
    if (btnIsLoading) {
      //SAVE SYSTEM NOTIFICATION THEN PROCEED
      StoreDataToMemory(
        LOCAL_STORAGE_PATH.systemNotification,
        systemNotification
      );

      const formData = {
        userEmail: `${userData?.email}`,
        notify: `${messages}`,
        notifyReview: `${reviews}`,
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
                "You have successfully made some changes to your notification settings"
              );
            }
            setBtnIsLoading(false);
          })
          .catch((err) => {
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
      <SettingsHeaderComp pageTitle={"Manage Notification"} />

      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - (80 + 48),
          backgroundColor: COLORS.gray100,
          paddingVertical: 24,
          gap: 24,
        }}
      >
        {/**SOCIAL LINKS */}
        <View style={[styles.pageSection, { gap: 20 }]}>
          <Text style={styles.notificationSubTitle}>
            Receive notifications on this device{" "}
          </Text>

          <View style={{ gap: 24 }}>
            <SettingCheckBox
              checkTitle={"System Notifications"}
              checkOption={systemNotification}
              setOption={setSystemNotification}
            />
          </View>

          <Text style={styles.notificationSubTitle}>
            Receive email notifications
          </Text>

          <View style={{ gap: 24 }}>
            <SettingCheckBox
              checkTitle={"For new messages"}
              checkOption={messages}
              setOption={setMessages}
            />
            <SettingCheckBox
              checkTitle={"For service reviews"}
              checkOption={reviews}
              setOption={setReviews}
            />
          </View>

          <SaveBtn
            btnText={"Save Changes"}
            isLoading={btnIsLoading}
            handleClick={() => {
              setBtnIsLoading(true);
            }}
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
