<div align="center">
  <h1 align="center">⚡ LinkHub</h1>
  <h3 align="center">Advanced Short-Link & Bio-Link Hub</h3>
  <p align="center">
    <em>A high-performance, full-stack application that combines advanced URL shortening with a customizable, Linktree-style Bio page builder.</em>
  </p>
  
  <br />
  
  <h3>👉 <a href="https://com-bot-linkhub.vercel.app"><strong>CLICK HERE FOR LIVE DEMO</strong></a> 👈</h3>
  
  <br />

  <img src="https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres" />
  <img src="https://img.shields.io/badge/Google_Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />

</div>

<br />

---

## 🚀 Live Deployment
This project is fully deployed and accessible online:
* **Frontend (Live Demo):** [https://com-bot-linkhub.vercel.app](https://com-bot-linkhub.vercel.app)
* **Backend API:** Hosted on Render
* **Database:** Hosted securely on Supabase

> **Note on Live Demo:** The frontend is hosted on Vercel for fast global delivery, while the FastAPI backend is hosted on a free Render instance. **It may take 30-50 seconds for the first request (login/signup) to wake up the backend server.**

---

## ✨ Key Features

### 🚀 1. Advanced URL Shortening
* **Custom Aliases:** Create branded, vanity URLs (e.g., `/r/my-campaign`).
* **Instant Redirection:** Blazing fast redirects powered by FastAPI.
* **Auto-generated Codes:** Secure, collision-resistant 6-character random slugs.

### 📊 2. Comprehensive Analytics Dashboard
* **Real-time Tracking:** Every click is instantly recorded in the database.
* **Time-Series Data:** Visualized clicks over a 30-day period.
* **Device Detection:** Categorizes traffic by Desktop, Mobile, or Tablet.
* **Referrer Tracking:** Know exactly where your traffic is coming from (Direct, Twitter, Google, etc.).
* **Data Visualization:** Built with modern, responsive **Recharts**.

### 🎨 3. Bio-Link Builder (Linktree Clone)
* **Live Preview:** See changes to your bio page in real-time as you type.
* **Custom Themes:** Choose between Minimal Light, Dark Slate, and Gradient aesthetics.
* **Social Links Auto-Detection:** Paste a GitHub or LinkedIn URL, and the builder automatically detects the platform and assigns the correct emoji icon.
* **Public Profile:** Share your unique URL (`/bio/yourusername`) on social media.
* **View Counter:** Tracks how many people have visited your public bio page.

### 🤖 4. AI-Powered Bio Generation
* Integrated directly with the **Google Gemini 3.6 Flash API**.
* Click the "Sparkles" button, and Gemini will instantly write a professional, engaging biography tailored to your profile name and existing data to help you stand out.

---

## 🛠️ Tech Stack & Architecture

### ⚛️ Frontend
<img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=flat-square&logo=vite&logoColor=white" alt="Vite" /> 
<img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white" alt="React Router" />

* **Framework:** React 18 + Vite (for lightning-fast HMR and building)
* **Routing:** React Router v6 (Single Page Application)
* **Charting:** Recharts (SVG-based data visualization)
* **Styling:** Custom CSS with a polished, modern Dark Mode UI
* **Hosting:** Vercel

### 🐍 Backend
<img src="https://img.shields.io/badge/python-3670A0?style=flat-square&logo=python&logoColor=ffdd54" alt="Python" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />

* **Framework:** FastAPI (High performance, async Python framework)
* **Database:** PostgreSQL (Hosted securely on Supabase)
* **ORM:** SQLAlchemy 2.0 with Alembic for database migrations
* **Authentication:** Secure JWT (JSON Web Tokens) with Bcrypt password hashing
* **AI Integration:** `google-generativeai` SDK
* **Hosting:** Render

### 🔒 Security Highlights
* **Protected Routes:** Both React and FastAPI implement strict authentication middleware.
* **Password Hashing:** Passwords are never stored in plain text; bcrypt is used for secure hashing.
* **Session Pooling:** Utilizes Supabase IPv4 Session Pooler to prevent database connection timeouts.
* **Stateless Auth:** Uses HTTP Bearer tokens (JWT) for scalable authentication.

---

## ⚙️ Local Development Setup

If you wish to run this project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/Abdullah124Arman/com.bot-linkhub.git
cd com.bot-linkhub
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory:
```env
DATABASE_URL=postgresql://your_db_url
SECRET_KEY=your_secure_secret_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
```
Run the backend:
```bash
uvicorn app.main:app --reload
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.
