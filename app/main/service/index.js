import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Platform, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../constants/themes/colors";
import PageTopBarComp from "../../../components/main/servicePage/pageTopBarComp";
import PhotoSliderComp from "../../../components/main/servicePage/photoSliderComp";
import ServiceDetailsComp from "../../../components/main/servicePage/serviceDetailsComp";
import UserDetailComp from "../../../components/main/servicePage/userDetailComp";
import UnavailableModal from "../../../components/main/profilePage/subComp/unavailableModal";
import ReviewDetailComp from "../../../components/main/servicePage/reviewDetailComp";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FETCH_SERVICE_ARTISAN,
  FETCH_SERVICE_DATA,
  FETCH_SERVICE_USER,
} from "../../../hooks/requests";
import {
  AddToSearchedService,
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";
import ReportServiceModal from "../../../components/main/profilePage/subComp/reportServiceModal";
import RateServiceModal from "../../../components/main/profilePage/subComp/rateServiceModal";
import AlertBox from "../../../components/general/alertBox";
import { AppStyle } from "../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function Service() {
  const [socketConn, setSocketConn] = useState(false);
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
  const local = useLocalSearchParams();
  const [serviceId, setServiceId] = useState("");
  const [ref, setRef] = useState("");

  useEffect(() => {
    if (local) {
      if (local?._id) {
        setServiceId(local?._id);
      }

      if (local?.ref) {
        setRef(local?.ref);
      }
    }
  }, [local]);

  //SAVE SERVICE IF FROM SEARCH
  useEffect(() => {
    if (ref === "search") {
      AddToSearchedService(serviceId);
    }
  }, [ref]);

  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState("");

  //FETCH USER DATA
  useEffect(() => {
    GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
    GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
  }, []);
  ///////////

  const [serviceDataIsLoading, setServiceDataIsLoading] = useState(false);
  const [serviceData, setServiceData] = useState();
  useEffect(() => {
    if (serviceId)
      FETCH_SERVICE_DATA(
        serviceId,
        setServiceData,
        setServiceDataIsLoading,
        popAlert
      );
  }, [serviceId]);
  ///////////////////////////////////
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (refreshing) {
      if (serviceId) {
        setServiceData();
        FETCH_SERVICE_DATA(
          serviceId,
          setServiceData,
          setServiceDataIsLoading,
          popAlert
        );
      } else {
        router.replace(`/main/service/?_id=${serviceId}`);
      }
    }
  }, [refreshing]);

  ///////////////////////

  const [serviceUserIsLoading, setServiceUserIsLoading] = useState(false);
  const [serviceUser, setServiceUser] = useState();
  const [serviceArtisanProfile, setServiceArtisanProfile] = useState();
  useEffect(() => {
    if (serviceData) {
      FETCH_SERVICE_USER(
        serviceData?.userId,
        setServiceUser,
        setServiceUserIsLoading,
        popAlert
      );
      FETCH_SERVICE_ARTISAN(serviceData?.userId, setServiceArtisanProfile);
    }
  }, [serviceData]);

  //SHOW/HIDE UNAVAILABLE MODAL
  const [unavailableModalIsVisible, setUnavailableModalIsVisible] =
    useState(false);
  function hideUnavailableModal() {
    setUnavailableModalIsVisible(false);
  }

  //SHOW/HIDE REPORT SERVICE MODAL
  const [reportServiceModalIsVisible, setReportServiceModalIsVisible] =
    useState(false);
  function hideReportServiceModal() {
    setReportServiceModalIsVisible(false);
  }

  //SHOW/HIDE RATE SERVICE MODAL
  const [rateServiceModalIsVisible, setRateServiceModalIsVisible] =
    useState(false);
  function hideRateServiceModal() {
    setRateServiceModalIsVisible(false);
  }

  return (
    <SafeAreaView
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

      {/**TOP BAR */}
      <PageTopBarComp
        userData={userData}
        serviceData={serviceData}
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
        {/**PHOTO SLIDER */}
        <PhotoSliderComp data={serviceData} />

        {/**SERVICE DETAILS*/}
        {(serviceData || serviceDataIsLoading) && (
          <ServiceDetailsComp
            data={serviceData}
            isLoading={serviceDataIsLoading}
          />
        )}

        {/**USER DETAILS */}
        {(serviceUser || serviceUserIsLoading) && (
          <UserDetailComp
            isLoading={serviceUserIsLoading}
            showUnavailableModal={setUnavailableModalIsVisible}
            showReportModal={setReportServiceModalIsVisible}
            userData={userData}
            serviceData={serviceData}
            userProfile={serviceUser}
            artisanProfile={serviceArtisanProfile}
            socketConnected={socketConn}
          />
        )}

        {/**REVIEWS */}
        {serviceData && (
          <ReviewDetailComp
            serviceId={serviceData?._id}
            rateModal={rateServiceModalIsVisible}
            showRateModal={setRateServiceModalIsVisible}
            userData={userData}
            serviceData={serviceData}
            userProfile={serviceUser}
          />
        )}
      </ScrollView>

      {/**UNAVAILABLE MODAL */}
      {unavailableModalIsVisible && (
        <UnavailableModal
          hideModal={() => {
            hideUnavailableModal();
          }}
          profile={serviceUser}
          artisan={serviceArtisanProfile}
          serviceData={serviceData}
          userData={userData}
        />
      )}

      {/**REPORT SERVICE MODAL */}
      {reportServiceModalIsVisible && (
        <ReportServiceModal
          hideModal={() => {
            hideReportServiceModal();
          }}
          profile={serviceUser}
          userData={userData}
          accessToken={accessToken}
          serviceId={serviceData?._id}
        />
      )}

      {/**RATE SERVICE MODAL */}
      {rateServiceModalIsVisible && (
        <RateServiceModal
          hideModal={() => {
            hideRateServiceModal();
          }}
          profile={serviceUser}
          userData={userData}
          accessToken={accessToken}
          serviceId={serviceData?._id}
        />
      )}

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
