import http from 'http';
import express from 'express';
import { Server } from 'socket.io';

type PeerId = string;

interface Room {
  id: string;
  a: PeerId;
  b: PeerId;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// In-memory waiting queue and rooms
const waitingQueue: PeerId[] = [];
const peerToRoom = new Map<PeerId, string>();
const rooms = new Map<string, Room>();

function pairIfPossible() {
  while (waitingQueue.length >= 2) {
    const a = waitingQueue.shift()!;
    const b = waitingQueue.shift()!;
    const id = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const room: Room = { id, a, b };
    rooms.set(id, room);
    peerToRoom.set(a, id);
    peerToRoom.set(b, id);
    io.to(a).emit('matched', { roomId: id, role: 'caller' });
    io.to(b).emit('matched', { roomId: id, role: 'callee' });
  }
}

io.on('connection', (socket) => {
  const peerId = socket.id;
  socket.join(peerId);

  socket.on('findMatch', () => {
    if (peerToRoom.has(peerId)) return;
    // Avoid duplicates
    if (!waitingQueue.includes(peerId)) waitingQueue.push(peerId);
    pairIfPossible();
  });

  socket.on('cancelFind', () => {
    const idx = waitingQueue.indexOf(peerId);
    if (idx >= 0) waitingQueue.splice(idx, 1);
  });

  socket.on('signal', (payload: { roomId: string; to: PeerId; data: any }) => {
    const { roomId, to, data } = payload;
    const room = rooms.get(roomId);
    if (!room) return;
    // Relay signaling data to the other peer
    io.to(to).emit('signal', { from: peerId, data, roomId });
  });

  socket.on('leave', () => {
    const roomId = peerToRoom.get(peerId);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    const other = room.a === peerId ? room.b : room.a;
    io.to(other).emit('peerLeft');
    rooms.delete(roomId);
    peerToRoom.delete(peerId);
    peerToRoom.delete(other);
  });

  socket.on('disconnect', () => {
    const idx = waitingQueue.indexOf(peerId);
    if (idx >= 0) waitingQueue.splice(idx, 1);
    const roomId = peerToRoom.get(peerId);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    const other = room.a === peerId ? room.b : room.a;
    io.to(other).emit('peerLeft');
    rooms.delete(roomId);
    peerToRoom.delete(peerId);
    peerToRoom.delete(other);
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
server.listen(PORT, () => {
  console.log(`Signaling server running on :${PORT}`);
});


