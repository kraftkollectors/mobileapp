import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { COLORS } from "../../../constants/themes/colors";
import FilterSortBy from "./subComp/filterSortBy";
import FilterCategory from "./subComp/filterCategory";
import FilterPrice from "./subComp/filterPrice";

export default function FilterModal({
  showFilter,
  sortBy,
  setSortBy,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  showResult,
  clearFilter,
}) {
  const [openBlock, setOpenBlock] = useState(""); //sort, category, price
  function chooseFilterBlock(choice) {
    if (choice === openBlock) {
      setOpenBlock("");
    } else {
      setOpenBlock(choice);
    }
  }
  return (
    <View style={styles.popupBlock}>
      <TouchableOpacity
        onPress={() => {
          showFilter(false);
        }}
      >
        <View
          style={{
            height: screenHeight,
            width: screenWidth,
            position: "absolute",
            zIndex: -1,
          }}
        ></View>
      </TouchableOpacity>

      <KeyboardAvoidingView enabled behavior="padding">
        <View style={styles.modalTab}>
          <View style={styles.modalTitleTab}>
            <Text style={styles.modalTitle}>Filter</Text>
          </View>

          <View style={styles.modalContent}>
            {FilterBlock(chooseFilterBlock, openBlock, "sort")}
            {openBlock === "sort" && (
              <FilterSortBy sortBy={sortBy} setSortBy={setSortBy} />
            )}

            {FilterBlock(chooseFilterBlock, openBlock, "category")}
            {openBlock === "category" && (
              <FilterCategory
                category={category}
                setCategory={setCategory}
                subCategory={subcategory}
                setSubCategory={setSubcategory}
              />
            )}

            {FilterBlock(chooseFilterBlock, openBlock, "price")}
            {openBlock === "price" && (
              <FilterPrice
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            )}
          </View>

          <View style={styles.modalButtonTab}>
            {ClearAllBtn(clearFilter, showResult, showFilter)}

            {ShowResultBtn(showResult, showFilter)}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function ShowResultBtn(showResult, showFilter) {
  return (
    <TouchableOpacity
      onPress={() => {
        showResult(true);
        showFilter(false);
      }}
      style={[styles.modalBtn, styles.modalBtnPri]}
    >
      <Text style={[styles.modalBtnText, { color: COLORS.whiteBG }]}>
        Show results
      </Text>
    </TouchableOpacity>
  );
}

function ClearAllBtn(clearFilter, showResult, showFilter) {
  return (
    <TouchableOpacity
      onPress={() => {
        clearFilter();
        showResult(true);
        showFilter(false);
      }}
      style={[styles.modalBtn, styles.modalBtnSec]}
    >
      <Text style={[styles.modalBtnText, { color: COLORS.black500 }]}>
        Clear all
      </Text>
    </TouchableOpacity>
  );
}

function FilterBlock(chooseFilterBlock, openBlock, filterName) {
  return (
    <TouchableOpacity
      onPress={() => {
        chooseFilterBlock(filterName);
      }}
      style={styles.modalGroupTab}
    >
      <Text style={styles.modalGroupTabText}>
        {filterName === "sort" ? "Sort By" : filterName}
      </Text>
      <Feather
        name={openBlock === filterName ? "chevron-up" : "chevron-down"}
        size={20}
        color={COLORS.black400}
      />
    </TouchableOpacity>
  );
}

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  popupBlock: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    justifyContent: "space-between",
  },
  modalTab: {
    width: "100%",
    height: "auto",
    minHeight: 200,
    maxHeight: screenHeight - 92,
    backgroundColor: COLORS.whiteBG,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 32,
  },
  modalTitleTab: {
    width: "100%",
    height: 56,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black500,
  },
  modalButtonTab: {
    width: "100%",
    height: 92,
    borderTopWidth: 1,
    borderTopColor: COLORS.black50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 16,
  },
  modalBtn: {
    width: (screenWidth - (32 + 16)) / 2,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
  },
  modalBtnSec: {
    borderWidth: 1,
    borderColor: COLORS.black50,
  },
  modalBtnPri: {
    backgroundColor: COLORS.black500,
  },
  modalContent: {
    width: "100%",
    gap: 8,
    minHeight: 100,
  },
  modalGroupTab: {
    width: "100%",
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  modalGroupTabText: {
    fontFamily: "EinaBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 24,
    color: COLORS.black400,
    textTransform: "capitalize",
  },
});
