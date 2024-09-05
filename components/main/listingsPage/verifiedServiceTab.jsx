import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import ServiceCard from "./subComp/serviceCard";
import { FETCH_ARTISAN_SERVICES } from "../../../hooks/requests";
import ServiceCardLoadingTemp from "../../loadingTemplates/listingsPage/serviceCardLoadingTemp";
import { useRouter } from "expo-router";
import ListingConfirmDeleteComp from "./subComp/confirmDeleteComp";
import axios from "axios";
import { END_POINT } from "../../../hooks/endpoints";

const NoPost = () => {
  const router = useRouter();

  function goToCreate() {
    router.navigate("/main/listings/create/");
  }

  return (
    <View style={emptyStyles.serviceTab}>
      <View style={emptyStyles.innerBox}>
        <Text style={emptyStyles.question}>Post a new service</Text>

        <TouchableOpacity
          onPress={() => {
            goToCreate();
          }}
          style={emptyStyles.tabBtn}
        >
          <Text style={emptyStyles.btnText}>Post service</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function VerifiedServiceTab({
  userData,
  accessToken,
  showAlert,
}) {
  const router = useRouter();

  function goToCreate() {
    router.navigate("/main/listings/create/");
  }
  //DEMO SERVICES
  const [serviceList, setServiceList] = useState();
  const [serviceIsLoading, setServiceIsLoading] = useState(false);
  useEffect(() => {
    FETCH_ARTISAN_SERVICES(
      userData?._id,
      setServiceIsLoading,
      setServiceList,
      showAlert
    );
  }, []);

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

  //CONFIRM DELETE
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [startDelete, setStartDelete] = useState(false);

  useEffect(() => {
    if (startDelete && idToDelete) {
      axios
        .delete(END_POINT.getSingleArtisanService(idToDelete), {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${accessToken}`,
          },
        })
        .then((res) => {
          if (res.data.statusCode === 201) {
            FETCH_ARTISAN_SERVICES(
              userData?._id,
              setServiceIsLoading,
              setServiceList,
              showAlert
            );
          }

          //show alert
          showAlert(
            "success",
            "Service Deleted Successfully",
            "You have deleted chosen service from your listings"
          );

          setConfirmDelete(false);
          setStartDelete(false);
        })
        .catch((err) => {
          console.log("delete err: ", err.response.data);
          setStartDelete(false);
        });
    }
  }, [startDelete]);

  return (
    <>
      {serviceIsLoading ? (
        <View>
          <ServiceCardLoadingTemp />
          <ServiceCardLoadingTemp />
        </View>
      ) : (
        <>
          {serviceList && serviceList.length > 0 ? (
            <>
              <View style={styles.addBtnTab}>
                <TouchableOpacity
                  onPress={() => {
                    goToCreate();
                  }}
                  style={styles.addBtn}
                >
                  <Text style={styles.addBtnText}>Post service</Text>
                  <MaterialCommunityIcons
                    name="plus"
                    size={16}
                    color={COLORS.whiteBG}
                  />
                </TouchableOpacity>
              </View>

              <View>
                {serviceList && serviceList.length > 0 ? (
                  serviceList.map((item, index) => (
                    <ServiceCard
                      key={index}
                      data={item}
                      tab={index}
                      showOptions={showTabOptions}
                      handleOptionVisibility={() => {
                        showHideOption(index);
                      }}
                      visibleIndex={visibleIndex}
                      confirmDelete={() => {
                        setConfirmDelete(true);
                      }}
                      toDelete={setIdToDelete}
                    />
                  ))
                ) : (
                  <></>
                )}
              </View>
            </>
          ) : (
            <NoPost />
          )}
        </>
      )}

      {/**POPUP TO CONFIRM DELETE */}
      {confirmDelete && (
        <ListingConfirmDeleteComp
          cancel={() => {
            setConfirmDelete(false);
          }}
          confirm={() => {
            setStartDelete(true);
          }}
          deleting={startDelete}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  addBtnTab: {
    padding: 16,
  },
  addBtn: {
    width: 113,
    height: 36,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: COLORS.blueNormal,
    borderRadius: 4,
    marginLeft: "auto",
  },
  addBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.whiteBG,
  },
});

const emptyStyles = StyleSheet.create({
  serviceTab: {
    width: "100%",
    height: 164,
    backgroundColor: COLORS.whiteBG,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.gray200,
  },
  innerBox: {
    width: 260,
    gap: 20,
    alignItems: "center",
  },
  question: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black300,
    textAlign: "center",
  },
  tabBtn: {
    width: 165,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.blueNormal,
    borderRadius: 4,
  },
  btnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.whiteBG,
  },
});
