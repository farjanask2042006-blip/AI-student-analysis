# EduPulse AI: Analytics Methodology & Institutional Decision-Support Framework

## 1. Executive Summary & Problem Context
Higher education institutions maintain student metrics across disparate silos: examination cell records (CGPA, subject marks), biometric attendance databases, Learning Management Systems (LMS assignment submissions), hackathons/extracurricular logs, and campus placement assessment portals. 

Because these systems are rarely unified in real-time, academic struggles and placement readiness gaps often go unnoticed until semester-end examinations or final-year recruitment drives.

**EduPulse AI** solves this disconnect by integrating cross-category campus data into a unified, transparent analytics platform. It calculates an explainable **Student Success Score**, identifies early academic and career risk indicators, partitions students into actionable cohorts, and equips faculty advisors to record timely interventions.

> **Crucial Ethical Guardrail:** EduPulse AI is explicitly designed as a *decision-support tool* for educators, not an autonomous judgment system. All scores, flags, and AI insights are deterministic, explainable, and presented with clear limitations. The system never predicts deterministic student failure, dropouts, or punitive measures.

---

## 2. Integrated Student Data Categories
The platform aggregates data across seven fundamental institutional categories:

| Data Category | Specific Indicators Captured | Storage Representation |
| :--- | :--- | :--- |
| **A. Academic Performance** | Cumulative Grade Point Average (CGPA 0.0–10.0), granular subject marks, backlog count | `students.cgpa`, `assessments` table |
| **B. Attendance** | Mandatory classroom and lab attendance rate (0–100%) | `students.attendance_pct`, `student_history` |
| **C. LMS & Continuous Evaluation** | Assignment submission percentage (0–100%), portal activity | `students.assignment_completion_pct` |
| **D. Placement Preparation** | Timed DSA rounds, aptitude scores, technical and mock HR interview performance (0–100%) | `students.placement_readiness_pct`, `assessments` |
| **E. Technical Skills** | Verified competency in algorithms, frameworks, and system design (0–100%) | `students.skills_score` |
| **F. Extracurricular Engagement** | Hackathon participation, cloud certifications, IEEE research, student club leadership (0–100%) | `students.engagement_score`, `student_activity` |
| **G. Faculty Feedback & Interventions** | Mentoring logs, tutoring referrals, makeup lab schedules, status tracking | `interventions` table |

`student_id` serves as the consistent relational key joining records across tables.

---

## 3. Student Success Score Engine (`src/analytics/scoring.js`)

### 3.1 Normalization
Because academic grading operates on a 0.0 to 10.0 scale while other dimensions use percentages or 0–100 scales, CGPA is normalized:
$$\text{Academic Score} = \left(\frac{\text{CGPA}}{10.0}\right) \times 100$$

### 3.2 Weight Distribution
Weights represent illustrative prototype assumptions formulated for college decision support:

| Component | Weight | Rationale |
| :--- | :---: | :--- |
| **Academic Performance** | **30%** | Foundation of degree completion and fundamental comprehension. |
| **Attendance** | **20%** | Regulatory prerequisite and early behavioral indicator of disengagement. |
| **Assignment / LMS Completion** | **15%** | Formative learning discipline and continuous coursework engagement. |
| **Placement Readiness** | **20%** | Practical industry preparedness (coding tests, aptitude, interviews). |
| **Technical & Soft Skills** | **10%** | Real-world problem solving and communication proficiency. |
| **Campus Engagement** | **5%** | Extracurricular certifications, leadership, and hackathons. |
| **Total** | **100%** | — |

### 3.3 Composite Formula
$$\text{Success Score} = (\text{Academic Score} \times 0.30) + (\text{Attendance} \times 0.20) + (\text{Assignment} \times 0.15) + (\text{Placement} \times 0.20) + (\text{Skills} \times 0.10) + (\text{Engagement} \times 0.05)$$

The final displayed score is rounded to the nearest integer.

