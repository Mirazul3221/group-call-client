export let peearConnections = {};

export const createPeearConnection = (email)=> {
    let peear = new RTCPeerConnection();
    peear.ontrack = (event) => {
      setRemote(prev=>[...prev,{email,stream:event.streams[0]}])   
    }
   peear.onicecandidate = (event) => {
      if (event.candidate) {
          socket.emit('icecandidate',{to:email,candidate:event.candidate})
      }
   }

   return peear 
}

export const handleOffer = ({offer,from})=> {
    const peear = createPeearConnection(from)
    peearConnections
}


