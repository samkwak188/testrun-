# 🎥 RandomChat - WebRTC Video Chat App

A clean, modern random video chat application built with WebRTC, Socket.IO, and vanilla JavaScript.

![UI Preview](https://img.shields.io/badge/UI-Modern_Clean_Interface-blue)
![WebRTC](https://img.shields.io/badge/WebRTC-Peer--to--Peer-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## ✨ Features

- 🎬 **HD Video & Audio** - Peer-to-peer WebRTC connections
- 🎯 **Random Matching** - Instantly connect with strangers
- 🎤 **Mute/Unmute** - Control your microphone
- 📹 **Camera Toggle** - Turn video on/off anytime
- ⏭️ **Next Stranger** - Skip to find someone new
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔇 **Audio-Only Mode** - Fallback if camera is unavailable
- 📊 **Activity Log** - See connection status in real-time

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install express socket.io
```

### 2. Start Server
```bash
npm start
```

### 3. Open in Browser
```
http://localhost:3001
```

### 4. Test Matching
Open the URL in **TWO browser tabs/windows** and click "Start" in both.

---

## 🎨 UI Design

### Clean, Modern Interface
- **Full-screen remote video** - Stranger's video fills the entire screen
- **Picture-in-picture local video** - Your video in top-right corner
- **Floating controls** - Bottom control bar with all buttons
- **Status overlays** - Clear visual feedback (searching, connecting, connected)
- **Activity log** - Real-time event logging (bottom-left)

### Controls
| Button | Function |
|--------|----------|
| 🎤 | Mute/Unmute microphone |
| 📹 | Turn camera on/off |
| 🚀 Start | Begin searching for stranger |
| ⏭️ Next | Skip to next stranger |
| ⏹️ Stop | End current chat |

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Browser A     │◄───────►│  Signaling       │◄───────►│   Browser B     │
│                 │ Socket.IO│  Server          │Socket.IO│                 │
│  WebRTC Client  │         │  (Node + Socket) │         │  WebRTC Client  │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                                                          │
        │                    WebRTC P2P Connection                 │
        └──────────────────────────────────────────────────────────┘
                         (Video/Audio Stream)
```

### Components

1. **Signaling Server** (`server/index.js`)
   - Handles user matching
   - Relays WebRTC signaling (offers, answers, ICE candidates)
   - Manages rooms and queues

2. **Web Client** (`web/index.html`)
   - WebRTC peer connection setup
   - Media stream handling
   - UI state management
   - Socket.IO event handling

---

## 🔧 How It Works

### 1. User Joins
```javascript
User clicks "Start" → Camera permission requested → Joins matching queue
```

### 2. Matching
```javascript
Server pairs 2 users → Emits "matched" event → Assigns caller/callee roles
```

### 3. WebRTC Handshake
```javascript
Caller creates offer → Sends via Socket.IO → Callee receives offer
                                             ↓
Callee creates answer ← Sends via Socket.IO ← 
```

### 4. ICE Exchange
```javascript
Both peers exchange ICE candidates → NAT traversal → Direct P2P connection
```

### 5. Connected
```javascript
Video/audio streams flow peer-to-peer (bypasses server for media)
```

---

## 📁 Project Structure

```
├── server/
│   ├── index.js          # Socket.IO signaling server
│   └── package.json      # Server dependencies
├── web/
│   └── index.html        # Single-page client app (HTML/CSS/JS)
├── DEPLOYMENT_GUIDE.md   # Production deployment steps
└── README.md             # This file
```

---

## 🛠️ Tech Stack

- **WebRTC** - Real-time video/audio communication
- **Socket.IO** - Signaling and matchmaking
- **Node.js + Express** - Server backend
- **Vanilla JavaScript** - No frameworks on frontend
- **CSS3** - Modern UI with animations

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Yes |
| Firefox | ✅ Yes |
| Safari | ✅ Yes (iOS 11+) |
| Edge | ✅ Yes |
| Opera | ✅ Yes |

---

## 📝 Configuration

### Change Server Port
```javascript
// In server/index.js
const PORT = process.env.PORT || 3001; // Change 3001 to your port
```

### Add TURN Servers
```javascript
// In web/index.html
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { 
    urls: 'turn:your-turn-server.com:3478',
    username: 'user',
    credential: 'pass'
  }
];
```

---

## 🚀 Production Deployment

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete production setup:

- ✅ HTTPS setup (required for WebRTC)
- ✅ TURN server configuration
- ✅ Database integration
- ✅ Moderation & safety features
- ✅ Scaling & load balancing

**Quick Deploy:**
```bash
cd server
railway login
railway up
```

---

## 🔒 Security & Privacy

- ✅ No video/audio recording on server
- ✅ Peer-to-peer connections (media doesn't touch server)
- ✅ No user accounts required
- ✅ Camera permission prompt before access
- ⚠️ Add report/block features before public launch

---

## 🐛 Troubleshooting

### "Can't find other users"
✅ Open the app in **2+ browser tabs/windows** to test matching

### "Camera not working"
✅ Allow camera/microphone permissions when prompted
✅ Try in a different browser
✅ Check browser console for errors

### "Peer connection fails"
✅ Add a TURN server (STUN alone doesn't work for all networks)
✅ Ensure HTTPS in production

### "Black screen on remote video"
✅ Check if the other user granted camera permissions
✅ Look at Activity Log for connection state

---

## 📊 Performance

- **Latency:** <100ms (peer-to-peer)
- **Server Load:** Minimal (only signaling, no media)
- **Bandwidth:** 1-3 Mbps per connection (varies by quality)
- **Concurrent Users:** Limited by server resources (Socket.IO can handle 10k+ with clustering)

---

## 🎯 Roadmap

- [ ] Add text chat alongside video
- [ ] Interest-based matching
- [ ] User accounts (optional)
- [ ] Screen sharing
- [ ] Group video (3+ people)
- [ ] Mobile apps (React Native)
- [ ] AI content moderation

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 💬 Support

- 📧 Email: support@yourapp.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/randomchat/issues)
- 💡 Feature Requests: Open an issue with `[Feature]` tag

---

## 🎉 Acknowledgments

- WebRTC samples and documentation
- Socket.IO team for excellent real-time library
- Open source community

---

**Built with ❤️ for connecting people worldwide**
