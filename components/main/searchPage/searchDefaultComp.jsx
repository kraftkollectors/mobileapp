import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import { SERVICE_CATEGORIES } from "../../../constants/json";

const CategoryTab = ({ index, data, chooseCategory }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        chooseCategory(index);
      }}
      style={styles.categoryTab}
    >
      <Text style={styles.categoryTabTitle}>{data?.category}</Text>
      <Text style={styles.categoryTabSub} numberOfLines={1}>
        {data?.sub.map(
          (item, index) => `${item}${index < data?.sub.length - 1 ? ", " : ""}`
        )}
      </Text>
    </TouchableOpacity>
  );
};

const SubTab = ({ data, setSubCategory, setSearch, beginSearch }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSubCategory(data);
        setSearch(data);
        beginSearch(true);
      }}
      style={styles.subTab}
    >
      <Text style={styles.subTabTitle} numberOfLines={1}>
        {data}
      </Text>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.black400} />
    </TouchableOpacity>
  );
};

export default function SearchDefaultComp({
  setCategory,
  setSubCategory,
  setSearch,
  beginSearch,
}) {
  const [categorySelected, setCategorySelected] = useState();

  const [categoryList, setCategoryList] = useState();
  useEffect(() => {
    setCategoryList(SERVICE_CATEGORIES);
  }, []);

  const [subList, setSubList] = useState();
  useEffect(() => {
    if (categorySelected || categorySelected === 0) {
      setCategory(categoryList[categorySelected]?.category);
      setSubList(categoryList[categorySelected]?.sub);
    } else {
      setSubList();
    }
  }, [categorySelected]);

  return (
    <View style={styles.searchDefaultComp}>
      <View style={styles.sdcTitleBar}>
        {categorySelected || categorySelected === 0 ? (
          <>
            <TouchableOpacity
              onPress={() => {
                setCategorySelected();
              }}
            >
              <MaterialIcons
                name="arrow-back"
                size={20}
                color={COLORS.black500}
              />
            </TouchableOpacity>

            <Text style={styles.sdcTitle}>
              {categoryList[categorySelected]?.category}
            </Text>
          </>
        ) : (
          <Text style={styles.sdcTitle}>Our Categories</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.sdcListDisplay}>
        {categorySelected || categorySelected === 0 ? (
          <>
            {subList &&
              subList.map((item, index) => (
                <SubTab
                  key={index}
                  data={item}
                  setSubCategory={setSubCategory}
                  setSearch={setSearch}
                  beginSearch={beginSearch}
                />
              ))}
          </>
        ) : (
          <>
            {categoryList &&
              categoryList.map((item, index) => (
                <CategoryTab
                  key={index}
                  index={index}
                  data={item}
                  chooseCategory={setCategorySelected}
                />
              ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  searchDefaultComp: {
    width: "100%",
    minHeight: "100%",
    backgroundColor: COLORS.whiteBG,
  },
  sdcTitleBar: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  sdcTitle: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black400,
    textTransform: "capitalize",
  },
  sdcListDisplay: {
    width: "100%",
    paddingBottom: 240,
    paddingLeft: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: COLORS.black50,
    borderBottomColor: COLORS.black50,
  },
  categoryTab: {
    width: "100%",
    height: 76,
    paddingVertical: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    justifyContent: "center",
    gap: 4,
  },
  categoryTabTitle: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black500,
    textTransform: "capitalize",
  },
  categoryTabSub: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black500,
    textTransform: "capitalize",
  },
  subTab: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  subTabTitle: {
    width: screenWidth - (32 + 24 + 8),
    fontFamily: "EinaRegular",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black500,
    textTransform: "capitalize",
  },
});
