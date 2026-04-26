import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import {
  Video, Users, Plus, LogIn, Phone, RefreshCw, Copy, Check,
  UserPlus, X, Search, Shield, Lock,
} from 'lucide-react';
import { Button } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../lib/uiStore';
import toast from 'react-hot-toast';

interface RoomInfo {
  id: string;
  name: string;
  participantCount: number;
  isGroupCall: boolean;
  createdBy: string;
  createdByName: string;
  allowedCount: number;
  createdAt: string;
}

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function VideoCallsLobby() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useUIStore();
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [roomName, setRoomName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [isGroupCall, setIsGroupCall] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User invite state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const wsUrl = window.location.origin;
    const sock = io(wsUrl, {
      path: '/video-socket',
      transports: ['websocket', 'polling'],
      auth: { token },
    });
    socketRef.current = sock;

    sock.on('authenticated', () => {
      sock.emit('get-rooms');
    });

    sock.on('rooms-list', (list: RoomInfo[]) => {
      setRooms(list);
      setLoading(false);
    });

    sock.on('room-created', (data: { roomId: string; roomName: string }) => {
      navigate(`/video-call/${data.roomId}?name=${encodeURIComponent(data.roomName)}`);
    });

    sock.on('users-search-result', (users: UserInfo[]) => {
      setSearchResults(users);
      setIsSearching(false);
    });

    sock.on('error', (data: { message: string }) => {
      toast.error(data.message);
    });

    const interval = setInterval(() => {
      sock.emit('get-rooms');
    }, 5000);

    return () => {
      clearInterval(interval);
      sock.disconnect();
    };
  }, [navigate]);

  const handleSearchUsers = useCallback((query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('search-users', { query: query.trim() });
    }, 300);
  }, []);

  const addUser = (u: UserInfo) => {
    if (!selectedUsers.find(s => s.id === u.id)) {
      setSelectedUsers(prev => [...prev, u]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeUser = (id: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== id));
  };

  const createRoom = () => {
    if (!roomName.trim()) {
      toast.error('Enter a room name');
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error('Add at least one participant');
      return;
    }
    socketRef.current?.emit('create-room', {
      roomName: roomName.trim(),
      isGroupCall,
      allowedUserIds: selectedUsers.map(u => u.id),
    });
  };

  const joinRoom = (id?: string) => {
    const rid = id || joinRoomId.trim();
    if (!rid) {
      toast.error('Enter a room ID');
      return;
    }
    const room = rooms.find(r => r.id === rid);
    const name = room?.name || 'Video Call';
    navigate(`/video-call/${rid}?name=${encodeURIComponent(name)}`);
  };

  const refreshRooms = () => {
    setLoading(true);
    socketRef.current?.emit('get-rooms');
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success('Room ID copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const roleColor: Record<string, string> = {
    ADMIN: 'var(--danger)', TEACHER: 'var(--warning)', STUDENT: 'var(--primary)',
  };

  // Filter out already-selected users from search results
  const filteredResults = searchResults.filter(u => !selectedUsers.find(s => s.id === u.id));

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: '1.75rem', fontWeight: 800,
          fontFamily: 'var(--font-display)', color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          <Video size={28} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--primary)' }} />
          {t.nav.videoCalls}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={14} style={{ color: 'var(--success)' }} />
          Secure video calls — only invited participants can join
        </p>
      </div>

      {/* Create & Join section */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20,
        marginBottom: 32,
      }}>
        {/* Create Room */}
        <div style={{
          padding: 24, borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Plus size={18} style={{ color: 'var(--primary)' }} />
            Create New Room
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="Room name (e.g. Math Lecture)"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '0.875rem',
                fontFamily: 'var(--font-body)', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />

            {/* Call type toggle */}
            <div style={{
              display: 'flex', gap: 8, padding: 4,
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}>
              <button
                onClick={() => setIsGroupCall(false)}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                  border: 'none', cursor: 'pointer',
                  background: !isGroupCall ? 'var(--primary)' : 'transparent',
                  color: !isGroupCall ? 'var(--text-inverse)' : 'var(--text-muted)',
                  fontSize: '0.8125rem', fontWeight: 600,
                  fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Phone size={14} /> 1-on-1
              </button>
              <button
                onClick={() => setIsGroupCall(true)}
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                  border: 'none', cursor: 'pointer',
                  background: isGroupCall ? 'var(--primary)' : 'transparent',
                  color: isGroupCall ? 'var(--text-inverse)' : 'var(--text-muted)',
                  fontSize: '0.8125rem', fontWeight: 600,
                  fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                <Users size={14} /> Group (up to 10)
              </button>
            </div>

            {/* Invite users */}
            <div>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)',
                marginBottom: 8,
              }}>
                <UserPlus size={14} style={{ color: 'var(--accent)' }} />
                Invite Participants
              </label>

              {/* Selected users chips */}
              {selectedUsers.length > 0 && (
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8,
                }}>
                  {selectedUsers.map(u => (
                    <span key={u.id} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 8px 4px 10px', borderRadius: 20,
                      background: 'var(--primary-dim)', border: '1px solid var(--border-strong)',
                      fontSize: '0.75rem', color: 'var(--text-primary)',
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: roleColor[u.role] || 'var(--primary)',
                        flexShrink: 0,
                      }} />
                      {u.firstName} {u.lastName}
                      <button
                        onClick={() => removeUser(u.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--text-muted)', padding: '0 2px', display: 'flex',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={e => handleSearchUsers(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 14px 9px 34px', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    color: 'var(--text-primary)', fontSize: '0.8125rem',
                    fontFamily: 'var(--font-body)', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onBlur={e => {
                    // Delay to allow click on result
                    setTimeout(() => {
                      e.target.style.borderColor = 'var(--border)';
                    }, 200);
                  }}
                />

                {/* Search results dropdown */}
                {(filteredResults.length > 0 || isSearching) && searchQuery.length >= 2 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                    marginTop: 4, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
                    boxShadow: 'var(--shadow-lg)', maxHeight: 200, overflowY: 'auto',
                  }}>
                    {isSearching ? (
                      <div style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        Searching...
                      </div>
                    ) : filteredResults.map(u => (
                      <button
                        key={u.id}
                        onClick={() => addUser(u)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 14px', border: 'none', cursor: 'pointer',
                          background: 'transparent', textAlign: 'left',
                          borderBottom: '1px solid var(--border-subtle)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: `${roleColor[u.role] || 'var(--primary)'}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: roleColor[u.role] || 'var(--primary)',
                          fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                        }}>
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {u.firstName} {u.lastName}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.email}
                          </p>
                        </div>
                        <span style={{
                          fontSize: '0.6rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
                          color: roleColor[u.role] || 'var(--primary)',
                          padding: '2px 6px', borderRadius: 4,
                          background: `${roleColor[u.role] || 'var(--primary)'}15`,
                        }}>
                          {u.role}
                        </span>
                      </button>
                    ))}
                    {!isSearching && filteredResults.length === 0 && (
                      <div style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Button onClick={createRoom} leftIcon={<Video size={16} />}>
              Create Secure Room
            </Button>
          </div>
        </div>

        {/* Join Room */}
        <div style={{
          padding: 24, borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
        }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <LogIn size={18} style={{ color: 'var(--accent)' }} />
            Join by Room ID
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              placeholder="Paste room ID here..."
              value={joinRoomId}
              onChange={e => setJoinRoomId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && joinRoom()}
              style={{
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '0.875rem',
                fontFamily: 'var(--font-body)', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
            <Button onClick={() => joinRoom()} variant="secondary" leftIcon={<UserPlus size={16} />}>
              Join Room
            </Button>
          </div>

          <div style={{
            marginTop: 16, padding: 12, borderRadius: 'var(--radius-md)',
            background: 'var(--info-dim)', border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--info)', lineHeight: 1.5 }}>
              <Lock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
              You can only join rooms where you have been invited by the host. Ask the host for the Room ID.
            </p>
          </div>
        </div>
      </div>

      {/* My Rooms (rooms I have access to) */}
      <div style={{
        padding: 24, borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <Shield size={18} style={{ color: 'var(--success)' }} />
            My Rooms
            {rooms.length > 0 && (
              <span style={{
                padding: '2px 8px', borderRadius: 10,
                background: 'var(--success-dim)', color: 'var(--success)',
                fontSize: '0.75rem', fontWeight: 600,
              }}>
                {rooms.length}
              </span>
            )}
          </h3>
          <button
            onClick={refreshRooms}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: '0.8125rem', fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {rooms.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: 'var(--text-muted)',
          }}>
            <Video size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: '0.875rem', marginBottom: 4 }}>No active rooms</p>
            <p style={{ fontSize: '0.75rem' }}>Create a room or wait for an invitation</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rooms.map(room => (
              <div
                key={room.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  transition: 'all 0.2s',
                  flexWrap: 'wrap', gap: 10,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: room.isGroupCall ? 'var(--secondary-dim)' : 'var(--primary-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: room.isGroupCall ? 'var(--secondary)' : 'var(--primary)',
                  }}>
                    {room.isGroupCall ? <Users size={18} /> : <Phone size={18} />}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {room.name}
                      <Lock size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {room.participantCount} online
                      {' '}&middot;{' '}
                      {room.allowedCount + 1} invited
                      {' '}&middot;{' '}
                      {room.isGroupCall ? 'Group' : '1-on-1'}
                      {room.createdBy === user?.id ? ' · You created' : ` · by ${room.createdByName}`}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => copyId(room.id)}
                    title="Copy Room ID"
                    style={{
                      padding: '6px 8px', borderRadius: 'var(--radius-sm)',
                      background: 'transparent', border: '1px solid var(--border)',
                      color: 'var(--text-muted)', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copiedId === room.id ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => joinRoom(room.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      border: 'none', color: 'var(--text-inverse)',
                      cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600,
                      fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                      boxShadow: '0 0 12px rgba(0,212,170,0.2)',
                    }}
                  >
                    <LogIn size={14} /> Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
