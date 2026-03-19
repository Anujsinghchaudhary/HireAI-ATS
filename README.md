# HireAI — AI-Powered Applicant Tracking System

An enterprise-ready, AI-powered Applicant Tracking System that automates resume screening, candidate scoring, and hiring pipeline management — all from a single web application with zero backend infrastructure.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![AI](https://img.shields.io/badge/AI-GPT--4o--mini-10A37F?logo=openai&logoColor=white)
![Deployment](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel&logoColor=white)

---

## Features

### Dashboard & Analytics
- Real-time hiring pipeline overview with key metrics (active jobs, total candidates, resumes analyzed, average match score)
- Interactive charts — application trends (Area Chart) and department-wise breakdown (Bar Chart)
- Recent activity feed tracking candidate movements through the pipeline

### Job Management (Full CRUD)
- Create, edit, and delete job postings with detailed descriptions and requirements
- Filter jobs by department, status (Open / Closed / Draft), and keyword search
- Track applicant count per job

### AI-Powered Resume Analysis
The core feature — a **3-step AI pipeline** powered by GPT-4o-mini:

1. **Resume Parsing** — Extracts structured data (name, contact, skills, experience, education, certifications)
2. **Resume–Job Matching** — Scores the resume against a job description (0–100) with:
   - Matched, missing, and additional skills identification
   - Keyword analysis and experience evaluation
   - Culture fit assessment
   - Auto-generated interview questions
3. **Feedback Generation** — Produces actionable improvement suggestions with priority levels, skill gap learning paths, and ATS optimization tips

Supports drag-and-drop file upload (`.txt`, `.pdf`, `.md`, `.docx`) and direct text paste.

### Candidate Pipeline Management
- Searchable, sortable candidate list with status filtering
- Pipeline stages: **New → Screening → Interview → Offer → Hired / Rejected**
- Detailed candidate profile with AI analysis breakdown, animated score gauge, strengths, concerns, and recommendations
- Status updates persist in real time

### Settings
- Profile management and AI model configuration
- Notification preferences
- Appearance controls (dark mode, animations)
- Data & privacy options

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | **React 19** + **Vite 7** |
| Routing | React Router DOM v7 |
| Icons | Lucide React |
| Charts | Recharts |
| AI / LLM | Puter.js → **GPT-4o-mini** |
| Database | Puter KV Store (serverless key-value) |
| Authentication | Puter Auth |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── services/
│   ├── aiPrompts.js        # Structured AI prompt templates (analysis, parsing, feedback)
│   └── puter.js            # Service layer — Auth, AI, KV storage APIs
├── components/
│   ├── Layout.jsx           # App shell with sidebar + header
│   ├── Sidebar.jsx          # Navigation sidebar (collapsible)
│   ├── Header.jsx           # Top bar with search and profile
│   ├── Modal.jsx            # Reusable modal dialog
│   ├── StatCard.jsx         # Dashboard metric card
│   └── ScoreGauge.jsx       # Animated SVG circular score indicator
├── pages/
│   ├── Dashboard.jsx        # Analytics overview with charts
│   ├── Jobs.jsx             # Job listing management (CRUD)
│   ├── Candidates.jsx       # Candidate list with filters
│   ├── CandidateDetail.jsx  # Individual candidate profile + AI results
│   ├── ResumeAnalysis.jsx   # Upload & AI-analyze resumes
│   └── Settings.jsx         # App configuration
├── App.jsx                  # Route definitions
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Anujsinghchaudhary/HireAI-ATS.git
cd HireAI-ATS

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## How It Works

1. **Create job postings** with titles, descriptions, and requirements
2. **Upload a candidate's resume** (file or pasted text) and select a job to match against
3. **AI parses, analyzes, and scores** the resume in a 3-step pipeline with real-time progress
4. **Candidate is auto-saved** to the database with full analysis results
5. **Manage candidates** through pipeline stages from New to Hired
6. **Monitor hiring metrics** on the dashboard with live charts

---

## Architecture Highlights

- **Serverless / Zero-Backend** — No Node.js server or database setup required. AI, authentication, and data storage all run through Puter.js cloud APIs.
- **Service Layer Pattern** — All external API interactions are encapsulated in `src/services/`, keeping UI components clean and testable.
- **Prompt Engineering** — JSON-only output prompts with structured schemas ensure reliable, machine-parseable AI responses. Fallback defaults handle parse failures gracefully.
- **Glassmorphism UI** — Modern glass-card design with smooth animations and a dark-mode-first approach.

---

## Deployment

Deployed on **Vercel** with:
- SPA routing via `vercel.json` rewrites
- Static asset caching (1-year immutable cache for `/assets/`)

---

## License

This project is built as a **Major Project (Phase 2)** for academic purposes.
