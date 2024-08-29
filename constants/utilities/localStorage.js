import AsyncStorage from "@react-native-async-storage/async-storage";

async function StoreDataToMemory(storagePath, dataToStore) {
  try {
    const jsonValue = JSON.stringify(dataToStore);
    await AsyncStorage.setItem(`${storagePath}`, jsonValue);
    //return true;
  } catch (e) {
    console.log(e);
    // saving error
    return false;
  }
}

async function GetDataFromMemory(storagePath, setData) {
  try {
    const jsonValue = await AsyncStorage.getItem(`${storagePath}`);
    let result = jsonValue != null ? JSON.parse(jsonValue) : null;
    setData(result);
  } catch (e) {
    console.log(e);
    // read error
  }
}

const RemoveDataFromMemory = async (storagePath) => {
  await AsyncStorage.removeItem(storagePath);
};

const LOCAL_STORAGE_PATH = {
  accessToken: "kraftkollectors_user_access_token",
  userData: "kraftkollectors_user_data",
  redirectPath: "kraftkollectors_redirect_path",
  systemNotification: "kraftkollectors_system_notification",
  searchedServices: "kraftkollectors_searched_services",
  hasUnreadChat: "kraftkollectors_has_unread_chats",
  notificationUrl: "kraftkollectors_notification_url",
  deviceLatLng: "kraftkollectors_device_lat_lng",
  API: {
    geolocationPlaces: "AIzaSyD5zRbkap5XBLXB7kzIUwYur_UOIBB700A",
  },
};

//CHECK IF USER LOGGED ON DEVICE
async function CheckLoginStatus(setStatus) {
  try {
    let value = await AsyncStorage.getItem(LOCAL_STORAGE_PATH.userData);
    value = value != null ? JSON.parse(value) : null;

    if (value !== null) {
      //USER LOGGED IN
      //CHECK IF USER EMAIL IS VERIFIED
      if (value?.emailVerify === "false") {
        setStatus("not-verified");
      } else {
        setStatus("logged");
      }
    } else {
      setStatus("not-logged");
    }
  } catch (e) {
    console.log("error: ", e);
    setStatus("not-logged");
    // error reading value
  }
}

//ADD SEARCHED SERVICE
async function AddToSearchedService(serviceId) {
  //CHECK IF LIST EXIST
  let searchClone = [];
  searchClone = await AsyncStorage.getItem(LOCAL_STORAGE_PATH.searchedServices);
  searchClone = searchClone != null ? JSON.parse(searchClone) : null;

  var newList = [];

  if (searchClone !== null) {
    //LIST EXIST
    if (!searchClone.includes(serviceId)) {
      if (searchClone.length < 20) {
        newList = [...searchClone, serviceId];
      } else {
        searchClone.splice(0, 1);
        newList = [...searchClone, serviceId];
      }
    } else {
      newList = [...searchClone];
    }
  } else {
    //ADD NEW LIST
    newList.push(serviceId);
  }

  //STORE LIST
  const jsonValue = JSON.stringify(newList);
  await AsyncStorage.setItem(LOCAL_STORAGE_PATH.searchedServices, jsonValue);
}

export {
  StoreDataToMemory,
  GetDataFromMemory,
  RemoveDataFromMemory,
  CheckLoginStatus,
  AddToSearchedService,
  LOCAL_STORAGE_PATH,
};
