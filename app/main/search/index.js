import { Dimensions, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import { COLORS } from "../../../constants/themes/colors";
import SearchBlockComp from "../../../components/main/searchPage/searchBlockComp";
import SearchResultComp from "../../../components/main/searchPage/searchResultComp";
import SearchDefaultComp from "../../../components/main/searchPage/searchDefaultComp";
import axios from "axios";
import { END_POINT } from "../../../hooks/endpoints";
import FilterModal from "../../../components/main/searchPage/filterModal";
import LocationModal from "../../../components/main/searchPage/locationModal";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";
import AlertBox from "../../../components/general/alertBox";
import { useLocalSearchParams } from "expo-router";
import { AppStyle } from "../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function SearchPage() {
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

  const [activeGroup, setActiveGroup] = useState("services"); //services, artisans
  const [catFromParams, setCFP] = useState("");

  //CHECK IF CATEGORY PARAMS SET
  let local = useLocalSearchParams();
  useEffect(() => {
    if (local?.category) {
      setCFP(local?.category);
    }
  }, []);

  //TAKE SEARCH PARAMS
  const [q, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [radius, setRadius] = useState("");

  const [locationString, setLocationString] = useState("");

  //SEARCH RESULTS
  const [startSearch, setStartSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  //SERVICE SEARCH
  const [serviceSearchIsLoading, setServiceSearchIsLoading] = useState(false);
  const [serviceSearchResult, setServiceSearchResult] = useState();
  const [totalServiceRes, setTotalServiceRes] = useState(0);
  const [currentPageServices, setCurrentPageServices] = useState(1);
  const [serviceHasNextPgn, setServiceHasNextPgn] = useState(false);

  //SERVICE SEARCH
  const [artisanSearchIsLoading, setArtisanSearchIsLoading] = useState(false);
  const [artisanSearchResult, setArtisanSearchResult] = useState();
  const [totalArtisanRes, setTotalArtisanRes] = useState(0);
  const [currentPageArtisans, setCurrentPageArtisans] = useState(1);
  const [artisanHasNextPgn, setArtisanHasNextPgn] = useState(false);

  //FILTER HANDLE
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  //HANDLE SEARCH REQUEST
  useEffect(() => {
    if (startSearch && (q.length > 0 || subCategory)) {
      try {
        setTotalServiceRes(0);
        setTotalArtisanRes(0);
        setSearchText(q);

        if (activeGroup === "services") {
          setServiceSearchIsLoading(true);

          axios
            .get(
              END_POINT.searchServices(
                q,
                serviceHasNextPgn
                  ? Number(currentPageServices + 1)
                  : currentPageServices,
                category,
                subCategory,
                sort,
                minPrice,
                maxPrice,
                longitude,
                latitude,
                radius
              )
            )
            .then((res) => {
              //console.log("Service Search: ", res.data);
              if (res.data.statusCode === 201) {
                if (serviceHasNextPgn) {
                  setServiceSearchResult((serviceSearchResult) => [
                    ...serviceSearchResult,
                    ...res.data.data?.existingRecords,
                  ]);
                } else {
                  setServiceSearchResult(res.data.data?.existingRecords);
                }

                setCurrentPageServices(res.data.data?.currentPage);
                setServiceHasNextPgn(res.data.data?.hasNextPage);
                setTotalServiceRes(res.data.data?.totalDocuments);
              }
              setStartSearch(false);
              setServiceSearchIsLoading(false);
            })
            .catch((err) => {
              popAlert(
                "error",
                "Search Attempt Unsuccessful",
                "Something went wrong while searching. Please try again later"
              );
              setStartSearch(false);
              setServiceSearchIsLoading(false);
            });
        } else {
          setArtisanSearchIsLoading(true);

          axios
            .get(
              END_POINT.searchArtisan(
                q,
                artisanHasNextPgn
                  ? Number(currentPageArtisans + 1)
                  : currentPageArtisans
              )
            )
            .then((res) => {
              //console.log("Artisan Search: ", res.data.data);
              if (res.data.statusCode === 201) {
                if (artisanHasNextPgn) {
                  setArtisanSearchResult((prev) => [
                    ...prev,
                    ...res.data.data?.existingRecords,
                  ]);
                } else {
                  setArtisanSearchResult(res.data.data?.existingRecords);
                }

                setCurrentPageArtisans(res.data.data?.currentPage);
                setArtisanHasNextPgn(res.data.data?.hasNextPage);
                setTotalArtisanRes(res.data.data?.totalDocuments);
              }
              setStartSearch(false);
              setArtisanSearchIsLoading(false);
            })
            .catch((err) => {
              popAlert(
                "error",
                "Search Attempt Unsuccessful",
                "Something went wrong while searching. Please try again later"
              );
              setStartSearch(false);
              setArtisanSearchIsLoading(false);
            });
        }
      } catch (error) {
        popAlert(
          "error",
          "Search Attempt Unsuccessful",
          "Network Error. Please check your connection and try again"
        );
        setStartSearch(false);
        setServiceSearchIsLoading(false);
        setArtisanSearchIsLoading(false);
      }
    } else {
      setStartSearch(false);
      setServiceSearchIsLoading(false);
      setArtisanSearchIsLoading(false);
    }
  }, [q, subCategory, startSearch]);

  useEffect(() => {
    setStartSearch(true);
  }, [activeGroup]);

  function resetFilter() {
    setCategory("");
    setSubCategory("");
    setSort("");
    setMinPrice("");
    setMaxPrice("");
  }

  function resetLocation() {
    setLongitude("");
    setLatitude("");
    setRadius("");
  }

  function resetSearch() {
    setSearch("");
  }

  return (
    <SafeAreaView
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
      }}
      style={[
        AppStyle.safeArea,
        {
          backgroundColor: COLORS.blueNormal,
        },
      ]}
    >
      <DefaultStatusBar
        theme={"blue"}
        setSocket={setSocketConn}
        socketConnect={socketConn}
        userId={userData && userData?._id}
        accessToken={accessToken}
      />
      {/**SEARCH TOP BLOCK */}
      <SearchBlockComp
        input={q}
        setInput={setSearch}
        doneTyping={setStartSearch}
        clearSearch={resetSearch}
      />

      {/**PAGE DISPLAY */}
      <View
        style={{
          minHeight:
            Platform.OS === "ios"
              ? screenHeight - (122 + 96)
              : screenHeight - (122 + 124),
          height:
            Platform.OS === "ios"
              ? screenHeight - (122 + 96)
              : screenHeight - (122 + 124),
          backgroundColor: COLORS.gray100,
          paddingBottom: 30,
        }}
      >
        {(q.length > 0 && (serviceSearchIsLoading || artisanSearchIsLoading)) ||
        serviceSearchResult ||
        artisanSearchResult ? (
          <SearchResultComp
            activeGroup={activeGroup}
            setActiveGroup={setActiveGroup}
            searched={searchText}
            serviceResultData={serviceSearchResult}
            serviceResultIsLoading={serviceSearchIsLoading}
            serviceHasNxtPgn={serviceHasNextPgn}
            totalServiceResCnt={totalServiceRes}
            artisanResultData={artisanSearchResult}
            artisanResultIsLoading={artisanSearchIsLoading}
            artisanHasNxtPgn={artisanHasNextPgn}
            totalArtisanResCnt={totalArtisanRes}
            popupFilter={setShowFilterModal}
            popupLocation={setShowLocationModal}
            category={category}
            subCategory={subCategory}
            sort={sort}
            minPrice={minPrice}
            maxPrice={maxPrice}
            radius={radius}
            showResult={setStartSearch}
          />
        ) : (
          <SearchDefaultComp
            setCategory={setCategory}
            setSubCategory={setSubCategory}
            setSearch={setSearch}
            beginSearch={setStartSearch}
            fromParams={catFromParams}
          />
        )}
      </View>

      {/**NAVIGATION */}
      <BottomNavigationComp activePage={"search"} userData={userData} />

      {/**FILTER MODAL */}
      {showFilterModal && (
        <FilterModal
          showFilter={setShowFilterModal}
          sortBy={sort}
          setSortBy={setSort}
          category={category}
          setCategory={setCategory}
          subcategory={subCategory}
          setSubcategory={setSubCategory}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          showResult={setStartSearch}
          clearFilter={resetFilter}
        />
      )}

      {/**FILTER MODAL */}
      {showLocationModal && (
        <LocationModal
          showLocation={setShowLocationModal}
          setLongitude={setLongitude}
          setLatitude={setLatitude}
          radius={radius}
          setRadius={setRadius}
          showResult={setStartSearch}
          clearLocation={resetLocation}
          location={locationString}
          setLocation={setLocationString}
          showAlert={popAlert}
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
    </SafeAreaView>
  );
}
