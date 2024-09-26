import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../auth.style";
import ChoiceTab from "../../../components/auth/choiceTab.comp";
import SimpleTab from "../../../components/auth/simpleTab";
import { useRouter } from "expo-router";
import AlertBox from "../../../components/general/alertBox";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import { END_POINT } from "../../../hooks/endpoints";
import { GENERATE_RANDOM_NUMBER } from "../../../constants/utilities";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";

export default function Signup() {
  const router = useRouter();
  const [socketConn, setSocketConn] = useState(false);

  const [goToPath, setGotoPath] = useState("");
  //
  const [userGoogleInfo, setUserGoogleInfo] = useState();
  const [googleBtnIsLoading, setGBIL] = useState(false);
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

  //GOOGLE AUTH CONFIG
  const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      webClientId:
        "912930599984-0ojggkv87gcrf25f661kvffft90qckmc.apps.googleusercontent.com",
      androidClientId:
        "912930599984-muu4f7tbo143m1rkl71vul9gua05idv6.apps.googleusercontent.com",
      iosClientId:
        "912930599984-qn00lf228935vjpid346r7ncag6us5hc.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 120,
    });
  };

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const signIn = async () => {
    setGBIL(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserGoogleInfo(userInfo?.user);
    } catch (error) {
      popAlert("error", "Google Authentication Error", `${error.message}`);
      setGBIL(false);
    }
  };

  //IF GOOGLE AUTH SUCCESSFUL
  useEffect(() => {
    if (userGoogleInfo) {
      //TRY TO LOGIN USER
      try {
        var userName = `${userGoogleInfo?.givenName}${GENERATE_RANDOM_NUMBER(
          1000,
          9999
        )}${userGoogleInfo?.id[userGoogleInfo?.id.length - 1]}`;

        let formData = {
          email: `${userGoogleInfo?.email}`,
          firstName: `${userGoogleInfo?.givenName}`,
          lastName: `${userGoogleInfo?.familyName}`,
          userName: `${userName}`,
          gender: `${userGoogleInfo?.gender ? userGoogleInfo?.gender : "none"}`,
          image: `${userGoogleInfo?.photo}`,
        };

        axios
          .post(END_POINT.googleAuth, formData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            //STORE USER DATA AND NAVIGATE
            let data = res.data?.data;
            if (res.data?.statusCode === 201 || res.data?.statusCode === 200) {
              //SAVE USER ACCESS TOKEN
              StoreDataToMemory(LOCAL_STORAGE_PATH.accessToken, data?.token);
              //SAVE USER DATA
              StoreDataToMemory(LOCAL_STORAGE_PATH.userData, data?.user);
              //UPDATE USER LOG STATUS
              StoreDataToMemory(LOCAL_STORAGE_PATH.logStat, "logged");

              setTimeout(() => {
                if (router.canDismiss) {
                  router.dismissAll();
                }
                //NAVIGATE TO REDIRECT PATH
                router.push(goToPath);
                setGBIL(false);
              }, 5000);
            }
          })
          .catch((err) => {
            popAlert(
              "error",
              "Google Sign in Attempt Failed",
              "Something went wrong. Please try again"
            );
            setGBIL(false);
          });
      } catch (error) {
        popAlert("error", "Google Sign in Attempt Failed", `${error.message}`);
        setGBIL(false);
      }
    }
  }, [userGoogleInfo]);

  ///////

  function goBack() {
    router.back();
  }

  function goToSignIn() {
    router.replace("/auth/signin/");
  }

  //CHOICES
  function continueWithEmail() {
    router.push("/auth/signup/continue");
  }

  return (
    <>
      <DefaultStatusBar theme={"dark"} setSocket={setSocketConn} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topPart}>
          <View style={styles.onboardImgTab}>
            <Image
              source={require("../../../assets/photos/onboard-bg.png")}
              style={styles.onboardImg}
            />
          </View>
        </View>

        <View style={styles.innerBlock}>
          <View></View>

          <View style={styles.bottomPart}>
            <View style={styles.whiteLogoTab}>
              <Image
                source={require("../../../assets/photos/logo-white.png")}
                style={styles.whiteLogoImg}
              />
            </View>

            {/** */}
            <View style={styles.whiteFrameCont}>
              <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                <Image
                  source={require("../../../assets/icons/arrowLeft.png")}
                  style={styles.backBtnImg}
                />
              </TouchableOpacity>

              <View style={styles.headingTextCont}>
                <Text style={styles.headingText}>Create a new account</Text>
                <View style={styles.subTextTab}>
                  <Text style={styles.subText}>Already have an account?</Text>
                  <TouchableOpacity onPress={goToSignIn}>
                    <Text style={styles.subTextLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/** */}
              <View style={styles.choiceBlock}>
                <ChoiceTab choice={"mail"} choiceFunction={continueWithEmail} />

                <SimpleTab />

                <ChoiceTab
                  choice={"google"}
                  choiceFunction={() => {
                    signIn();
                  }}
                  isLoading={googleBtnIsLoading}
                />
              </View>
              {/** */}
              <Text style={styles.baseTextTab}>
                <Text style={styles.baseText}>
                  By signing up, you agree to our{" "}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.baseTextLink}>
                    Terms, Conitions & Privacy Policy
                  </Text>
                </TouchableOpacity>
              </Text>
            </View>
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
      </SafeAreaView>
    </>
  );
}
