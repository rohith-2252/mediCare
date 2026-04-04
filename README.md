# 🏥 MedCare — Full Stack Hospital Management App

A full-stack hospital management application with React frontend, Node/Express backend,
SQLite database, Gemini AI chatbot, and Google News integration.

---

## 📁 Project Structure

```
medcare/
├── backend/                  ← Node.js + Express API
│   ├── routes/
│   │   ├── auth.js           ← Register & Login (user/staff)
│   │   ├── patient.js        ← Patient record access
│   │   ├── admin.js          ← Staff portal, scan uploads
│   │   ├── chat.js           ← Gemini AI chatbot
│   │   └── content.js        ← Google News API
│   ├── middleware/
│   │   └── authMiddleware.js ← Cookie session verification
│   ├── db.js                 ← SQLite schema + MedID generator
│   ├── server.js             ← Express entry point
│   ├── .env.example          ← Environment variable template
│   └── package.json
│
└── frontend/                 ← React + Vite app
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── Layout/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Header.jsx
    │   │   │   └── Sidebar.jsx
    │   │   ├── Pages/
    │   │   │   ├── Content.jsx
    │   │   │   ├── PatientInfo.jsx
    │   │   │   └── Admin.jsx
    │   │   └── Chatbot/
    │   │       ├── ChatbotPage.jsx
    │   │       ├── ChatMessages.jsx
    │   │       ├── ChatMessage.jsx
    │   │       └── ChatInput.jsx
    │   ├── hooks/useAuth.jsx
    │   ├── utils/api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Quick Start (Local Development)

### Step 1 — Prerequisites
Make sure you have installed:
- **Node.js** v18 or later → https://nodejs.org
- **npm** v9 or later (comes with Node.js)

---

### Step 2 — Set up the Backend

```bash
# 1. Navigate to backend folder
cd medcare/backend

# 2. Install dependencies
npm install

# 3. Copy .env file and fill in your API keys
cp .env.example .env
```

Open `.env` and fill in:

```env
PORT=5000
SESSION_SECRET=any_random_string_here_make_it_long
HOSPITAL_SECRET_PREFIX=@MedCare

# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_key_here

# Get from: https://developers.google.com/custom-search/v1/overview
GOOGLE_API_KEY=your_google_api_key
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_cx

FRONTEND_URL=http://localhost:5173
```

```bash
# 4. Start the backend
npm run dev
# → Running on http://localhost:5000
# → medcare.db will be auto-created in the backend folder
```

---

### Step 3 — Set up the Frontend

```bash
# In a new terminal
cd medcare/frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
# → Running on http://localhost:5173
```

Open your browser at **http://localhost:5173** — you're live!

---

## 🔑 Getting API Keys (Free)

### Gemini AI API Key (for chatbot)
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click **Create API key**
4. Copy it into `GEMINI_API_KEY` in your `.env`

### Google Custom Search (for health news)
1. Go to https://developers.google.com/custom-search/v1/overview
2. Click **Get a Key** → create a project → copy the key into `GOOGLE_API_KEY`
3. Go to https://programmablesearchengine.google.com/
4. Click **New Search Engine** → set "Search the entire web" → copy the **Search engine ID** into `GOOGLE_SEARCH_ENGINE_ID`
   > Free tier: 100 queries/day

---

## 👥 How Accounts Work

### Patient (User) Registration
- Fields: Name, Phone, Email, Password, DOB, Gender
- Auto-generates a unique **MedID** like `MED-A3X7K2`
- Login with: Email + Password

### Staff (Doctor/Nurse) Registration
- Requires a valid **Hospital ID** starting with your prefix (default: `@MedCare`)
  - Example valid IDs: `@MedCare2024`, `@MedCareAdmin`, `@MedCareRohith22`
- Fields: HospitalID, Name, Phone, Email, Password, DOB, Gender, Role, Specialty
- Login with: Hospital ID + Email + Password

### Security
- Passwords stored with **bcrypt** (12 salt rounds)
- Sessions use **HttpOnly cookies** valid for **1 day**
- Staff routes are protected — patients cannot access the Admin portal

---

## 🗄️ Database Tables

### `users` table
| Column | Type | Description |
|--------|------|-------------|
| medId | TEXT | Unique MED-XXXXXX identifier |
| name | TEXT | Full name |
| phone | TEXT | Phone number |
| email | TEXT | Login email (unique) |
| password | TEXT | bcrypt hash |
| dob | TEXT | Date of birth |
| gender | TEXT | Gender |
| role | TEXT | Always 'user' |

### `staff` table
| Column | Type | Description |
|--------|------|-------------|
| medId | TEXT | Unique MED-XXXXXX identifier |
| hospitalId | TEXT | Hospital ID (e.g. @MedCare2024) |
| name, phone, email | TEXT | Contact info |
| password | TEXT | bcrypt hash |
| role | TEXT | 'doctor' or 'nurse' |
| specialty | TEXT | Medical specialty |

### `patient_details` table
| Column | Type | Description |
|--------|------|-------------|
| medId | TEXT | Links to user |
| medicalReport | TEXT | Doctor's summary |
| domain | TEXT | Condition/disease area |
| scanType | TEXT | X-Ray, MRI, CT, etc. |
| scanImagePath | TEXT | Upload path |
| bloodGlucose | TEXT | Glucose reading |
| pressure | TEXT | Blood pressure |
| doctorHandling | TEXT | Assigned doctor |
| contact | TEXT | Emergency contact |
| currentStatus | TEXT | stable/moderate/critical/recovery |
| testsDone | TEXT | List of tests |

---

## 🚀 Free Hosting (No Cost)

### Option A: Render (Recommended — fully free)

**Backend on Render:**
1. Push your `medcare/backend` folder to a GitHub repo
2. Go to https://render.com → New → **Web Service**
3. Connect your repo
4. Set:
   - Build command: `npm install`
   - Start command: `node server.js`
   - Environment: Node
5. Add all `.env` variables in the **Environment** tab
6. Click **Deploy** → you get a free URL like `https://medcare-api.onrender.com`

