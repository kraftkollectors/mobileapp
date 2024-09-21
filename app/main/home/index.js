import { Dimensions, Platform, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import WelcomeBoardComp from "../../../components/main/homePage/welcomeBoardComp";
import HireCategoryComp from "../../../components/main/homePage/hireCategoryComp";
import { COLORS } from "../../../constants/themes/colors";
import AdScreenComp from "../../../components/main/homePage/adScreenComp";
import HorizontalServicesComp from "../../../components/main/homePage/horizontalServicesComp";
import { FETCH_SAVED_SEARCH, FETCH_SERVICES } from "../../../hooks/requests";
import AlertBox from "../../../components/general/alertBox";
import { useRouter } from "expo-router";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";
import VerticalServicesComp from "../../../components/main/homePage/verticalServicesComp";
import BecomeArtisanAdBoardComp from "../../../components/main/homePage/becomeArtisanAdBoardComp";
import { AppStyle } from "../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function Home() {
  const [socketConn, setSocketConn] = useState(false);
  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState("");
  const [savedServices, setSavedServices] = useState();

  //ALERTS
  const [isAlert, showAlert] = useState(false);
  const [alertStat, setAlertStat] = useState("success");
  const [alertHeading, setAlertHead] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  function popAlert(status, heading, msg) {
    setAlertStat(status);
    setAlertHead(heading);
    setAlertMsg(msg);
    showAlert(true);
  }
  ///////////////////////////////////////////////

  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (refreshing) {
      router.replace("/main/home");
    }
  }, [refreshing]);

  //LIST OF NECESSARY SERVICES
  const [fsIsLoading, setFsIsLoading] = useState(false);
  const [featuredServices, setFeaturedServices] = useState([]);

  //FETCH FEATURED SERVICES
  useEffect(() => {
    FETCH_SERVICES(setFsIsLoading, setFeaturedServices, popAlert);
  }, []);

  //LIST OF SAVED SEARCHES
  const [searchedServices, setSearchedServices] = useState();
  const [searchServicesLoading, setSearchedServicesLoading] = useState(false);

  useEffect(() => {
    if (savedServices && userData) {
      FETCH_SAVED_SEARCH(
        savedServices,
        setSearchedServicesLoading,
        setSearchedServices
      );
    }
  }, [savedServices, userData]);

  return (
    <SafeAreaView
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
        GetDataFromMemory(
          LOCAL_STORAGE_PATH.searchedServices,
          setSavedServices
        );
      }}
      style={[
        AppStyle.safeArea,
        {
          backgroundColor: COLORS.whiteBG,
        },
      ]}
    >
      <DefaultStatusBar
        theme={"light"}
        setSocket={setSocketConn}
        socketConnect={socketConn}
        userId={userData && userData?._id}
        accessToken={accessToken}
      />
      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - 80,
          backgroundColor: COLORS.gray100,
          paddingBottom: 30,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/**WELCOME FRAME */}
        <WelcomeBoardComp data={userData} />

        {/**HIRE CATEGORY */}
        <HireCategoryComp />

        {/**FEATURED SERVICES */}
        <HorizontalServicesComp
          sectionTitle={"Featured services"}
          serviceData={featuredServices}
          isLoading={fsIsLoading}
        />

        {/**AD SCREEN */}
        <AdScreenComp />

        {/**FROM SEARCHES */}
        {savedServices && (
          <HorizontalServicesComp
            sectionTitle={"From your search"}
            serviceData={searchedServices}
            isLoading={searchServicesLoading}
          />
        )}

        {/**ARTISAN AD BOARD */}
        {userData && !userData.isArtisan && <BecomeArtisanAdBoardComp />}

        {/**RECOMMENDED SERVICES */}
        <VerticalServicesComp
          sectionTitle={"Recommended"}
          showAlert={popAlert}
        />
      </ScrollView>

      {/**ALERT BOX */}
      {isAlert && (
        <AlertBox
          status={alertStat}
          heading={alertHeading}
          message={alertMsg}
          showAlert={showAlert}
        />
      )}

      {/**NAVIGATION */}
      <BottomNavigationComp activePage={"home"} userData={userData} />
    </SafeAreaView>
  );
}
