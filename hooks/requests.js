import React, { useEffect, useState } from "react";
import axios from "axios";
import { END_POINT, STATE_END_POINT } from "./endpoints";
import { Alert } from "react-native";
import {
  LOCAL_STORAGE_PATH,
  StoreDataToMemory,
} from "../constants/utilities/localStorage";

async function FETCH_SERVICES(isLoading, result, showError) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.services(1))
      .then((res) => {
        //MAIN DATA IN res.data.data.existingRecords
        if (res?.data.statusCode === 201) {
          result(res?.data.data.existingRecords);
        }
        isLoading(false);
      })
      .catch((err) => {
        showError(
          "error",
          "Error Fetching Services",
          "Something went wrong. Please reload page"
        );
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
    showError(
      "error",
      "Error Fetching Services",
      "Please check your network connection and try again"
    );
  }
}

async function FETCH_ARTISAN_SERVICES(userId, isLoading, result, showError) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.getArtisanServices(userId))
      .then((res) => {
        //MAIN DATA IN res.data.data.existingRecords
        if (res.data.statusCode === 201) {
          result(res.data.data.existingRecords);
        }
        isLoading(false);
      })
      .catch((err) => {
        showError(
          "error",
          "Error Fetching Services",
          "Something went wrong. Please reload page"
        );
        isLoading(false);
      });
  } catch (error) {
    showError(
      "error",
      "Error Fetching Services",
      "Please check your network connection and try again"
    );
    isLoading(false);
  }
}

async function FETCH_USER_CERTIFICATES(userId, result, fetchType, isLoading) {
  if (fetchType != "refresh") {
    isLoading(true);
  }

  axios
    .get(END_POINT.getUserCertificates(userId))
    .then((res) => {
      //MAIN DATA IN res.data.data.existingRecords
      if (res.data.statusCode === 201) {
        result(res.data.data.existingRecords);
      }
      isLoading(false);
    })
    .catch((err) => {
      Alert.alert(
        "Error Fetching Certificates",
        "Something went wrong. Please try again"
      );
      isLoading(false);
    });
}

async function FETCH_USER_EDUCATIONS(userId, result, fetchType, isLoading) {
  if (fetchType != "refresh") {
    isLoading(true);
  }

  axios
    .get(END_POINT.getUserEducations(userId))
    .then((res) => {
      //MAIN DATA IN res.data.data.existingRecords
      if (res.data.statusCode === 201) {
        result(res.data.data.existingRecords);
      }
      isLoading(false);
    })
    .catch((err) => {
      Alert.alert(
        "Error Fetching Educations",
        "Something went wrong. Please try again"
      );
      isLoading(false);
    });
}

async function FETCH_SERVICE_DATA(serviceId, result, isLoading, showError) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.getSingleArtisanService(serviceId))
      .then((res) => {
        //MAIN DATA IN res.data.data.existingRecord
        if (res.data.statusCode === 201) {
          result(res.data.data.existingRecord);
        }
        isLoading(false);
      })
      .catch((err) => {
        showError(
          "error",
          "Error Fetching Service Data",
          "Something went wrong. Please try again"
        );
        isLoading(false);
      });
  } catch (error) {
    showError(
      "error",
      "Error Fetching Service Data",
      "Check your network connection and try again"
    );
    isLoading(false);
  }
}

async function FETCH_SERVICE_USER(serviceUserId, result, isLoading, showError) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.getUser(serviceUserId))
      .then((res) => {
        //MAIN DATA IN res.data.data.userDetails
        if (res.data.statusCode === 201) {
          result(res.data.data.userDetails);
        }
        isLoading(false);
      })
      .catch((err) => {
        showError(
          "error",
          "Error Fetching User Data",
          "Something went wrong. Please try again"
        );
        isLoading(false);
      });
  } catch (error) {
    showError(
      "error",
      "Error Fetching User Data",
      "Check your network connection and try again"
    );
    isLoading(false);
  }
}

async function FETCH_SERVICE_ARTISAN(serviceUserId, result) {
  try {
    axios
      .get(END_POINT.getArtisan(serviceUserId))
      .then((res) => {
        //MAIN DATA IN res.data.data.existingRecord
        if (res.data.statusCode === 201) {
          result(res.data.data.existingRecord);
        }
      })
      .catch((err) => {
        Alert.alert(
          "Error Fetching Service Artisan Data",
          "Something went wrong. Please try again"
        );
      });
  } catch (error) {
    Alert.alert(
      "Error Fetching Service Artisan Data",
      "Check your network connection and try again"
    );
  }
}

