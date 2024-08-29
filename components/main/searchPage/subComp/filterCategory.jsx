import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SettingSelectTab from "../../accountPage/subComps/settingSelectTab";
import { SERVICE_CATEGORIES } from "../../../../constants/json";

export default function FilterCategory({
  category,
  setCategory,
  subCategory,
  setSubCategory,
}) {
  const [categoryList, setCategoryList] = useState();
  const [subCategoryList, setSubCategoryList] = useState();

  useEffect(() => {
    let serviceCat = SERVICE_CATEGORIES();
    let catArr = [];
    serviceCat.forEach((cat) => {
      catArr.push(cat.category);
    });
    setCategoryList(catArr);
  }, []);

  useEffect(() => {
    if (category) {
      setSubCategory("");

      let serviceCat = SERVICE_CATEGORIES();
      let subArr = [];
      serviceCat.forEach((cat) => {
        if (cat.category === category) {
          setSubCategoryList(cat.sub);
        }
      });
    }
  }, [category]);

  return (
    <View style={styles.filterCategory}>
      <SettingSelectTab
        label={"Category"}
        placeholder={"-select category-"}
        selectList={categoryList}
        selectedItem={category}
        setSelectedItem={setCategory}
      />

      {category && (
        <SettingSelectTab
          label={"Sub-category"}
          placeholder={"-select sub-category-"}
          selectList={subCategoryList}
          selectedItem={subCategory}
          setSelectedItem={setSubCategory}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterCategory: {
    width: "100%",
    height: "auto",
    padding: 16,
    gap: 16,
  },
});
