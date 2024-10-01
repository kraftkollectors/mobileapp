//import AsyncStorage from "@react-native-async-storage/async-storage";

import { MMKV } from "react-native-mmkv";

export const APP_STORAGE = new MMKV();

/*async function StoreDataToMemory(storagePath, dataToStore) {
  try {
    const jsonValue = JSON.stringify(dataToStore);
    await AsyncStorage.setItem(`${storagePath}`, jsonValue);
    //return true;
  } catch (e) {
    console.log("store erro: ", e);
    // saving error
    return false;
  }
}

async function GetDataFromMemory(storagePath, setData) {
  try {
    const jsonValue = await AsyncStorage.getItem(`${storagePath}`);
    console.log("storage path: ", storagePath);
    console.log("get json: ", jsonValue);
    let result =
      jsonValue &&
      jsonValue !== null &&
      jsonValue !== "" &&
      jsonValue.length > 0
        ? JSON.parse(jsonValue)
        : jsonValue;
    setData(result);
  } catch (e) {
    console.log("get error: ", e);
    // read error
  }
}

const RemoveDataFromMemory = async (storagePath) => {
  await AsyncStorage.removeItem(storagePath);
};*/

//////
export const StoreDataToMemory = async (storagePath, dataToStore) => {
  // Serialize the object into a JSON string
  APP_STORAGE.set(storagePath, JSON.stringify(dataToStore));

  return true;
};

export const GetDataFromMemory = async (storagePath, setData) => {
  //if storage path is user data, check log stat
  if (storagePath === LOCAL_STORAGE_PATH.userData) {
    let logStat = APP_STORAGE.getString(LOCAL_STORAGE_PATH.logStat);
    let accessToken = APP_STORAGE.getString(LOCAL_STORAGE_PATH.accessToken);
    if (!logStat || !accessToken) {
      setData();
      return;
    }

    if (JSON.parse(logStat) !== "logged") {
      setData();
      return;
    }
  }
  //check if storagePath exists
  let pathExists = APP_STORAGE.contains(storagePath);

  if (pathExists) {
    // Deserialize the JSON string into an object
    const jsonVal = APP_STORAGE.getString(storagePath);
    const finalVal = jsonVal != null ? JSON.parse(jsonVal) : jsonVal;

    setData(finalVal);
  } else {
    setData();
  }
};

export const RemoveDataFromMemory = async (storagePath) => {
  //check if storagePath exists
  // delete the specific key + value
  APP_STORAGE.delete(storagePath);
  /*let pathExists = APP_STORAGE.contains(storagePath);

  if (pathExists) {
  }*/
};

export const LOCAL_STORAGE_PATH = {
  accessToken: "kraftkollectors_user_access_token",
  userData: "kraftkollectors_user_data",
  logStat: "kraftkollectors_user_log_status",
  redirectPath: "kraftkollectors_redirect_path",
  systemNotification: "kraftkollectors_system_notification",
  searchedServices: "kraftkollectors_searched_services",
  hasUnreadChat: "kraftkollectors_has_unread_chats",
  notificationUrl: "kraftkollectors_notification_url",
  deviceLatLng: "kraftkollectors_device_lat_lng",
  API: {
    glp: process.env.EXPO_PUBLIC_API_KEY, //your geolocation api key
  },
};

//CHECK IF USER LOGGED ON DEVICE
export const CheckLoginStatus = async (setStatus) => {
  try {
    let logStat = APP_STORAGE.getString(LOCAL_STORAGE_PATH.logStat);
    let accessToken = APP_STORAGE.getString(LOCAL_STORAGE_PATH.accessToken);

    if (!logStat || !accessToken) {
      setStatus("not-logged");
      return;
    }

    if (JSON.parse(logStat) !== "logged") {
      setStatus("not-logged");
      return;
    }

    //check if userData exists
    let pathExists = APP_STORAGE.contains(LOCAL_STORAGE_PATH.userData);

    if (pathExists) {
      // Deserialize the JSON string into an object
      const jsonVal = APP_STORAGE.getString(LOCAL_STORAGE_PATH.userData);
      const value = jsonVal != null ? JSON.parse(jsonVal) : jsonVal;

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
    } else {
      setStatus("not-logged");
    }
  } catch (e) {
    setStatus("not-logged");
  }
};

//ADD SEARCHED SERVICE
export const AddToSearchedService = async (serviceId) => {
  //CHECK IF LIST EXIST
  let searchClone = [];
  searchClone = APP_STORAGE.getString(LOCAL_STORAGE_PATH.searchedServices);
  searchClone = searchClone != null ? JSON.parse(searchClone) : null;

  var newList = [];

  if (searchClone !== null) {
    //LIST EXIST
    if (!searchClone.includes(serviceId)) {
      if (searchClone.length < 20) {
        newList = [serviceId, ...searchClone];
      } else {
        searchClone.splice(0, 1);
        newList = [serviceId, ...searchClone];
      }
    } else {
      searchClone.forEach((item, index) => {
        if (item === serviceId) {
          searchClone.splice(index, 1);
        }
      });
      newList = [serviceId, ...searchClone];
    }
  } else {
    //ADD NEW LIST
    newList.push(serviceId);
  }

  //STORE LIST
  APP_STORAGE.set(LOCAL_STORAGE_PATH.searchedServices, JSON.stringify(newList));
  /*const jsonValue = JSON.stringify(newList);
  await AsyncStorage.setItem(LOCAL_STORAGE_PATH.searchedServices, jsonValue);*/
};
