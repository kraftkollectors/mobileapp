import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import ModalBtn from "./modalBtn";
import ProfileTextareaTab from "./profileTextareaTab";
import { END_POINT } from "../../../../hooks/endpoints";
import axios from "axios";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function ReportServiceModal({
  hideModal,
  profile,
  serviceId,
  userData,
  accessToken,
}) {
  const [report, setReport] = useState("");
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  //STORE ERRORS
  const [reportErr, setReportErr] = useState("");

  function validateInput() {
    //CLEAR ERROR
    setReportErr("");

    if (report.trim() === "") {
      setReportErr("Tell the support team what is wrong");
      return;
    }

    let numOfWords = report.trim().split(" ");
    if (numOfWords.length < 8) {
      setReportErr("Reports must be written in details not less than 8 words");
      return;
    }

    //CONTINUE IF NO ERROR
    setBtnIsLoading(true);
  }
  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        text: `${report.trim()}`,
        reporterId: `${userData?._id}`,
        reportedId: `${profile?._id}`,
        postId: `${serviceId}`,
        userEmail: `${userData?.email}`,
      };

      try {
        axios
          .post(END_POINT.reportService, formData, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${accessToken}`,
            },
          })
          .then((res) => {
            console.log(res.data);
            setBtnIsLoading(false);
            hideModal();
          })
          .catch((err) => {
            console.log(err.response.data);
            setReportErr("Authentication Error: please log in and try again");
            setBtnIsLoading(false);
          });
      } catch (error) {
        console.log(error.message);
        setReportErr(
          "Network Error: check your internet connection and try again"
        );
        setBtnIsLoading(false);
      }
    }
  }, [btnIsLoading]);

  return (
    <View style={styles.popupModalFrame}>
      <View style={styles.popupModalBox}>
        <TouchableOpacity onPress={hideModal} style={styles.modalCancelBtn}>
          <Octicons name="x" size={20} color={COLORS.black500} />
        </TouchableOpacity>

        <View style={styles.modalTextTab}>
          <Text style={styles.modalHeading}>Write Report</Text>
          <Text style={styles.modalBody}>
            Please type your report below to report the service.
          </Text>
        </View>

        <ProfileTextareaTab
          placeholder={"What is your complaint?"}
          input={report}
          setInput={setReport}
          hasError={reportErr}
        />

        <ModalBtn
          btnText={"Submit"}
          handleClick={() => {
            validateInput();
          }}
          isLoading={btnIsLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popupModalFrame: {
    width: screenWidth,
    height: screenHeight,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  popupModalBox: {
    width: "100%",
    height: "auto",
    borderRadius: 8,
    backgroundColor: COLORS.whiteBG,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 0,
  },
  modalCancelBtn: {
    width: 20,
    height: 20,
    marginLeft: "auto",
  },
  modalTextTab: {
    width: "100%",
    gap: 16,
    alignItems: "center",
  },
  modalHeading: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 22 : 24,
    lineHeight: 40,
    color: COLORS.yellowNormal,
    textAlign: "center",
  },
  modalBody: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black300,
    maxWidth: "90%",
    textAlign: "center",
  },
});
