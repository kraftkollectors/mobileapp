import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/themes/colors";
import AboutEduCertTab from "./subComp/aboutEduCertTab";

export default function AboutUserComp({ profile, artisan }) {
  //DEMO DATA
  const [educationHistory, setEducationHistory] = useState();
  const [certificationHistory, setCertificationHistory] = useState();

  useEffect(() => {
    if (profile) {
      setEducationHistory(profile?.education);
      setCertificationHistory(profile?.certification);
    }
  }, [profile]);

  return (
    <View style={styles.aboutComp}>
      {/**ABOUT */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionHeading}>About me</Text>
        {/** */}
        {artisan && artisan.description ? (
          <Text style={styles.aboutMe}>{artisan?.description}</Text>
        ) : (
          <Text style={styles.notAddedText}>Not added yet</Text>
        )}
      </View>

      {/**EDUCATION */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionHeading}>Education</Text>
        {/** */}
        {educationHistory && educationHistory.length > 0 ? (
          educationHistory.map((item, index) => (
            <AboutEduCertTab
              key={index}
              index={index}
              typeName={"education"}
              fullLength={educationHistory.length - 1}
              data={item}
            />
          ))
        ) : (
          <Text style={styles.notAddedText}>Not added yet</Text>
        )}
      </View>

      {/**CERTIFICATION */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionHeading}>Certifications</Text>
        {/** */}
        {certificationHistory && certificationHistory.length > 0 ? (
          certificationHistory.map((item, index) => (
            <AboutEduCertTab
              key={index}
              index={index}
              typeName={"certification"}
              fullLength={certificationHistory.length - 1}
              data={item}
            />
          ))
        ) : (
          <Text style={styles.notAddedText}>Not added yet</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutComp: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    paddingVertical: 8,
    paddingLeft: 16,
    gap: 12,
  },
  sectionBlock: {
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    gap: 8,
  },
  sectionHeading: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black900,
  },
  aboutMe: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black400,
  },
  notAddedText: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black300,
  },
});
