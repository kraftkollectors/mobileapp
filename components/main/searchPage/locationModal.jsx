import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import { LOCAL_STORAGE_PATH } from "../../../constants/utilities/localStorage";
import { FETCH_PLACES_LIST } from "../../../hooks/requests";
import axios from "axios";
import { GENERATE_RANDOM_NUMBER } from "../../../constants/utilities";

export default function LocationModal({
  showLocation,
  setLongitude,
  setLatitude,
  radius,
  setRadius,
  showResult,
  clearLocation,
  location,
  setLocation,
  showAlert,
}) {
  const rangeList = ["2", "10", "15", "20", "30"];

  const [findPlace, setFindPlace] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [placeList, setPlaceList] = useState();
  const [placeLoading, setPlaceLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (location && location != "") {
      setSearchQuery(`${location}`);
    }
  }, []);

  useEffect(() => {
    if (findPlace && searchQuery && searchQuery.length > 3) {
      FETCH_PLACES_LIST(
        searchQuery,
        LOCAL_STORAGE_PATH.API.glp,
        setPlaceList,
        setPlaceLoading,
        showAlert
      );
      setFindPlace(false);
    }
  }, [findPlace, searchQuery]);

  function selectPlace(id, place) {
    let queryFields = "formatted_address,geometry,name";

    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${LOCAL_STORAGE_PATH.API.glp}&fields=${queryFields}&language=en-US`
      )
      .then((res) => {
        setLocation(res.data?.result?.formatted_address);
        setSearchQuery(res.data?.result?.formatted_address);
        setLongitude(res.data?.result?.geometry?.location?.lng);
        setLatitude(res.data?.result?.geometry?.location?.lat);
        setRadius(rangeList[0]);
        setPlaceList();
      })
      .catch((err) => {
        showAlert(
          "error",
          "Location Error",
          "Something went wrong while trying to select your location. Please try again"
        );
        setSearchQuery(place);
      });
  }

  async function useCurrentLocation() {
    setLocationLoading(true);
    //CHECK FOR PERMISSION TO USE LOCATION
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showAlert(
          "error",
          "Permission Not Granted",
          "Permission to access location was denied"
        );
        setLocationLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});

      var lat = currentLocation?.coords?.latitude;
      var lng = currentLocation?.coords?.longitude;

      let queryFields = "formatted_address,geometry,name";

      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${LOCAL_STORAGE_PATH.API.glp}&fields=${queryFields}&language=en-US&sensor=true`
        )
        .then((res) => {
          if (res.data?.status.toLowerCase() === "ok") {
            var target = GENERATE_RANDOM_NUMBER(
              0,
              res.data?.results.length - 1
            );
            let mainData = res.data?.results[target];

            setLocation(mainData?.formatted_address);
            setSearchQuery(mainData?.formatted_address);
            setLongitude(mainData?.geometry?.location?.lng);
            setLatitude(mainData?.geometry?.location?.lat);
            setRadius(rangeList[0]);
            setPlaceList();
          } else {
            showAlert(
              "error",
              "Error Getting Location",
              "Sorry, your device location could not be found"
            );
          }
          setLocationLoading(false);
        })
        .catch((err) => {
          showAlert(
            "error",
            "Error Getting Location",
            "Sorry, your device location could not be found"
          );
          setLocationLoading(false);
        });

      return;
    } catch (error) {
      setLocationLoading(false);
      showAlert(
        "error",
        "Permission Not Granted",
        "Permission to access location was denied"
      );
      return;
    }
  }

  return (
    <View style={styles.popupBlock}>
      <TouchableOpacity
        onPress={() => {
          showLocation(false);
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
            <Text style={styles.modalTitle}>Choose Location</Text>
          </View>

          <View style={{ width: "100%", padding: 16, gap: 16 }}>
            {/**RANGE BLOCK */}
            {RangeBlock(rangeList, setRadius, radius)}

            {/**SEARCH BLOCK */}
            <View style={styles.searchTab}>
              <AntDesign name="search1" size={24} color={COLORS.black400} />
              <TextInput
                placeholder="Search for address, city, town or village"
                placeholderTextColor={COLORS.black200}
                style={styles.searchInp}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onEndEditing={() => {
                  setFindPlace(true);
                }}
                onSubmitEditing={() => {
                  setFindPlace(true);
                }}
              />
            </View>

            {/**CHOOSE LOCATION */}
            {UseLocation(useCurrentLocation, locationLoading)}

            {/**PLACE LIST */}

            {placeLoading && (
              <View style={styles.placeLoadingView}>
                <ActivityIndicator size={"large"} color={COLORS.blueNormal} />
              </View>
            )}

            {placeList && placeList.length > 0 && (
              <View style={{ width: "100%", maxHeight: 320 }}>
                <ScrollView
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  contentContainerStyle={styles.placeListScroll}
                >
                  {placeList.map((item, index) =>
                    PlaceListTab(index, item, selectPlace)
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.modalButtonTab}>
            {ClearAllBtn(clearLocation, showResult, showLocation)}

            {ShowResultBtn(showResult, showLocation)}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function PlaceListTab(index, data, selectPlace) {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        selectPlace(data?.place_id, data?.description);
      }}
      style={styles.placeTab}
    >
      <Text style={styles.placeTextMain}>
        {data?.structured_formatting?.main_text}
      </Text>
      <Text style={styles.placeTextSub}>
        {data?.structured_formatting?.secondary_text}
      </Text>
    </TouchableOpacity>
  );
}

function ShowResultBtn(showResult, showLocation) {
  return (
    <TouchableOpacity
      onPress={() => {
        showResult(true);
        showLocation(false);
      }}
      style={[styles.modalBtn, styles.modalBtnPri]}
    >
      <Text style={[styles.modalBtnText, { color: COLORS.whiteBG }]}>
        Show results
      </Text>
    </TouchableOpacity>
  );
}

function ClearAllBtn(clearLocation, showResult, showLocation) {
  return (
    <TouchableOpacity
      onPress={() => {
        clearLocation();
        showResult(true);
        showLocation(false);
      }}
      style={[styles.modalBtn, styles.modalBtnSec]}
    >
      <Text style={[styles.modalBtnText, { color: COLORS.black500 }]}>
        Clear all
      </Text>
    </TouchableOpacity>
  );
}

function RangeBlock(rangeList, chooseRadius, curRadius) {
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.rangeBlock}
      nestedScrollEnabled={true}
      showsHorizontalScrollIndicator={false}
    >
      {/**ACTIVE LOCATION */}
      {!curRadius && (
        <View style={[styles.rangeTab, styles.rangeTabView]}>
          <Text style={[styles.rangeText, { color: COLORS.blueNormal }]}>
            All Nigeria
          </Text>
        </View>
      )}
      {rangeList.map((item, index) =>
        RangeBtnTab(index, item, chooseRadius, curRadius)
      )}
    </ScrollView>
  );
}

function RangeBtnTab(index, item, chooseRadius, curRadius) {
  return (
    <TouchableOpacity
      onPress={() => {
        chooseRadius(item);
      }}
      style={[
        styles.rangeTab,
        styles.rangeTabBtn,
        curRadius === item && styles.rangeTabView,
      ]}
      key={index}
    >
      <Text
        style={[
          styles.rangeText,
          curRadius === item
            ? { color: COLORS.blueNormal }
            : { color: COLORS.black400 },
        ]}
      >
        {item}km
      </Text>
    </TouchableOpacity>
  );
}

function UseLocation(useCurLoc, isLoading) {
  return (
    <TouchableOpacity
      onPress={() => {
        useCurLoc();
      }}
      style={styles.useLocationTab}
    >
      {isLoading ? (
        <ActivityIndicator
          size={Platform.OS === "ios" ? "small" : 20}
          color={COLORS.blueNormal}
        />
      ) : (
        <MaterialIcons name="gps-fixed" size={20} color={COLORS.blueNormal} />
      )}
      <Text style={styles.useLocationText}>Use my current location</Text>
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
    minHeight: 320,
    maxHeight: screenHeight - 92,
    backgroundColor: COLORS.whiteBG,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 0,
    paddingBottom: 64,
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
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black500,
  },
  rangeBlock: {
    minWidth: "100%",
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rangeTab: {
    width: "auto",
    minWidth: (screenWidth - (32 + 24)) / 4,
    height: 40,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: 1,
  },
  rangeTabView: {
    borderColor: COLORS.blueNormal,
    backgroundColor: COLORS.blueLight,
  },
  rangeTabBtn: {
    borderColor: COLORS.black50,
  },
  rangeText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
  },
  searchTab: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.black100,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchInp: {
    width: screenWidth - (32 + 24 + 24 + 8),
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black400,
  },
  useLocationTab: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  useLocationText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.blueNormal,
  },
  placeLoadingView: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  placeListScroll: {
    width: "100%",
    minHeight: 240,
    paddingBottom: 30,
    gap: 4,
  },
  placeTab: {
    width: "100%",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    gap: 4,
  },
  placeTextMain: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black500,
    textTransform: "capitalize",
  },
  placeTextSub: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black200,
    textTransform: "capitalize",
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
});
