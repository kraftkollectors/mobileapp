import { View, Text, Image, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import styles from "../auth.style";
import { COLORS } from "../../../constants/themes/colors";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EmailInputTab from "../../../components/auth/emailInputTab";
import PasswordInputTab from "../../../components/auth/passwordInputTab";
import ActionBtn from "../../../components/auth/actionBtn";
import GenInputTab from "../../../components/auth/genInputTab";
import AuthSelectTab from "../../../components/auth/authSelectTab";
import { END_POINT } from "../../../hooks/endpoints";
import { VALIDATE_EMAIL } from "../../../constants/utilities";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";

export default function Continue() {
  const router = useRouter();
  const [socketConn, setSocketConn] = useState(false);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [btnIsLoading, setBtnIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  //TAKE INPUTS
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");
  const genderList = ["male", "female"];

  //TAKE INPUTS ERRORS
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [userNameErr, setUserNameErr] = useState("");
  const [firstNameErr, setFirstNameErr] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");

  //NAVIGATION HANDLER
  function checkInputsOne() {
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

    if (password === "" || password.length < 8) {
      setPasswordErr("Must be atleast 8 characters long");
      return;
    }

    //PROCEED IF NO ERROR
    setActivePageIndex(1);
  }
  function checkInputsTwo() {
    //CLEAR ERRORS
    setUserNameErr("");
    setFirstNameErr("");
    setLastNameErr("");
    //CHECK OTHER INPUTS
    if (userName == "" || userName.length < 4) {
      setUserNameErr("Ensure an adequate Username is provided");
      return;
    }

    if (firstName === "" || firstName.length < 3) {
      setFirstNameErr("Please provide a correct name");
      return;
    }
    if (lastName === "" || lastName.length < 3) {
      setLastNameErr("Please provide a correct name");
      return;
    }

    //PROCEED IF NO ERROR
    setActivePageIndex(2);
  }

  useEffect(() => {
    function goBack() {
      router.back();
    }

    function signUp() {
      //
      setLoadError("");
      setBtnIsLoading(true);

      const formData = {
        email: `${email.toLowerCase()}`,
        firstName: `${firstName}`,
        lastName: `${lastName}`,
        userName: `${userName.toLowerCase()}`,
        gender: `${gender.toLowerCase()}`,
        password: `${password}`,
      };

      axios
        .post(END_POINT.register, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setBtnIsLoading(false);
          console.log(res.data);
          let data = res.data.data;
          if (res.data?.statusCode === 201 || res.data?.statusCode === 200) {
            //SAVE USER ACCESS TOKEN
            StoreDataToMemory(LOCAL_STORAGE_PATH.accessToken, data?.token);
            //SAVE USER DATA
            StoreDataToMemory(LOCAL_STORAGE_PATH.userData, data?.user);
            //UPDATE USER LOG STATUS
            StoreDataToMemory(LOCAL_STORAGE_PATH.logStat, "logged");

            //NAVIGATE TO VERIFY PAGE
            router.replace(
              `/auth/signup/verify/?otp=${data?.otp}&token=${data?.token}&email=${email}`
            );
          } else {
            setLoadError("Error Creating Account.");
          }
        })
        .catch((err) => {
          setBtnIsLoading(false);
          console.log("Error: ", err.response.data);

          if (
            (err.response.status === 404 || err.response.status === 400) &&
            err.response.data.data === "Email is already in use"
          ) {
            setLoadError(
              "There is an existing account with this email. Try to login"
            );
          } else {
            setLoadError("Something went wrong. Please try again");
          }
        });
    }

    if (activePageIndex < 0) {
      goBack();
    } else if (activePageIndex > 1) {
      setActivePageIndex(1);
      signUp();
    }
  }, [activePageIndex]);

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
              <TouchableOpacity
                onPress={() => {
                  setActivePageIndex((prev) => prev - 1);
                }}
                style={styles.backBtn}
              >
                <Image
                  source={require("../../../assets/icons/arrowLeft.png")}
                  style={styles.backBtnImg}
                />
              </TouchableOpacity>

              <View style={styles.headingTextCont}>
                <Text style={styles.headingText}>
                  {activePageIndex === 0
                    ? "Continue with your email"
                    : "Fill in your details"}
                </Text>

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
                {activePageIndex === 0 ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <GenInputTab
                      label={"Username"}
                      input={userName}
                      setInput={setUserName}
                      placeholder={"Ex. john5342"}
                      hasError={userNameErr}
                      lowerCase
                    />

                    <GenInputTab
                      label={"First name"}
                      input={firstName}
                      setInput={setFirstName}
                      placeholder={"Ex. John"}
                      hasError={firstNameErr}
                    />

                    <GenInputTab
                      label={"Last name"}
                      input={lastName}
                      setInput={setLastName}
                      placeholder={"Ex. Okafor"}
                      hasError={lastNameErr}
                    />

                    <AuthSelectTab
                      label={"Gender"}
                      placeholder={"Click to select"}
                      selectedItem={gender}
                      setSelectedItem={setGender}
                      selectList={genderList}
                    />
                  </>
                )}
              </View>
              {/** */}
              <View>
                {activePageIndex === 0 ? (
                  <ActionBtn
                    btnText={"Sign Up"}
                    handleClick={() => checkInputsOne()}
                  />
                ) : (
                  <ActionBtn
                    btnText={"Continue"}
                    handleClick={() => checkInputsTwo()}
                    isLoading={btnIsLoading}
                  />
                )}
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
