import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/themes/colors";
import {
  FORMATNUMBERWITHCOMMA,
  TRUNCATESTRING,
} from "../../../constants/utilities";
import ServiceDetailsLoadingTemp from "../../loadingTemplates/servicePage/serviceDetailsLoadingTemp";

export default function ServiceDetailsComp({ data, isLoading }) {
  //CHECK DESC LENGTH
  const maxDesc = 200;
  const [shownDesc, setShownDesc] = useState("");
  const [descIsLong, setDescIsLong] = useState(false);
  useEffect(() => {
    if (data) {
      if (data?.description.length > maxDesc) {
        const shortDesc = TRUNCATESTRING(data?.description, maxDesc);
        setDescIsLong(true);
        setShownDesc(shortDesc);
      } else {
        setShownDesc(data?.description);
      }
    }
  }, [data]);
  //HANDLE READMORE BUTTON
  function showMore() {
    setShownDesc(data?.description);
    setDescIsLong(false);
  }

  return (
    <>
      {isLoading ? (
        <ServiceDetailsLoadingTemp />
      ) : (
        <>
          {data && (
            <View style={styles.serviceDetailComp}>
              <View style={styles.serviceCategoryTab}>
                <Text style={styles.serviceCategory}>{data?.category}</Text>
                <View style={styles.serviceCategorySplit}></View>
                <Text style={styles.serviceCategory}>{data?.subCategory}</Text>
              </View>

              <View style={styles.sdcTop}>
                <Text style={styles.serviceTitle}>{data?.title}</Text>
                {data && (
                  <Text style={styles.servicePrice}>
                    N {FORMATNUMBERWITHCOMMA(data?.estimatedPrice)}{" "}
                    <Text style={styles.serviceCharge}>
                      /{data?.charge === "hourly" ? "hr" : "fixed"}
                    </Text>
                  </Text>
                )}
              </View>

              <View style={styles.sdcBtm}>
                <Text style={styles.serviceDesc}>
                  {shownDesc}
                  {descIsLong ? (
                    <Text
                      onPress={() => {
                        showMore();
                      }}
                      style={styles.readMoreText}
                    >
                      {" "}
                      Read more
                    </Text>
                  ) : (
                    <></>
                  )}
                </Text>
              </View>

              <View>
                <View>
                  <Text></Text>
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  serviceDetailComp: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    paddingVertical: 17,
    paddingHorizontal: 16,
  },
  sdcTop: {
    width: "100%",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  serviceTitle: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.black900,
    textTransform: "capitalize",
  },
  servicePrice: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.blueNormal,
  },
  serviceCharge: {
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 28,
    color: COLORS.black500,
  },
  sdcBtm: {
    width: "100%",
    paddingVertical: 12,
    gap: 8,
  },
  serviceDesc: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black500,
  },
  readMoreText: {
    fontFamily: "EinaBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.blueNormal,
  },
  serviceCategoryTab: {
    width: "auto",
    alignSelf: "flex-start",
    height: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 8,
    backgroundColor: COLORS.gray200,
  },
  serviceCategory: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.black300,
    textTransform: "capitalize",
  },
  serviceCategorySplit: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.black100,
  },
});
