import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Octicons } from "@expo/vector-icons";
import ProfileCard from "./subComp/profileCard";
import ContactCard from "./subComp/contactCard";
import { COLORS } from "../../../constants/themes/colors";
import { useRouter } from "expo-router";
import {
  CheckLoginStatus,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";
import ProfileCardLoadingTemp from "../../loadingTemplates/servicePage/profileCardLoadingTemp";

export default function UserDetailComp({
  isLoading,
  userData,
  serviceData,
  userProfile,
  artisanProfile,
  showUnavailableModal,
  showReportModal,
  socketConnected,
}) {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState("");
  const [makeReport, setMakeReport] = useState(false);

  useEffect(() => {
    if (isLogged === "logged" || isLogged === "not-verified") {
      if (makeReport) {
        showReportModal(true);
        setMakeReport(false);
      }
    } else if (isLogged === "not-logged" && makeReport) {
      setMakeReport(false);
      router.push("/auth/signin/");
    } else {
      //SAVE CURRENT PATH
      StoreDataToMemory(
        LOCAL_STORAGE_PATH.redirectPath,
        `/main/service/?_id=${serviceData?._id}`
      );

      //CHECK LOGIN STATUS
      CheckLoginStatus(setIsLogged);
    }
  }, [isLogged, makeReport, userData, serviceData]);

  return (
    <View style={styles.userDetailsComp}>
      {/**PROFILE CARD */}
      {isLoading ? (
        <ProfileCardLoadingTemp />
      ) : (
        <ProfileCard
          showUnavailableModal={showUnavailableModal}
          profile={userProfile}
          artisan={artisanProfile}
          userData={userData}
          socketConnected={socketConnected}
          serviceData={serviceData}
        />
      )}

      {/**CONTACT CARD */}
      {artisanProfile && (
        <ContactCard profile={userProfile} artisan={artisanProfile} />
      )}

      {/**REPORT BTN */}
      {userProfile && (
        <View style={styles.reportTab}>
          <TouchableOpacity
            onPress={() => {
              setMakeReport(true);
            }}
            style={styles.reportBtn}
          >
            {makeReport ? (
              <ActivityIndicator size={16} color={COLORS.black400} />
            ) : (
              <Octicons name="report" size={16} color={COLORS.black400} />
            )}
            <Text style={styles.reportBtnText}>Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  userDetailsComp: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    marginVertical: 20,
    paddingVertical: 20,
  },
  reportTab: {
    width: "100%",
    paddingVertical: 20,
    paddingRight: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  reportBtn: {
    width: "auto",
    height: 28,
    borderRadius: 4,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.black50,
  },
  reportBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black400,
  },
});
