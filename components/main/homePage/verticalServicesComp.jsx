import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";

import RecommendCard from "./subComps/recommendCard";
import RecommendCardLoadingTemp from "../../loadingTemplates/homePage/recommendLoadingTemp";
import axios from "axios";
import { END_POINT } from "../../../hooks/endpoints";

const screenWidth = Dimensions.get("screen").width;

export default function VerticalServicesComp({ sectionTitle, showAlert }) {
  //LIST OF SERVICES
  const [isLoading, setIsLoading] = useState(false);
  const [fetchServices, setFetchServices] = useState(true);
  const [serviceData, setServiceData] = useState([]);
  //LIST OF META DATA
  const [curPgn, setCurPgn] = useState(1);
  const [serviceHasNextPgn, setServiceHasNextPgn] = useState(false);

  //FETCH FEATURED SERVICES
  useEffect(() => {
    if (fetchServices) {
      setIsLoading(true);

      let nxtPgn = parseInt(Number(curPgn) + 1);

      axios
        .get(END_POINT.services(serviceHasNextPgn ? nxtPgn : curPgn))
        .then((res) => {
          if (res.data.statusCode === 201) {
            if (serviceHasNextPgn) {
              setServiceData((serviceSearchResult) => [
                ...serviceSearchResult,
                ...res.data.data?.existingRecords,
              ]);
            } else {
              setServiceData(res.data.data?.existingRecords);
            }

            setCurPgn(res.data.data?.currentPage);
            setServiceHasNextPgn(res.data.data?.hasNextPage);
          }

          setIsLoading(false);
          setFetchServices(false);
        })
        .catch((err) => {
          showAlert(
            "error",
            "Error Fetching Services",
            "Something went wrong. Please reload page"
          );
          setIsLoading(false);
          setFetchServices(false);
        });
    }
  }, [fetchServices]);

  return (
    <View style={styles.featuredCont}>
      <View style={styles.featuredHeading}>
        <Text style={styles.featuredHeadingText}>{sectionTitle}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.featuredScroll}
      >
        <>
          {serviceData && serviceData.length > 0 ? (
            serviceData.map((item, index) => (
              <RecommendCard key={index} data={item} />
            ))
          ) : (
            <></>
          )}
        </>
        {isLoading && (
          <>
            <RecommendCardLoadingTemp />
            <RecommendCardLoadingTemp />
          </>
        )}

        {serviceHasNextPgn && (
          <View style={styles.hasNxtPgTab}>
            {isLoading ? (
              <TouchableOpacity style={styles.loadMoreBtn}>
                <ActivityIndicator size={20} color={COLORS.black400} />

                <MaterialCommunityIcons
                  name="chevron-down"
                  size={19}
                  color={COLORS.black400}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setFetchServices(true);
                }}
                style={styles.loadMoreBtn}
              >
                <Text style={styles.loadMoreBtnText}>Load more</Text>

                <MaterialCommunityIcons
                  name="chevron-down"
                  size={19}
                  color={COLORS.black400}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredCont: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  featuredHeading: {
    width: "100%",
  },
  featuredHeadingText: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.black400,
  },
  featuredScroll: {
    gap: 12,
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
