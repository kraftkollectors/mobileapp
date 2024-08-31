import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SimpleLineIcons } from "@expo/vector-icons";
import { UIActivityIndicator } from "react-native-indicators";
import { COLORS } from "../../../constants/themes/colors";
import EditPhotoModal from "./subComps/editPhotoModal";
import { LOAD_PROFILE_THUMBNAIL } from "../../../constants/utilities";
import SubscribePremiumModal from "./subComps/subscribePremiumModal";

const screenWidth = Dimensions.get("screen").width;

export default function AccountHeaderComp({
  data,
  accessToken,
  popAlert,
  refreshPage,
}) {
  const [imageIsLoading, setImageIsLoading] = useState(false);
  //HANDLE EDIT PHOTO MODAL
  const [editPhotoModalIsVisible, setEditPhotoModalIsVisible] = useState(false);

  //HANDLE SUBSCRIBE TO PREMIUM
  const [showPremiumBlock, setShowPremiumBlock] = useState(false);

  return (
    <>
      <View style={styles.accountHeader}>
        <TouchableOpacity
          onPress={() => {
            setShowPremiumBlock(true);
          }}
          style={styles.accountPremiumBtn}
        >
          {/*<SimpleLineIcons name="diamond" size={20} color={COLORS.blueDark2} />*/}
          <Image
            source={require("../../../assets/icons/gem.png")}
            style={{ width: 20, height: 20, objectFit: "fill" }}
          />
          <Text style={styles.accountPremiumBtnText}>Go Premium</Text>
        </TouchableOpacity>

        {data ? (
          <View style={styles.accountBlock}>
            <View style={styles.accountHeaderThumbnail}>
              <View style={styles.accountHeaderThumbnailImg}>
                <Image
                  source={LOAD_PROFILE_THUMBNAIL(data?.image)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {imageIsLoading && (
                  <View style={styles.ahLoadingView}>
                    <UIActivityIndicator
                      color={COLORS.whiteBG}
                      size={Platform.OS === "ios" ? 52 : 48}
                    />
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={() => {
                  setEditPhotoModalIsVisible(true);
                }}
                style={styles.ahEditPhotoBtn}
              >
                <SimpleLineIcons
                  name="camera"
                  size={18}
                  color={COLORS.black500}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.ahUserBox}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Text style={styles.ahUsername}>
                  {data?.firstName} {data?.lastName}
                </Text>

                {data?.isArtisan && (
                  <Image
                    source={require("../../../assets/icons/verified.png")}
                    style={{ width: 16, height: 16, objectFit: "cover" }}
                  />
                )}
              </View>
              <Text style={styles.ahUsertag}>@{data?.userName}</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator color={COLORS.black100} size={"large"} />
        )}
      </View>

      {editPhotoModalIsVisible && (
        <EditPhotoModal
          userData={data}
          accessToken={accessToken}
          popAlert={popAlert}
          isLoading={setImageIsLoading}
          refreshPage={refreshPage}
          hideModal={() => {
            setEditPhotoModalIsVisible(false);
          }}
        />
      )}

      {showPremiumBlock && (
        <SubscribePremiumModal
          hideModal={() => {
            setShowPremiumBlock(false);
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  accountHeader: {
    width: "100%",
    height: "auto",
    backgroundColor: COLORS.whiteBG,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
    gap: 36,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  accountPremiumBtn: {
    height: 36,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.violetFaded,
    marginLeft: "auto",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 21,
    backgroundColor: COLORS.violetLight,
  },
  accountPremiumBtnText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.violetNormal,
  },
  accountBlock: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  accountHeaderThumbnail: {
    width: 80,
    height: 80,
    position: "relative",
  },
  accountHeaderThumbnailImg: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: COLORS.gray100,
    overflow: "hidden",
    position: "relative",
  },
  ahLoadingView: {
    width: 80,
    height: 80,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
  },
  ahEditPhotoBtn: {
    width: 32,
    height: 32,
    borderRadius: 40,
    backgroundColor: COLORS.whiteBG,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  ahUserBox: {
    width: "100%",
    alignItems: "center",
  },
  ahUsername: {
    fontFamily: "EinaBold",
    fontSize: 22,
    lineHeight: 28,
    color: COLORS.black900,
    textTransform: "capitalize",
  },
  ahUsertag: {
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black300,
  },
});
