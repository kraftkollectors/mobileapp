import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import DefaultStatusBar from "../../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../../constants/themes/colors";
import SettingsHeaderComp from "../../../../components/main/accountPage/settingsHeaderComp";
import MiniBtn from "../../../../components/main/accountPage/subComps/miniBtn";
import EducertTabComp from "../../../../components/main/accountPage/educertTabComp";
import { styles } from "./settings.style";
import CertAddComp from "../../../../components/main/accountPage/certAddComp";
import ConfirmDeleteComp from "../../../../components/general/confirmDeleteComp";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../../constants/utilities/localStorage";
import { FETCH_USER_CERTIFICATES } from "../../../../hooks/requests";
import AlertBox from "../../../../components/general/alertBox";
import { AppStyle } from "../../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function Certification() {
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

  //USER DATA
  const [userData, setUserData] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [pageIsLoading, setPageIsLoading] = useState(false);

  //POPUP TO ADD NEW DATA
  const [showPopup, setShowPopup] = useState(false);

  //CERTIFICATE LIST
  const [certificationList, setCertificationList] = useState([]);
  useEffect(() => {
    if (userData && userData._id) {
      FETCH_USER_CERTIFICATES(
        userData?._id,
        setCertificationList,
        "load",
        setPageIsLoading
      );
    }
  }, [userData]);

  //HANDLE PAGE REFRESH
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (refreshing && userData) {
      FETCH_USER_CERTIFICATES(
        userData?._id,
        setCertificationList,
        "refresh",
        setPageIsLoading
      );
    }
  }, [refreshing]);

  //CERTIFICATE TAB OPTION
  const [showTabOptions, setShowTabOptions] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [activeData, setActiveData] = useState([]);

  function showHideOption(tabIndex, tabData) {
    if (visibleIndex == tabIndex) {
      setShowTabOptions((prev) => !prev);
    } else {
      setVisibleIndex(tabIndex);
      setShowTabOptions(true);
    }

    setActiveData(tabData);
  }

  //CONFIRM DELETE
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [commenceEdit, setCommenceEdit] = useState(false);
  useEffect(() => {
    if (commenceEdit) {
      setShowPopup(true);
      setShowTabOptions(false);
    } else {
      setShowPopup(false);
    }
  }, [commenceEdit]);

  return (
    <SafeAreaView
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
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

      {/**SETTINGS HEADER */}
      <SettingsHeaderComp pageTitle={"Certification"} />

      {/**PAGE DISPLAY */}
      <ScrollView
        contentContainerStyle={{
          minHeight: screenHeight - (80 + 48),
          backgroundColor: COLORS.gray100,
          paddingVertical: 24,
          gap: 24,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/**ADD BUTTON */}
        <View style={{ marginLeft: "auto", paddingRight: 16 }}>
          <MiniBtn
            handleClick={() => {
              setShowPopup(true);
            }}
          />
        </View>

        {/**CERTIFICATE LIST */}
        <View
          style={[
            styles.pageSection,
            { gap: 4, paddingRight: 0, paddingBottom: 0 },
          ]}
        >
          {certificationList && certificationList.length > 0 ? (
            certificationList.map((item, index) => (
              <EducertTabComp
                data={item}
                key={index}
                tab={index}
                typeName={"certification"}
                showOptions={showTabOptions}
                handleOptionVisibility={() => {
                  showHideOption(index, item);
                }}
                visibleIndex={visibleIndex}
                confirmDelete={() => {
                  setConfirmDelete(true);
                }}
                commenceEdit={() => setCommenceEdit(true)}
              />
            ))
          ) : (
            <View style={styles.noDataFoundTab}>
              <Text style={styles.noDataFoundText}>No Certificate Found</Text>
            </View>
          )}
        </View>
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
      <BottomNavigationComp activePage={"account"} />

      {/**POPUP MENU TO ADD */}
      <>
        {showPopup && (
          <CertAddComp
            handleClick={() => {
              setCommenceEdit(false);
              setShowPopup(false);
            }}
            userData={userData}
            accessToken={accessToken}
            update={onRefresh}
            isEdit={commenceEdit}
            editData={activeData}
            setAlert={popAlert}
          />
        )}

        {/**POPUP TO CONFIRM DELETE */}
        {confirmDelete && (
          <ConfirmDeleteComp
            cancel={() => {
              setConfirmDelete(false);
            }}
          />
        )}
      </>
    </SafeAreaView>
  );
}
