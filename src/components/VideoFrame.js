import React from "react";

const VideoFrame = ({ src, height, width }) => {
  return (
    <video src={src} autoPlay={true} height={height} width={width}></video>
  );
};

export default VideoFrame;
