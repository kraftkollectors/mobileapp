import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../constants/themes/colors";
import AccountHeaderComp from "../../../components/main/accountPage/accountHeaderComp";
import AccountLinkTabComp from "../../../components/main/accountPage/accountLinkTabComp";
import { useRouter } from "expo-router";
import {
  CheckLoginStatus,
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";
import {
  FETCH_SERVICE_ARTISAN,
  FETCH_SERVICE_USER,
} from "../../../hooks/requests";
import AlertBox from "../../../components/general/alertBox";
import { AppStyle } from "../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function Account() {
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
  const [isLogged, setIsLogged] = useState("");
  const [userData, setUserData] = useState();
  const [artisanData, setArtisanData] = useState();
  const [accessToken, setAccessToken] = useState("");

  //CHECK IF ARTISAN AND RETURN ARTISAN DATA
  useEffect(() => {
    if (userData && userData.isArtisan) {
      FETCH_SERVICE_ARTISAN(userData?._id, setArtisanData);
    }
  }, [userData]);

  //ATTEMPT EMAIL VERIFY
  const [attemptEmailVerify, setEV] = useState(false);
  useEffect(() => {
    if (attemptEmailVerify && userData) {
      const formData = {
        email: `${email.toLowerCase()}`,
      };

      axios
        .post(END_POINT.resendVerificationCode, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setBtnIsLoading(false);
          //NAVIGATE TO SIGNUP VERIFY PAGE
          router.replace(
            `/auth/signup/verify/?otp=${res.data.data?.num}&token=0&email=${userData?.email}`
          );
        })
        .catch((err) => {
          console.log("Error: ", err.response.data);
          setBtnIsLoading(false);
        });
    }
  }, [attemptEmailVerify]);

  useEffect(() => {
    if (isLogged != "") {
      if (isLogged === "not-verified") {
        setEV(true);
      } else if (isLogged === "not-logged") {
        router.replace("/auth/signin/");
      } else {
        //user LOGGED IN
      }
    }
  }, [isLogged]);

  useEffect(() => {
    //SAVE CURRENT PATH
    StoreDataToMemory(LOCAL_STORAGE_PATH.redirectPath, "/main/account/");

    //CHECK LOGIN STATUS
    CheckLoginStatus(setIsLogged);
  }, []);

  //HANDLE PAGE REFRESH
  const [refreshing, setRefreshing] = useState(false);
  const [newUser, setNewUser] = useState();
  const [newUserIsLoading, setNewUserIsLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (refreshing && userData) {
      FETCH_SERVICE_USER(userData?._id, setNewUser, setRefreshing, popAlert);
    } else {
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    if (newUser) {
      StoreDataToMemory(LOCAL_STORAGE_PATH.userData, newUser);

      setTimeout(() => {
        //UPDATE USERDATA
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);

        setRefreshing(false);
      }, 3000);
    }
  }, [newUser]);

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

      {/**ACCOUNT HEADER */}
      <AccountHeaderComp
        data={userData}
        accessToken={accessToken}
        popAlert={popAlert}
        refreshPage={onRefresh}
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
        {/**LINKS */}
        <View style={{ gap: 16, paddingVertical: 24, paddingHorizontal: 16 }}>
          {/**USER INFORMATION */}
          <View>
            <AccountLinkTabComp label={"General Info"} pathUrl={""} />

            {userData?.isArtisan && (
              <>
                <AccountLinkTabComp
                  label={"Change Phone Number"}
                  pathUrl={"phone"}
                  isPhone={true}
                  phoneNumber={artisanData?.phoneNumber}
                />
                <AccountLinkTabComp
                  label={"Description"}
                  pathUrl={"description"}
                />
                <AccountLinkTabComp label={"Social Links"} pathUrl={"social"} />
              </>
            )}
          </View>

          {/**MORE DETAILs */}
          <>
            {userData?.isArtisan && (
              <View>
                <AccountLinkTabComp
                  label={"Occupation"}
                  pathUrl={"occupation"}
                />
                <AccountLinkTabComp label={"Education"} pathUrl={"education"} />
                <AccountLinkTabComp
                  label={"Certification"}
                  pathUrl={"certification"}
                />
                <AccountLinkTabComp
                  label={"Away Message"}
                  pathUrl={"message"}
                />
                <AccountLinkTabComp label={"Work Hour"} pathUrl={"work"} />
              </View>
            )}
          </>

          {/**OTHER SETTINGs */}
          <View>
            <AccountLinkTabComp
              label={"Change Password"}
              pathUrl={"password"}
            />
            <AccountLinkTabComp
              label={"Manage Notification"}
              pathUrl={"notification"}
            />
            <AccountLinkTabComp label={"Support"} pathUrl={"support"} />
          </View>

          {/**LOGOUT USER */}
          <View>
            <AccountLinkTabComp
              label={"Log Out"}
              pathUrl={"logout"}
              isLogout={true}
            />
          </View>
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
      <BottomNavigationComp activePage={"account"} userData={userData} />
    </SafeAreaView>
  );
}