**Frontend on Render (Static Site):**
1. Push `medcare/frontend` to GitHub
2. Render → New → **Static Site**
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add env variable: `VITE_API_URL=https://medcare-api.onrender.com`
6. In `vite.config.js`, update proxy target to your Render backend URL for production

> ⚠️ Free Render services spin down after 15 min of inactivity. First request may take ~30s.

---

### Option B: Vercel (Frontend) + Railway (Backend)

**Frontend → Vercel:**
```bash
cd medcare/frontend
npx vercel --prod
```

**Backend → Railway:**
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Set root to `backend/`
4. Add environment variables
5. Railway gives you a free URL

---

### Option C: Netlify (Frontend) + Cyclic (Backend)

Similar process — both have free tiers.

---

## 📝 Important Notes for Production

1. In `backend/.env`, set `NODE_ENV=production`
2. Update `FRONTEND_URL` to your actual frontend URL (for CORS)
3. The SQLite DB (`medcare.db`) is stored on the server — Render's free tier resets disk on restart. For persistent storage, upgrade to a paid plan or migrate to **Supabase** (free PostgreSQL).
4. Set a strong `SESSION_SECRET` in production

---

## 🛠️ API Endpoints Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/user` | Register patient | No |
| POST | `/api/auth/register/staff` | Register doctor/nurse | No |
| POST | `/api/auth/login/user` | Patient login | No |
| POST | `/api/auth/login/staff` | Staff login | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/patient/my-details` | Patient's own records | Yes |
| GET | `/api/patient/all` | All patients (staff) | Staff |
| GET | `/api/patient/:medId` | Single patient | Staff/Self |
| POST | `/api/admin/patient/:medId` | Update patient (with scan upload) | Staff |
| POST | `/api/chat/message` | Send message to AI | Yes |
| GET | `/api/chat/history` | Get chat history | Yes |
| DELETE | `/api/chat/history` | Clear chat | Yes |
| GET | `/api/content/news` | Get health news | Yes |

---

## 🐛 Troubleshooting

**"Cannot find module 'better-sqlite3'"**
```bash
cd backend && npm install
```

**Chatbot returns "AI service not configured"**
→ Add your `GEMINI_API_KEY` to `backend/.env`

**CORS errors in browser**
→ Check `FRONTEND_URL` in backend `.env` matches your frontend URL exactly

**Cookie not being sent**
→ Make sure Vite proxy is configured (it is in `vite.config.js`). In production, backend and frontend must be on the same domain or use `sameSite: 'none'` with HTTPS.

**Staff login failing**
→ Hospital ID must start with the `HOSPITAL_SECRET_PREFIX` (default: `@MedCare`)
