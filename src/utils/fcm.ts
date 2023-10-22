import admin from "firebase-admin";

import moment from "moment";
import { applicationDefault } from "firebase-admin/app";
import { FIREBASE_CONFIG } from "../config";
// import { FIREBASE_DATABASE_URL } from "../config";
// console.log({ FIREBASE_CONFIG });
const firebaseConfig = {
  // credential: applicationDefault(),
  credential: admin.credential.cert({
    ...JSON.parse(FIREBASE_CONFIG),
  }),

  // databaseURL: FIREBASE_DATABASE_URL,
};

// Initialize Firebase Admin SDK
admin.initializeApp(firebaseConfig);

class FCM {
  static sendPushNotificationToGeneral(
    title: string,
    message: string,
    resource_link?: string
  ) {
    let messageData = {
      notification: {
        title,
        body: message ?? "",
      },

      data: {
        message,
        resource_link: resource_link ?? "",
        type: "general",
        created_at: moment().format(),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },

      android: {
        notification: {
          sound: "default",
          click_action: "FLUTTER_NOTIFICATION_CLICK",
        },
      },

      topic: "general",
    };

    // console.log("::::::::::::::::::::::", message)

    admin
      .messaging()
      .send(messageData)
      .then((response) => {
        console.log("Notifications response:+++====>>> ", response);
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  }
  static sendPushNotificationToUser(
    deviceToken: string,
    title: string,
    body: string,
    imageUrl?: string,
    resource_link?: string
  ) {
    const androidNotification: any = {
      sound: "default",
      click_action: "FLUTTER_NOTIFICATION_CLICK",
    };

    if (imageUrl) androidNotification.imageUrl = imageUrl;

    let messageData = {
      notification: {
        title,
        body,
      },

      data: {
        body,
        resource_link: resource_link ?? "",
        type: "individual",
        created_at: moment().format(),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },

      android: {
        notification: androidNotification,
      },

      token: deviceToken,
    };

    admin
      .messaging()
      .send(messageData)
      .then((response) => {
        console.log("Successfully sent push notification:", response);
      })
      .catch((error) => {
        console.error("Error sending push notification:", error);
      });
  }
}

export default FCM;
