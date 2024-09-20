import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/themes/colors";
import styles from "./listings.style";
import DefaultStatusBar from "../../../components/general/defaultStatusBar.comp";
import BottomNavigationComp from "../../../components/main/bottomNavigationComp";
import CreatePageTopBar from "../../../components/main/listingsPage/createPageTopBar";
import SettingInputTab from "../../../components/main/accountPage/subComps/settingInputTab";
import SettingSelectTab from "../../../components/main/accountPage/subComps/settingSelectTab";
import { SERVICE_CATEGORIES } from "../../../constants/json";
import SettingTextareaTab from "../../../components/main/accountPage/subComps/settingTextareaTab";
import SaveBtn from "../../../components/main/accountPage/subComps/saveBtn";
import AlertBox from "../../../components/general/alertBox";
import {
  FETCH_SERVICE_DATA,
  FETCH_PLACES_LIST,
  FETCH_STATES_LIST,
  UPLOAD_COVER_PHOTO,
  UPLOAD_PORTFOLIO_PHOTOS,
} from "../../../hooks/requests";
import {
  GetDataFromMemory,
  LOCAL_STORAGE_PATH,
} from "../../../constants/utilities/localStorage";
import axios from "axios";
import { END_POINT } from "../../../hooks/endpoints";
import { useRouter } from "expo-router";
import { AppStyle } from "../../../constants/themes/style";

const screenHeight = Dimensions.get("screen").height;

