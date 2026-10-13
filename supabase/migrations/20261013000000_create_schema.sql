-- ====================================================================
-- EduPulse AI - Database Schema Migration
-- Tables: students, assessments, student_activity, student_history, interventions
-- Includes: Constraints, RLS policies, Indexes, and Updated_At triggers
-- ====================================================================

-- 1. Enable UUID Extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Students Table
CREATE TABLE IF NOT EXISTS public.students (
    student_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    semester INTEGER DEFAULT 7,
    mentor TEXT,
    cgpa NUMERIC(4,2) CHECK (cgpa IS NULL OR (cgpa >= 0.0 AND cgpa <= 10.0)),
    attendance_pct NUMERIC(5,2) CHECK (attendance_pct IS NULL OR (attendance_pct >= 0.0 AND attendance_pct <= 100.0)),
    assignment_completion_pct NUMERIC(5,2) CHECK (assignment_completion_pct IS NULL OR (assignment_completion_pct >= 0.0 AND assignment_completion_pct <= 100.0)),
    placement_readiness_pct NUMERIC(5,2) CHECK (placement_readiness_pct IS NULL OR (placement_readiness_pct >= 0.0 AND placement_readiness_pct <= 100.0)),
    skills_score NUMERIC(5,2) CHECK (skills_score IS NULL OR (skills_score >= 0.0 AND skills_score <= 100.0)),
    engagement_score NUMERIC(5,2) CHECK (engagement_score IS NULL OR (engagement_score >= 0.0 AND engagement_score <= 100.0)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create Subject & Placement Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    marks NUMERIC(5,2) NOT NULL CHECK (marks >= 0.0),
    max_marks NUMERIC(5,2) NOT NULL DEFAULT 100.0 CHECK (max_marks > 0.0),
    assessment_type TEXT NOT NULL DEFAULT 'Subject', -- 'Subject', 'DSA Assessment', 'Aptitude', 'Interview'
    assessment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Create Student Activities & LMS Engagement Table
CREATE TABLE IF NOT EXISTS public.student_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'Hackathon', 'Certification', 'Club', 'Research', 'LMS'
    activity_description TEXT NOT NULL,
    completion_status TEXT NOT NULL DEFAULT 'Completed',
    activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Create Student History (Longitudinal Snapshots) Table
CREATE TABLE IF NOT EXISTS public.student_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    semester_label TEXT NOT NULL,
    assessment_date DATE DEFAULT CURRENT_DATE,
    cgpa_snapshot NUMERIC(4,2),
    attendance_snapshot NUMERIC(5,2),
    assignment_completion_snapshot NUMERIC(5,2),
    placement_readiness_snapshot NUMERIC(5,2),
    calculated_success_score NUMERIC(5,2),
    data_completeness_status TEXT NOT NULL DEFAULT 'COMPLETE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Create Interventions Table
CREATE TABLE IF NOT EXISTS public.interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL REFERENCES public.students(student_id) ON DELETE CASCADE,
    intervention_type TEXT NOT NULL,
    description TEXT NOT NULL,
    assigned_faculty TEXT NOT NULL,
    due_date DATE,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    follow_up_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_department ON public.students(department);
CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON public.assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_student_id ON public.student_activity(student_id);
CREATE INDEX IF NOT EXISTS idx_history_student_id ON public.student_history(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_student_id ON public.interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON public.interventions(status);

-- 8. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_students_updated_at ON public.students;
CREATE TRIGGER set_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_interventions_updated_at ON public.interventions;
CREATE TRIGGER set_interventions_updated_at
    BEFORE UPDATE ON public.interventions
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- 9. Row Level Security (RLS) Setup
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

-- Demo / Educational Access Policies
-- Reads: Permitted for authenticated users or public demo read-only access
CREATE POLICY "Allow public read access for demo students"
    ON public.students FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access for assessments"
    ON public.assessments FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access for student activities"
    ON public.student_activity FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access for history"
    ON public.student_history FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access for interventions"
    ON public.interventions FOR SELECT
    USING (true);

-- Writes for interventions (Faculty decision-support actions)
CREATE POLICY "Allow insert of interventions"
    ON public.interventions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow update of interventions"
    ON public.interventions FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Writes for student data import (Faculty / Admin import)
CREATE POLICY "Allow insert of students"
    ON public.students FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow update of students"
    ON public.students FOR UPDATE
    USING (true)
    WITH CHECK (true);
