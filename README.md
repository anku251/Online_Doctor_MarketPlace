# Doc Health — Online Doctors Marketplace (India) 🏥

A full-stack React + FastAPI web application with WebRTC video calling for online medical consultations. Browse doctors, book appointments, and conduct secure video calls with real-time signaling.

---

## 🌐 Live Deployment

| Platform | URL | Status |
|----------|-----|--------|
| **Frontend** | [https://online-doctor-market-place-mbzv.vercel.app](https://online-doctor-market-place-mbzv.vercel.app) | ✅ Live |
| **Backend** | [https://doc-health-api.onrender.com](https://doc-health-api.onrender.com) | ✅ Live |
| **API Docs** | [https://doc-health-api.onrender.com/docs](https://doc-health-api.onrender.com/docs) | ✅ Available |

---

## 📚 Stack

**Frontend:**
- React 18.3 with Vite 5 (fast bundler)
- React Router v6 (navigation)
- Modern JavaScript (ES modules)

**Backend:**
- Python FastAPI (async web framework)
- Uvicorn (ASGI server)
- WebSocket signaling (real-time communication)

**Video:**
- WebRTC (peer-to-peer media)
- STUN server (NAT traversal)
- Browser-native APIs

---

## 🚀 Features

- ✅ **Doctor Directory** — Browse doctors with specialty, location, fees, and ratings
- ✅ **Book Appointments** — Schedule consultations with automatic room generation
- ✅ **Video Calls** — WebRTC-based peer-to-peer HD video calling
- ✅ **Real-time Signaling** — WebSocket-powered SDP/ICE candidate exchange
- ✅ **Responsive Design** — Works on desktop and mobile browsers
- ✅ **In-memory Storage** — Perfect for demos and prototyping

---

## 📖 Quickstart (Local Development)

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Backend Setup (Terminal 1)

```bash
cd server
python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend will run at: `http://localhost:8000`  
API docs available at: `http://localhost:8000/docs`

### Frontend Setup (Terminal 2)

```bash
cd client
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`

### Test the App
1. Open http://localhost:5173
2. Browse the doctor list
3. Click "Book" to create an appointment
4. Open the appointment link in another browser/incognito window
5. Start a video call (grant camera/microphone permissions)

---

## 📁 Project Structure

```
Online_Doctor_MarketPlace/
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx           # Main component
│   │   ├── main.jsx          # Entry point
│   │   ├── api.js            # API client (configurable endpoint)
│   │   ├── styles.css        # Global styles
│   │   └── pages/
│   │       ├── Doctors.jsx   # Doctor list view
│   │       ├── Book.jsx      # Booking page
│   │       ├── Appointments.jsx # User appointments
│   │       └── VideoCall.jsx # WebRTC video interface
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .npmrc                 # npm config
│   ├── .vercelignore         # Vercel ignore rules
│   └── .env.example          # Environment template
│
├── server/                    # Python FastAPI Backend
│   ├── main.py               # FastAPI app + WebSocket signaling
│   ├── requirements.txt       # Python dependencies
│   ├── Procfile              # Heroku/Render config
│   ├── runtime.txt           # Python version
│   └── render.yaml           # Render Blueprint config
│
├── README.md
└── .gitignore
```

---

## 🔧 Configuration

### Environment Variables

**Frontend** (`client/.env` or Vercel):
```env
VITE_API_URL=http://localhost:8000  # Local
# VITE_API_URL=https://your-backend.onrender.com  # Production
```

**Backend** — Uses port from environment variable `PORT` (set automatically by Render/Heroku)

---

## 🌍 Deployment

### Frontend on Vercel ✅

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import repository: `anku251/Online_Doctor_MarketPlace`
3. **Root Directory:** `./client`
4. **Framework:** Vite (auto-detected)
5. Deploy!

**Live URL:** https://online-doctor-marketplace-six.vercel.app

### Backend on Render (Recommended)

1. Go to [render.com](https://render.com)
2. Create new **Web Service** (or use Blueprint)
3. Select repository: `anku251/Online_Doctor_MarketPlace`
4. **Root Directory:** `server`
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy!

**Free tier includes 750 hours/month**

#### After Backend Deployment

1. Copy your backend URL (e.g., `https://doc-health-api.onrender.com`)
2. Go to Vercel → Project Settings → Environment Variables
3. Add/Update: `VITE_API_URL=https://doc-health-api.onrender.com`
4. Redeploy

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/doctors` | List all doctors |
| `POST` | `/appointments` | Create appointment |
| `GET` | `/appointments?patientName=X` | List appointments |
| `WebSocket` | `/ws/{room_id}` | WebRTC signaling |

---

## 💡 How It Works

### Doctor Browsing
1. Frontend fetches doctor list from `/doctors` endpoint
2. Displays with name, specialty, location, fee, rating

### Booking Appointment
1. User fills booking form
2. POST to `/appointments` → Backend generates `appointmentId` and `roomId`
3. User receives shareable video call link
4. Link contains room ID for WebRTC connection

### Video Calling (WebRTC)
1. Caller opens video call link → connects to WebSocket
2. Callee opens same link → joins WebSocket room
3. Browser's WebRTC API negotiates P2P connection
4. SDP offers/answers and ICE candidates exchanged via WebSocket
5. Direct peer-to-peer audio/video stream established
6. No video data passes through server (efficient!)

---

## ⚙️ Technical Details

- **CORS:** Configured for local dev and deployed URLs
- **In-Memory Storage:** Appointments reset on server restart (perfect for demo)
- **WebSocket Rooms:** Automatic cleanup on disconnect
- **STUN Server:** Google's public server for NAT traversal
- **Frontend Caching:** Vite caches build assets for fast load times

---

## 📋 Notes

- **Demo Data:** Doctors list is hardcoded for simplicity (can be replaced with database)
- **Storage:** Currently in-memory (add PostgreSQL for production)
- **Authentication:** Currently unauthenticated (add JWT for security)
- **Mobile:** Fully responsive design works on all devices
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🐛 Troubleshooting

### "Loading specialist roster..." forever
→ Backend API URL not set correctly. Check `VITE_API_URL` environment variable.

### Video call fails
→ Check browser permissions for camera/microphone  
→ Ensure both users have good internet connection  
→ Try different browser if one fails

### WebSocket connection error
→ Backend not running or wrong API URL  
→ CORS not properly configured

---

## 📞 Support & Contributions

- **Issues?** Check GitHub Issues
- **Want to contribute?** Submit a Pull Request
- **Feature requests?** Open a Discussion

---

## 📄 License

MIT License — Feel free to use this project for learning and commercial purposes!

---

**Built with ❤️ by Anku | 2026**
