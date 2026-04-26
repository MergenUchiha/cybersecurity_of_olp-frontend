import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Users, Copy, Check, Monitor,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../lib/uiStore';
import toast from 'react-hot-toast';

interface Participant {
  socketId: string;
  userId: string;
  userName: string;
  isMuted: boolean;
  isCameraOff: boolean;
}

interface PeerConnection {
  pc: RTCPeerConnection;
  participant: Participant;
  stream?: MediaStream;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export default function VideoCallPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useUIStore();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peers, setPeers] = useState<Map<string, PeerConnection>>(new Map());
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const userName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

  // Initialize media and socket
  useEffect(() => {
    if (!roomId || !user) return;

    let mounted = true;

    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        if (!mounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Connect to signaling server with JWT auth
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast.error('Not authenticated');
          navigate('/login');
          return;
        }

        const wsUrl = window.location.origin;
        const sock = io(wsUrl, {
          path: '/video-socket',
          transports: ['websocket', 'polling'],
          auth: { token },
        });

        socketRef.current = sock;
        setSocket(sock);

        sock.on('connect', () => {
          if (!mounted) return;
          // Don't emit join-room yet — wait for server to confirm auth
        });

        sock.on('authenticated', () => {
          if (!mounted) return;
          setIsConnected(true);
          sock.emit('join-room', { roomId });
        });

        sock.on('existing-participants', (participants: Participant[]) => {
          if (!mounted) return;
          participants.forEach(p => createPeerConnection(p, true, sock, stream));
        });

        sock.on('user-joined', (participant: Participant) => {
          if (!mounted) return;
          toast.success(`${participant.userName} joined`);
          createPeerConnection(participant, false, sock, stream);
        });

        sock.on('offer', async (data: { sdp: RTCSessionDescriptionInit; fromSocketId: string }) => {
          if (!mounted) return;
          const peerConn = peersRef.current.get(data.fromSocketId);
          if (peerConn) {
            await peerConn.pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            const answer = await peerConn.pc.createAnswer();
            await peerConn.pc.setLocalDescription(answer);
            sock.emit('answer', { targetSocketId: data.fromSocketId, sdp: answer });
          }
        });

        sock.on('answer', async (data: { sdp: RTCSessionDescriptionInit; fromSocketId: string }) => {
          if (!mounted) return;
          const peerConn = peersRef.current.get(data.fromSocketId);
          if (peerConn) {
            await peerConn.pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          }
        });

        sock.on('ice-candidate', async (data: { candidate: RTCIceCandidateInit; fromSocketId: string }) => {
          if (!mounted) return;
          const peerConn = peersRef.current.get(data.fromSocketId);
          if (peerConn) {
            await peerConn.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        });

        sock.on('user-left', (data: { socketId: string; userName: string }) => {
          if (!mounted) return;
          toast(`${data.userName} left`);
          removePeer(data.socketId);
        });

        sock.on('user-toggle-mute', (data: { socketId: string; isMuted: boolean }) => {
          if (!mounted) return;
          peersRef.current.forEach((peer, key) => {
            if (key === data.socketId) {
              peer.participant.isMuted = data.isMuted;
              setPeers(new Map(peersRef.current));
            }
          });
        });

        sock.on('user-toggle-camera', (data: { socketId: string; isCameraOff: boolean }) => {
          if (!mounted) return;
          peersRef.current.forEach((peer, key) => {
            if (key === data.socketId) {
              peer.participant.isCameraOff = data.isCameraOff;
              setPeers(new Map(peersRef.current));
            }
          });
        });

        sock.on('error', (data: { message: string }) => {
          toast.error(data.message);
          // Kick user back to lobby on access/auth errors
          if (
            data.message.includes('Access denied') ||
            data.message.includes('not invited') ||
            data.message.includes('Authentication required') ||
            data.message.includes('not authenticated') ||
            data.message.includes('not active') ||
            data.message.includes('blocked') ||
            data.message.includes('Invalid or expired token') ||
            data.message.includes('Room not found')
          ) {
            cleanup();
            navigate('/video-calls');
          }
        });

        sock.on('disconnect', (reason: string) => {
          if (!mounted) return;
          setIsConnected(false);
          // If server forcefully disconnected us (auth failure)
          if (reason === 'io server disconnect') {
            toast.error('Disconnected by server — access denied');
            cleanup();
            navigate('/video-calls');
          }
        });

      } catch (err: any) {
        console.error('Failed to initialize:', err);
        toast.error('Failed to access camera/microphone');
      }
    }

    init();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [roomId, user]);

  function createPeerConnection(
    participant: Participant,
    isInitiator: boolean,
    sock: Socket,
    stream: MediaStream,
  ) {
    if (peersRef.current.has(participant.socketId)) return;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sock.emit('ice-candidate', {
          targetSocketId: participant.socketId,
          candidate: event.candidate,
        });
      }
    };

    const peerConn: PeerConnection = { pc, participant };

    pc.ontrack = (event) => {
      peerConn.stream = event.streams[0];
      peersRef.current.set(participant.socketId, { ...peerConn, stream: event.streams[0] });
      setPeers(new Map(peersRef.current));
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        removePeer(participant.socketId);
      }
    };

    peersRef.current.set(participant.socketId, peerConn);
    setPeers(new Map(peersRef.current));

    if (isInitiator) {
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          sock.emit('offer', {
            targetSocketId: participant.socketId,
            sdp: pc.localDescription,
          });
        });
    }
  }

  function removePeer(socketId: string) {
    const peer = peersRef.current.get(socketId);
    if (peer) {
      peer.pc.close();
      peersRef.current.delete(socketId);
      setPeers(new Map(peersRef.current));
    }
  }

  function cleanup() {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    peersRef.current.forEach(p => p.pc.close());
    peersRef.current.clear();
    socketRef.current?.disconnect();
  }

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        socketRef.current?.emit('toggle-mute', { roomId, isMuted: !audioTrack.enabled });
      }
    }
  }, [roomId]);

  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
        socketRef.current?.emit('toggle-camera', { roomId, isCameraOff: !videoTrack.enabled });
      }
    }
  }, [roomId]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen sharing, restore camera
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack) {
        peersRef.current.forEach(peer => {
          const sender = peer.pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(cameraTrack);
        });
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        const screenTrack = screenStream.getVideoTracks()[0];

        peersRef.current.forEach(peer => {
          const sender = peer.pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        });

        screenTrack.onended = () => {
          const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
          if (cameraTrack) {
            peersRef.current.forEach(peer => {
              const sender = peer.pc.getSenders().find(s => s.track?.kind === 'video');
              if (sender) sender.replaceTrack(cameraTrack);
            });
          }
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch {
        // User cancelled screen sharing
      }
    }
  }, [isScreenSharing]);

  const leaveCall = useCallback(() => {
    socketRef.current?.emit('leave-room', { roomId });
    cleanup();
    navigate('/video-calls');
  }, [roomId, navigate]);

  const copyRoomId = useCallback(() => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success('Room ID copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [roomId]);

  const peerArray = Array.from(peers.values());
  const totalParticipants = peerArray.length + 1;
  const gridCols = totalParticipants <= 1 ? 1 : totalParticipants <= 4 ? 2 : totalParticipants <= 9 ? 3 : 4;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#0a0a0a', display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: isConnected ? '#10b981' : '#f59e0b',
            boxShadow: isConnected ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
          }} />
          <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>
            {searchParams.get('name') || 'Video Call'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
            <Users size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {totalParticipants}
          </span>
        </div>
        <button
          onClick={copyRoomId}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', cursor: 'pointer', fontSize: '0.75rem',
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {roomId?.substring(0, 16)}...
        </button>
      </div>

      {/* Video grid */}
      <div style={{
        flex: 1, padding: 12, overflow: 'auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: 8,
        alignContent: 'center',
      }}>
        {/* Local video */}
        <div style={{
          position: 'relative', borderRadius: 12,
          background: '#1a1a2e', overflow: 'hidden',
          aspectRatio: '16/9', minHeight: 200,
          border: '2px solid rgba(0,212,170,0.3)',
        }}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: 'scaleX(-1)',
              display: isCameraOff ? 'none' : 'block',
            }}
          />
          {isCameraOff && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(0,212,170,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem', fontWeight: 700, color: '#00d4aa',
              }}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: 8, left: 8, right: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              padding: '4px 10px', borderRadius: 6,
              background: 'rgba(0,0,0,0.6)', color: '#fff',
              fontSize: '0.75rem', fontWeight: 500,
              backdropFilter: 'blur(4px)',
            }}>
              {userName} (You)
            </span>
            {isMuted && (
              <span style={{
                padding: '4px 6px', borderRadius: 6,
                background: 'rgba(244,63,94,0.8)',
              }}>
                <MicOff size={12} color="#fff" />
              </span>
            )}
          </div>
        </div>

        {/* Remote videos */}
        {peerArray.map((peer) => (
          <RemoteVideo key={peer.participant.socketId} peer={peer} />
        ))}
      </div>

      {/* Controls */}
      <div style={{
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        background: 'rgba(255,255,255,0.05)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <ControlButton
          icon={isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          active={!isMuted}
          onClick={toggleMute}
          label={isMuted ? 'Unmute' : 'Mute'}
        />
        <ControlButton
          icon={isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
          active={!isCameraOff}
          onClick={toggleCamera}
          label={isCameraOff ? 'Camera On' : 'Camera Off'}
        />
        <ControlButton
          icon={<Monitor size={20} />}
          active={isScreenSharing}
          onClick={toggleScreenShare}
          label={isScreenSharing ? 'Stop Share' : 'Share Screen'}
          color="#3b82f6"
        />
        <div style={{ width: 20 }} />
        <button
          onClick={leaveCall}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 40,
            background: '#f43f5e', border: 'none',
            color: '#fff', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#e11d48'}
          onMouseLeave={e => e.currentTarget.style.background = '#f43f5e'}
        >
          <PhoneOff size={18} /> Leave
        </button>
      </div>
    </div>
  );
}

// Remote video component
function RemoteVideo({ peer }: { peer: PeerConnection }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && peer.stream) {
      videoRef.current.srcObject = peer.stream;
    }
  }, [peer.stream]);

  return (
    <div style={{
      position: 'relative', borderRadius: 12,
      background: '#1a1a2e', overflow: 'hidden',
      aspectRatio: '16/9', minHeight: 200,
      border: '2px solid rgba(255,255,255,0.1)',
    }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          display: peer.participant.isCameraOff ? 'none' : 'block',
        }}
      />
      {peer.participant.isCameraOff && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 700, color: '#6366f1',
          }}>
            {peer.participant.userName.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 8, left: 8, right: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          padding: '4px 10px', borderRadius: 6,
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          fontSize: '0.75rem', fontWeight: 500,
          backdropFilter: 'blur(4px)',
        }}>
          {peer.participant.userName}
        </span>
        {peer.participant.isMuted && (
          <span style={{
            padding: '4px 6px', borderRadius: 6,
            background: 'rgba(244,63,94,0.8)',
          }}>
            <MicOff size={12} color="#fff" />
          </span>
        )}
      </div>
    </div>
  );
}

// Control button component
function ControlButton({ icon, active, onClick, label, color }: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        padding: '10px 16px', borderRadius: 12,
        background: active
          ? (color ? `${color}20` : 'rgba(255,255,255,0.1)')
          : 'rgba(244,63,94,0.15)',
        border: `1px solid ${active ? (color || 'rgba(255,255,255,0.2)') : 'rgba(244,63,94,0.3)'}`,
        color: active ? (color || '#fff') : '#f43f5e',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {icon}
      <span style={{ fontSize: '0.625rem', fontWeight: 500 }}>{label}</span>
    </button>
  );
}
