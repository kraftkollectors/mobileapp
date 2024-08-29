import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ReviewSummaryCard from "./subComp/reviewSummaryCard";
import { COLORS } from "../../../constants/themes/colors";

export default function ReviewDetailComp({
  serviceId,
  rateModal,
  showRateModal,
  userData,
  serviceData,
  userProfile,
}) {
  return (
    <View style={styles.reviewDetails}>
      {/**REVIEW SUMMARY */}
      <ReviewSummaryCard
        serviceId={serviceId}
        rateModal={rateModal}
        showRateModal={showRateModal}
        userData={userData}
        serviceData={serviceData}
        userProfile={userProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  reviewDetails: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    paddingVertical: 20,
  },
});
