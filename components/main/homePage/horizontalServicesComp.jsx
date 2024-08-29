import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/themes/colors";
import ServiceTab from "./subComps/serviceTab";
import ServiceLoadingTemp from "../../loadingTemplates/homePage/serviceLoadingTemp";

const screenWidth = Dimensions.get("screen").width;

export default function HorizontalServicesComp({
  sectionTitle,
  serviceData,
  isLoading,
}) {
  return (
    <View style={styles.featuredCont}>
      <View style={styles.featuredHeading}>
        <Text style={styles.featuredHeadingText}>{sectionTitle}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredScroll}
      >
        {isLoading ? (
          <>
            <ServiceLoadingTemp />
            <ServiceLoadingTemp />
          </>
        ) : (
          <>
            {serviceData && serviceData.length > 0 ? (
              serviceData.map((item, index) => (
                <ServiceTab key={index} data={item} />
              ))
            ) : (
              <></>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredCont: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  featuredHeading: {
    width: "100%",
  },
  featuredHeadingText: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.black400,
  },
  featuredScroll: {
    gap: 12,
  },
});
