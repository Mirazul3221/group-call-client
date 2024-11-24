import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate()
  const handleJoinRoom = () => {
    navigate(`/room/${roomId}/${userId}`)
  }
  return (
    <div className="flex justify-center items-center w-screen h-screen">
        <div>
        <h1>WebRTC Multi-User Call</h1>
      <input
        type="number"
        placeholder="user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        type="number"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom} className='bg-gray-100 px-6 py-2'>Join Room</button>
        </div>
    </div>
  );
}

export default Home