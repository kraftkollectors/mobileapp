import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import styles from "../auth.style";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import EmailInputTab from "../../../components/auth/emailInputTab";
import PasswordInputTab from "../../../components/auth/passwordInputTab";
import ActionBtn from "../../../components/auth/actionBtn";
import { END_POINT } from "../../../hooks/endpoints";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  RemoveDataFromMemory,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";
import { VALIDATE_EMAIL } from "../../../constants/utilities";
import { COLORS } from "../../../constants/themes/colors";

export default function Continue() {
  const router = useRouter();
  const [socketConn, setSocketConn] = useState(false);
  const [goToPath, setGotoPath] = useState("");
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  function goBack() {
    router.back();
  }

  //TAKE INPUTS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //TAKE INPUTS ERRORS
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  function goToReset() {
    router.push("/auth/signin/reset-pass");
  }

  function validateInputs() {
    //CLEAR ERRORS
    setEmailErr("");
    setPasswordErr("");
    //CHECK EMAIL AND PASS
    if (email == "" || email.length < 8) {
      setEmailErr("Please provide an email address to continue");
      return;
    }

    if (!VALIDATE_EMAIL(email.toLowerCase())) {
      setEmailErr("Unrecognized email format");
      return;
    }

    if (password === "" || password.length < 2) {
      setPasswordErr("Please provide a password to continue");
      return;
    }

    //PROCEED IF NO ERROR
    setBtnIsLoading(true);
  }

  //ATTEMPT EMAIL VERIFY
  const [attemptEmailVerify, setEV] = useState(false);
  useEffect(() => {
    if (attemptEmailVerify && email.length > 0) {
      const formData = {
        email: `${email.toLowerCase()}`,
      };

      axios
        .post(END_POINT.resendVerificationCode, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          //console.log(res.data);
          setBtnIsLoading(false);
          //NAVIGATE TO SIGNUP VERIFY PAGE
          router.replace(
            `/auth/signup/verify/?otp=${res.data.data?.num}&token=0&email=${email}`
          );
        })
        .catch((err) => {
          console.log("Error: ", err.response.data);
          setBtnIsLoading(false);
        });
    }
  }, [attemptEmailVerify]);

  //SIGN IN
  useEffect(() => {
    if (btnIsLoading) {
      setLoadError("");

      const formData = {
        email: `${email.toLowerCase()}`,
        password: `${password}`,
      };

      axios
        .post(END_POINT.login, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          //console.log(res.data);
          let data = res.data.data;
          if (res.data?.statusCode === 201 || res.data?.statusCode === 200) {
            //SAVE USER ACCESS TOKEN
            StoreDataToMemory(LOCAL_STORAGE_PATH.accessToken, data?.token);
            //SAVE NEW USER DATA
            //RemoveDataFromMemory(LOCAL_STORAGE_PATH.userData);
            StoreDataToMemory(LOCAL_STORAGE_PATH.userData, data?.user);
            //UPDATE USER LOG STATUS
            StoreDataToMemory(LOCAL_STORAGE_PATH.logStat, "logged");

            setTimeout(() => {
              if (data?.user.emailVerify === "false") {
                //ATTEMPT EMAIL VERIFICATION
                setEV(true);
              } else {
                if (router.canDismiss()) {
                  router.dismissAll();
                }
                //REDIRECT TO HOME SCREEN
                router.replace("/main/home/");
              }
              setBtnIsLoading(false);
            }, 5000);
          } else {
            setBtnIsLoading(false);
            setLoadError("Login attempt unsuccessful. Please try again");
          }
        })
        .catch((err) => {
          //console.log('Error: ', err.response.data);

          if (
            err.response.data.data.toLowerCase() ===
            "user with the specified email not found"
          ) {
            setLoadError("Invalid email or password");
            setBtnIsLoading(false);
          } else if (
            err.response.data.data.toLowerCase() === "email not verified"
          ) {
            //ATTEMPT EMAIL VERIFICATION
            setEV(true);
          } else if (
            err.response.data.data.toLowerCase() === "incorrect password"
          ) {
            //WRONG DETAILS
            setLoadError("Invalid email or password");
            setBtnIsLoading(false);
          } else {
            setLoadError("Something went wrong. Please try again");
            setBtnIsLoading(false);
          }
        });
    }
  }, [btnIsLoading]);

  return (
    <>
      <DefaultStatusBar theme={"dark"} setSocket={setSocketConn} />
      <SafeAreaView
        onLayout={() => {
          GetDataFromMemory(LOCAL_STORAGE_PATH.redirectPath, setGotoPath);
        }}
        style={styles.safeArea}
      >
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

            {/**<ScrollView contentContainerStyle={styles.whiteFrameCont}> */}
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
                <Text style={styles.headingText}>Continue with your email</Text>

                {loadError && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="alert-circle-outline"
                      size={16}
                      color={COLORS.redWarning}
                    />
                    <Text
                      style={{
                        fontFamily: "EinaRegular",
                        fontSize: 14,
                        lineHeight: 16,
                        color: COLORS.redWarning,
                      }}
                    >
                      {loadError}
                    </Text>
                  </View>
                )}
              </View>
              {/** */}
              <View style={styles.choiceBlock}>
                <EmailInputTab
                  input={email}
                  setInput={setEmail}
                  hasError={emailErr}
                />

                <PasswordInputTab
                  input={password}
                  setInput={setPassword}
                  hasError={passwordErr}
                />

                <View style={{ width: "100%" }}>
                  <TouchableOpacity
                    onPress={goToReset}
                    style={{ marginLeft: "auto" }}
                  >
                    <Text style={styles.forgotText}>Forgot your password?</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/** */}
              <View>
                <ActionBtn
                  btnText={"Log In"}
                  handleClick={() => {
                    validateInputs();
                  }}
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
