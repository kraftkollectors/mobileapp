import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/themes/colors";
import { SERVICE_CATEGORIES } from "../../../constants/json/data";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("screen").width;

export default function HireCategoryComp() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const sCat = SERVICE_CATEGORIES();

    let clone = [];
    for (x = 0; x < 7; x++) {
      clone.push(sCat[x].category);
    }

    clone.push("view all");

    setCategoryList([...clone]);
  }, []);

  function goToSearch(cat) {
    if (cat === "view all") {
      router.navigate(`/main/search/`);
    } else {
      router.navigate(`/main/search/?category=${cat}`);
    }
  }

  return (
    <View style={styles.hireCont}>
      <View style={styles.hireBlockCont}>
        {categoryList &&
          categoryList.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                goToSearch(item);
              }}
              key={index}
              style={styles.hireTab}
            >
              <View style={styles.hireTabInner}>
                <Image
                  source={require("../../../assets/icons/service-icon.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </View>
              <Text style={styles.hireTabText} numberOfLines={1}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hireCont: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 8,
  },
  hireBlockCont: {
    width: "100%",
    height: "auto",
    gap: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  hireTab: {
    minWidth: (screenWidth - (3 * 8 + 32)) / 4,
    width: (screenWidth - (3 * 8 + 32)) / 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  hireTabInner: {
    width: "100%",
    height: 72,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.whiteBG,
    overflow: "hidden",
  },
  hireTabText: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.black400,
    textTransform: "capitalize",
    textAlign: "center",
  },
});
