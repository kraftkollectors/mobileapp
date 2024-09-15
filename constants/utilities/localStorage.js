//import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";

export const APP_STORAGE = new MMKV();

/*async function StoreDataToMemory(storagePath, dataToStore) {
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
};*/

async function StoreDataToMemory(storagePath, dataToStore) {
  // Serialize the object into a JSON string
  APP_STORAGE.set(`${storagePath}`, JSON.stringify(dataToStore));
}

async function GetDataFromMemory(storagePath, setData) {
  // Deserialize the JSON string into an object
  const jsonObj = APP_STORAGE.getString(`${storagePath}`);
  const resObj = JSON.parse(jsonObj);

  //return data
  setData(resObj);
}

async function RemoveDataFromMemory(storagePath) {
  APP_STORAGE.delete(`${storagePath}`);
}

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
    glp: process.env.EXPO_PUBLIC_API_KEY, //your geolocation api key
  },
};

//CHECK IF USER LOGGED ON DEVICE
/*async function CheckLoginStatus(setStatus) {
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
}*/

async function CheckLoginStatus(setStatus) {
  let userExists = APP_STORAGE.contains(LOCAL_STORAGE_PATH.userData);

  if (userExists) {
    const jsonObj = APP_STORAGE.getString(LOCAL_STORAGE_PATH.userData);
    let userData = JSON.parse(jsonObj);

    if (userData && userData?._id) {
      if (userData?.emailVerify === "false") {
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
}

//ADD SEARCHED SERVICE
/*async function AddToSearchedService(serviceId) {
  //CHECK IF LIST EXIST
  let searchClone = [];
  searchClone = await AsyncStorage.getItem(LOCAL_STORAGE_PATH.searchedServices);
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
  const jsonValue = JSON.stringify(newList);
  await AsyncStorage.setItem(LOCAL_STORAGE_PATH.searchedServices, jsonValue);
}*/

async function AddToSearchedService(serviceId) {
  //CHECK IF LIST EXIST
  let cloneExists = APP_STORAGE.contains(LOCAL_STORAGE_PATH.searchedServices);

  let searchClone = [];
  var newList = [];

  if (cloneExists) {
    const jsonObj = APP_STORAGE.getString(LOCAL_STORAGE_PATH.searchedServices);
    searchClone = JSON.parse(jsonObj);

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
  } else {
    newList.push(serviceId);
  }

  //STORE LIST
  StoreDataToMemory(LOCAL_STORAGE_PATH.searchedServices, newList);
}

async function LogUserOut() {
  let userExists = APP_STORAGE.contains(LOCAL_STORAGE_PATH.userData);

  if (userExists) {
    RemoveDataFromMemory(LOCAL_STORAGE_PATH.userData);
    RemoveDataFromMemory(LOCAL_STORAGE_PATH.accessToken);
  }
}

export {
  StoreDataToMemory,
  GetDataFromMemory,
  RemoveDataFromMemory,
  CheckLoginStatus,
  AddToSearchedService,
  LogUserOut,
  LOCAL_STORAGE_PATH,
};
