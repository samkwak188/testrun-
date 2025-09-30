# 🚀 Complete Render Deployment Guide

## Goal: Get Your Video Chat App Working Between Different Devices

By the end, you'll be able to:
- ✅ Video chat with someone on a different computer/phone
- ✅ App accessible worldwide via HTTPS URL
- ✅ Camera and microphone working on all devices

---

## Part 1: Deploy to Render (15 minutes)

### Step 1: Sign Up for Render

1. Go to: **https://render.com/register**
2. Click **"Sign up with GitHub"**
3. Authorize Render to access your repositories
4. ✅ You're now logged into Render!

---

### Step 2: Create a New Web Service

1. Click the **"New +"** button (top right corner)
2. Select **"Web Service"**
3. You'll see a list of your GitHub repositories

---

### Step 3: Connect Your Repository

1. Find **"testrun-"** in the list
2. Click **"Connect"** button next to it

**If you don't see it:**
- Click **"Configure account"**
- Make sure Render has access to your repositories
- Go back and look for "testrun-" again

---

### Step 4: Configure Your Service

Fill in these **EXACT** settings:

**Name:**
```
random-video-chat
```
(Or any name you like - this becomes part of your URL)

**Region:**
Choose the one closest to you:
- `Oregon (US West)` - for USA/Canada
- `Frankfurt` - for Europe
- `Singapore` - for Asia

**Branch:**
```
main
```

**Root Directory:**
```
server
```
⚠️ **IMPORTANT:** Must be `server` (where your Node.js app is)

**Runtime:**
```
Node
```

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

**Instance Type:**
```
Free
```

---

### Step 5: Advanced Settings (Important!)

Before clicking "Create Web Service", scroll down to **"Advanced"** and verify:

**Environment Variables:**
Render auto-sets `PORT`, so you don't need to add anything.

**Auto-Deploy:**
✅ Keep this enabled (auto-deploys when you push to GitHub)

---

### Step 6: Create the Service

1. Click **"Create Web Service"** button at the bottom
2. Render starts building your app
3. Watch the logs scroll by

**You'll see:**
```
==> Cloning from https://github.com/samkwak188/testrun-...
==> Checking out commit abc123 in branch main
==> Running build command 'npm install'...
==> Installing dependencies
==> Build successful
==> Starting server with 'npm start'
==> Server running on port 10000
==> Deploy live at https://random-video-chat.onrender.com
```

This takes **2-5 minutes**. ☕

---

### Step 7: Get Your Live URL

Once deployment succeeds (green checkmark ✅):

1. Look at the top of the page - you'll see your URL:
```
https://random-video-chat.onrender.com
```

2. Click it to open your app!

---

## Part 2: Test Your Deployed App

### Test 1: Basic Access

1. Open your Render URL: `https://random-video-chat.onrender.com`
2. **If it's sleeping:** Wait 30 seconds for the first load
3. You should see your video chat interface!

**If you see an error:**
- Click "Logs" tab in Render
- Look for errors
- Common fix: Make sure `server/package.json` has the start script

---

### Test 2: Camera/Microphone Permissions

1. Click **"Start"** button
2. Browser asks for camera/mic permission
3. Click **"Allow"**
4. ✅ You should see your video in the left panel

---

### Test 3: Matching with Another Device

**This is the main test!**

