import { EventEmitterEvents } from "./events.interface";
import EventEmitter from "./base";
import setupItemEvents from "./item.events";

function setupEvents() {
  setupItemEvents();
}
export { setupEvents, EventEmitter, EventEmitterEvents };
