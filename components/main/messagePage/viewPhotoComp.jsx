import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../../../constants/themes/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function ViewPhotoComp({ guestName, photoList, setPhotoList }) {
  function closeView() {
    setPhotoList();
  }

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    setPhotos([]);
    if (photoList) {
      let clonePhotos = [];

      photoList.forEach((pic) => {
        var picSplit = pic.split(".");
        var ext = picSplit[picSplit.length - 1].toLowerCase();
        if (ext === "jpg" || ext === "jpeg" || ext === "png") {
          clonePhotos.push(pic);
        }
      });

      setPhotos((prev) => [...prev, ...clonePhotos]);
    }
  }, [photoList]);

  return (
    <SafeAreaView style={styles.viewBlock}>
      <StatusBar
        animated={true}
        backgroundColor={COLORS.black900}
        style={"light"}
        translucent={true}
      />

      <View style={styles.viewCancelBlock}>
        <TouchableOpacity
          style={styles.viewCancel}
          onPress={() => {
            closeView();
          }}
        >
          <Octicons name="arrow-left" size={24} color={COLORS.whiteBG} />
        </TouchableOpacity>

        <Text style={styles.viewCancelText} numberOfLines={1}>
          {guestName} - {photoList ? photoList.length : "0"} Photo
          {photoList.length > 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.viewTab}>
        <SliderBox
          images={photos}
          imageLoadingColor={COLORS.whiteBG}
          sliderBoxHeight={screenHeight - 64}
          resizeMethod={"resize"}
          resizeMode={"cover"}
          disableOnPress={true}
          dotColor={COLORS.blueNormal}
          inactiveDotColor={COLORS.gray200}
          dotStyle={{
            width: 7.5,
            height: 7.5,
            borderRadius: 15,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
          }}
          paginationBoxVerticalPadding={20}
          paginationBoxStyle={{
            justifyContent: "center",
            gap: 4,
            backgroundColor: "rgba(0,0,0,0.3)",
            borderRadius: 40,
            height: 45,
            padding: 0,
            marginBottom: Platform.OS === "ios" ? 92 : 124,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: COLORS.black900,
  },
  viewCancelBlock: {
    width: screenWidth,
    height: 64,
    backgroundColor: COLORS.black900,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  viewCancel: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  viewCancelText: {
    width: screenWidth - (24 + 16),
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.whiteBG,
  },
  viewTab: {
    width: screenWidth,
    height: screenHeight - 64,
    backgroundColor: COLORS.black900,
  },
});
