import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = (): Socket => {
  if (socket) {
    return socket;
  }
  const url =
    (typeof window !== "undefined" ? window.location.origin : null) ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  socket = io(url, {
    autoConnect: false,
  });
  return socket;
};
