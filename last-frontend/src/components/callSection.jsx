import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { FiPhoneCall, FiVideo } from "react-icons/fi";

export default function CallSection({ selectedUser, currentUser }) {
  const userId = selectedUser?.id || selectedUser?.userId;

  const [incomingCall, setIncomingCall] = useState(null);
  const [callType, setCallType] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [callLogId, setCallLogId] = useState(null);

  const pendingCandidates = useRef([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const peerConnection = useRef(null);

  const stopExistingStream = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => { track.stop(); });
      localStream.current = null;
    }
  };

  const startMedia = async (video = true) => {
    try {
      stopExistingStream();

      const stream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: true,
      });

      localStream.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;

        try {
          await localVideoRef.current.play();
        } catch (err) {
          console.log("Local video play error:", err);
        }
      }

      return stream;
    } catch (err) {
      console.log("Main media failed:", err);

      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });

        localStream.current = fallbackStream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = fallbackStream;

          try {
            await localVideoRef.current.play();
          } catch (err) {
            console.log("Local video play error:", err);
          }
        }

        return fallbackStream;
      } catch (fallbackErr) {
        console.log("Fallback media failed:", fallbackErr);
        return null;
      }
    }
  };

  const createPeerConnection = (receiverId) => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302", },], });

    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => { pc.addTrack(track, localStream.current); });
    }

    pc.ontrack = async (event) => {
      const stream = event.streams[0]

      if (remoteVideoRef.current && stream) {
        remoteVideoRef.current.srcObject = stream;

        try {
          await remoteVideoRef.current.play();
        } catch (err) {
          console.log("Remote video play error:", err);
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) { socket.emit("ice-candidate", { receiverId, candidate: event.candidate, }); }
    };

    peerConnection.current = pc;
    return pc;
  };

  const startCall = async (type) => {
    try {
      setCallType(type);

      await startMedia(type === "video");
      const pc = createPeerConnection(userId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("call-user", { receiverId: userId, callerId: currentUser.id, appointmentId: selectedUser.appointmentId, offer, callType: type, });

      setIsInCall(true);
    } catch (err) {
      console.log("Start call error:", err);
    }
  };

  const acceptCall = async () => {
    try {
      if (!incomingCall) return;

      console.log(incomingCall);

      await startMedia(incomingCall.callType === "video");

      const pc = createPeerConnection(incomingCall.callerId);

      await pc.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      while (pendingCandidates.current.length > 0) {
        const candidate = pendingCandidates.current.shift();

        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.log("Pending ICE error:", err);
        }
      }

      console.log(pc);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer-call", {
        receiverId: incomingCall.callerId,
        answer,
        callLogId: incomingCall.callLogId,
      });

      setCallLogId(incomingCall.callLogId);
      setCallType(incomingCall.callType);
      setIsInCall(true);
      setIncomingCall(null);
    } catch (err) {
      console.log("Accept call error:", err);
    }
  };

  const rejectCall = () => {
    if (!incomingCall) return;

    socket.emit("reject-call", { receiverId: incomingCall.callerId, callLogId: incomingCall.callLogId, });
    setIncomingCall(null);
  };

  const cleanupCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    stopExistingStream();

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    pendingCandidates.current = [];
    setIsInCall(false);
    setIncomingCall(null);
    setCallLogId(null);
  };

  const endCall = () => {
    socket.emit("end-call", { receiverId: userId, callLogId, });
    cleanupCall();
  };

  useEffect(() => {
    socket.on("incoming-call", ({ callerId, offer, callType, callLogId }) => {
      setIncomingCall({ callerId, offer, callType, callLogId, });
    });

    socket.on("call-accepted", async ({ answer, callLogId }) => {
      try {
        setCallLogId(callLogId);

        if (!peerConnection.current) return;
        const pc = peerConnection.current;

        await pc.setRemoteDescription(new RTCSessionDescription(answer));

        while (pendingCandidates.current.length > 0) {
          const candidate = pendingCandidates.current.shift();

          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.log("Pending ICE error:", err);
          }
        }
      } catch (err) {
        console.log("Call accepted error:", err);
      }
    });

    socket.on("call-rejected", () => {
      alert("Call rejected");
      cleanupCall();
    });

    socket.on("call-ended", () => { cleanupCall(); });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        if (!candidate || !peerConnection.current) return;

        if (
          peerConnection.current.remoteDescription &&
          peerConnection.current.remoteDescription.type
        ) {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } else {
          pendingCandidates.current.push(candidate);
        }
      } catch (err) {
        console.log("ICE candidate error:", err);
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-rejected");
      socket.off("call-ended");
      socket.off("ice-candidate");
    };
  }, [userId]);

  return (
    <>
      {incomingCall && (
        <div className="fixed shadow-xl border border-black/10 rounded-xl bg-white top-10 right-10 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-2">Incoming {incomingCall?.callType} call</h2>

            <div className="flex gap-3 justify-center mt-4">
              <button onClick={acceptCall} className="bg-green-500 text-white px-4 py-2 rounded-xl">Accept</button>
              <button onClick={rejectCall} className="bg-red-500 text-white px-4 py-2 rounded-xl">Reject</button>
            </div>
          </div>
        </div>
      )}

      {isInCall && (
        <div className="fixed left-0 top-0 h-screen w-full bg-black z-50 flex flex-col items-center justify-center gap-4 p-4">
          <video ref={remoteVideoRef} autoPlay playsInline controls={false} muted={false} className="w-full max-w-4xl h-[75vh] bg-black rounded-2xl object-cover" />
          <video ref={localVideoRef} autoPlay muted playsInline controls={false} className="absolute bottom-24 right-4 w-44 h-32 rounded-xl border border-white object-cover bg-black" />
          <button onClick={endCall} className="bg-red-500 text-white px-6 py-3 rounded-full">End Call</button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button onClick={() => startCall("voice")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200">
          <FiPhoneCall size={18} />
        </button>

        <button onClick={() => startCall("video")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all duration-200">
          <FiVideo size={18} />
        </button>
      </div>
    </>
  );
}