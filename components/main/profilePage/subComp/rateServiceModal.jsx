import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";
import ModalBtn from "./modalBtn";
import ProfileTextareaTab from "./profileTextareaTab";
import StarRatingClickable from "../../../general/starRatingClickable";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import {
  contains_forbidden_words,
  has_less_words,
  isEmpty,
} from "../../../../constants";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function RateServiceModal({
  hideModal,
  profile,
  serviceId,
  userData,
  accessToken,
}) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  //STORE ERRORS
  const [reviewErr, setReviewErr] = useState("");

  function validateInput() {
    //CLEAR ERROR
    setReviewErr("");

    //review
    if (isEmpty(review, "Service review", setReviewErr)) {
      return;
    }

    if (has_less_words(5, review, "Service review", setReviewErr)) {
      return;
    }

    if (contains_forbidden_words(review, "Service review", setReviewErr)) {
      return;
    }

    //CONTINUE IF NO ERROR
    setBtnIsLoading(true);
  }
  useEffect(() => {
    if (btnIsLoading) {
      const formData = {
        serviceId: `${serviceId}`,
        rating: `${rating === 0 ? 1 : rating}`,
        review: `${review.trim()}`,
        reviewerId: `${userData?._id}`,
        ownerId: `${profile?._id}`,
        userEmail: `${userData?.email}`,
      };

      try {
        axios
          .post(END_POINT.rateService, formData, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${accessToken}`,
            },
          })
          .then((res) => {
            setBtnIsLoading(false);
            hideModal();
          })
          .catch((err) => {
            setReviewErr("Authentication Error: please log in and try again");
            setBtnIsLoading(false);
          });
      } catch (error) {
        setReviewErr(
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
          <Text style={styles.modalHeading}>Rate Service</Text>
          <Text style={styles.modalBody}>
            Kindly provide genuine feedback to benefit both future customers and
            the artisan in attracting more clients.
          </Text>

          <StarRatingClickable
            rating={rating}
            setRating={setRating}
            starSize={40}
          />
        </View>

        <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={16}>
          <ProfileTextareaTab
            placeholder={"Write a review"}
            input={review}
            setInput={setReview}
            hasError={reviewErr}
          />

          <ModalBtn
            btnText={"Submit"}
            handleClick={() => {
              validateInput();
            }}
            isLoading={btnIsLoading}
          />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popupModalFrame: {
    width: screenWidth,
    height: screenHeight,
    overflow: "hidden",
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
    fontSize: Platform.OS === "ios" ? 20 : 22,
    lineHeight: 28,
    color: COLORS.black900,
    textAlign: "center",
  },
  modalBody: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 24,
    color: COLORS.black200,
    textAlign: "center",
  },
});