**Option A: Two Browser Tabs (Same Computer)**
1. Keep first tab open with "Start" clicked
2. Open **new incognito/private window**: Ctrl+Shift+N (Chrome) or Ctrl+Shift+P (Firefox)
3. Go to same URL: `https://random-video-chat.onrender.com`
4. Click "Start" in the new window
5. **Both should match!** You'll see:
   - Your camera in left panel
   - "Stranger's" camera in right panel (it's you!)

**Option B: Different Devices (Real Test)**
1. On your computer: Open `https://random-video-chat.onrender.com`
2. Click "Start"
3. On your phone: Open same URL
4. Click "Start"
5. **You should match!** Computer ↔ Phone video chat works!

**Option C: Share with a Friend**
1. Send your friend the URL: `https://random-video-chat.onrender.com`
2. Both of you click "Start"
3. **You match and video chat!** ✅

---

## Part 3: Troubleshooting Common Issues

### Issue 1: "Service Unavailable" or App Won't Load

**Cause:** Server sleeping or failed to start

**Fix:**
1. Go to Render Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Look for errors in the logs
5. Common errors:
   - `Cannot find module` → Missing dependencies
   - `EADDRINUSE` → Port conflict (shouldn't happen on Render)

**Solution:**
```
# In Render Dashboard → "Manual Deploy" → "Clear build cache & deploy"
```

---

### Issue 2: Camera Doesn't Work

**Cause:** No HTTPS or permissions blocked

**Fix:**
- ✅ Render provides HTTPS automatically
- Make sure you allowed camera/mic permissions
- Try in different browser (Chrome recommended)
- Check browser console (F12 → Console tab)

---

### Issue 3: Can't Find Other Users

**Cause:** Not enough people online or both users on same device

**Fix:**
1. Open URL in **2 different browser windows/tabs**
2. Click "Start" in **BOTH** within a few seconds
3. Server pairs you automatically

**Note:** On Render free tier, if server was sleeping, first user wakes it up. Second user should wait 10 seconds after first user clicks Start.

---

### Issue 4: Video Connection Fails (Black Screen)

**Cause:** WebRTC connection failed (NAT/firewall)

**Fix:** We need to add a TURN server (I'll help you with this next)

---

### Issue 5: Connection Drops Frequently

**Cause:** Only using STUN (no TURN server)

**Fix:** Add TURN server (see Part 4 below)

---

## Part 4: Add TURN Server (Better Connectivity)

Currently your app uses **STUN only** = works ~70% of the time.
With **TURN** = works ~99% of the time.

### Option A: Free TURN from Metered

1. Go to: https://www.metered.ca/tools/openrelay/
2. You'll see free TURN server URLs like:
```
stun:openrelay.metered.ca:80
turn:openrelay.metered.ca:80
turn:openrelay.metered.ca:443
```

3. I'll update your code to use these (see next section)

---

## Part 5: Code Updates for Production

Let me create the necessary updates for you.

### Update 1: Add Production TURN Servers

I need to update `web/index.html` to add TURN servers for better connectivity.

### Update 2: Handle Render's PORT Variable

Already done! Your code uses `process.env.PORT || 3001` ✅

### Update 3: Better Error Handling

I'll add better error messages for production.

---

## Part 6: Monitoring Your App

### Check Server Status

**Render Dashboard:**
1. Go to: https://dashboard.render.com
2. Click on your service: "random-video-chat"
3. See:
   - ✅ Status: Live/Sleeping
   - 📊 CPU/Memory usage
   - 📝 Recent logs
   - 🔄 Deployment history

### View Logs in Real-Time

1. In Render Dashboard → Click your service
2. Click **"Logs"** tab
3. See live server logs:
```
[CONNECT] abc123 connected. Online: 1
[QUEUE] abc123 joined queue. Queue size: 1
[PAIR] Matched abc123 (caller) with def456 (callee)
```

---

## Part 7: Keep Your App Awake (Optional)

Render free tier **sleeps after 15 minutes** of no activity.

### Option A: Use UptimeRobot (Free)

1. Sign up: https://uptimerobot.com
2. Add new monitor:
   - **Type:** HTTP(s)
   - **URL:** `https://random-video-chat.onrender.com/health`
   - **Interval:** 5 minutes
3. ✅ Keeps your app awake 24/7!

### Option B: Upgrade to Paid ($7/month)

- Never sleeps
- Better performance
- More resources

---

## Part 8: Updating Your App

When you make changes to your code:

```powershell
# 1. Make your changes in Cursor/VS Code

# 2. Commit and push to GitHub
git add .
git commit -m "Updated feature"
git push origin main

# 3. Render auto-deploys! (1-2 minutes)
```

Watch deployment in Render Dashboard → "Events" tab

---

## ✅ Deployment Checklist

After deployment, verify:

- [ ] App loads at Render URL
- [ ] HTTPS works (🔒 in browser)
- [ ] Camera permission prompt appears
- [ ] Local video shows in left panel
- [ ] Can match with another browser tab
- [ ] Can match with different device (phone/computer)
- [ ] Video and audio work both ways
- [ ] Controls work (mute, video off, next, stop)
- [ ] Activity log shows connection events

---

## 🎯 Expected Results

**After successful deployment:**

✅ **Your URL:** `https://random-video-chat.onrender.com`
✅ **HTTPS:** Automatic SSL certificate
✅ **Uptime:** 750 hours/month free (enough for testing)
✅ **Works on:** Desktop, mobile, any browser
✅ **Video chat:** Works between any 2 devices

---

## 📊 Performance Expectations

**Render Free Tier:**
- First load: ~30 seconds (if sleeping)
- Active load: Instant
- Video latency: <100ms (peer-to-peer)
- Concurrent users: ~10-50 (free tier limit)

**To scale beyond:**
- Upgrade to Render Starter: $7/month
- Handles 100+ concurrent users
- Never sleeps

---

## 🆘 Need Help?

**If something doesn't work:**

1. **Check Render Logs:**
   - Dashboard → Your service → Logs tab
   - Look for error messages

2. **Check Browser Console:**
   - Press F12 → Console tab
   - Look for red errors

3. **Common Issues:**
   - Server sleeping → Wait 30 seconds
   - Camera blocked → Allow permissions
   - Connection failed → Try different network/browser
   - Can't match → Open 2 tabs simultaneously

---

## 🎉 Success Criteria

**You know it's working when:**

1. ✅ You can open the URL from any device
2. ✅ Camera/mic permissions work
3. ✅ You can match with yourself in 2 tabs
4. ✅ You can match with a friend on different device
5. ✅ Video and audio both work smoothly
6. ✅ All controls (mute, camera, next, stop) function

---

**Next:** Once you confirm deployment works, I'll add TURN servers to improve connectivity to 99%!
