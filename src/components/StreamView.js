import React, { Component } from "react";

import { Sockets } from "./SocketConfigs";
import { peer } from "./PeerConfigs";

import VideoFrame from "./VideoFrame";

import { Main, Participants, ButtonsContainer } from "./Containers";

const socket = Sockets(window.location.pathname);

class StreamView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myId: "",
      pool: {},
      streams: {},
      primaryStream: null,
      secondaryStreams: []
    };
  }

  componentDidMount = () => {
    peer.on("open", id => {
      this.setState({
        myId: id
      });
    });

    socket.on("sync", participants => {
      const pool = participants.reduce((acc, val) => {
        if (val !== this.state.myId) {
          acc[val] = true;
        }

        return acc;
      }, {});
      const poolArr = Object.keys(pool);

      this.setState(
        {
          pool: poolArr
        },
        async () => {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: {
              optional: [
                { minFrameRate: 30 },
                { maxFrameRate: 60 },
                { maxWidth: 1280 },
                { maxHeigth: 720 }
              ]
            }
          });

          poolArr.map(async user => {
            peer.call(user, stream);
          });

          peer.on("call", async call => {
            call.answer(stream);
            call.on("stream", remoteStream => {
              const { streams } = this.state;
              const newStreams = {
                ...streams,
                [remoteStream.id]: remoteStream
              };
              const arr = Object.values(newStreams);
              this.setState({
                streams: newStreams,
                primaryStream: arr[0],
                secondaryStreams: arr.slice(1)
              });
            });
          });
        }
      );
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
          optional: [
            { minFrameRate: 30 },
            { maxFrameRate: 60 },
            { maxWidth: 1280 },
            { maxHeigth: 720 }
          ]
        }
      });
      peer.call(user, stream);
    });
  };

  disconnect = () => {
    socket.emit("disconnect", { id: this.state.myId });
  };

  render = () => {
    const { primaryStream, secondaryStreams } = this.state;

    return (
      <div>
        <Main>
          <VideoFrame
            src={primaryStream}
            height={window.screen.height * 0.7}
            width={window.screen.width * 0.8}
          />
          <Participants>
            {secondaryStreams.map(stream => {
              return (
                <VideoFrame
                  src={stream}
                  height={window.screen.height * 0.3}
                  width={window.screen.width * 0.2}
                />
              );
            })}
          </Participants>
          <ButtonsContainer>
            <button onClick={this.connect}>Connect</button>
            <button onClick={this.disconnect}>Hang Up</button>
          </ButtonsContainer>
        </Main>
      </div>
    );
  };
}

export default StreamView;
