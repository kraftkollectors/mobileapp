import { Dimensions, Platform, ScrollView, View } from "react-native";
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
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";
import AlertBox from "../../../components/general/alertBox";

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

  //CONFIRM DELETE
  const [confirmDelete, setConfirmDelete] = useState(false);

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
              setConfirmDelete={setConfirmDelete}
              showAlert={popAlert}
            />
          ) : (
            <>
              {userData && (
                <>
                  {userVerified ? (
                    <VerifiedServiceTab
                      setConfirmDelete={setConfirmDelete}
                      userId={userData?._id}
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

      {/**POPUP TO CONFIRM DELETE */}
      {confirmDelete ? (
        <ConfirmDeleteComp
          cancel={() => {
            setConfirmDelete(false);
          }}
        />
      ) : (
        <></>
      )}

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