### 3.4 Missing Data Handling
If any required component is missing:
1. The official score status returns `INCOMPLETE`.
2. Missing indicators are explicitly itemized (e.g. `['placement_readiness_pct']`).
3. **Missing fields are NEVER treated as zero.** Imputing zeros would falsely classify students awaiting biometric sync or transfer credits as failing.
4. An informative, clearly labeled partial score is calculated strictly for faculty reference without representing it as an official institutional rating.

---

## 4. Risk Identification Rules (`src/analytics/riskRules.js`)

Heuristic thresholds trigger early supportive intervention alerts:

1. **Academic Review Flag:**
   - Triggered if $\text{CGPA} < 6.0$ OR $\text{Attendance} < 75\%$.
   - *Rationale:* $75\%$ attendance is the institutional threshold for semester exam eligibility; a CGPA below $6.0$ indicates coursework difficulty.
2. **Placement Support Flag:**
   - Triggered if $\text{Placement Readiness} < 50\%$.
   - *Rationale:* Identifies students who need mock interview practice, aptitude bootcamps, or DSA sprints before campus recruitment drives.
3. **Priority Follow-Up Review:**
   - Triggered if $\text{Success Score} < 50$ OR (Both Academic and Placement flags are concurrently active).
   - *Rationale:* Dual compounding flags warrant coordinated advisor intervention.

---

## 5. Student Segmentation Matrix (`src/analytics/segmentation.js`)

| Cohort Segment | Classification Rule | Pedagogical Action Plan |
| :--- | :--- | :--- |
| **Strong academics, placement ready** | $\text{CGPA} \ge 7.5 \land \text{Placement} \ge 70\%$ | Tier-1 recruitment mentorship, research publications, peer tutoring leadership. |
| **Strong academics, low placement readiness** *(Critical Divergent Cohort)* | $\text{CGPA} \ge 7.5 \land \text{Placement} < 50\%$ | Intensive live coding sprints, resume review, mock technical and HR interview simulations. |
| **Needs academic support** | Academic Flag active $\land \text{Placement} \ge 50\%$ | Subject-matter tutoring, makeup laboratory sessions, attendance barrier review. |
| **Needs academic and placement support** | Academic Flag active $\land \text{Placement} < 50\%$ | Comprehensive 1-on-1 advisor counseling; establish individualized remedial study contract. |
| **Balanced progress / Developing** | Baseline parameters met | Encourage technical certifications, hackathon entries, and career portfolio expansion. |
| **Insufficient data** | 1+ core metrics missing | Audit missing registrar, biometric, or assessment records. |

---

## 6. Secure OpenAI Integration & Edge Function Architecture

1. **Server-Side Invocation Only:**
   Frontend clients never communicate directly with OpenAI. Requests route through a Supabase Edge Function (`supabase/functions/student-insights/index.ts`).
2. **Server Secret Storage:**
   The `OPENAI_API_KEY` is maintained as a server-side secret (`supabase secrets set OPENAI_API_KEY=...`) and is never present in client bundles or `VITE_` variables.
3. **Structured JSON Output:**
   OpenAI requests return strictly formatted JSON:
   - `summary`: Concise status overview.
   - `supportingIndicators`: Observed quantitative inputs.
   - `potentialConcerns`: Specific challenge areas.
   - `suggestedActions`: Concrete faculty mentoring actions.
   - `facultyQuestions`: Exploratory questions for 1-on-1 advisor sessions.
   - `limitations`: Contextual and missing-data constraints.
4. **Deterministic Rule-Based Fallback Engine:**
   If the OpenAI API key is unconfigured, rate-limited, or unreachable, EduPulse AI automatically generates transparent, structured insights via its internal heuristic engine. A visible badge indicates the active generator.

---

## 7. Data Governance, Privacy & Security
- **Synthetic Demonstration Dataset:** The 55 loaded profiles utilize synthetic names and fictional metrics.
- **Row-Level Security (RLS):** Supabase PostgreSQL tables employ RLS policies to govern read and write access.
- **Audit Logging:** Every faculty intervention includes creator identity, creation date, target date, status lifecycle (`Pending` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`), and follow-up notes.
