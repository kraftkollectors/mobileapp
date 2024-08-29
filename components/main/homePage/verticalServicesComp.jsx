import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";
import { COLORS } from "../../../constants/themes/colors";

import RecommendCard from "./subComps/recommendCard";
import RecommendCardLoadingTemp from "../../loadingTemplates/homePage/recommendLoadingTemp";

const screenWidth = Dimensions.get("screen").width;

export default function VerticalServicesComp({
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.featuredScroll}
      >
        {isLoading ? (
          <>
            <RecommendCardLoadingTemp />
            <RecommendCardLoadingTemp />
          </>
        ) : (
          <>
            {serviceData && serviceData.length > 0 ? (
              serviceData.map((item, index) => (
                <RecommendCard key={index} data={item} />
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
