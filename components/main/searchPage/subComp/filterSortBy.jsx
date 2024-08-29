import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../../../constants/themes/colors";

export default function FilterSortBy({ sortBy, setSortBy }) {
  const sortList = ["best rating", "latest", "lowest price", "highest price"]; //best rating, latest, lowest price, highest price

  return (
    <View style={styles.filterSortBy}>
      {sortList.map((item, index) => (
        <SortTab
          key={index}
          data={item}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      ))}
    </View>
  );
}

const SortTab = ({ data, sortBy, setSortBy }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setSortBy(data);
      }}
      style={styles.sortByTab}
    >
      <View
        style={[
          styles.sortByRadio,
          sortBy === data ? styles.sbrClicked : styles.sbrDefault,
        ]}
      >
        {sortBy === data && <View style={styles.sbrInner}></View>}
      </View>
      <Text style={styles.sortByText}>{data}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterSortBy: {
    width: "100%",
    padding: 16,
    gap: 16,
  },
  sortByTab: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sortByText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black400,
    textTransform: "capitalize",
  },
  sortByRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sbrDefault: {
    borderColor: COLORS.black50,
  },
  sbrClicked: {
    borderColor: COLORS.black600,
  },
  sbrInner: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: COLORS.black600,
  },
});
