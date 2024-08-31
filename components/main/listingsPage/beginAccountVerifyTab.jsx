import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/themes/colors";
import ActionBtn from "../../auth/actionBtn";
import VerifyInputTab from "./subComp/verifyInputTab";
import axios from "axios";
import { END_POINT } from "../../../hooks/endpoints";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";

export default function BeginAccountVerifyTab({
  verifySuccess,
  endVerification,
  userData,
  accessToken,
  setUserData,
}) {
  //
  const [verificationSuccessfull, setVerificationSuccessfull] = useState("");
  const [errorMsg, setErrorMsg] = useState(
    "NIN Mismatch. Please recheck your NIN details and try again."
  ); //NIN Mismatch. Please recheck your NIN details and try again.

  function concludeVerification() {
    verifySuccess();
    endVerification();
  }

  function closeVerifyTab() {
    endVerification();
  }

  const [btnIsLoading, setBtnIsLoading] = useState(false);

  //TAKE INPUTS
  const [fullname, setfullname] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phone, setPhone] = useState("");
  const [nin, setNin] = useState("");

  //TAKE INPUTS ERROR
  const [fullnameErr, setfullnameErr] = useState("");
  const [occupationErr, setOccupationErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [ninErr, setNinErr] = useState("");

  //VALIDATE INPUTS
  function validateInputs() {
    //CLEAR ERRORS
    setfullnameErr("");
    setOccupationErr("");
    setPhoneErr("");
    setNinErr("");

    if (fullname.trim() === "" || fullname.length < 3) {
      setfullnameErr("Please ensure the name you have provided is accurate");
      return;
    }

    if (occupation.trim() === "" || occupation.length < 3) {
      setOccupationErr("Provide an occupation to proceed with verification");
      return;
    }

    if (phone.trim() === "" || phone.length < 8) {
      setPhoneErr("Please ensure the number you have provided is accurate");
      return;
    }

    if (nin.trim() === "" || nin.length < 9) {
      setNinErr("Please provide an accurate National Identity Number (NIN)");
      return;
    }

    //PROCEED IF NO ERROR
    setBtnIsLoading(true);
  }
  useEffect(() => {
    if (btnIsLoading) {
      let nameSplit = fullname.split(" ");

      const formData = {
        userEmail: `${userData?.email}`,
        userId: `${userData?._id}`,
        firstName: `${nameSplit[1].trim()}`,
        lastName: `${nameSplit[0].trim()}`,
        nin: nin,
        phoneNumber: phone,
        areaOfSpecialization: `${occupation.trim()}`,
      };

      try {
        axios
          .post(END_POINT.becomeArtisan, formData, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${accessToken}`,
            },
          })
          .then((res) => {
            //IF SUCCESS
            if (res.data.statusCode === 201) {
              //UPDATE USER DATA
              let updatedUser = [...userData, { isArtisan: true }];
              StoreDataToMemory(LOCAL_STORAGE_PATH.userData, updatedUser);

              setTimeout(() => {
                setVerificationSuccessfull("success");
              }, 3000);
            }

            setBtnIsLoading(false);
          })
          .catch((err) => {
            if (err.response.data.data.toLowerCase() === "check nin provided") {
              setErrorMsg("Ensure you have provided an accurate NIN");
              setVerificationSuccessfull("error");
            } else if (
              err.response.data.data.toLowerCase() ===
              "nin provided does not match any account details (first name, lastname, or phone)"
            ) {
              setErrorMsg(
                "Some of the details provided does not correspond with what is stored on your NIN"
              );
              setVerificationSuccessfull("error");
            } else if (
              err.response.data.data.toLowerCase() ===
              "account already an artisan"
            ) {
              //PROCEED
              setVerificationSuccessfull("success");
            } else {
              setErrorMsg(
                "Something went wrong. Please check your details and try again"
              );
              setVerificationSuccessfull("error");
            }

            setBtnIsLoading(false);
          });
      } catch (error) {
        setBtnIsLoading(false);
        setErrorMsg("Network Error. Check your connection and try again");
        setVerificationSuccessfull("error");
      }
    }
  }, [btnIsLoading]);

  return (
    <View style={styles.beginVerifyFullBlock}>
      <TouchableOpacity
        onPress={() => {
          closeVerifyTab();
        }}
        style={styles.beginVerifyModalCancel}
      ></TouchableOpacity>
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{ maxHeight: 720 }}
      >
        <View style={styles.beginVerifyModal}>
          <View style={styles.beginVerifyModalTitleBlock}>
            <Text style={styles.beginVerifyModalTitle}>
              Account verification
            </Text>
          </View>

          {verificationSuccessfull ? (
            <>
              <View style={styles.verifySuccessBlock}>
                <View style={styles.verifySuccessBlockTop}>
                  <View style={styles.verifySuccessIcon}>
                    {verificationSuccessfull === "success" ? (
                      <Image
                        source={require("../../../assets/icons/verified-big.png")}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/icons/verified-big-failed.png")}
                        style={{ width: "100%", height: "100%" }}
                      />
                    )}
                  </View>

                  <Text style={styles.verifySuccessTitle}>
                    {verificationSuccessfull === "success"
                      ? "Verification Successfull"
                      : "Verification Failed"}
                  </Text>

                  {verificationSuccessfull === "success" ? (
                    <Text style={styles.verifySuccessText}>
                      Your identity has been verified. You can now post services
                      on{" "}
                      <Text style={{ color: COLORS.black500 }}>
                        KraftKollectors
                      </Text>
                      .
                    </Text>
                  ) : (
                    <Text style={styles.verifySuccessText}>{errorMsg}</Text>
                  )}
                </View>

                {verificationSuccessfull === "success" ? (
                  <ActionBtn
                    btnText={"Setup profile"}
                    handleClick={() => {
                      concludeVerification();
                    }}
                  />
                ) : (
                  <ActionBtn
                    btnText={"Try again"}
                    handleClick={() => {
                      setVerificationSuccessfull("");
                    }}
                  />
                )}
              </View>
            </>
          ) : (
            <>
              <ScrollView contentContainerStyle={styles.verifyAuthBlock}>
                <VerifyInputTab
                  label={"Full name"}
                  placeholder={"Ex. John smith"}
                  input={fullname}
                  setInput={setfullname}
                  btmText={
                    "Use your full name as shown on your NIN card (Surname should come first)"
                  }
                  hasError={fullnameErr}
                />

                <VerifyInputTab
                  label={"Occupation"}
                  placeholder={"Ex. Web Developer"}
                  input={occupation}
                  setInput={setOccupation}
                  hasError={occupationErr}
                />

                <VerifyInputTab
                  label={"Phone Number"}
                  placeholder={"081XXXXXXXX"}
                  input={phone}
                  setInput={setPhone}
                  btmText={"Provide the phone number linked to your NIN"}
                  isNumeric={true}
                  hasError={phoneErr}
                />

                <VerifyInputTab
                  label={"NIN Number"}
                  placeholder={"Ex. 0123456789"}
                  input={nin}
                  setInput={setNin}
                  isNumeric={true}
                  hasError={ninErr}
                />

                <View style={{ marginVertical: 16 }}>
                  <ActionBtn
                    btnText={"Submit"}
                    handleClick={() => {
                      validateInputs();
                    }}
                    isLoading={btnIsLoading}
                  />
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  beginVerifyFullBlock: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    zIndex: 100,
    justifyContent: "flex-end",
  },
  beginVerifyModalCancel: {
    width: "100%",
    height: "auto",
    minHeight: 100,
  },
  beginVerifyModal: {
    width: "100%",
    height: "auto",
    backgroundColor: COLORS.whiteBG,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  beginVerifyModalTitleBlock: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  beginVerifyModalTitle: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black500,
  },
  verifySuccessBlock: {
    width: "100%",
    height: 560,
    paddingHorizontal: 16,
    paddingBottom: 56,
    justifyContent: "space-between",
  },
  verifySuccessBlockTop: {
    height: "70%",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 20,
  },
  verifySuccessIcon: {
    width: 132,
    height: 132,
    overflow: "hidden",
  },
  verifySuccessTitle: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 20 : 22,
    lineHeight: 28,
    color: COLORS.black500,
  },
  verifySuccessText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
    textAlign: "center",
  },
  verifyAuthBlock: {
    width: "100%",
    maxHeight: 720,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 56,
    gap: 12,
  },
});
