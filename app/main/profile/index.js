import { Dimensions, Platform, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../constants/themes/colors";
import ProfileCardComp from "../../../components/main/profilePage/profileCardComp";
import PostListComp from "../../../components/main/profilePage/postListComp";
import ContactListComp from "../../../components/main/profilePage/contactListComp";
import UnavailableModal from "../../../components/main/profilePage/subComp/unavailableModal";
import AboutUserComp from "../../../components/main/profilePage/aboutUserComp";
import ReviewsComp from "../../../components/main/profilePage/reviewsComp";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FETCH_SERVICE_ARTISAN,
  FETCH_SERVICE_USER,
} from "../../../hooks/requests";
import AlertBox from "../../../components/general/alertBox";
import ProfileCardLoadingTemp from "../../../components/loadingTemplates/profilePage/profileCardLoadingTemp";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";
import { AppStyle } from "../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function Profile() {
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
  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState("");

  //FETCH USER DATA
  useEffect(() => {
    GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
    GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
  }, []);
  ///////////

  const local = useLocalSearchParams();
  const userId = local?._id;

  const [userProfileIsLoading, setUserProfileIsLoading] = useState(false);
  const [serviceUserProfile, setServiceUserProfile] = useState();
  const [serviceArtisanProfile, setServiceArtisanProfile] = useState();

  useEffect(() => {
    if (userId && !serviceUserProfile) {
      FETCH_SERVICE_USER(
        userId,
        setServiceUserProfile,
        setUserProfileIsLoading,
        popAlert
      );
    }

    if (userId && serviceUserProfile && serviceUserProfile.isArtisan) {
      FETCH_SERVICE_ARTISAN(userId, setServiceArtisanProfile);
    }
  }, [userId, serviceUserProfile]);

  //HANDLE PROFILE VISIBLE SECTION
  const [isVisible, setIsVisible] = useState("post"); //post, contact, about, review

  //SHOW/HIDE UNAVAILABLE MODAL
  const [unavailableModalIsVisible, setUnavailableModalIsVisible] =
    useState(false);
  function hideUnavailableModal() {
    setUnavailableModalIsVisible(false);
  }

  ///////
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (refreshing) {
      router.replace(`/main/profile?_id=${userId}`);
    }
  }, [refreshing]);
  ///////////////

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
      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - 80,
          backgroundColor: COLORS.gray100,
          paddingBottom: 30,
          gap: 16,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/**PROFILE CARD */}
        {(serviceUserProfile || userProfileIsLoading) && (
          <>
            {userProfileIsLoading ? (
              <ProfileCardLoadingTemp />
            ) : (
              <ProfileCardComp
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                setShowModal={setUnavailableModalIsVisible}
                profile={serviceUserProfile}
                artisan={serviceArtisanProfile}
                userData={userData}
              />
            )}
          </>
        )}

        {/**VIEW OPTIONS */}
        {serviceUserProfile && (
          <>
            {isVisible == "post" ? (
              <PostListComp profile={serviceUserProfile} showError={popAlert} />
            ) : isVisible == "contact" ? (
              <ContactListComp
                profile={serviceUserProfile}
                artisan={serviceArtisanProfile}
              />
            ) : isVisible == "about" ? (
              <AboutUserComp
                profile={serviceUserProfile}
                artisan={serviceArtisanProfile}
              />
            ) : isVisible == "review" ? (
              <ReviewsComp profile={serviceUserProfile} />
            ) : (
              <></>
            )}
          </>
        )}
      </ScrollView>

      {/**UNAVAILABLE MODAL */}
      {unavailableModalIsVisible ? (
        <UnavailableModal
          hideModal={() => {
            hideUnavailableModal();
          }}
          profile={serviceUserProfile}
          artisan={serviceArtisanProfile}
        />
      ) : (
        <></>
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
