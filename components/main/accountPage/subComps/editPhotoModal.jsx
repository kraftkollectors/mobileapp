import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Octicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { COLORS } from "../../../../constants/themes/colors";
import axios from "axios";
import { END_POINT } from "../../../../hooks/endpoints";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../../../../constants/utilities/localStorage";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

export default function EditPhotoModal({
  hideModal,
  userData,
  accessToken,
  popAlert,
  isLoading,
  refreshPage,
}) {
  const [fileArray, setFile] = useState();
  const [uploadUrl, setUploadUrl] = useState("");

  //HANDLE PHOTO SELECTION FROM GALLERY
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [16, 16],
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    if (!result.canceled) {
      let assetArr = {
        uri: `${result.assets[0].uri}`,
        name: `${result.assets[0].fileName}`,
        type: `${result.assets[0].mimeType}`,
      };
      setFile(assetArr);
    }
  };

  //HANDLE CAMERA PERMISSION
  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const handleCameraPermission = useCallback(async () => {
    if (cameraStatus) {
      if (
        cameraStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
        (cameraStatus.status === ImagePicker.PermissionStatus.DENIED &&
          cameraStatus.canAskAgain)
      ) {
        const permission = await requestCameraPermission();
        if (permission.granted) {
          await takeImage();
        }
      } else if (cameraStatus.status === ImagePicker.PermissionStatus.DENIED) {
        await Linking.openSettings();
      } else {
        await takeImage();
      }
    }
  }, [cameraStatus, takeImage, requestCameraPermission]);

  //HANDLE PHOTO SELECTION FROM CAMERA
  const takeImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      popAlert(
        "error",
        "Photo Update Failed",
        "You've refused to grant this app access to your camera"
      );
      return;
    } else {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [16, 16],
        quality: 1,
        cameraType: "front",
      });

      if (result.canceled) {
        return;
      }

      if (!result.canceled) {
        let assetArr = {
          uri: `${result.assets[0].uri}`,
          name: `${result.assets[0].fileName}`,
          type: `${result.assets[0].mimeType}`,
        };
        setFile(assetArr);
      }
    }
  };

  //HANDLE PHOTO UPLOAD TO SERVER
  useEffect(() => {
    if (fileArray && fileArray) {
      isLoading(true);

      const formData = new FormData();
      formData.append("file", fileArray);

      try {
        axios
          .post(END_POINT.uploadSingleFile, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            //console.log(res.data);
            if (res.data.statusCode === 201) {
              setUploadUrl(`${res.data.data.uploadUrl}`);
            }
          })
          .catch((err) => {
            popAlert(
              "error",
              "Profile Update Failed",
              "Error uploading photo to server. Please select a jpg/pgn file and try again"
            );
            isLoading(false);
          });
      } catch (error) {
        popAlert(
          "error",
          "Profile Update Failed",
          "Network Error. Check your connection and try again"
        );
        isLoading(false);
      }
    }
  }, [fileArray]);

  //HANDLE PHOTO UPLOAD URL TO BACKEND
  useEffect(() => {
    if (uploadUrl) {
      const formData = {
        image: `${uploadUrl}`,
        userEmail: `${userData?.email}`,
      };

      try {
        axios
          .patch(END_POINT.updateUserProfile(userData?._id), formData, {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": `${accessToken}`,
            },
          })
          .then((res) => {
            if (res.data.statusCode === 201) {
              let data = res.data.data.data;
              //UPDATE USER DATA
              StoreDataToMemory(LOCAL_STORAGE_PATH.userData, data);
              //SHOW ALERT
              popAlert(
                "success",
                "Profile Update Successful",
                "You have successfully updated your profile photo"
              );

              isLoading(false);
              hideModal();
              refreshPage();
            }
          })
          .catch((err) => {
            isLoading(false);

            //SHOW ALERT
            popAlert(
              "error",
              "Profile Update Failed",
              "Something went wrong. Please try again"
            );
          });
      } catch (error) {
        isLoading(false);

        //SHOW ALERT
        popAlert(
          "error",
          "Profile Update Failed",
          "Network Error. Check your connection and try again"
        );
      }
    }
  }, [uploadUrl]);

  return (
    <View style={styles.photoModal}>
      <View></View>

      <View style={styles.modalBox}>
        <View style={styles.mbTopBar}>
          <Text style={styles.mbTitle}>Edit Profile Photo</Text>

          <TouchableOpacity onPress={hideModal} style={styles.mbCancelBtn}>
            <Octicons name="x" size={24} color={COLORS.black500} />
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => {
              handleCameraPermission();
            }}
            style={[styles.mbLinkTab, styles.mbNormLink]}
          >
            <SimpleLineIcons name="camera" color={COLORS.black400} size={24} />
            <Text style={[styles.mbLinkText, { color: COLORS.black400 }]}>
              Take a Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              pickImage();
            }}
            style={[styles.mbLinkTab, styles.mbNormLink]}
          >
            <SimpleLineIcons name="picture" color={COLORS.black400} size={24} />
            <Text style={[styles.mbLinkText, { color: COLORS.black400 }]}>
              Choose from Gallery/Photos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.mbLinkTab]}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              color={COLORS.redWarning}
              size={24}
            />
            <Text style={[styles.mbLinkText, { color: COLORS.redWarning }]}>
              Remove current photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoModal: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    justifyContent: "space-between",
  },
  modalBox: {
    width: "100%",
    height: 350,
    backgroundColor: COLORS.whiteBG,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 24,
  },
  mbTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mbTitle: {
    fontFamily: "EinaBold",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black500,
  },
  mbCancelBtn: {
    width: 24,
    height: 24,
    alignItems: "flex-end",
  },
  mbLinkTab: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  mbNormLink: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black50,
  },
  mbLinkText: {
    fontFamily: "EinaSemiBold",
    fontSize: 16,
    lineHeight: 24,
  },
});
