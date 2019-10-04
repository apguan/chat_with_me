import Peer from "peerjs";

export const peer = new Peer({
  secure: window.location.protocol === "https:" ? true : false,
  host: window.location.hostname,
  path: "/peerjs",
  port:
    window.location.hostname === "localhost"
      ? 9000
      : window.location.protocol === "https:"
      ? 443
      : 80,
  debug: 3,
  config: {
    iceServers: [
      { url: "stun:stun1.l.google.com:19302" },
      {
        url: "turn:192.158.29.39:3478?transport=tcp",
        credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
        username: "28224511:1379330808"
      }
    ]
  }
});
