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

To keep **MedCare** fast, free, and easy to maintain for NGOs and rural clinics, we chose a "lean" tech stack. Every tool was selected to ensure the app works on slow internet and requires zero monthly hosting costs.

---

### 🎨 Frontend: The "Face" of MedCare
* **React 18 + Vite:** We used React because it’s the industry standard, but paired it with **Vite** to make the app load in milliseconds. In a rural clinic with a 3G connection, speed isn't a luxury—it’s a necessity.
* **Custom CSS (No Heavy Libraries):** We skipped big design frameworks like Material UI or Bootstrap. This kept the "weight" of the website tiny (under 10KB), ensuring it doesn't lag on older smartphones.
* **React Router v6:** This allows the app to feel like a smooth, multi-page website without ever needing to "refresh" the page when navigating between the Dashboard and the Chatbot.

---

### ⚙️ Backend: The "Brain"
* **Node.js & Express:** The engine that handles all requests. We chose this because it uses JavaScript—the same language as the frontend—making it easier for a single volunteer developer to manage the whole system.
* **Multer:** This is the specific tool that handles **medical scan uploads**. When a doctor takes a photo of an X-ray, Multer securely saves it to the server and links it to the patient’s ID.



---

### 💾 Database: The "Memory"
* **SQLite (via better-sqlite3):** This is our "secret sauce." Unlike professional databases that require expensive servers, SQLite stores everything in **one single file** on the computer. 
    * **The Benefit:** To back up all patient data, you literally just copy the `medcare.db` file to a Google Drive or a thumb drive. It’s "IT-proof."

---

### 🔐 Security & AI: The "Protection"
* **Bcryptjs:** We never store raw passwords. If someone were to see the database, your password would look like a 60-character string of random gibberish.
* **HttpOnly Cookies:** A digital "lock" that prevents hackers from stealing a user's session through the browser's console.
* **Google Gemini 1.5 Flash:** We chose this AI because it has a massive **Free Tier**. It allows MedBot to "read" the patient's record and explain it in plain language without the NGO having to pay for every message sent.

---

### ☁️ Hosting: The "Home" (All Free)
| Component | Provider | Why? |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Fast global delivery and free for small projects. |
| **Backend** | **Render** | Reliability and easy connection to the database. |
| **Images** | **Local/Cloudinary** | Keeps medical scans organized and accessible. |
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

