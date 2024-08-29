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
import { EDU_DEGREE_ARRAY, YEAR_ARRAY } from "../../../constants/json";
import { END_POINT } from "../../../hooks/endpoints";
import axios from "axios";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function EduAddComp({
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
  const listOfDegrees = EDU_DEGREE_ARRAY();
  const listOfYears = YEAR_ARRAY();

  //STORE DATA
  const [universityName, setUniversityName] = useState("");
  const [degree, setDegree] = useState("");
  const [areaOfStudy, setAreaOfStudy] = useState("");
  const [yearOfGrad, setYearOfGrad] = useState(`${new Date().getFullYear()}`);
  useEffect(() => {
    if (isEdit) {
      setUniversityName(editData?.university);
      setDegree(editData?.degree);
      setAreaOfStudy(editData?.areaOfStudy);
      setYearOfGrad(editData?.year);
    }
  }, [isEdit]);

  //STORE DATA ERROR
  const [universityNameErr, setUniversityNameErr] = useState("");
  const [degreeErr, setDegreeErr] = useState("");
  const [areaOfStudyErr, setAreaOfStudyErr] = useState("");

  //VALIDATION HANDLE
  function validateInputs() {
    //CLEAR eRRORS
    setUniversityNameErr("");
    setDegreeErr("");
    setAreaOfStudyErr("");

    if (universityName.trim() === "" || universityName.length < 5) {
      setUniversityNameErr("Please ensure you provide accurate information");
      return;
    }

    if (degree.trim() === "" || degree.length < 1) {
      setDegreeErr("Please choose a degree to proceed");
      return;
    }

    if (areaOfStudy.trim() === "" || areaOfStudy.length < 3) {
      setAreaOfStudyErr("Please ensure you provide accurate information");
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
        university: `${universityName.trim()}`,
        degree: `${degree}`,
        areaOfStudy: `${areaOfStudy.trim()}`,
        year: `${yearOfGrad}`,
      };

      try {
        if (isEdit) {
          //REQUEST TO EDIT EXISTING EDUCATION
          axios
            .patch(END_POINT.editEducation(editData?._id), formData, {
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
                  "Education Update Successful",
                  "You have successfully updated your education history"
                );
              }
              setBtnIsLoading(false);
            })
            .catch((err) => {
              //console.log('Error: ', err.response.data);
              //SHOW ALERT
              setAlert(
                "error",
                "Education Update Failed",
                "Something went wrong. Please try again"
              );

              setBtnIsLoading(false);
            });
        } else {
          //REQUEST TO ADD NEW EDUCATION
          axios
            .post(END_POINT.uploadEducation, formData, {
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
                  "Add New Education Successful",
                  "You have added a new education history to your profile"
                );
              }
              setBtnIsLoading(false);
            })
            .catch((err) => {
              console.log("Error: ", err.response.data);
              //SHOW ALERT
              setAlert(
                "error",
                "Add New Education Failed",
                "Something went wrong. Please try again"
              );

              setBtnIsLoading(false);
            });
        }
      } catch (error) {
        console.log("Net Error: ", error.message);
        //SHOW ALERT
        setAlert(
          "error",
          "Add New Education Failed",
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
              label={"University name"}
              placeholder={"Ex. Federal University of Technology Owerri"}
              input={universityName}
              setInput={setUniversityName}
              hasError={universityNameErr}
            />

            <SettingSelectTab
              label={"Degree"}
              placeholder={"Click to select"}
              selectList={listOfDegrees}
              selectedItem={degree}
              setSelectedItem={setDegree}
              hasError={degreeErr}
            />

            <SettingInputTab
              label={"Area of study"}
              placeholder={"Ex. Computer Engineering"}
              input={areaOfStudy}
              setInput={setAreaOfStudy}
              hasError={areaOfStudyErr}
            />

            <SettingSelectTab
              label={"Year of graduation"}
              placeholder={"Click to select"}
              selectList={listOfYears}
              selectedItem={yearOfGrad}
              setSelectedItem={setYearOfGrad}
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
