import React, { useRef, useEffect } from "react";

const VideoFrame = ({ src, height, width }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.srcObject = src;
  }, [src]);

  return (
    <video ref={videoRef} autoPlay={true} height={height} width={width}></video>
  );
};

export default VideoFrame;