async function CHECK_SERVICE_IS_FAVOURITE(userId, serviceId, result) {
  axios
    .get(END_POINT.checkFavourite(userId, serviceId))
    .then((res) => {
      //MAIN DATA IN res.data.data
      let isFav = res.data.data;
      if (res.data.statusCode === 201) {
        result(isFav);
      } else {
        result(false);
      }
    })
    .catch((err) => {
      result(false);
    });
}

async function FETCH_USER_FAVOURITES(
  userId,
  result,
  fetchType,
  isLoading,
  showError
) {
  if (fetchType != "refresh") {
    isLoading(true);
  }

  try {
    axios
      .get(END_POINT.myFavouriteServices(userId))
      .then((res) => {
        //MAIN DATA IN res.data.data.existingRecords
        if (res.data.statusCode === 201) {
          result(res.data.data.existingRecords);
        }
        isLoading(false);
      })
      .catch((err) => {
        showError(
          "error",
          "Error Fetching Saved Services",
          "Something went wrong. Please try again"
        );
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
    showError(
      "error",
      "Error Fetching Saved Services",
      "Please check your network connection and try again"
    );
  }
}

async function MAKE_SERVICE_FAVOURITE(
  userId,
  userEmail,
  serviceId,
  accessToken,
  isActive,
  result,
  isLoading
) {
  isLoading(true);

  try {
    if (isActive) {
      axios
        .delete(END_POINT.deleteFavourite(userId, serviceId), {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${accessToken}`,
          },
        })
        .then((res) => {
          //MAIN DATA IN res.data.data
          if (res.data.statusCode === 201) {
            result(false);
          } else {
            result(true);
          }
          isLoading(false);
        })
        .catch((err) => {
          isLoading(false);
          result(false);
        });
    } else {
      const formData = {
        userId: `${userId}`,
        userEmail: `${userEmail}`,
        serviceId: `${serviceId}`,
      };

      axios
        .post(END_POINT.makeFavourite, formData, {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": `${accessToken}`,
          },
        })
        .then((res) => {
          //MAIN DATA IN res.data.data
          if (res.data.statusCode === 201) {
            result(true);
          } else {
            result(false);
          }
          isLoading(false);
        })
        .catch((err) => {
          isLoading(false);
          result(false);
        });
    }
  } catch (error) {
    isLoading(false);
  }
}

async function FETCH_CHAT_THREADS(
  userId,
  accessToken,
  result,
  isLoading,
  isRefresh
) {
  !isRefresh && isLoading(true);

  try {
    axios
      .get(END_POINT.getChatHeads(userId), {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${accessToken}`,
        },
      })
      .then((res) => {
        result(res.data.data.existingRecords);
        isLoading(false);
      })
      .catch((err) => {
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
  }
}

async function FETCH_CHATS(
  userId,
  guestId,
  accessToken,
  result,
  isLoading,
  hasNxtPgn,
  setTime
) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.getChats(userId, guestId), {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${accessToken}`,
        },
      })
      .then((res) => {
        result(res.data.data.existingRecords.reverse());
        hasNxtPgn(res.data.data?.hasNextPage);
        let chatsCount = res.data.data.existingRecords.length;
        let lastChat = res.data.data.existingRecords[0];
        lastChat && setTime(lastChat?.timestamp);
        isLoading(false);
      })
      .catch((err) => {
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
  }
}

async function FETCH_MORE_CHATS(
  userId,
  guestId,
  accessToken,
  result,
  isLoading,
  hasNxtPgn,
  lastMsgTime,
  setTime
) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.getChats(userId, guestId, lastMsgTime), {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${accessToken}`,
        },
      })
      .then((res) => {
        result((prev) => [...res.data.data.existingRecords.reverse(), ...prev]);
        hasNxtPgn(res.data.data?.hasNextPage);
        let chatsCount = res.data.data.existingRecords.length;
        let lastChat = res.data.data.existingRecords[0];
        lastChat && setTime(lastChat?.timestamp);
        isLoading(false);
      })
      .catch((err) => {
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
  }
}

async function FETCH_STATES_LIST(result, showError) {
  try {
    axios
      .get(STATE_END_POINT.nigerianStates)
      .then((res) => {
        result(res.data.data);
      })
      .catch((err) => {
        showError(
          "error",
          "Error Fetching States",
          "Something went wrong, please try again"
        );
      });
  } catch (error) {
    showError(
      "error",
      "Error Fetching States",
      "Network Error. Check your internet connection and try again"
    );
  }
}

async function UPLOAD_COVER_PHOTO(file, result, showError) {
  const formData = new FormData();
  formData.append("file", file);
  console.log("file: ", file);

  try {
    axios
      .post(END_POINT.uploadSingleFile, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("cover: ", res.data);
        if (res.data.statusCode === 201) {
          result(`${res.data.data.uploadUrl}`);
        }
      })
      .catch((err) => {
        console.log("cover err: ", err.response);
        showError(
          "error",
          "Cover Photo Upload Failed",
          "Error uploading photo to server. Please select a supported file and try again"
        );
      });
  } catch (error) {
    console.log("cover net err: ", err.message);
    showError(
      "error",
      "Cover Photo Upload Failed",
      "Network Error. Check your internet connection and try again"
    );
  }
}

async function UPLOAD_PORTFOLIO_PHOTOS(files, result, showError) {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    axios
      .post(END_POINT.uploadManyFiles, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("portf: ", res.data);
        if (res.data.statusCode === 201) {
          let uploads = res.data.data;
          let urlClone = [];
          uploads.forEach((upload) => {
            urlClone.push(`${upload?.uploadUrl}`);
          });

          result(urlClone);
        }
      })
      .catch((err) => {
        console.log("portf err: ", err.response);
        showError(
          "error",
          "Service Photo Upload Failed",
          "Error uploading photos to server. Please select supported files and try again"
        );
      });
  } catch (error) {
    console.log("portf net err: ", err.message);
    showError(
      "error",
      "Service Photo Upload Failed",
      "Network Error. Check your internet connection and try again"
    );
  }
}

