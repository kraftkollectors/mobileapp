import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import SearchResultGroupBlock from "./subComp/searchResultGroupBlock";
import SearchFilterBlock from "./subComp/searchFilterBlock";
import ResultArtisanTab from "./subComp/resultArtisanTab";
import ResultServiceTab from "./subComp/resultServiceTab";
import { FORMATNUMBERWITHCOMMA } from "../../../constants/utilities";
import ServiceLoadingTemp from "../../loadingTemplates/searchPage/serviceLoadingTemp";
import ArtisanLoadingTemp from "../../loadingTemplates/searchPage/artisanLoadingTemp";

export default function SearchResultComp({
  activeGroup,
  setActiveGroup,
  searched,
  serviceResultData,
  serviceResultIsLoading,
  serviceHasNxtPgn,
  totalServiceResCnt,
  artisanResultData,
  artisanResultIsLoading,
  artisanHasNxtPgn,
  totalArtisanResCnt,
  popupFilter,
  popupLocation,
  category,
  subCategory,
  sort,
  minPrice,
  maxPrice,
  radius,
  showResult,
}) {
  return (
    <View style={styles.searchResultComp}>
      {/**ACTIVE GROUP BLOCK */}
      <SearchResultGroupBlock
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
      />

      <ScrollView contentContainerStyle={styles.searchResultContainer}>
        <Text style={styles.searchResultText}>
          Search Result for{" "}
          {activeGroup === "services" ? (
            <Text style={[{ fontFamily: "EinaSemiBold" }]}>
              {searched} (
              {totalServiceResCnt
                ? FORMATNUMBERWITHCOMMA(totalServiceResCnt)
                : 0}
              )
            </Text>
          ) : (
            <Text style={[{ fontFamily: "EinaSemiBold" }]}>
              {searched} (
              {totalArtisanResCnt
                ? FORMATNUMBERWITHCOMMA(totalArtisanResCnt)
                : 0}
              )
            </Text>
          )}
        </Text>

        {/**FILTER BLOCK */}
        {activeGroup === "services" && (
          <SearchFilterBlock
            popupFilter={popupFilter}
            popupLocation={popupLocation}
            category={category}
            subCategory={subCategory}
            sort={sort}
            minPrice={minPrice}
            maxPrice={maxPrice}
            radius={radius}
          />
        )}

        {/**RESULT DISPLAY */}
        {(!serviceHasNxtPgn && serviceResultIsLoading) ||
        (!artisanHasNxtPgn && artisanResultIsLoading) ? (
          <>
            {activeGroup === "services" ? (
              <View style={styles.searchResultServiceList}>
                <ServiceLoadingTemp />
                <ServiceLoadingTemp />
              </View>
            ) : (
              <View style={styles.searchResultArtisanList}>
                <ArtisanLoadingTemp />
                <ArtisanLoadingTemp />
              </View>
            )}
          </>
        ) : (
          <>
            {activeGroup === "services" ? (
              <>
                {serviceResultData && serviceResultData.length > 0 ? (
                  <View style={styles.searchResultServiceList}>
                    {serviceResultData.map((item, index) => (
                      <ResultServiceTab key={index} data={item} />
                    ))}

                    {serviceHasNxtPgn && (
                      <View style={styles.hasNxtPgTab}>
                        {serviceResultIsLoading ? (
                          <TouchableOpacity style={styles.loadMoreBtn}>
                            <ActivityIndicator
                              size={20}
                              color={COLORS.black400}
                            />

                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={19}
                              color={COLORS.black400}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              showResult(true);
                            }}
                            style={styles.loadMoreBtn}
                          >
                            <Text style={styles.loadMoreBtnText}>
                              Load more
                            </Text>

                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={19}
                              color={COLORS.black400}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: 250,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text>No result found for your search</Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {artisanResultData && artisanResultData.length > 0 ? (
                  <View style={styles.searchResultArtisanList}>
                    {artisanResultData.map((item, index) => (
                      <ResultArtisanTab key={index} data={item} />
                    ))}

                    {artisanHasNxtPgn && (
                      <View style={styles.hasNxtPgTab}>
                        {serviceResultIsLoading ? (
                          <TouchableOpacity style={styles.loadMoreBtn}>
                            <ActivityIndicator
                              size={20}
                              color={COLORS.black400}
                            />

                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={19}
                              color={COLORS.black400}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              showResult(true);
                            }}
                            style={styles.loadMoreBtn}
                          >
                            <Text style={styles.loadMoreBtnText}>
                              Load more
                            </Text>

                            <MaterialCommunityIcons
                              name="chevron-down"
                              size={19}
                              color={COLORS.black400}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: 250,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text>No result found for your search</Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchResultComp: {
    width: "100%",
  },
  searchResultContainer: {
    width: "100%",
    minHeight: 350,
    padding: 16,
    paddingBottom: 240,
    gap: 16,
  },
  searchResultText: {
    fontFamily: "EinaRegular",
    fontSize: Platform.OS === "ios" ? 12 : 14,
    lineHeight: 20,
    color: COLORS.black400,
  },
  searchResultArtisanList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  searchResultServiceList: {
    width: "100%",
    gap: 16,
  },
  loadMoreBtn: {
    width: 120,
    height: 28,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.black50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadMoreBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.black400,
  },
  hasNxtPgTab: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
  },
});
