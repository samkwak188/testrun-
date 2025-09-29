# ⚡ Quick Start Guide

## Run Locally (30 seconds)

```bash
# 1. Install dependencies
cd server
npm install express socket.io

# 2. Start server
npm start

# 3. Open browser
# Go to: http://localhost:3001

# 4. Test matching
# Open http://localhost:3001 in TWO tabs
# Click "Start" in both tabs
```

---

## What You'll See

### 🎨 UI Layout
```
┌──────────────────────────────────────────────┐
│  🎥 RandomChat              🟢 Online        │
├──────────────────────────────────────────────┤
│                                              │
│        [ Stranger's Video - Full Screen ]    │
│                                              │
│                          ┌─────────┐         │
│                          │  Your   │         │
│                          │  Video  │         │
│                          └─────────┘         │
│                                              │
│  📋 Activity Log                             │
│  [12:34] Connected to server                 │
│  [12:35] Searching...                        │
│                                              │
│    🎤  📹  [🚀 Start]  ⏭️  ⏹️               │
└──────────────────────────────────────────────┘
```

### 🎮 Controls

| Button | What it does |
|--------|--------------|
| **🚀 Start** | Find a random stranger |
| **🎤** | Mute/unmute your mic |
| **📹** | Turn camera on/off |
| **⏭️ Next** | Skip to next person |
| **⏹️ Stop** | End chat and go idle |

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] Browser opens to http://localhost:3001
- [ ] "Welcome to RandomChat" screen shows
- [ ] Click "Start" → camera permission prompt appears
- [ ] Allow camera → see yourself in top-right corner
- [ ] Open second tab → click "Start" in both tabs
- [ ] Both tabs show "Stranger Found!"
- [ ] Videos appear in both tabs
- [ ] Try mute button → mic icon changes to 🔇
- [ ] Try video button → camera turns off
- [ ] Try "Next" → finds another stranger
- [ ] Try "Stop" → returns to welcome screen

---

## Common Issues

### ❌ "Can't find anyone"
**Solution:** You need 2+ users. Open multiple browser tabs.

### ❌ "Camera permission denied"
**Solution:** Click the 🔒 icon in browser address bar → Allow camera/mic

### ❌ "Connection failed"
**Solution:** Both users must click "Start" within a few seconds of each other

### ❌ "Port 3001 already in use"
**Solution:**
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill

# Or change the port in server/index.js
const PORT = 3002;
```

---

## Next Steps

### 1️⃣ Make it Public
```bash
cd server
railway login
railway up
# Get URL: https://yourapp.railway.app
```

### 2️⃣ Add TURN Server (for reliability)
```javascript
// In web/index.html, line ~270
const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'turn:YOUR_TURN_SERVER' }  // Add this
];
```

### 3️⃣ Add Safety Features
- Report button
- Auto-ban after reports
- Rate limiting

See **DEPLOYMENT_GUIDE.md** for full production setup.

---

## File Overview

```
your-project/
├── server/
│   ├── index.js          ← Signaling server
│   └── package.json      ← Dependencies
├── web/
│   └── index.html        ← Complete app (HTML/CSS/JS)
├── README.md             ← Full documentation
├── DEPLOYMENT_GUIDE.md   ← Production steps
└── QUICK_START.md        ← This file
```

---

## Quick Customization

### Change App Name
```html
<!-- In web/index.html, line 6 -->
<title>YourAppName</title>

<!-- Line 289 -->
<div class="logo">🎥 YourAppName</div>
```

### Change Colors
```css
/* In web/index.html, lines 178-203 */
.btn-start {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  /* Change to your brand colors */
}
```

### Change Server Port
```javascript
// In server/index.js, line 86
const PORT = 3001; // Change to any available port
```

---

## Development Tips

### Watch Server Logs
```bash
cd server
npm start

# You'll see:
# [CONNECT] abc123 connected. Online: 1
# [QUEUE] abc123 joined queue. Queue size: 1
# [PAIR] Matched abc123 (caller) with def456 (callee)
```

### Browser Console Logs
```
Press F12 → Console tab

You'll see:
✅ Ready! Click "Start" to begin
Connected to server
Searching for stranger...
Matched with stranger (caller)
Camera and microphone enabled
```

---

## Server Status Codes

| Code | Meaning |
|------|---------|
| `[CONNECT]` | User connected |
| `[QUEUE]` | User joined matching queue |
| `[PAIR]` | Two users matched |
| `[SIGNAL]` | WebRTC signaling (offer/answer/ICE) |
| `[LEAVE]` | User left room |
| `[DISCONNECT]` | User disconnected |

---

## Architecture (Simplified)

```
User A (Browser)                User B (Browser)
      │                               │
      ├─── Socket.IO ────┐   ┌──── Socket.IO ───┤
      │                  ▼   ▼                   │
      │            [Server Pairs Them]           │
      │                  │   │                   │
      ◄──────── WebRTC P2P Video ──────────────►
             (Bypasses server)
```

---

## Resources

- 📚 WebRTC Tutorial: https://webrtc.org/getting-started/overview
- 🔌 Socket.IO Docs: https://socket.io/docs/
- 🛠️ Test TURN: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

---

**You're all set! 🎉**

Run `cd server && npm start` and open http://localhost:3001
