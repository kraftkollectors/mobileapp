import React, { useEffect, useState } from "react";
import { Dimensions, Platform, ScrollView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import { styles } from "./settings.style";
import SettingInputTab from "../../../../components/main/accountPage/subComps/settingInputTab";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import { FETCH_SERVICE_ARTISAN } from "../../../../hooks/requests";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../../constants/utilities/localStorage";
import { END_POINT } from "../../../../hooks/endpoints";
import axios from "axios";
import AlertBox from "../../../../components/general/alertBox";
import { AppStyle } from "../../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function SocialLinks() {
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
  //FETCH USER DATA
  useEffect(() => {
    GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
    GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
  }, []);
  ///////////

  useEffect(() => {
    if (userData && userData.isArtisan) {
      FETCH_SERVICE_ARTISAN(userData?._id, setArtisanProfile);
    }
  }, [userData]);

  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (artisanProfile) {
      setInstagram(artisanProfile?.instagram);
      setTwitter(artisanProfile?.twitter);
      setLinkedin(artisanProfile?.linkedin);
      setFacebook(artisanProfile?.facebook);
      setWebsite(artisanProfile?.website);
    }
  }, [artisanProfile]);

  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        website: `${website.trim().toLowerCase()}`,
        instagram: `${instagram.trim().toLowerCase()}`,
        twitter: `${twitter.trim().toLowerCase()}`,
        facebook: `${facebook.trim().toLowerCase()}`,
        linkedin: `${linkedin.trim().toLowerCase()}`,
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
                "You have successfully updated your social links"
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
      <SettingsHeaderComp pageTitle={"Social Links"} />

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
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={16}
          contentContainerStyle={styles.pageSection}
        >
          <SettingInputTab
            label={"Instagram"}
            placeholder={"Ex. @example_123"}
            input={instagram}
            setInput={setInstagram}
          />
          <SettingInputTab
            label={"Twitter"}
            placeholder={"Ex. @example123"}
            input={twitter}
            setInput={setTwitter}
          />
          <SettingInputTab
            label={"LinkedIn"}
            placeholder={"Ex. https://www.linkedin.com/in/example"}
            input={linkedin}
            setInput={setLinkedin}
          />
          <SettingInputTab
            label={"Facebook"}
            placeholder={"Ex. https://www.facebook.com/example"}
            input={facebook}
            setInput={setFacebook}
          />
          <SettingInputTab
            label={"Website Link"}
            placeholder={"Ex. www.example.com"}
            input={website}
            setInput={setWebsite}
          />

          <SaveBtn
            btnText={"Save Changes"}
            isLoading={btnIsLoading}
            handleClick={() => {
              setBtnIsLoading(true);
            }}
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
