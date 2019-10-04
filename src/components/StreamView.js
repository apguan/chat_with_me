import React, { Component } from "react";

import { Sockets } from "./SocketConfigs";
import { peer } from "./PeerConfigs";

import VideoFrame from "./VideoFrame";

import { Main, Participants } from "./Containers";

const socket = Sockets(window.location.pathname);

class StreamView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myId: "",
      pool: [],
      streams: []
    };
  }

  componentDidMount = () => {
    peer.on("open", id => {
      this.setState({
        myId: id
      });
    });

    socket.on("sync", participants => {
      const pool = participants.filter(data => data !== this.state.myId);
      this.setState({
        pool
      });
    });

    peer.on("call", async call => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      call.answer(stream);

      call.on("stream", remoteStream => {
        const { streams } = this.state;
        console.log("THIS IS THE REMOTE:", remoteStream);
        const newStreams = streams.concat(remoteStream);
        console.log(remoteStream);
        this.setState({
          streams: newStreams
        });
      });
    });
  };

  componentWillUnmount = () => {
    socket.emit("disconnect", { id: this.state.myId });
    socket.off("sync");
  };

  connect = () => {
    socket.emit("new participant", { id: this.state.myId });

    this.state.pool.map(async user => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: { minAspectRatio: 1.333, maxAspectRatio: 1.334 },
          optional: [
            { minFrameRate: 30 },
            { maxFrameRate: 60 },
            { maxWidth: 1280 },
            { maxHeigth: 720 }
          ]
        }
      });

      console.log(stream.id);

      peer.call(user, stream);
    });
  };

  disconnect = () => {
    socket.emit("disconnect", { id: this.state.myId });
  };

  render = () => {
    const { streams } = this.state;
    return (
      <div>
        <Main>
          <Participants>
            {streams.map(stream => {
              return <VideoFrame src={stream} height="120px" width="150px" />;
            })}
          </Participants>
        </Main>
        <button onClick={this.connect}>Connect</button>
        <button onClick={this.disconnect}>Hang Up</button>
      </div>
    );
  };
}

export default StreamView;
