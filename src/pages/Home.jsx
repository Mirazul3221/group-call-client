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
    <div className="flex justify-center items-center w-screen h-screen bg-gray-100">
        <div className='md:w-1/3 flex flex-col gap-2 bg-white px-6 py-4 rounded-md border'>
        <h1 className='mb-2 text-lg text-center font-bold text-gray-700'>Group Video Call</h1>
      <input
      className='outline-none px-4 py-2 border rounded-lg'
        type="text"
        placeholder="user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <input
        className='outline-none px-4 py-2 border rounded-lg'
        type="number"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom} className='bg-gray-100 px-6 rounded-lg py-2'>Join Room</button>
        </div>
    </div>
  );
}

export default Home