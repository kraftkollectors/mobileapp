import SOCKET_API, { SOCKET_EVENTS } from "./endpoints";
import io from "socket.io-client";

const SOCKET_URL = SOCKET_API;

class WSService {
  initializeSocket = async (isConnected) => {
    try {
      this.socket = io(SOCKET_URL, {
        transports: ["websocket"],
      });

      //console.log("Initializing socket: ", this.socket);

      this.socket.on(SOCKET_EVENTS.on.connect, (data) => {
        isConnected(true);
        //console.log("Socket connected");
      });

      this.socket.on(SOCKET_EVENTS.on.disconnect, (data) => {
        isConnected(false);
        //console.log("Socket disconnected");
      });

      this.socket.on(SOCKET_EVENTS.on.error, (data) => {
        isConnected(false);
        //console.log("Socket error: ", data);
      });
    } catch (error) {
      isConnected(false);
      //console.log("Socket is not initialized: ", error);
    }
  };

  emit(event, data) {
    this.socket.emit(event, data);
  }

  on(event, cb) {
    this.socket.on(event, cb);
  }

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const socketServices = new WSService();

export default socketServices;
