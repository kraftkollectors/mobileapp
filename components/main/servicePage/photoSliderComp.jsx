import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS } from "../../../constants/themes/colors";

export default function PhotoSliderComp({ data }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    setPhotos([]);
    if (data) {
      let clonePhotos = [];
      clonePhotos.push(data?.coverPhoto);

      let ports = data?.portfolio;
      ports.forEach((pic) => {
        var portSplit = pic.split(".");
        var ext = portSplit[portSplit.length - 1].toLowerCase();
        if (ext === "jpg" || ext === "jpeg" || ext === "png") {
          clonePhotos.push(pic);
        }
      });

      setPhotos((prev) => [...prev, ...clonePhotos]);
    }
  }, [data]);
  return (
    <View style={styles.sliderComp}>
      <SliderBox
        images={photos}
        imageLoadingColor={COLORS.whiteBG}
        sliderBoxHeight={264}
        resizeMethod={"resize"}
        resizeMode={"contain"}
        disableOnPress={true}
        dotColor={COLORS.whiteBG}
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
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderComp: {
    width: "100%",
    height: 264,
    backgroundColor: COLORS.black900,
  },
});