async function FETCH_PLACES_LIST(
  query,
  googleApiKey,
  result,
  isLoading,
  showError
) {
  isLoading(true);
  let queryFields = "formatted_address,geometry,name";
  try {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${googleApiKey}&inputtype=textquery&language=en-US&fields=${queryFields}`
      )
      .then((res) => {
        result(res.data.predictions);
        isLoading(false);
      })
      .catch((err) => {
        showError(
          "error",
          "Error Fetching Locations",
          "Something went wrong. Please try again"
        );
        isLoading(false);
      });
  } catch (error) {
    showError(
      "error",
      "Error Fetching Locations",
      "Network error. Check your internet connection and try again"
    );
    isLoading(false);
  }
}

async function UPDATE_LAST_SEEN(userId, accessToken) {
  try {
    axios
      .get(END_POINT.updateLastSeen(userId), {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": `${accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.statusCode === 201) {
          let updatedUser = res.data.data.data;

          StoreDataToMemory(LOCAL_STORAGE_PATH.userData, updatedUser);
        }
      })
      .catch((err) => {});
  } catch (error) {}
}

async function FETCH_PAID_ADS(isLoading, result) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.paidAds)
      .then((res) => {
        result(res.data.data.existingRecords);
        isLoading(false);
      })
      .catch((err) => {
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
  }
}

async function FETCH_SAVED_SEARCH(idList, isLoading, result) {
  isLoading(true);

  try {
    axios
      .post(END_POINT.getSavedSearch, idList, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        result(res.data.data.serviceObjects);
        isLoading(false);
      })
      .catch((err) => {
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
  }
}

async function FETCH_ARTISAN_REVIEWS(userId, isLoading, result, isRefresh) {
  if (!isRefresh) {
    isLoading(true);
  }

  try {
    axios
      .get(END_POINT.userReviews(userId))
      .then((res) => {
        result(res.data.data.existingRecords);
        isLoading(false);
      })
      .catch((err) => {
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
  }
}

async function FETCH_ARTISAN_REVIEWS_COUNT(
  userId,
  isLoading,
  ratings,
  sumTotal
) {
  isLoading(true);

  try {
    axios
      .get(END_POINT.userReviewsCount(userId))
      .then((res) => {
        if (res.data.statusCode === 201) {
          sumTotal(res.data.data?.totalRatings);
          ratings(res.data.data.ratingCounts);
        }
        isLoading(false);
      })
      .catch((err) => {
        isLoading(false);
      });
  } catch (error) {
    isLoading(false);
  }
}

export {
  FETCH_SERVICES,
  FETCH_ARTISAN_SERVICES,
  FETCH_USER_CERTIFICATES,
  FETCH_USER_EDUCATIONS,
  FETCH_SERVICE_DATA,
  FETCH_SERVICE_USER,
  FETCH_SERVICE_ARTISAN,
  CHECK_SERVICE_IS_FAVOURITE,
  MAKE_SERVICE_FAVOURITE,
  FETCH_USER_FAVOURITES,
  FETCH_CHAT_THREADS,
  FETCH_CHATS,
  FETCH_MORE_CHATS,
  FETCH_STATES_LIST,
  FETCH_PLACES_LIST,
  UPLOAD_COVER_PHOTO,
  UPLOAD_PORTFOLIO_PHOTOS,
  UPDATE_LAST_SEEN,
  FETCH_PAID_ADS,
  FETCH_SAVED_SEARCH,
  FETCH_ARTISAN_REVIEWS,
  FETCH_ARTISAN_REVIEWS_COUNT,
};
