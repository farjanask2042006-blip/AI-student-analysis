# EduPulse AI: AI-Powered Student Analytics and Success Platform

> **Predict. Optimize. Improve Student Success.**  
> *Transform disconnected campus data into explainable insights that help faculty support student achievement and career readiness.*

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Edge_Function-412991?logo=openai&logoColor=white)](https://openai.com/)
[![Tests](https://img.shields.io/badge/Vitest-13_Passed-green?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 1. Problem Statement & Architecture Overview
Higher education institutions routinely store academic marks, biometric attendance, LMS assignment logs, and placement assessment scores in separate data silos. Disconnected analytics prevent advisors from noticing students who are slipping in coursework or falling behind in campus placement preparedness.

**EduPulse AI** unites these streams into an institutional decision-support system:
1. **Multi-Source Ingestion:** Ingests academic records, attendance percentages, assignment completion, placement tests, technical skills assessments, and extracurricular records.
2. **Explainable Scoring Engine:** Calculates a transparent **Student Success Score** ($0\text{--}100$) derived from configurable, documented weightings.
3. **Early-Warning Heuristics:** Flags academic review needs ($\text{CGPA} < 6.0 \lor \text{Attendance} < 75\%$) and placement support needs ($\text{Placement Readiness} < 50\%$).
4. **Actionable Cohort Segmentation:** Identifies critical cohorts, including **"Strong academics, low placement readiness"** (students with high GPAs who struggle in practical interview rounds).
5. **Secure Server-Side AI:** Calls OpenAI through a Supabase Edge Function with structured JSON responses and an automatic deterministic fallback engine when offline.
6. **Faculty Intervention Lifecycle:** Enables faculty advisors to schedule mentoring sessions, mock interviews, and makeup schedules with persistent tracking.

---

## 2. Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Recharts (6 interactive chart types), Lucide React, React Router 7.
- **Backend & Database:** Supabase PostgreSQL, Row Level Security (RLS), Supabase JS Client, Supabase Edge Functions.
- **AI Integration:** OpenAI API called exclusively via server-side Edge Functions with structured JSON output and a deterministic rule-based fallback.
- **Testing & Quality Assurance:** Vitest for scoring and segmentation test suites.

---

## 3. Quick Start: Local Development

### Prerequisites
- Node.js `v18+` (Tested on `v24.20.0`)
- npm `v9+`

### 1. Clone & Install
```bash
git clone https://github.com/your-username/ai-student.git
cd ai-student
npm install
```

### 2. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

If you don't have Supabase credentials yet, leave `.env.local` empty! EduPulse AI **automatically operates in Fictional Demo Mode** with 55 preloaded synthetic student records, realistic risk distribution, and reactive local storage.

If using Supabase:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-anon-key
```

### 3. Run Unit Tests
```bash
npm test
```
*Validates CGPA normalization, component weights, missing data handling, boundary thresholds, and cohort classification (13/13 passing).*

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 4. Supabase Database & Edge Function Setup

### 1. Execute SQL Migrations
In your Supabase project dashboard (SQL Editor) or via the Supabase CLI, run the schema migration:
```bash
# Execute supabase/migrations/20261013000000_create_schema.sql
```
This provisions:
- `public.students` (with numeric range check constraints)
- `public.assessments` (subject and placement exam marks)
- `public.student_activity` (hackathons, certifications, clubs)
- `public.student_history` (longitudinal semester snapshots)
- `public.interventions` (action type, assigned advisor, due date, status, follow-up notes)
- RLS Policies and `handle_updated_at` triggers.

### 2. Seed Synthetic Demo Data
Execute `supabase/seed.sql` in the SQL Editor to populate the database with the 55 synthetic student profiles, assessments, activities, snapshots, and interventions.

### 3. Deploy Supabase Edge Function
Deploy the secure server-side OpenAI function:
```bash
supabase functions deploy student-insights --no-verify-jwt
```

### 4. Configure Server-Side OpenAI Secret
Store your OpenAI API key as a secure server secret (never in frontend code):
```bash
supabase secrets set OPENAI_API_KEY=sk-proj-your-openai-api-key
```

---

## 5. Deployment Guide (Vercel)

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete EduPulse AI student analytics platform"
   git push origin main
   ```
2. Import the project in [Vercel](https://vercel.com).
3. In Vercel Project Settings $\rightarrow$ Environment Variables, configure:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Click **Deploy**. Vercel will build and serve the optimized production bundle (`dist/`).

---

## 6. Hackathon Presentation Walkthrough (Judge Flow)

Follow this 10-step flow to demonstrate the end-to-end capabilities of EduPulse AI:

1. **Overview Dashboard (`/`):**
   - Point out the institutional KPIs (Total Students, Avg Success Score, Academic Review, Placement Support, Incomplete Data, Priority Review).
   - Demonstrate the dynamic department filter updating all 6 interactive Recharts charts (Score Distribution, Department averages, Risk Quadrants, Attendance vs CGPA correlation scatter, Placement distribution, and Segmentation).
2. **Data-Quality & Missing Value Transparency:**
   - Note the **Incomplete Data** KPI card (4 students). Show that their scores are returned as `Incomplete` rather than falsifying a zero score.
3. **Student Explorer (`/students`):**
   - Demonstrate multi-attribute search and column sorting.
   - Filter by **Cohort Segment**: select **"Strong academics, low placement readiness"**.
   - Show how students like **Rohan Gupta (`EP-104`)** (CGPA 8.85, Attendance 91%, but Placement 38%) are immediately identified.
4. **Student Detail Profile (`/students/EP-104`):**
   - Inspect the **"Why this score?"** component breakdown. Show raw inputs, normalized values, 30%/20%/15%/20%/10%/5% weights, and individual point contributions.
   - View the transparent risk heuristic checks (reasons explaining why the Placement Support flag was triggered).
5. **AI-Powered Insights:**
   - Click **"Generate AI Explanation"**.
   - Highlight the structured output (Executive Summary, Supporting Indicators, Concerns, Faculty Actions, 1-on-1 Questions, and Limitations).
   - Point out the active engine badge (OpenAI Live vs Heuristic Fallback).
6. **Record Faculty Intervention:**
   - Click **"Record Intervention"**.
   - Select `Schedule a mock interview` or `Assign a coding-practice plan`, set target due date, assign advisor, and save.
7. **Risk & Intervention Center (`/interventions`):**
   - Review separate views for Academic Review, Placement Support, Priority Review, Incomplete Data, and Active Intervention Logs.
   - Show how the newly recorded intervention persists in real-time, and toggle its status to `In Progress` or `Completed`.
8. **AI Workspace (`/ai-insights`):**
   - Switch between Individual Student, Cohort Segment, Department Aggregate, and Overall Campus scopes.
9. **Data Management & CSV Validation (`/data-management`):**
   - Show the CSV Upload zone with instant client-side range validation, duplicate ID detection, and error reporting.
   - Download the official CSV Template or export the active roster to CSV.
10. **Methodology Documentation (`/methodology`):**
    - Conclude by highlighting the ethical governance guidelines and explainable mathematical formulas.

---

## 7. Project Structure

```
├── .env.example
├── METHODOLOGY.md
├── README.md
├── package.json
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── analytics/
│   │   ├── __tests__/
│   │   │   └── analytics.test.js    # Vitest unit test suite (13 tests)
│   │   ├── scoring.js               # Success score engine & weights
│   │   ├── riskRules.js             # Academic & placement risk heuristics
│   │   └── segmentation.js          # 6-cohort segmentation engine
│   ├── components/
│   │   ├── ChartCard.jsx            # Recharts container with tooltips
│   │   ├── EmptyState.jsx           # Filter empty state UI
│   │   ├── Header.jsx               # Top navigation & demo indicator
│   │   ├── InterventionModal.jsx    # Faculty intervention dialog
│   │   ├── KPICard.jsx              # Responsive metric card
│   │   ├── LoadingState.jsx         # Loading spinner
│   │   ├── RiskBadge.jsx            # Accessible status badges
│   │   ├── ScoreBreakdown.jsx       # Explainable "Why this score?" table
│   │   └── Sidebar.jsx              # Enterprise dark navy navigation
│   ├── context/
│   │   └── StudentContext.jsx       # Reactive shared state & data provider
│   ├── data/
│   │   └── demoStudents.js          # 55 synthetic student profiles & interventions
│   ├── lib/
│   │   ├── aiService.js             # OpenAI Edge Function caller & fallback
│   │   ├── interventionService.js   # Supabase & localStorage CRUD
│   │   ├── studentService.js        # Data retrieval & enrichment
│   │   └── supabase.js              # Supabase client initializer
│   ├── pages/
│   │   ├── AIInsights.jsx           # Dedicated AI workspace
│   │   ├── Dashboard.jsx            # KPI cards & 6 Recharts visualizations
│   │   ├── DataManagement.jsx       # CSV upload, validation, export
│   │   ├── Interventions.jsx        # Risk & Intervention Center
│   │   ├── Methodology.jsx          # Documentation & governance page
│   │   ├── StudentDetail.jsx        # Detailed profile & audit trail
│   │   └── StudentExplorer.jsx      # Searchable, filterable student roster
│   ├── utils/
│   │   ├── csvHelper.js             # CSV parser, validator, template & exporter
│   │   └── formatters.js            # Percentages, score & date formatters
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
└── supabase/
    ├── functions/
    │   └── student-insights/
    │       └── index.ts             # Secure Deno Edge Function for OpenAI
    ├── migrations/
    │   └── 20261013000000_create_schema.sql  # Database schema & RLS
    └── seed.sql                     # SQL seed dataset (55 synthetic records)
```

---

## 8. License
Educational prototype developed for college hackathon evaluation. Built for decision-support demonstration.
