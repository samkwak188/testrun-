const http = require('http');
const path = require('path');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
app.use(express.static(path.resolve(__dirname, '../web')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// In-memory waiting queue and rooms
const waitingQueue = [];
const peerToRoom = new Map();
const rooms = new Map();

function pairIfPossible() {
  while (waitingQueue.length >= 2) {
    const a = waitingQueue.shift();
    const b = waitingQueue.shift();
    const id = `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const room = { id, a, b };
    rooms.set(id, room);
    peerToRoom.set(a, id);
    peerToRoom.set(b, id);
    console.log(`[PAIR] Matched ${a} (caller) with ${b} (callee) in room ${id}`);
    io.to(a).emit('matched', { roomId: id, role: 'caller', peerId: b });
    io.to(b).emit('matched', { roomId: id, role: 'callee', peerId: a });
  }
}

io.on('connection', (socket) => {
  const peerId = socket.id;
  socket.join(peerId);
  console.log(`[CONNECT] ${peerId} connected. Online: ${io.sockets.sockets.size}`);

  socket.on('findMatch', () => {
    if (peerToRoom.has(peerId)) {
      console.log(`[MATCH] ${peerId} already in a room`);
      return;
    }
    if (!waitingQueue.includes(peerId)) {
      waitingQueue.push(peerId);
      console.log(`[QUEUE] ${peerId} joined queue. Queue size: ${waitingQueue.length}`);
    }
    pairIfPossible();
  });

  socket.on('cancelFind', () => {
    const idx = waitingQueue.indexOf(peerId);
    if (idx >= 0) {
      waitingQueue.splice(idx, 1);
      console.log(`[QUEUE] ${peerId} left queue. Queue size: ${waitingQueue.length}`);
    }
  });

  socket.on('signal', (payload) => {
    const { roomId, to, data } = payload || {};
    const room = rooms.get(roomId);
    if (!room) {
      console.log(`[SIGNAL] Invalid room ${roomId}`);
      return;
    }
    io.to(to).emit('signal', { from: peerId, data, roomId });
    console.log(`[SIGNAL] ${data.type || 'ICE'} from ${peerId} to ${to}`);
  });

  socket.on('chatMessage', (payload) => {
    const { roomId, to, message } = payload || {};
    const room = rooms.get(roomId);
    if (!room) {
      console.log(`[CHAT] Invalid room ${roomId}`);
      return;
    }
    io.to(to).emit('chatMessage', { from: peerId, message });
    console.log(`[CHAT] Message from ${peerId} to ${to}: "${message}"`);
  });

  socket.on('leave', () => {
    const roomId = peerToRoom.get(peerId);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    const other = room.a === peerId ? room.b : room.a;
    io.to(other).emit('peerLeft');
    console.log(`[LEAVE] ${peerId} left room ${roomId}`);
    rooms.delete(roomId);
    peerToRoom.delete(peerId);
    peerToRoom.delete(other);
  });

  socket.on('disconnect', () => {
    console.log(`[DISCONNECT] ${peerId} disconnected. Online: ${io.sockets.sockets.size}`);
    const idx = waitingQueue.indexOf(peerId);
    if (idx >= 0) {
      waitingQueue.splice(idx, 1);
      console.log(`[QUEUE] ${peerId} removed from queue on disconnect`);
    }
    const roomId = peerToRoom.get(peerId);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    const other = room.a === peerId ? room.b : room.a;
    io.to(other).emit('peerLeft');
    console.log(`[DISCONNECT] Notifying ${other} that ${peerId} left`);
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
  console.log(`Signaling server running on http://localhost:${PORT}`);
});


