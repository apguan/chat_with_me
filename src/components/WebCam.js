import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WebCam = () => {
  const webcamRef = useRef(null);

  return (
    <Webcam
      audio={true}
      width={"85%"}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    />
  );
};

export default WebCam;
