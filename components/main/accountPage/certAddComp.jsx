import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import SettingInputTab from "./subComps/settingInputTab";
import SettingSelectTab from "./subComps/settingSelectTab";
import SaveBtn from "./subComps/saveBtn";
import { COLORS } from "../../../constants/themes/colors";
import { YEAR_ARRAY } from "../../../constants/json";
import { END_POINT } from "../../../hooks/endpoints";
import axios from "axios";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function CertAddComp({
  handleClick,
  userData,
  accessToken,
  update,
  isEdit,
  editData,
  setAlert,
}) {
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  //ARRAY OF OPTIONS
  const listOfYears = YEAR_ARRAY();

  //STORE DATA
  const [certificateName, setCertificateName] = useState("");
  const [certifiedBy, setCertifiedBy] = useState("");
  const [yearOfCompletion, setYearOfCompletion] = useState(
    `${new Date().getFullYear()}`
  );
  useEffect(() => {
    if (isEdit) {
      setCertificateName(editData?.certificate);
      setCertifiedBy(editData?.certifiedBy);
      setYearOfCompletion(editData?.year);
    }
  }, [isEdit]);

  //STORE DATA ERROR
  const [certificateNameErr, setCertificateNameErr] = useState("");
  const [certifiedByErr, setCertifiedByErr] = useState("");

  //VALIDATION HANDLE
  function validateInputs() {
    //CLEAR eRRORS
    setCertificateNameErr("");
    setCertifiedByErr("");

    if (certificateName.trim() === "" || certificateName.length < 5) {
      setCertificateNameErr("Please ensure you provide accurate information");
      return;
    }

    if (certifiedBy.trim() === "" || certifiedBy.length < 1) {
      setCertifiedByErr("Please ensure you provide accurate information");
      return;
    }

    //PROCEEd IF NO ERROR
    setBtnIsLoading(true);
  }
  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        userEmail: `${userData?.email}`,
        userId: `${userData?._id}`,
        certificate: `${certificateName.trim()}`,
        certifiedBy: `${certifiedBy.trim()}`,
        year: `${yearOfCompletion}`,
      };

      try {
        if (isEdit) {
          //REQUEST TO EDIT EXISTING CERTIFICATE
          axios
            .patch(END_POINT.editCertificate(editData?._id), formData, {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": `${accessToken}`,
              },
            })
            .then((res) => {
              //console.log(res.data);
              if (res.data.statusCode === 201) {
                update();
                handleClick();
                //SHOW ALERT
                setAlert(
                  "success",
                  "Certificate Update Successful",
                  "You have successfully updated your certificate"
                );
              }
              setBtnIsLoading(false);
            })
            .catch((err) => {
              //console.log('Error: ', err.response.data);
              //SHOW ALERT
              setAlert(
                "error",
                "Certificate Update Failed",
                "Something went wrong. Please try again"
              );

              setBtnIsLoading(false);
            });
        } else {
          //REQUEST TO ADD NEW CERTIFICATE
          axios
            .post(END_POINT.uploadCertificate, formData, {
              headers: {
                "Content-Type": "application/json",
                "x-access-token": `${accessToken}`,
              },
            })
            .then((res) => {
              //console.log(res.data);
              if (res.data.statusCode === 201) {
                update();
                handleClick();
                //SHOW ALERT
                setAlert(
                  "success",
                  "Add New Certificate",
                  "You have added a new certification to your profile"
                );
              }
              setBtnIsLoading(false);
            })
            .catch((err) => {
              //console.log('Error: ', err.response.data);
              //SHOW ALERT
              setAlert(
                "error",
                "Add New Certificate Failed",
                "Something went wrong. Please try again"
              );

              setBtnIsLoading(false);
            });
        }
      } catch (error) {
        //console.log('Net Error: ', error.message);
        //SHOW ALERT
        setAlert(
          "error",
          "Add New Certificate Failed",
          "Network Error. Check your connection and try again"
        );

        setBtnIsLoading(false);
      }
    }
  }, [btnIsLoading]);

  return (
    <View style={styles.pagePopupBlock}>
      <View></View>

      <KeyboardAvoidingView enabled behavior="padding">
        <View style={styles.pageModalTab}>
          <View style={styles.pageModalCancelTab}>
            <TouchableOpacity
              onPress={() => {
                handleClick();
              }}
            >
              <Text style={styles.pageModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/** */}
            <SettingInputTab
              label={"Certificate"}
              placeholder={"Ex. Backend Development in JavaScript"}
              input={certificateName}
              setInput={setCertificateName}
              hasError={certificateNameErr}
            />

            <SettingInputTab
              label={"Certified by"}
              placeholder={"Ex. FreeCodeCamp"}
              input={certifiedBy}
              setInput={setCertifiedBy}
              hasError={certifiedByErr}
            />

            <SettingSelectTab
              label={"Year of completion"}
              placeholder={"Click to select"}
              selectList={listOfYears}
              selectedItem={yearOfCompletion}
              setSelectedItem={setYearOfCompletion}
            />

            {/** */}
          </ScrollView>

          <SaveBtn
            btnText={"Done"}
            handleClick={() => {
              validateInputs();
            }}
            isLoading={btnIsLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  pagePopupBlock: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    justifyContent: "space-between",
  },
  pageModalTab: {
    width: "100%",
    height: "auto",
    maxHeight: screenHeight - 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 48 : 64,
    backgroundColor: COLORS.whiteBG,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 8,
  },
  pageModalCancelTab: {
    width: "auto",
    marginLeft: "auto",
    paddingBottom: 10,
  },
  pageModalCancelText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.redWarning,
  },
});