export default function CreatePost() {
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

    setBtnIsLoading(false);
  }
  ///////////////////////////////////////////////
  const router = useRouter();
  const [userData, setUserData] = useState();
  const [accessToken, setAccessToken] = useState("");
  const [btnIsLoading, setBtnIsLoading] = useState(false);

  const defaultTitleBtm =
    "Using relevant keywords is crucial for potential buyers to find your service easily. Ensure it reflects the essence of your offering effectively";
  const defaultCategoryBtm =
    "Select the most appropriate category that aligns with your service. This helps users navigate and discover your offering efficiently. Choose wisely to attract the right audience";
  const defaultDescBtm =
    "Provide a concise yet comprehensive overview of your service. Craft your description thoughtfully to entice and inform your audience effectively";
  const defaultAddressBtm =
    "Do not include the state name in the address input field as you have already chosen it";

  //COLLECT INPUT DATA
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedPrice, setEstPrice] = useState(0);
  const [charge, setCharge] = useState("fixed"); //fixed, hourly
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [portfolio, setPortfolio] = useState();

  //COLLECT INPUT DATA ERROR
  const [titleErr, setTitleErr] = useState("");
  const [categoryErr, setCategoryErr] = useState("");
  const [subCategoryErr, setSubCategoryErr] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [estimatedPriceErr, setEstPriceErr] = useState("");
  const [stateErr, setStateErr] = useState("");
  const [addressErr, setAddressErr] = useState("");
  const [coverPhotoErr, setCoverPhotoErr] = useState("");
  const [portfolioErr, setPortfolioErr] = useState("");

  //IMAGE DATA
  const [coverPhotoFile, setCoverPhotoFile] = useState();
  const [portfolioPhotoFiles, setPortfolioPhotoFiles] = useState([]);

  //QUICK FETCH
  const [categoryList, setCategoryList] = useState();
  const [subCategoryList, setSubCategoryList] = useState();
  const [onlineStates, setOnlineStates] = useState();
  const [stateList, setStateList] = useState();

  useEffect(() => {
    let serviceCat = SERVICE_CATEGORIES();
    let catArr = [];
    serviceCat.forEach((cat) => {
      catArr.push(cat.category);
    });
    setCategoryList(catArr);
  }, []);

  useEffect(() => {
    if (category) {
      setSubCategory("");

      let serviceCat = SERVICE_CATEGORIES();
      let subArr = [];
      serviceCat.forEach((cat) => {
        if (cat.category === category) {
          setSubCategoryList(cat.sub);
        }
      });
    }
  }, [category]);

  useEffect(() => {
    if (onlineStates) {
      let stateArr = [];
      onlineStates.forEach((state) => {
        stateArr.push(state.name);
      });
      setStateList(stateArr);
    }
  }, [onlineStates]);

  //***ADDRESS HANDLE ***//
  const [findPlace, setFindPlace] = useState(false);
  const [placeList, setPlaceList] = useState();
  const [placeLoading, setPlaceLoading] = useState(false);

  useEffect(() => {
    if (findPlace && address && address.length > 3) {
      FETCH_PLACES_LIST(
        address,
        LOCAL_STORAGE_PATH.API.glp,
        setPlaceList,
        setPlaceLoading,
        popAlert
      );
      setFindPlace(false);
    }
  }, [findPlace, address]);

  function selectPlace(id, place) {
    let queryFields = "formatted_address,geometry,name";

    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${LOCAL_STORAGE_PATH.API.glp}&fields=${queryFields}&language=en-US`
      )
      .then((res) => {
        setAddress(res.data?.result?.formatted_address);
        setLongitude(res.data?.result?.geometry?.location?.lng);
        setLatitude(res.data?.result?.geometry?.location?.lat);
        setPlaceList();
      })
      .catch((err) => {
        setAddress(place);
      });
  }

  //****PHOTO SELECTION HANDLE****//
  function removeCoverPhoto() {
    setCoverPhotoFile();
  }

  function removePortfolioPhoto(i) {
    setPortfolioPhotoFiles((prev) => [
      ...prev.slice(0, i),
      ...prev.slice(i + 1, prev.length),
    ]);
  }
  //PICK PHOTO
  const pickImage = async (choice) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      popAlert(
        "error",
        "Photo Upload Failed",
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
        allowsMultipleSelection: choice === "cover" ? false : true,
      });

      if (result.canceled) {
        return;
      }

      if (!result.canceled) {
        let assetArr;

        if (choice === "cover") {
          assetArr = {
            uri: `${result.assets[0].uri}`,
            name: `${result.assets[0].fileName}`,
            type: `${result.assets[0].mimeType}`,
          };
          setCoverPhotoFile(assetArr);
        } else {
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

          setPortfolioPhotoFiles((prev) => [...prev, ...assetArr]);
        }
      }
    }
  };
  //HANDLE MEDIA PERMISSION
  const [mediaStatus, requestMediaLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();

  const handleMediaPermission = useCallback(
    async (choice) => {
      if (mediaStatus) {
        if (
          mediaStatus.status === ImagePicker.PermissionStatus.UNDETERMINED ||
          (mediaStatus.status === ImagePicker.PermissionStatus.DENIED &&
            mediaStatus.canAskAgain)
        ) {
          const permission = await requestMediaLibraryPermission();
          if (permission.granted) {
            await pickImage(choice);
          }
        } else if (mediaStatus.status === ImagePicker.PermissionStatus.DENIED) {
          await Linking.openSettings();
        } else {
          await pickImage(choice);
        }
      }
    },
    [mediaStatus, pickImage, requestMediaLibraryPermission]
  );

  //HANDLE POST CREATION//
  function validateInputs() {
    //CLEAR ERRORS
    setTitleErr("");
    setCategoryErr("");
    setSubCategoryErr("");
    setDescriptionErr("");
    setEstPriceErr("");
    setStateErr("");
    setAddressErr("");
    setCoverPhotoErr("");
    setPortfolioErr("");

    //TITLE
    if (!title) {
      setTitleErr("Provide a title for your service");
      return;
    } else {
      if (title.split(" ").length < 4) {
        setTitleErr("Service title provided is not clear enough");
        return;
      }
    }

    //CATEGORY
    if (!category) {
      setCategoryErr("Please choose a category that matches your service");
      return;
    }

    //SUB CATEGORY
    if (!subCategory) {
      setSubCategoryErr("select the best sub-category for your service");
      return;
    }

    //DESCRIPTION
    if (!description) {
      setDescriptionErr("Tell your target users more about the service");
      return;
    } else {
      if (description.split(" ").length < 10) {
        setDescriptionErr("Service description must be more than 10 words");
        return;
      }
    }

    //PRICE
    if (!estimatedPrice) {
      setEstPriceErr("Give an estimated price for your service");
      return;
    } else {
      if (parseInt(estimatedPrice) < 100) {
        setEstPriceErr("Service price can not be less than N100");
        return;
      }
    }

    //STATE
    if (!state) {
      setStateErr("Where is your service being offered?");
      return;
    }

    //ADDRESS
    if (!address) {
      setAddressErr("Please make it easy to locate your service");
      return;
    }

    //COVER PHOTO
    if (!coverPhotoFile) {
      setCoverPhotoErr(
        "You must upload a cover photo for your service thumbnail"
      );
      return;
    }

    //PORTFOLIO PHOTO
    if (portfolioPhotoFiles.length < 1) {
      setPortfolioErr(
        "You must upload atleast one photo for your service gallery"
      );
      return;
    }

    //PROCEED
    setBtnIsLoading(true);
  }

  //CREATING POST HANDLE
  useEffect(() => {
    if (btnIsLoading) {
      //ATTEMPT COVER PHOTO UPLOAD
      UPLOAD_COVER_PHOTO(coverPhotoFile, setCoverPhoto, popAlert);
    }
  }, [btnIsLoading]);
  useEffect(() => {
    if (coverPhoto) {
      //ATTEMPT PORTFOLIO UPLOADS
      UPLOAD_PORTFOLIO_PHOTOS(portfolioPhotoFiles, setPortfolio, popAlert);
    }
  }, [coverPhoto]);

  useEffect(() => {
    if (portfolio) {
      //PROCEED WITH SERVICE CREATION
      console.log("start here");
      const formData = {
        address: `${address.trim()}`,
        title: `${title.trim()}`,
        category: `${category}`,
        subCategory: `${subCategory}`,
        description: `${description.trim()}`,
        estimatedPrice: `${estimatedPrice}`,
        state: `${state}`,
        charge: `${charge}`,
        userId: `${userData?._id}`,
        userEmail: `${userData?.email}`,
        portfolio: portfolio,
        coverPhoto: `${coverPhoto}`,
        longitude: longitude,
        latitude: latitude,
      };

      axios
        .post(END_POINT.services, formData, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${accessToken}`,
          },
        })
        .then((res) => {
          setBtnIsLoading(false);
          if (res.data.statusCode === 201) {
            let serviceId = res.data.data?.ad?._id;
            //GO TO SERVICE

            popAlert(
              "success",
              "Service Creation Successful",
              "You have listed a new service on kraftkollectors. You will be redirected shortly"
            );

            setTimeout(() => {
              if (router.canDismiss()) {
                router.dismissAll();
              }
              router.push(`/main/service?_id=${serviceId}`);
            }, 2500);
          }
        })
        .catch((err) => {
          console.log("Error: ", err.response.data);
          setBtnIsLoading(false);
        });
    }
  }, [portfolio]);

  return (
    <SafeAreaView
      style={[
        AppStyle.safeArea,
        {
          backgroundColor: COLORS.whiteBG,
        },
      ]}
      onLayout={() => {
        GetDataFromMemory(LOCAL_STORAGE_PATH.userData, setUserData);
        GetDataFromMemory(LOCAL_STORAGE_PATH.accessToken, setAccessToken);
        FETCH_STATES_LIST(setOnlineStates, popAlert);
      }}
    >
      <DefaultStatusBar
        theme={"light"}
        setSocket={setSocketConn}
        socketConnect={socketConn}
        userId={userData && userData?._id}
        accessToken={accessToken}
      />

      {/**STICKY HEADER */}
      <CreatePageTopBar pageTitle={"Create New Service"} />
      {/**PAGE DISPLAY */}
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{
          height:
            Platform.OS === "ios"
              ? screenHeight - (124 + 48)
              : screenHeight - (124 + 32 + 48),
        }}
      >
        <ScrollView
          contentContainerStyle={{
            minHeight: screenHeight - (80 + 48),
            backgroundColor: COLORS.gray100,
            paddingBottom: 30,
            paddingTop: 24,
            gap: 16,
          }}
        >
          <View style={styles.createSection}>
            <Text style={styles.sectionLabel}>Title</Text>

            <SettingInputTab
              placeholder={"Ex. I will plan and manage your events"}
              input={title}
              setInput={setTitle}
              hasError={titleErr}
            />

            {title.length > 0 && (
              <Text style={styles.sectionBtmText}>{defaultTitleBtm}</Text>
            )}
          </View>

          <View style={styles.createSection}>
            <Text style={styles.sectionLabel}>Category</Text>

            <>
              <SettingSelectTab
                placeholder={"Choose a category"}
                selectList={categoryList}
                selectedItem={category}
                setSelectedItem={setCategory}
                hasError={categoryErr}
              />

              {category && (
                <SettingSelectTab
                  placeholder={"Select a sub-category"}
                  selectList={subCategoryList}
                  selectedItem={subCategory}
                  setSelectedItem={setSubCategory}
                  hasError={subCategoryErr}
                />
              )}
            </>

            <Text style={styles.sectionBtmText}>{defaultCategoryBtm}</Text>
          </View>

          <View style={styles.createSection}>
            <Text style={styles.sectionLabel}>Description</Text>

            <SettingTextareaTab
              placeholder={"Tell us more about your service"}
              input={description}
              setInput={setDescription}
              hasError={descriptionErr}
            />

            {description.length > 0 && (
              <Text style={styles.sectionBtmText}>{defaultDescBtm}</Text>
            )}
          </View>

          <View style={styles.createSection}>
            <Text style={styles.sectionLabel}>Price</Text>

            <SettingInputTab
              placeholder={"Ex. 1000"}
              input={estimatedPrice}
              setInput={setEstPrice}
              isNumber={true}
              hasError={estimatedPriceErr}
            />

            <View style={styles.priceChargeTabList}>
              {priceChargeTab(charge, setCharge, "fixed")}
              {priceChargeTab(charge, setCharge, "hourly")}
            </View>
          </View>

          <View style={styles.createSection}>
            <Text style={styles.sectionLabel}>Service Location</Text>

            <SettingSelectTab
              placeholder={"Choose your state"}
              selectList={stateList}
              selectedItem={state}
              setSelectedItem={setState}
              hasError={stateErr}
            />

            {state && (
              <View style={styles.inputBlock}>
                <View
                  style={[
                    styles.inputTab,
                    addressErr
                      ? { borderColor: COLORS.redWarning }
                      : { borderColor: COLORS.black100 },
                  ]}
                >
                  <TextInput
                    style={styles.inputText}
                    placeholder={"Search for address, city, or town"}
                    placeholderTextColor={COLORS.black100}
                    value={address}
                    onChangeText={(text) => setAddress(text)}
                    onEndEditing={() => {
                      setFindPlace(true);
                    }}
                    onSubmitEditing={() => {
                      setFindPlace(true);
                    }}
                    inputMode={"text"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyLabel="Search"
                    returnKeyType="search"
                    enterKeyHint="search"
                  />
                </View>

                {addressErr && (
                  <Text
                    style={[styles.inputBtmText, { color: COLORS.redWarning }]}
                  >
                    {addressErr}
                  </Text>
                )}
              </View>
            )}

            {/**PLACE LIST */}

            {placeLoading ? (
              <View style={styles.placeLoadingView}>
                <ActivityIndicator size={"large"} color={COLORS.blueNormal} />
              </View>
            ) : (
              <>
                {placeList && placeList.length > 0 && (
                  <View
                    style={{
                      width: "100%",
                      maxHeight: 320,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 4,
                      borderWidth: 1,
                      borderColor: COLORS.black50,
                    }}
                  >
                    <ScrollView
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      contentContainerStyle={styles.placeListScroll}
                    >
                      {placeList.map((item, index) =>
                        PlaceListTab(index, item, selectPlace)
                      )}
                    </ScrollView>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.createSection}>
            <Text style={styles.sectionLabel}>Cover Photo</Text>

            <TouchableOpacity
              onPress={() => {
                handleMediaPermission("cover");
              }}
              style={styles.photoSelectorTouchpad}
            >
              <View style={styles.photoSelectorInner}>
                <Feather name="upload" size={20} color={COLORS.blueNormal} />
                <Text style={styles.photoSelectorText}>Upload Photo</Text>
              </View>

              <Text style={styles.photoSelectorPlaceholder}>
                .jpg and .png {"\n"} Photo must not exceed 5mb
              </Text>
            </TouchableOpacity>

            {coverPhotoErr.length > 0 && (
              <Text style={styles.sectionBtmErrText}>{coverPhotoErr}</Text>
            )}

            {coverPhotoFile && (
              <View style={styles.photoPreviewTab}>
                <TouchableOpacity
                  onPress={() => {
                    removeCoverPhoto();
                  }}
                  style={styles.photoPreviewTabClear}
                >
                  <Feather name="x" size={16} color={COLORS.black900} />
                </TouchableOpacity>

                <Image
                  source={{ uri: coverPhotoFile?.uri }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </View>
            )}
          </View>

          <View style={styles.createSection}>
            <Text style={styles.sectionLabel}>Service Photo Gallery</Text>

            <TouchableOpacity
              onPress={() => {
                handleMediaPermission("portfolio");
              }}
              style={styles.photoSelectorTouchpad}
            >
              <View style={styles.photoSelectorInner}>
                <Feather name="upload" size={20} color={COLORS.blueNormal} />
                <Text style={styles.photoSelectorText}>Select Photos</Text>
              </View>

              <Text style={styles.photoSelectorPlaceholder}>
                .jpg and .png {"\n"} Each photo must not exceed 5mb
              </Text>
            </TouchableOpacity>

            {portfolioErr.length > 0 && (
              <Text style={styles.sectionBtmErrText}>{portfolioErr}</Text>
            )}

            {portfolioPhotoFiles && portfolioPhotoFiles.length > 0 && (
              <ScrollView horizontal={true} contentContainerStyle={{ gap: 8 }}>
                {portfolioPhotoFiles.map((item, index) => (
                  <View style={styles.photoPreviewTab} key={index}>
                    <TouchableOpacity
                      onPress={() => {
                        removePortfolioPhoto(index);
                      }}
                      style={styles.photoPreviewTabClear}
                    >
                      <Feather name="x" size={16} color={COLORS.black900} />
                    </TouchableOpacity>

                    <Image
                      source={{ uri: item?.uri }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={{ padding: 16 }}>
            <SaveBtn
              btnText={"Publish"}
              isLoading={btnIsLoading}
              handleClick={() => {
                validateInputs();
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/**ALERT BOX */}
      {isAlert && (
        <AlertBox
          status={alertStat}
          heading={alertHeading}
          message={alertMsg}
          showAlert={showAlert}
        />
      )}

      {/**NAVIGATION */}
      <BottomNavigationComp activePage={"listings"} />
    </SafeAreaView>
  );
}

function priceChargeTab(charge, setCharge, choice) {
  return (
    <TouchableOpacity
      onPress={() => {
        setCharge(choice);
      }}
      style={[
        styles.priceChargeTabDefault,
        charge === choice && styles.priceChargeTabChoosen,
      ]}
    >
      <Text
        style={[
          styles.priceChargeDefault,
          charge === choice && { color: COLORS.blueNormal },
        ]}
      >
        {choice}
      </Text>
    </TouchableOpacity>
  );
}

function PlaceListTab(index, data, selectPlace) {
  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        selectPlace(data?.place_id, data?.description);
      }}
      style={styles.placeTab}
    >
      <Text style={styles.placeTextMain}>
        {data?.structured_formatting?.main_text}
      </Text>
      <Text style={styles.placeTextSub}>
        {data?.structured_formatting?.secondary_text}
      </Text>
    </TouchableOpacity>
  );
}
