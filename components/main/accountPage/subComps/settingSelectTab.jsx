import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../../constants/themes/colors";

const screenWidth = Dimensions.get("screen").width;

export default function SettingSelectTab({
  label,
  placeholder,
  selectedItem,
  setSelectedItem,
  selectList,
  hasError,
}) {
  const [showList, setShowList] = useState(false);

  function selectOption(item) {
    setSelectedItem(item);
    setShowList(false);
  }

  return (
    <>
      <View style={styles.selectBlock}>
        {label && <Text style={styles.selectLabel}>{label}</Text>}

        <TouchableOpacity
          onPress={() => {
            setShowList((prev) => !prev);
          }}
          style={styles.selectTab}
        >
          {!selectedItem ? (
            <Text style={[styles.selectText, { color: COLORS.black100 }]}>
              {placeholder}
            </Text>
          ) : (
            <Text style={styles.selectText}>{selectedItem}</Text>
          )}

          <View>
            <Octicons
              name={showList ? "chevron-up" : "chevron-down"}
              size={16}
              color={COLORS.black500}
            />
          </View>
        </TouchableOpacity>

        {hasError && <Text style={styles.inputError}>{hasError}</Text>}
      </View>

      {showList && (
        <View style={styles.selectOptionBlock}>
          <ScrollView nestedScrollEnabled={true}>
            {selectList && selectList.length > 0 ? (
              selectList.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    selectOption(item);
                  }}
                  key={index}
                  style={styles.selectOptionTab}
                >
                  <Text style={styles.selectOptionText}>{item}</Text>
                  {item === selectedItem ? (
                    <Octicons name="check" size={16} color={COLORS.black500} />
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.selectNoOptionText}>
                Unable to fetch list
              </Text>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
}

function SelectOptionTab(selectOption, item, selectedItem) {
  return (
    <TouchableOpacity
      onPress={() => {
        selectOption(item);
      }}
      style={styles.selectOptionTab}
    >
      <Text style={styles.selectOptionText}>{item}</Text>
      {item === selectedItem ? (
        <Octicons name="check" size={16} color={COLORS.black500} />
      ) : (
        <></>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  selectBlock: {
    width: "100%",
    gap: 8,
    paddingVertical: 8,
  },
  selectLabel: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black200,
  },
  inputError: {
    fontFamily: "EinaRegular",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.redWarning,
  },
  selectTab: {
    width: "100%",
    height: 44,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 12,
  },
  selectText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black500,
  },
  selectOptionBlock: {
    width: "100%",
    height: "auto",
    maxHeight: 250,
    backgroundColor: COLORS.whiteBG,
    borderWidth: 1,
    borderColor: COLORS.black100,
    marginBottom: 10,
  },
  selectOptionTab: {
    width: "100%",
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  selectOptionText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black500,
  },
  selectNoOptionText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black200,
    textAlign: "center",
    paddingVertical: 16,
    width: "100%",
  },
});
