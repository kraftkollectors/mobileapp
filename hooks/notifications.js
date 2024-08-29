import React from "react";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { END_POINT } from "./endpoints";

//CONFIGURE NOTIFICATION
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

//NOTIFICATION FUNCTION
const generateNotification = async (sender, msg, path) => {
  //show the notification to the user
  Notifications.scheduleNotificationAsync({
    //set the content of the notification
    content: {
      title: `New Message - ${sender}`,
      body: `${msg}`,
      data: { url: `${path}` },
    },
    trigger: null,
  });
};

export async function PROCESS_NEW_MESSAGE_NOTICE(userId, msgData) {
  var senderId = msgData?.senderId;
  var newMsg = msgData?.message;

  //FETCH SENDER NAME
  try {
    axios
      .get(END_POINT.getUser(senderId))
      .then((res) => {
        //MAIN DATA IN res.data.data.userDetails
        if (res.data.statusCode === 201) {
          let senderData = res.data.data.userDetails;

          var senderName = `${senderData?.firstName} ${senderData?.lastName}`;

          var targetUrl = `/main/messages/chat?userId=${userId}&guestId=${senderData?._id}&fname=${senderData?.firstName}&lname=${senderData?.lastName}&thumbnail=${senderData?.image}`;

          //GENERATE SYSTEM NOTIFICATION
          generateNotification(senderName, newMsg, targetUrl);
        }
      })
      .catch((err) => {
        console.log("Error: ", err);
      });
  } catch (error) {
    console.log("Net Error: ", error);
  }
}
