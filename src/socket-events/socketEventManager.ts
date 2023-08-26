import { Socket } from "socket.io";
import { SocketEvents } from "./socket-events.type";

type SocketHandler = (socket: Socket) => void;

class SocketEventManager {
  private socket: Socket;
  private handlers: SocketHandler[] = [];

  constructor(socket: Socket) {
    this.socket = socket;
  }

  use(handler: SocketHandler) {
    this.handlers.push(handler);
    return this;
  }

  attachHandlers() {
    this.handlers.forEach((handler) => {
      handler(this.socket);
      console.log("Attached event handler: ", handler.name);
    });
  }

  get getEventsList() {
    return Object.values(SocketEvents);
  }
}

export default SocketEventManager;
