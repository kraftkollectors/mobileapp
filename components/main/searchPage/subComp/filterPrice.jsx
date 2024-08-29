import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { COLORS } from "../../../../constants/themes/colors";

export default function FilterPrice({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}) {
  return (
    <View style={styles.filterPrice}>
      <View style={styles.filterPriceInputTab}>
        <TextInput
          placeholder="-min-"
          placeholderTextColor={COLORS.black300}
          style={styles.filterPriceInp}
          inputMode="numeric"
          value={minPrice}
          onChangeText={(text) => setMinPrice(text)}
        />
      </View>

      <Text style={styles.filterPriceLine}>-</Text>

      <View style={styles.filterPriceInputTab}>
        <TextInput
          placeholder="-max-"
          placeholderTextColor={COLORS.black300}
          style={styles.filterPriceInp}
          inputMode="numeric"
          value={maxPrice}
          onChangeText={(text) => setMaxPrice(text)}
        />
      </View>
    </View>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  filterPrice: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: 16,
  },
  filterPriceInputTab: {
    width: (screenWidth - (40 + 32)) / 2,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black100,
  },
  filterPriceInp: {
    width: "100%",
    height: "100%",
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black500,
  },
  filterPriceLine: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
});
