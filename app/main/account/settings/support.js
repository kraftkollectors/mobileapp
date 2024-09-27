import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Octicons, SimpleLineIcons, FontAwesome6 } from "@expo/vector-icons";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import { styles } from "./settings.style";
import SaveBtn from "../../../../components/main/accountPage/subComps/saveBtn";
import SettingTextareaTab from "../../../../components/main/accountPage/subComps/settingTextareaTab";
import SettingInputTab from "../../../../components/main/accountPage/subComps/settingInputTab";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../../constants/utilities/localStorage";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import AlertBox from "../../../../components/general/alertBox";
import { AppStyle } from "../../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function Support() {
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

  //COLLECT DATA
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (userData) {
      setEmail(`${userData?.email}`);
      setName(`${userData?.firstName} ${userData?.lastName}`);
    }
  }, [userData]);

  //COLLECT DATA ERROR
  const [emailErr, setEmailErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [subjectErr, setSubjectErr] = useState("");
  const [messageErr, setMessageErr] = useState("");

  //VALIDATE INPUTS
  function validateInputs() {
    //CLEAR ERRORS
    setEmailErr("");
    setNameErr("");
    setPhoneErr("");
    setSubjectErr("");
    setMessageErr("");

    if (email.trim() === "" || email.length < 6) {
      setEmailErr("Please provide an actual email to proceed");
      return;
    }

    if (name.trim() === "" || name.length < 3) {
      setNameErr("Give us a name to address you with");
      return;
    }

    if (phone === "" || phone.length < 5) {
      setPhoneErr("Please provide a contact phone number for communications");
      return;
    }

    if (subject.trim() === "" || subject.length < 10) {
      setSubjectErr("A proper title is needed for any support message");
      return;
    }

    if (message.trim() === "" || message.length < 20) {
      setMessageErr("Ensure your message is ellaborate and clear");
      return;
    }

    //PROCEED IF NO ERROR
    setBtnIsLoading(true);
  }
  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        userEmail: `${email}`,
        userId: `${userData?._id}`,
        email: `${email.toLowerCase()}`,
        name: `${name.trim()}`,
        phone: `${phone}`,
        subject: `${subject.trim()}`,
        message: `${message.trim()}`,
      };

      try {
        axios
          .post(END_POINT.contactSupport, formData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.data.statusCode === 201) {
              popAlert(
                "success",
                "Contact Support",
                "Message sent successfully. You will be contacted as soon as possible"
              );
            }
            setBtnIsLoading(false);
          })
          .catch((err) => {
            popAlert(
              "error",
              "Contact Support Error",
              "Something went wrong. Please try again later"
            );
            setBtnIsLoading(false);
          });
      } catch (error) {
        popAlert(
          "error",
          "Contact Support Error",
          "Network Error. Check your connection and try again"
        );
        setBtnIsLoading(false);
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
      <SettingsHeaderComp pageTitle={"Support"} />

      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - (80 + 48),
          backgroundColor: COLORS.gray100,
          paddingVertical: 24,
          gap: 24,
        }}
      >
        {/**SUPPORT */}
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          contentContainerStyle={[styles.pageSection, { gap: 20 }]}
        >
          <View style={{ gap: 8 }}>
            <Text
              style={{
                fontFamily: "EinaBold",
                fontSize: 22,
                lineHeight: 28,
                color: COLORS.black900,
              }}
            >
              Contact KraftKollectors
            </Text>

            <Text
              style={{
                fontFamily: "EinaRegular",
                fontSize: 16,
                lineHeight: 24,
                color: COLORS.black300,
              }}
            >
              Have a question or need assistance? We're here to help. Reach out
              to us using the form below, and we'll get back to you as soon as
              possible. Your satisfaction is our priority.
            </Text>
          </View>

          {/**INPUT FIELDS */}
          <View>
            <SettingInputTab
              label={""}
              placeholder={"Email address"}
              input={email}
              setInput={setEmail}
              hasError={emailErr}
            />

            <SettingInputTab
              label={""}
              placeholder={"Name"}
              input={name}
              setInput={setName}
              hasError={nameErr}
            />

            <SettingInputTab
              label={""}
              placeholder={"Phone"}
              input={phone}
              setInput={setPhone}
              hasError={phoneErr}
            />

            <SettingInputTab
              label={""}
              placeholder={"Subject"}
              input={subject}
              setInput={setSubject}
              hasError={subjectErr}
            />

            <SettingTextareaTab
              label={""}
              placeholder={"Write message..."}
              input={message}
              setInput={setMessage}
              hasError={messageErr}
            />
          </View>

          <SaveBtn
            btnText={"Submit message"}
            handleClick={() => {
              validateInputs();
            }}
            isLoading={btnIsLoading}
          />

          <View style={styles.supportSocialBlock}>
            <Text style={styles.supportSocialText}>Our Socials</Text>
            <View style={styles.supportSocialIconBlock}>
              <TouchableOpacity style={styles.supportSocialIcon}>
                <FontAwesome6
                  name="x-twitter"
                  size={16}
                  color={COLORS.black300}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.supportSocialIcon}>
                <SimpleLineIcons
                  name="social-linkedin"
                  size={16}
                  color={COLORS.black300}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.supportSocialIcon}>
                <SimpleLineIcons
                  name="social-instagram"
                  size={16}
                  color={COLORS.black300}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.supportSocialIcon}>
                <SimpleLineIcons
                  name="social-facebook"
                  size={16}
                  color={COLORS.black300}
                />
              </TouchableOpacity>
            </View>
          </View>
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
