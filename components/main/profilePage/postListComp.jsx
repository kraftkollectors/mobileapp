import { View, Text, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../constants/themes/colors";
import PostCard from "./subComp/postCard";
import { FETCH_ARTISAN_SERVICES } from "../../../hooks/requests";
import PostCardLoadingTemp from "../../loadingTemplates/profilePage/postCardLoadingTemp";

export default function PostListComp({ profile, showError }) {
  //STORE DATA
  const [services, setServices] = useState();
  const [postIsLoading, setPostIsLoading] = useState(false);

  useEffect(() => {
    if (profile._id) {
      FETCH_ARTISAN_SERVICES(
        profile?._id,
        setPostIsLoading,
        setServices,
        showError
      );
    }
  }, [profile]);

  return (
    <View style={styles.postListComp}>
      {postIsLoading ? (
        <PostCardLoadingTemp />
      ) : (
        <>
          {services && services.length > 0 ? (
            services.map((item, index) => <PostCard key={index} data={item} />)
          ) : (
            <View style={styles.noService}>
              <Text style={styles.noServiceText}>No services posted yet</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  postListComp: {
    width: "100%",
    backgroundColor: COLORS.whiteBG,
    paddingLeft: 16,
  },
  noService: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  noServiceText: {
    fontFamily: "EinaSemiBold",
    fontSize: Platform.OS === "ios" ? 14 : 16,
    lineHeight: 24,
    color: COLORS.black200,
  },
});
