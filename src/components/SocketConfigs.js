import socketIOClient from "socket.io-client";

let connectSocket = function(room) {
  return socketIOClient(window.location.origin, {
    query: "r_var=" + room
  });
};

export const Sockets = pathName => {
  const arr = pathName.split("/");
  const roomId = arr[arr.length - 1];
  let socket = connectSocket(roomId).connect(data => {
    console.log("connected:", data);
  });

  return socket;
};
