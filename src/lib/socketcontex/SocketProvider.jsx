import { createContext, useContext } from "react";
import io from  'socket.io-client'
export const SocketContext = createContext(null)

export const useSocket = ()=>{
    return useContext(SocketContext)
}

 const SocketProvider = ({children})=>{
  const socket =io('https://new-socket-server-render.onrender.com')
  return <SocketContext.Provider value={socket}>
     {children}
  </SocketContext.Provider>
}

export default SocketProvider