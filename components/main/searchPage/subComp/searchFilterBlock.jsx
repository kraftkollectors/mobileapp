import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";

export default function SearchFilterBlock({
  popupFilter,
  popupLocation,
  category,
  subCategory,
  sort,
  minPrice,
  maxPrice,
  radius,
}) {
  const [filterInUse, setFilterInUse] = useState(false);
  const [numOfUsedFilter, setNOUF] = useState(0);
  useEffect(() => {
    setNOUF(0);
    if (category || subCategory || sort || minPrice || maxPrice) {
      setFilterInUse(true);

      if (category) setNOUF((prev) => Number(prev + 1));
      if (subCategory) setNOUF((prev) => Number(prev + 1));
      if (sort) setNOUF((prev) => Number(prev + 1));
      if (minPrice && maxPrice) setNOUF((prev) => Number(prev + 1));
    } else {
      setFilterInUse(false);
    }
  }, [category, subCategory, sort, minPrice, maxPrice]);
  return (
    <View style={styles.searchFilterBlock}>
      <TouchableOpacity
        onPress={() => {
          popupFilter(true);
        }}
        style={styles.searchFilterTab}
      >
        <Ionicons
          name="filter"
          size={20}
          color={filterInUse ? COLORS.blueNormal : COLORS.black200}
        />
        <Text
          style={[
            styles.searchFilterText,
            filterInUse
              ? { color: COLORS.blueNormal }
              : { color: COLORS.black400 },
          ]}
        >
          Filter {numOfUsedFilter > 0 && `(${numOfUsedFilter})`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          popupLocation(true);
        }}
        style={styles.searchFilterTab}
      >
        <Feather
          name="map-pin"
          size={20}
          color={radius ? COLORS.blueNormal : COLORS.black200}
        />
        <Text
          style={[
            styles.searchFilterText,
            radius ? { color: COLORS.blueNormal } : { color: COLORS.black400 },
          ]}
        >
          {radius ? `${radius}km` : "All Nigeria"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  searchFilterBlock: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    gap: 8,
  },
  searchFilterTab: {
    width: (screenWidth - (32 + 8)) / 2,
    height: 44,
    backgroundColor: COLORS.whiteBG,
    borderWidth: 1,
    borderColor: COLORS.black50,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  searchFilterText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
  },
});
