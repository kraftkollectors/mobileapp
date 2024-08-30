import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import { useRouter } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  GENERATE_RANDOM_NUMBER,
  LOAD_PROFILE_THUMBNAIL,
} from "../../../constants/utilities";
import axios from "axios";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";

const screenWidth = Dimensions.get("screen").width;
export default function WelcomeBoardComp({ data }) {
  const router = useRouter();
  const [deviceLatLng, setDeviceLatLng] = useState("");
  const [defaultLocation, setDefaultLocation] = useState("");

  useEffect(() => {
    if (deviceLatLng) {
      let queryFields = "formatted_address,geometry,name";

      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${deviceLatLng}&key=${LOCAL_STORAGE_PATH.API.glp}&fields=${queryFields}&language=en-US&sensor=true`
        )
        .then((res) => {
          if (res.data?.status.toLowerCase() === "ok") {
            let mainData = res.data?.results[0];

            setDefaultLocation(mainData?.formatted_address);
          } else {
          }
        })
        .catch((err) => {});
    }
  }, [deviceLatLng]);

  function goToSearch() {
    router.navigate("/main/search/");
  }

  function goToProfile() {
    router.navigate("/main/account/");
  }

  return (
    <View
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.deviceLatLng, setDeviceLatLng);
      }}
      style={styles.welcomeFrame}
    >
      <View style={styles.wfTopLayer}>
        {/**USER DETAILS CONTAINER */}
        <View style={styles.wftUserCont}>
          <View style={styles.wftUserGreetingTab}>
            <View>
              <Text style={styles.wftGreeting}>Good morning</Text>
              {data ? (
                <Text style={styles.wftGreetingTag} numberOfLines={1}>
                  {data?.firstName} {data?.lastName}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    goToProfile();
                  }}
                >
                  <Text style={styles.wftGreetingBtn}>Log in to continue</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              goToProfile();
            }}
            style={styles.wftUserImg}
          >
            <Image
              source={LOAD_PROFILE_THUMBNAIL(data?.image)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/**SEARCH TAB */}
      <View style={styles.wftSearchBlock}>
        <View style={styles.wftSearchBox}>
          {/**JUST FOR DESIGN */}
          <View style={[styles.wftSearchBoxDesign, styles.design1]}></View>
          <View style={[styles.wftSearchBoxDesign, styles.design2]}></View>
          {/**JUST FOR DESIGN */}

          <View style={styles.wftSearchBoxTitleBar}>
            <Text style={styles.wftSearchBoxTitle}>Hire Experts Nearby</Text>

            {deviceLatLng && defaultLocation && (
              <View style={styles.wftSearchBoxLocationBar}>
                <FontAwesome5
                  name="map-marker-alt"
                  size={12}
                  color={COLORS.gray300}
                />
                <Text style={styles.wftSearchBoxLocation} numberOfLines={1}>
                  {defaultLocation}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.wftSearchTabOuter}>
            <TouchableOpacity
              onPress={() => {
                goToSearch();
              }}
              style={styles.wftSearchTab}
            >
              <Octicons name="search" size={16} color={COLORS.black300} />

              <Text style={styles.wftSearchInput}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeFrame: {
    width: "100%",
  },
  wfTopLayer: {
    width: "100%",
    height: 84,
    backgroundColor: COLORS.whiteBG,
    padding: 16,
    gap: 36,
  },
  wftUserCont: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wftUserGreetingTab: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  wftGreeting: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black400,
  },
  wftGreetingTag: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
    textTransform: "capitalize",
  },
  wftGreetingBtn: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.blueNormal,
  },
  wftUserImg: {
    width: 44,
    height: 44,
    overflow: "hidden",
    backgroundColor: COLORS.gray50,
    borderRadius: 40,
  },
  wftSearchBlock: {
    width: "100%",
    padding: 16,
  },
  wftSearchBox: {
    width: "100%",
    height: 156,
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.blueNormal,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 16,
    justifyContent: "center",
  },
  wftSearchBoxDesign: {
    borderRadius: 200,
    backgroundColor: "rgba(57, 135, 191, 0.86)",
    position: "absolute",
  },
  design1: {
    width: 120,
    height: 120,
    top: -50,
    right: -50,
  },
  design2: {
    width: 60,
    height: 60,
    top: 50,
    left: -25,
  },
  wftSearchBoxTitleBar: {
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  wftSearchBoxTitle: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.whiteBG,
  },
  wftSearchBoxLocationBar: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  wftSearchBoxLocation: {
    fontFamily: "EinaBold",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.gray300,
  },
  wftSearchTabOuter: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.whiteBG,
  },
  wftSearchTab: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black50,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: COLORS.whiteBG,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOpacity: 0.2,
    shadowRadius: 0.1,
    shadowOffset: [0, 0],
    elevation: 2,
  },
  wftSearchIcon: {
    width: 16,
    height: 16,
  },
  wftSearchInput: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black300,
  },
});
