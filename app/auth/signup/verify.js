import { View, Text, Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import styles from "../auth.style";
import ActionBtn from "../../../components/auth/actionBtn";
import GenInputTab from "../../../components/auth/genInputTab";
import { END_POINT } from "../../../hooks/endpoints";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";

export default function Verify() {
  const router = useRouter();
  const [socketConn, setSocketConn] = useState(false);
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  //GET URL PARAMS
  const local = useLocalSearchParams();

  function goBack() {
    router.back();
  }

  //TAKE INPUTS
  const [sentFrom, setSentFrom] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [userToken, setUserToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState([]);
  const [otp, setOtp] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [goToPath, setGotoPath] = useState("");

  useEffect(() => {
    setSentFrom(local?.from);
    setSentOtp(local?.otp);
    setUserToken(local?.token);
    setUserEmail(local?.email);

    if (proceedWithVerify) {
      //SAVE TO LOCAL STORAGE
      StoreDataToMemory(LOCAL_STORAGE_PATH.userData, userData);
      //FETCH THE REDIRECT PATH
      GetDataFromMemory(LOCAL_STORAGE_PATH.redirectPath, setGotoPath);
    }
  }, [userData]);

  //VERIFY USER EMAIL
  const [proceedWithVerify, setProceed] = useState(false);

  useEffect(() => {
    if (proceedWithVerify && userData) {
      const formData = {
        token: `${userToken}`,
        email: `${userEmail.toLowerCase()}`,
      };

      axios
        .post(END_POINT.registerVerifyEmail, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBtnIsLoading(false);
          console.log(res.data);
          if (res.data.statusCode === 201) {
            //UPDATE USER DATA
            setUserData((prev) => [{ ...prev, emailVerify: true }]);

            if (sentFrom === "forgotPassword") {
              router.replace(
                `/auth/signin/new-pass?otp=${sentOtp}&stored=${local?.stored}&email=${userEmail}`
              );
            } else {
              //RETURN TO PREVIOUS SCREEN
              router.replace(goToPath);
            }
          } else {
            setOtpErr("Email verification failed. Please try again");
          }
          setProceed(false);
        })
        .catch((err) => {
          setBtnIsLoading(false);
          console.log("Error: ", err.message);
          setOtpErr("Something went wrong. Please try again");
          setProceed(false);
        });
    }
  }, [proceedWithVerify]);

  //CHECK OTP
  function compareOtps() {
    setBtnIsLoading(true);
    //VERIFY OTP === SENT OTP
    if (otp === sentOtp) {
      //PROCEED
      setProceed(true);
    } else {
      setBtnIsLoading(false);
      setOtpErr("Invalid OTP. Ensure you've entered the correct code");
    }
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
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              contentContainerStyle={styles.whiteFrameCont}
            >
              <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                <Image
                  source={require("../../../assets/icons/arrowLeft.png")}
                  style={styles.backBtnImg}
                />
              </TouchableOpacity>

              <View style={styles.headingTextCont}>
                <Text style={styles.headingText}>Email Verification</Text>
                <View style={styles.subTextTab}>
                  <Text style={styles.verifyText}>
                    Enter the OTP code we sent to
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.verifyTextLink}>{userEmail}</Text>
                  </TouchableOpacity>
                  <Text style={styles.verifyText}>to verify your email</Text>
                </View>
              </View>
              {/** */}
              <View style={styles.choiceBlock}>
                <GenInputTab
                  label={"OTP"}
                  input={otp}
                  setInput={setOtp}
                  placeholder={""}
                  isNumeric={true}
                  hasError={otpErr}
                />
              </View>
              {/** */}
              <View>
                <ActionBtn
                  btnText={"Continue"}
                  handleClick={compareOtps}
                  isLoading={btnIsLoading}
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
