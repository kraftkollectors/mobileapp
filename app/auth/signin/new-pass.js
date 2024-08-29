import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import styles from "../auth.style";
import { useLocalSearchParams, useRouter } from "expo-router";
import ActionBtn from "../../../components/auth/actionBtn";
import GenInputTab from "../../../components/auth/genInputTab";
import { END_POINT } from "../../../hooks/endpoints";
import { COLORS } from "../../../constants/themes/colors";

export default function NewPass() {
  const router = useRouter();
  const [socketConn, setSocketConn] = useState(false);
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  //GET URL PARAMS
  const local = useLocalSearchParams();
  const [otp, setOtp] = useState(local?.otp);
  const [stored, setStored] = useState(local?.stored);
  const [email, setEmail] = useState(local?.email);

  function goBack() {
    router.back();
  }

  //TAKE INPUTS
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  //TAKE INPUTS ERRORS
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPassErr, setConfirmPassErr] = useState("");

  function validateInputs() {
    //
    setPasswordErr("");
    setConfirmPassErr("");
    setLoadError("");
    if (password === "" || password.length < 8) {
      setPasswordErr("Must be atleast 8 characters long");
      return;
    }

    if (confirmPass === "") {
      setConfirmPassErr("Please confirm your new password to continue");
      return;
    }
    if (confirmPass != password) {
      setConfirmPassErr("Ensure both passwords are a perfect match");
      return;
    }

    //PROCEED IF NO ERROR
    setBtnIsLoading(true);
  }

  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        otp: `${otp}`,
        stored: `${stored}`,
        email: `${email}`,
        password: `${password}`,
      };

      try {
        axios
          .post(END_POINT.forgotPasswordReset, formData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            setBtnIsLoading(false);
            console.log(res.data);

            if (res.data?.statusCode === 201 || 200) {
              Alert.alert(
                "Password Change",
                "You have successfully updated the password for you account. please proceed to login"
              );
              setTimeout(() => {
                if (router.canDismiss()) {
                  router.dismissAll();
                }
                router.replace("/auth/signin/continue");
              }, 2000);
            } else {
              setLoadError("Password change attempt failed. Try again later");
            }
          })
          .catch((err) => {
            setBtnIsLoading(false);
            console.log("Error :", err.response.data);
            setLoadError("Something went wrong. Please try again later");
          });
      } catch (error) {
        setBtnIsLoading(false);
        console.log("Error :", error.message);
        setLoadError("Something went wrong. Please try again later");
      }
    }
  }, [btnIsLoading]);

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

          <KeyboardAvoidingView enabled behavior="padding">
            <View style={styles.bottomPart}>
              <View style={styles.whiteLogoTab}>
                <Image
                  source={require("../../../assets/photos/logo-white.png")}
                  style={styles.whiteLogoImg}
                />
              </View>

              {/** */}
              <ScrollView contentContainerStyle={styles.whiteFrameCont}>
                <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                  <Image
                    source={require("../../../assets/icons/arrowLeft.png")}
                    style={styles.backBtnImg}
                  />
                </TouchableOpacity>

                <View style={styles.headingTextCont}>
                  <Text style={styles.headingText}>New Password</Text>

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
                  <GenInputTab
                    label={"Password"}
                    input={password}
                    setInput={setPassword}
                    placeholder={""}
                    hasError={passwordErr}
                  />

                  <GenInputTab
                    label={"Confirm password"}
                    input={confirmPass}
                    setInput={setConfirmPass}
                    placeholder={""}
                    hasError={confirmPassErr}
                  />
                </View>
                {/** */}
                <View>
                  <ActionBtn
                    btnText={"Continue"}
                    handleClick={validateInputs}
                    isLoading={btnIsLoading}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </>
  );
}
