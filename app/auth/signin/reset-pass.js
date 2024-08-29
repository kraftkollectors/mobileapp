import {
  View,
  Text,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../auth.style";
import ChoiceTab from "../../../components/auth/choiceTab.comp";
import SimpleTab from "../../../components/auth/simpleTab";
import { useRouter } from "expo-router";
import EmailInputTab from "../../../components/auth/emailInputTab";
import PasswordInputTab from "../../../components/auth/passwordInputTab";
import ActionBtn from "../../../components/auth/actionBtn";
import axios from "axios";
import { END_POINT } from "../../../hooks/endpoints";
import { VALIDATE_EMAIL } from "../../../constants/utilities";

export default function ResetPass() {
  const router = useRouter();
  const [socketConn, setSocketConn] = useState(false);
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  function goBack() {
    router.back();
  }

  //TAKE INPUTS
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");

  function validateInput() {
    //CLEAR ERRORS
    setEmailErr("");
    //CHECK EMAIL
    if (email == "" || email.length < 8) {
      setEmailErr("Please provide an email address to continue");
      return;
    }

    if (!VALIDATE_EMAIL(email.toLowerCase())) {
      setEmailErr("Unrecognized email format");
      return;
    }

    //PROCEED IF NO ERROR
    setBtnIsLoading(true);
  }

  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        email: `${email}`,
      };

      try {
        axios
          .post(END_POINT.forgotPasswordSendEmail, formData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            setBtnIsLoading(false);
            console.log(res.data);

            if (res.data?.statusCode === 201 || 200) {
              router.push(
                `/auth/signup/verify?otp=${res.data.data?.otp}&stored=${res.data.data?.stored}&token=0&from=forgotPassword&email=${email}`
              );
            }
          })
          .catch((err) => {
            setBtnIsLoading(false);
            console.log("Error: ", err.response.data);
            if (
              err.response.data?.data.toLowerCase() ===
              "user with the specified email not found"
            ) {
              setEmailErr("No account found for the provided email");
            }
          });
      } catch (error) {
        setBtnIsLoading(false);
        console.log("Error: ", error.message);
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
              <KeyboardAvoidingView
                behavior="height"
                enabled
                style={styles.whiteFrameCont}
              >
                <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                  <Image
                    source={require("../../../assets/icons/arrowLeft.png")}
                    style={styles.backBtnImg}
                  />
                </TouchableOpacity>

                <View style={styles.headingTextCont}>
                  <Text style={styles.headingText}>Reset password</Text>
                  <View style={styles.subTextTab}>
                    <Text style={styles.verifyText}>
                      Enter your email address and we'll send you a link to
                      reset your password.
                    </Text>
                  </View>
                </View>
                {/** */}
                <View style={styles.choiceBlock}>
                  <EmailInputTab
                    input={email}
                    setInput={setEmail}
                    hasError={emailErr}
                  />
                </View>
                {/** */}
                <View>
                  <ActionBtn
                    btnText={"Reset Password"}
                    handleClick={validateInput}
                    isLoading={btnIsLoading}
                  />
                </View>
              </KeyboardAvoidingView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </>
  );
}
