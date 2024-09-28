import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { COLORS } from "../../../constants/themes/colors";

//
const suggestions = [
  "Is that the best price?",
  "Are you available?",
  "How much will you charge for this?",
];
//

const screenWidth = Dimensions.get("screen").width;

export default function ChatBottomBlockComp({
  typedText,
  setTypedText,
  sendMessage,
  sendPhoto,
  popAlert,
  isLoading,
}) {
  //const [chatSuggestions, setChatSuggestions] = useState();
  const [isEmpty, setIsEmpty] = useState(true);
  useEffect(() => {
    if (typedText.trim() != "" || typedText.trim().length > 0) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
  }, [typedText]);

  //HANDLE PHOTO SEND
  const [photoFiles, setPhotoFiles] = useState([]);
  const [fileCnt, setFileCnt] = useState(0);

  useEffect(() => {
    if (photoFiles && photoFiles.length > 0) {
      sendPhoto(photoFiles);
      setFileCnt(photoFiles.length);
      setPhotoFiles([]);
    }
  }, [photoFiles]);

  //PICK PHOTO
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      popAlert(
        "error",
        "Photo Update Failed",
        "You've refused to grant this app access to your gallery"
      );
      return;
    } else {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [16, 16],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (result.canceled) {
        return;
      }

      if (!result.canceled) {
        let assetArr;

        assetArr = [];
        var hasLargeFile = 0;
        var notImage = 0;

        result.assets.forEach((asset) => {
          if (parseInt(asset.fileSize) < 5000000) {
            if (asset.type === "image") {
              assetArr.push({
                uri: `${asset.uri}`,
                name: `${asset.fileName}`,
                type: `${asset.mimeType}`,
              });
            } else {
              notImage = parseInt(notImage + 1);
            }
          } else {
            hasLargeFile = parseInt(hasLargeFile + 1);
          }
        });

        if (parseInt(hasLargeFile) > 0) {
          popAlert(
            "error",
            "File Not Added",
            `${hasLargeFile} photo(s) you selected were above 5mb and could not be added`
          );
        }

        if (parseInt(notImage) > 0) {
          popAlert(
            "error",
            "File Not Added",
            `You selected ${notImage} non-image file(s). Only .jpg and .png files supported`
          );
        }

        setPhotoFiles((prev) => [...prev, ...assetArr]);
      }
    }
  };

  //HANDLE MEDIA PERMISSION
  const [mediaStatus, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const handleMediaPermission = useCallback(async () => {
    if (mediaStatus) {
      if (
        mediaStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
        (mediaStatus.status === ImagePicker.PermissionStatus.DENIED &&
          mediaStatus.canAskAgain)
      ) {
        const permission = await requestMediaLibraryPermission();
        if (permission.granted) {
          await pickImage();
        }
      } else if (mediaStatus.status === ImagePicker.PermissionStatus.DENIED) {
        await Linking.openSettings();
      } else {
        await pickImage();
      }
    }
  }, [mediaStatus, pickImage, requestMediaLibraryPermission]);

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={32}>
      <View style={styles.chatBottomBlock}>
        <ScrollView
          style={styles.chatSuggestionBlock}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {suggestions &&
            suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setTypedText(item);
                }}
                style={styles.chatSuggestionTab}
              >
                <Text style={styles.chatSuggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/**INPUT BLOCK */}
        <View style={styles.chatInputTab}>
          {isLoading ? (
            <View style={[styles.chatInputBtn, { position: "relative" }]}>
              <ActivityIndicator
                size={Platform.OS === "ios" ? "large" : 28}
                color={COLORS.blueNormal}
              />

              <View style={styles.chatPhotoCount}>
                <Text style={styles.chatPhotoCountText}>{fileCnt}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                handleMediaPermission();
              }}
              style={styles.chatInputBtn}
            >
              <Image
                source={require("../../../assets/icons/clip.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.chatInput}
            placeholder="Type a message"
            placeholderTextColor={COLORS.black300}
            value={typedText}
            onChangeText={(text) => setTypedText(text)}
            enterKeyHint="send"
            returnKeyType="send"
            returnKeyLabel="send"
            onSubmitEditing={sendMessage}
          />

          {isEmpty ? (
            <TouchableOpacity style={styles.chatInputBtn}>
              <Image
                source={require("../../../assets/icons/send-disable.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={sendMessage} style={styles.chatInputBtn}>
              <Image
                source={require("../../../assets/icons/send.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  chatBottomBlock: {
    width: "100%",
    height: 160,
    backgroundColor: COLORS.whiteBG,
    gap: 16,
    paddingTop: 16,
  },
  chatSuggestionBlock: {
    minWidth: screenWidth,
    maxHeight: 36,
    paddingLeft: 16,
  },
  chatSuggestionTab: {
    width: "auto",
    height: 36,
    paddingHorizontal: 12,
    marginHorizontal: 6,
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.black100,
  },
  chatSuggestionText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.black400,
  },
  chatInputTab: {
    width: "100%",
    height: 28,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatInputBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  chatInput: {
    height: 28,
    width: screenWidth - (56 + 32 + 16),
    fontFamily: "EinaRegular",
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black500,
  },
  chatPhotoCount: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: COLORS.whiteBG,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 4,
    left: 4,
  },
  chatPhotoCountText: {
    fontFamily: "EinaSemiBold",
    fontSize: 14,
    color: COLORS.blueNormal,
  },
});
