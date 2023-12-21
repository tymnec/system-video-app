import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import "./App.css";

function App() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [callinfo, setCallinfo] = useState(null);

  const Create = () => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", async (call) => {
      // Make answer call button visible
      if (call) {
        document.getElementById("answer-call-button").style.display = "block";

        setCallinfo(call);
      }
    });
  };

  const answerCall = () => {
    var call = callinfo;
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();
      call.answer(currentUserVideoRef.current.srcObject);

      call.on("stream", function (remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  const callHandler = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      var call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };

  return (
    <div className="container border shadow rounded-2xl">
      <div className="flex gap-3 place-items-center justify-center m-5">
        <button
          className="p-3 rounded-2xl shadow hover:bg-black hover:text-white"
          onClick={() => Create()}
        >
          Create
        </button>
        <h1 className="font-bold">
          Your id is <span className="font-normal">{peerId}</span>
        </h1>

        {/* Copy Id Button */}
        <button
          onClick={() => navigator.clipboard.writeText(peerId)}
          className="mt-2 p-3 rounded-2xl shadow hover:bg-black hover:text-white"
        >
          Copy Id
        </button>
        {/* <button onClick={() => peerInstance.current.disconnect()}>Disconnect</button> */}
      </div>

      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
        className="border shadow rounded-2xl m-5 p-3"
      />
      <button
        onClick={() => callHandler(remotePeerIdValue)}
        className="mt-2 p-3 rounded-2xl shadow hover:bg-black hover:text-white"
      >
        Call
      </button>

      <button
        id="answer"
        className="mt-2 p-3 rounded-2xl shadow hover:bg-black hover:text-white"
        onClick={() => answerCall()}
        hidden
      >
        Answer
      </button>
      <div className="border rounded-3xl shadow p-3 m-3">
        <p className="font-bold">Local Video</p>
        <video ref={currentUserVideoRef} className="rounded-2xl" />
      </div>
      <div className="border rounded-3xl shadow p-3 m-3">
        <p className="font-bold">Remote Video</p>
        <video ref={remoteVideoRef} className="rounded-2xl" />
      </div>

      <div></div>
    </div>
  );
}

export default App;
