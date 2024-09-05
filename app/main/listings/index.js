import { Dimensions, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../constants/themes/colors";
import StickyTopBar from "../../../components/main/listingsPage/stickyTopBar";
import UnverifiedServiceTab from "../../../components/main/listingsPage/unverifiedServiceTab";
import VerifiedServiceTab from "../../../components/main/listingsPage/verifiedServiceTab";
import ConfirmDeleteComp from "../../../components/general/confirmDeleteComp";
import SavedServicesTab from "../../../components/main/listingsPage/savedServicesTab";
import ReviewServicesTab from "../../../components/main/listingsPage/reviewServicesTab";
import BeginAccountVerifyTab from "../../../components/main/listingsPage/beginAccountVerifyTab";
import {
  CheckLoginStatus,
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";
import AlertBox from "../../../components/general/alertBox";
import styles from "./listings.style";

const screenHeight = Dimensions.get("screen").height;

export default function Listings() {
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
  const [isLogged, setIsLogged] = useState("");
  const [noSavedMsg, setNoSavedMsg] = useState("");

  useEffect(() => {
    if (isLogged === "logged" || (isLogged === "not-verified" && userData)) {
      setNoSavedMsg("");
    } else if (isLogged === "not-logged") {
      setNoSavedMsg("Please log in to see your services");
    } else {
      //SAVE CURRENT PATH
      StoreDataToMemory(LOCAL_STORAGE_PATH.redirectPath, `/main/listings`);

      //CHECK LOGIN STATUS
      CheckLoginStatus(setIsLogged);
    }
  }, [isLogged]);

  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState("");

  //CHECK IF USER VERIFIED OR NOT
  const [userVerified, setUserVerified] = useState(false);
  useEffect(() => {
    if (userData && userData?.isArtisan) {
      setUserVerified(true);
    }
  }, [userData]);
  const [beginVerifyAccount, setBeginVerifyAccount] = useState(false);

  //HANDLE TAB SWITCHES
  const [currentTab, setCurrentTab] = useState("services"); //services, reviews, saved

  return (
    <SafeAreaView
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
      }}
      style={{
        height: Platform.OS === "ios" ? screenHeight + 32 : screenHeight,
        backgroundColor: COLORS.blueNormal,
      }}
    >
      <DefaultStatusBar
        theme={"blue"}
        setSocket={setSocketConn}
        socketConnect={socketConn}
        userId={userData && userData?._id}
        accessToken={accessToken}
      />
      {/**STICKY TOP BAR */}
      <StickyTopBar
        isVerified={userVerified}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
      />

      {/**PAGE DISPLAY */}
      <View
        style={{
          height:
            Platform.OS === "ios"
              ? screenHeight - (80 + 32 + 124)
              : screenHeight - (80 + 48 + 124),
          width: "100%",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            minHeight: screenHeight - 94,
            backgroundColor: COLORS.gray100,
            paddingBottom: 30,
            paddingTop: 16,
          }}
        >
          {currentTab === "reviews" ? (
            <ReviewServicesTab userData={userData} />
          ) : currentTab === "saved" ? (
            <SavedServicesTab
              userData={userData}
              accessToken={accessToken}
              showAlert={popAlert}
            />
          ) : (
            <>
              {userData ? (
                <>
                  {userVerified ? (
                    <VerifiedServiceTab
                      userData={userData}
                      accessToken={accessToken}
                      showAlert={popAlert}
                    />
                  ) : (
                    <UnverifiedServiceTab
                      beginVerification={() => {
                        setBeginVerifyAccount(true);
                      }}
                    />
                  )}
                </>
              ) : (
                <View style={styles.notFoundTab}>
                  <Text style={styles.notFoundText}>{noSavedMsg}</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>

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
      <BottomNavigationComp activePage={"listings"} userData={userData} />

      {/**VERIFY ACCOUNT POPUP MODAL */}
      {!userVerified && beginVerifyAccount ? (
        <BeginAccountVerifyTab
          verifySuccess={() => {
            setUserVerified(true);
          }}
          endVerification={() => {
            setBeginVerifyAccount(false);
          }}
          userData={userData}
          accessToken={accessToken}
          setUserData={setUserData}
        />
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
}
