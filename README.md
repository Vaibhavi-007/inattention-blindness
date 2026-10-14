# 🧠 Inattention Blindness Lab - Cognitive Prototype

A single-architecture, zero-dependency web application designed to study and demonstrate **Inattention Blindness** and **Change Blindness** in human visual perception.

Built for **Rishab Bajaj** to demonstrate to clients and research stakeholders.

---

## 🌟 Key Features

1. **Scientifically Accurate 3-Phase Protocol**:
   - **Phase 1: Initial Stimulus** – Participant studies an intricate visual scene for a set duration (default: 2,500ms).
   - **Phase 2: Flicker Mask / Blank Screen** – A brief black screen (default: 350ms) suppresses retinal persistence and ocular motion transients.
   - **Phase 3: Spot The Change** – The modified scene appears with a single target altered. The participant clicks on the altered region.
2. **Dual Experiment Paradigms**:
   - **Single Flicker Protocol**: Classic single-shot presentation.
   - **Continuous Flicker Protocol (Rensink Paradigm)**: Image A ⇄ Black Screen ⇄ Image B alternating until the participant detects the change.
3. **High-Precision Metric Tracking**:
   - **Accuracy**: Calculates target hit vs miss based on bounding box coordinates.
   - **Reaction Time (RT)**: Millisecond-level tracking (`performance.now()`) from the moment the stimulus appears until user click.
   - **Visual Feedback**: Green ripple for correct hits, red ripple for misses, and an illuminated amber boundary highlighting the exact location of the change.
   - **Audio Feedback**: Built-in sound synthesis via Web Audio API (zero external sound files needed).
4. **Preset Environmental Scenarios**:
   - *Downtown Intersection* (Urban Street, Fire Hydrant change)
   - *Executive Workspace* (Office Desk, Coffee Mug change)
   - *Airport Runway & Jet* (Aviation, Airplane Jet Engine change)
   - *Cozy Living Room* (Interior, Wall Clock change)
   - *Sunny Park Picnic* (Outdoors, Flying Kite change)
   - *Chemistry Laboratory* (Science Lab, Erlenmeyer Flask change)
5. **Analytics & Persistence**:
   - Automated Cognitive Evaluation & Inattention Blindness Index diagnosis.
   - Real-time trial breakdown table.
   - Session history storage (`data/results.json`).
   - One-click CSV dataset export (`/api/export/csv`) for cognitive data analysis.
6. **Single-Architecture & Zero Dependencies**:
   - Runs natively on Node.js using built-in standard libraries (`http`, `fs`, `path`).
   - Requires **no `npm install`**, no third-party package vulnerabilities, and starts in under 50ms.
   - Deployable anywhere as a single unified service (frontend + backend + storage in one process).

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js (v16+) installed.

### Run Locally
```bash
# Clone or navigate to the directory
cd RB

# Start the application (zero npm install required!)
npm start
# or
node server.js
```

Open your browser at:
👉 **[http://localhost:3000](http://localhost:3000)** (or the port displayed in your terminal if 3000 is occupied).

The default participant is pre-set to **Rishab Bajaj**.

---

## 🌐 1-Click Cloud Deployment (Single Service)

Because this app is designed with a **single self-contained architecture**, deploying it for client review takes just a few clicks on any free or paid cloud host:

### Option A: Render (Recommended - Free & Fast)
1. Push this folder to a GitHub repository.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
3. Select your repository.
4. Set:
   - **Environment**: `Node`
   - **Build Command**: *(leave blank or `echo "No build needed"`)*
   - **Start Command**: `node server.js`
5. Click **Deploy Web Service**. You'll receive a live public URL (e.g. `https://inattention-blindness.onrender.com`) to share with the client.

### Option B: Railway
1. Go to [Railway.app](https://railway.app/).
2. Click **New Project > Deploy from GitHub repo**.
3. Railway auto-detects `server.js` and provides an instant public HTTPS URL.

### Option C: Docker Container
```bash
docker build -t inattention-blindness-app .
docker run -p 3000:3000 inattention-blindness-app
```

---

## 📁 Project Structure

```
/RB
├── server.js              # Pure Node.js HTTP server & REST APIs
├── package.json           # Node configuration & metadata
├── Dockerfile             # Production container definition
├── README.md              # Documentation and client guide
├── data/
│   └── results.json       # JSON file store for recorded sessions
└── public/
    ├── index.html         # User interface & experiment stage
    ├── css/
    │   └── styles.css     # Dark mode cognitive lab UI styling
    └── js/
        ├── scenes.js      # 6 Detailed vector scenes & change targets
        ├── sound.js       # Web Audio API synthesizer for sound effects
        └── app.js         # Experiment engine & reaction time tracker
```

---

## 📊 API Reference

- `GET /api/health` — Service health check & uptime.
- `GET /api/sessions` — Fetch list of recorded participant sessions.
- `POST /api/sessions` — Save participant experiment results.
- `GET /api/export/csv` — Download complete dataset in CSV format.
- `DELETE /api/sessions` — Clear test session history.
