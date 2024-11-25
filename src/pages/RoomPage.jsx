import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../lib/socketcontex/SocketProvider";
const RoomPage = () => {
  const param = useParams();
  const localStream = useRef(null);
  const peerConnections = useRef({})
  const socket = useSocket()
  const localvid = useRef()
  const configuration = {
    iceServers: [
      // STUN server
      {
        urls: "stun:stun.l.google.com:19302", // Replace with your STUN server address
      },
      {
        urls: "stun:global.stun.twilio.com:3478", // Replace with your STUN server address
      },
      // TURN server with credentials
      {
        urls: "turn:relay1.expressturn.com:3478", // Your TURN server
        username: "efNFMA7S3AXKL4C9FV", // Your username
        credential: "qHpAu3uMlVCiUAlR", // Your password
      },
    ],
  };
  const stm = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true})
    localStream.current = stream
    localvid.current.srcObject = stream
    return await stream
  }
  useEffect(() => {
    stm()
  }, []);
  useEffect(() => {
    socket?.emit('join-room',param)
  }, [socket]);

  useEffect(() => {
    socket?.on('user-connected',handleNewUser)
    return () => {
      socket.off('user-connected',handleNewUser)
    };
  }, [socket]);

  const handleNewUser =async (data)=>{
     const peer =await createPeerConnection(data)
    await peer.createOffer().then((offer)=>{
      peer.setLocalDescription(offer)
      socket?.emit('offer',{from:param.userId, to:data,offer})
    })
     peerConnections.current[data] = peer;
  }
  const createPeerConnection =async (to) => {
    const peer = new RTCPeerConnection(configuration)
    const sss =await stm()
    sss?.getTracks().forEach((track)=>{
      peer.addTrack(track,sss)
    })
    let hasHandledTrack = false;
    peer.ontrack = (event)=>{
      if (!hasHandledTrack) {
        console.log(event);
        addRemoteVideo(event.streams[0])
        hasHandledTrack = true;
      }
    }

   peer.onicecandidate = (event)=>{
      if (event.candidate) {
          socket?.emit('ice-candidate',{candidate:event.candidate,to,from:param.userId})
      }
    }
    return await peer
  }
////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    socket?.on('offer',handleOffer)
    return () => {
      socket?.off('offer',handleOffer) 
    };
  }, [socket]);

  const handleOffer =async (data) => {
    const peer =await createPeerConnection(data.from)
    peer.setRemoteDescription(data.offer)
    peer.createAnswer().then((answer)=>{
       peer.setLocalDescription(answer)
       socket?.emit('answer',{from:param.userId, to:data.from,answer})
    })
    // peerConnections.current[data.from] = peer

  }
//////////////////////////////////////////////////////////////////////////////////////

useEffect(() => {
  socket?.on('answer',handleAnswer)
  return () => {
    socket?.off('answer',handleAnswer)
  };
}, []);
const handleAnswer = (data) => {
  const peer = peerConnections.current[data.from]
  peer.setRemoteDescription(data.answer)
}

///////////////////////////////////////////////////////
useEffect(() => {
  socket?.on('ice-candidate',async({candidate,from})=>{
     const peer = peerConnections.current[from]
    if (candidate) {
      if (peer) {
        peer.addIceCandidate(new RTCIceCandidate(candidate))
      }
    }
  })
  return () => {
    socket?.off('ice-candidate')
  };
}, [socket]);

const addRemoteVideo =(stm)=>{
  const container = document.getElementById('remoteVideos')
  const video = document.createElement('video');
  video.srcObject = stm;
  video.autoplay = true
  console.log(stm)//
  container.appendChild(video)
}
 const dog = () => {
  console.log(peerConnections.current)
 }
  return (
    <div className="bg-gray-100 w-screen h-screen relative">
      <div onClick={dog} className="gs">click</div>
      <video className="rounded-lg w-3/12 absolute right-4 bottom-4" ref={localvid} autoPlay muted playsInline id="localVideo"/>

      <div id="remoteVideos flex justify-center items-center"></div>
    </div>
  );
};

export default RoomPage;
