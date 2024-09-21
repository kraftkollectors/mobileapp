import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import ServiceCard from "./subComp/serviceCard";
import { FETCH_USER_FAVOURITES } from "../../../hooks/requests";
import styles from "../../../app/main/listings/listings.style";
import { useRouter } from "expo-router";
import {
  CheckLoginStatus,
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../constants/utilities/localStorage";
import ServiceCardLoadingTemp from "../../loadingTemplates/listingsPage/serviceCardLoadingTemp";

export default function SavedServicesTab({ userData, accessToken, showAlert }) {
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  //DUMMY DATA
  const [savedServices, setSavedServices] = useState();
  const [noSavedMsg, setNoSavedMsg] = useState("You have saved no services"); //DEFAULT: You have saved no services

  //CHECK IF LOGGED IN OR NOT
  const router = useRouter();
  const [isLogged, setIsLogged] = useState("");
  const [refreshServiceList, setRSL] = useState(false);

  useEffect(() => {
    if (isLogged === "logged" || (isLogged === "not-verified" && userData)) {
      setNoSavedMsg("You have saved no services");

      FETCH_USER_FAVOURITES(
        userData?._id,
        setSavedServices,
        "load",
        setPageIsLoading,
        showAlert
      );

      setRSL(false);
    } else if (isLogged === "not-logged") {
      setNoSavedMsg("Please log in to see your favourite services");
    } else {
      //SAVE CURRENT PATH
      StoreDataToMemory(LOCAL_STORAGE_PATH.redirectPath, `/main/listings`);

      //CHECK LOGIN STATUS
      CheckLoginStatus(setIsLogged);
    }
  }, [isLogged, userData, refreshServiceList]);

  //TAB OPTION
  const [showTabOptions, setShowTabOptions] = useState(false);
  const [visibleIndex, setVisibleIndex] = useState(0);

  function showHideOption(tabIndex) {
    if (visibleIndex == tabIndex) {
      setShowTabOptions((prev) => !prev);
    } else {
      setVisibleIndex(tabIndex);
      setShowTabOptions(true);
    }
  }

  return (
    <View>
      {pageIsLoading ? (
        <>
          <ServiceCardLoadingTemp />
          <ServiceCardLoadingTemp />
        </>
      ) : (
        <>
          {savedServices && savedServices.length > 0 ? (
            savedServices.map((item, index) => (
              <ServiceCard
                key={index}
                tab={index}
                data={item}
                userData={userData}
                accessToken={accessToken}
                typeName={"saved"}
                showOptions={showTabOptions}
                handleOptionVisibility={() => {
                  showHideOption(index);
                }}
                visibleIndex={visibleIndex}
                confirmDelete={() => {
                  setConfirmDelete(true);
                }}
                refreshList={() => {
                  setRSL(true);
                }}
              />
            ))
          ) : (
            <View style={styles.notFoundTab}>
              <Text style={styles.notFoundText}>{noSavedMsg}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}
