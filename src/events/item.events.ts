import { NotificationService } from "../modules/notification";
import { UserService } from "../modules/user";
import eventEmitter from "./base";
import { EventEmitterEvents } from "./events.interface";

export default function setupItemEvents() {
  console.log("Setup item events");
  eventEmitter.on(EventEmitterEvents.ITEM_CREATED, async (eventData) => {
    const { userId } = eventData;
    if (!userId) return;
    const userDeviceToken = await UserService.getUserDeviceTokens(userId ?? "");
    const title = "Item Created";
    const body = "Your item has been created!";
    NotificationService.sendPushNotification(
      title,
      body,
      userDeviceToken,
      userId,
      EventEmitterEvents.ITEM_CREATED,
      {
        item_id: eventData.itemId,
        id: eventData.itemId,
      }
    );
  });
  eventEmitter.on(EventEmitterEvents.ITEM_CLAIMED, async (eventData) => {
    const { userId } = eventData;
    if (!userId) return;
    const userDeviceToken = await UserService.getUserDeviceTokens(userId ?? "");
    const title = "Item Claimed";
    const body = "Your item has been claimed!";
    NotificationService.sendPushNotification(
      title,
      body,
      userDeviceToken,
      userId,
      EventEmitterEvents.ITEM_CLAIMED,
      {
        item_id: eventData.itemId,
        id: eventData.itemId,
      }
    );
  });

  eventEmitter.on(EventEmitterEvents.ITEM_LIKED, async (eventData) => {
    const { userId } = eventData;
    console.log("like notification");
    if (!userId) return;
    const userDeviceToken = await UserService.getUserDeviceTokens(userId ?? "");
    const title = "Your item just received a like!";
    const body = "Another like gben gben!";
    NotificationService.sendPushNotification(
      title,
      body,
      userDeviceToken,
      userId,
      EventEmitterEvents.ITEM_LIKED,
      {
        item_id: eventData.itemId,
        id: eventData.itemId,
      }
    );
  });
  eventEmitter.on(EventEmitterEvents.ITEM_COMMENTED_ON, async (eventData) => {
    const { userId } = eventData;
    if (!userId) return;
    const userDeviceToken = await UserService.getUserDeviceTokens(userId ?? "");
    const title = "Your item just got a new comment!";
    const body = "Another comment ebon!";
    NotificationService.sendPushNotification(
      title,
      body,
      userDeviceToken,
      userId,
      EventEmitterEvents.ITEM_COMMENTED_ON,
      {
        item_id: eventData.itemId,
        id: eventData.commenterId,
      }
    );
  });
}
