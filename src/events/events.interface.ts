import { ObjectId } from "mongoose";
import { IItem } from "./../modules/item";
import { IUser } from "./../modules/user";
export enum EventEmitterEvents {
  USER_CREATED = "user-created",
  ITEM_CLAIMED = "item-claimed",
  ITEM_CREATED = "item-created",
  ITEM_LIKED = "item-liked",
  ITEM_COMMENTED_ON = "item-commented-on",
}

type ItemAction = {
  itemId?: string;
  userId?: string;
};

// Define a mapping from enum values to data types
export type EventDataMap = {
  [EventEmitterEvents.USER_CREATED]: IUser;
  [EventEmitterEvents.ITEM_CREATED]: ItemAction;
  [EventEmitterEvents.ITEM_CLAIMED]: ItemAction;
  [EventEmitterEvents.ITEM_LIKED]: ItemAction;
  [EventEmitterEvents.ITEM_COMMENTED_ON]: ItemAction & {
    comment: string;
    commenterId: string;
  };
};

// Define the interface that maps enum values to data types
export interface EventData<T extends EventEmitterEvents> {
  type: T;
  data: EventDataMap[T];
}
