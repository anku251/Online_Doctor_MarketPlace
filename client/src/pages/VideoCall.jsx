import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function VideoCall() {
  const { roomId } = useParams()
  const [status, setStatus] = useState('connecting…')
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const pcRef = useRef(null)
  const wsRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    let mounted = true
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${roomId}`)
    wsRef.current = ws

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    pcRef.current = pc

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        ws.send(JSON.stringify({ type: 'candidate', candidate: e.candidate }))
      }
    }

    pc.ontrack = (e) => {
      const [stream] = e.streams
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream
      }
    }

    async function setupMedia() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      stream.getTracks().forEach(t => pc.addTrack(t, stream))
    }

    setupMedia().catch(err => setStatus('media error: ' + err.message))

    ws.onopen = () => setStatus('connected to signaling')

    ws.onmessage = async (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.type === 'info') {
        if (msg.initiator && !startedRef.current) {
          startedRef.current = true
          await startOffer()
        } else {
          setStatus('waiting for offer…')
        }
        return
      }

      switch (msg.type) {
        case 'offer': {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          ws.send(JSON.stringify({ type: 'answer', sdp: answer }))
          setStatus('in call')
          break
        }
        case 'answer': {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          setStatus('in call')
          break
        }
        case 'candidate': {
          try {
            await pc.addIceCandidate(msg.candidate)
          } catch (e) {
            console.warn('Error adding ICE', e)
          }
          break
        }
      }
    }

    ws.onclose = () => setStatus('disconnected')

    async function startOffer() {
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      ws.send(JSON.stringify({ type: 'offer', sdp: offer }))
      setStatus('calling…')
    }

    return () => {
      mounted = false
      ws.close()
      pc.close()
    }
  }, [roomId])

  return (
    <div className="call">
      <h2>Video Call</h2>
      <div className="status">Status: {status}</div>
      <div className="videos">
        <video ref={localVideoRef} autoPlay playsInline muted className="local" />
        <video ref={remoteVideoRef} autoPlay playsInline className="remote" />
      </div>
      <p className="hint">Tip: open this page in another browser/device to start a two-way call.</p>
    </div>
  )
}
