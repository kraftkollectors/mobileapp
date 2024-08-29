import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { COLORS } from "../../../constants/themes/colors";
import AdIndicator from "./subComps/adIndicator";
import { LOAD_SERVICE_THUMBNAIL } from "../../../constants/utilities";
import { FETCH_PAID_ADS } from "../../../hooks/requests";

const screenWidth = Dimensions.get("screen").width;

export default function AdScreenComp() {
  const [adPics, setAdPics] = useState();
  const [adsLoading, setAdsLoading] = useState(false);

  useEffect(() => {
    FETCH_PAID_ADS(setAdsLoading, setAdPics);
  }, []);

  async function openAdLink(link) {
    let url = "";

    if (link.includes("http")) {
      url = link;
    } else {
      url = `https://${link}`;
    }

    Linking.openURL(url);
  }

  return (
    <View style={styles.adScreenCont}>
      {adPics && (
        <>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.adScrollView}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            decelerationRate="fast"
            snapToOffsets={[
              screenWidth - (32 - 8),
              (screenWidth - (32 - 8)) * 2,
              (screenWidth - (32 - 8)) * 3,
            ]}
          >
            {adPics.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  openAdLink(`${item?.url}`);
                }}
                key={index}
                style={styles.adDisplay}
              >
                <Image
                  source={LOAD_SERVICE_THUMBNAIL(item?.image)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <View style={styles.adTitleBlock}>
                  <Text style={styles.adTitle}>{item?.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View>
            <AdIndicator totalDots={adPics.length} activeDot={1} />
          </View>
        </>
      )}
      {adsLoading && <View style={styles.adDisplay}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  adScreenCont: {
    width: "100%",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  adScrollView: {
    gap: 8,
  },
  adDisplay: {
    minWidth: screenWidth - 32,
    width: screenWidth - 32,
    height: 248,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.whiteBG,
    position: "relative",
  },
  adTitleBlock: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 4,
  },
  adTitle: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.whiteBG,
    textTransform: "capitalize",
  },
});
