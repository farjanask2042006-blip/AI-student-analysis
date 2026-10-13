-- ====================================================================
-- EduPulse AI - Database Seed Data (55 Synthetic Student Profiles)
-- For Hackathon Demonstration & Local Supabase Development
-- ====================================================================

TRUNCATE TABLE public.interventions CASCADE;
TRUNCATE TABLE public.student_history CASCADE;
TRUNCATE TABLE public.student_activity CASCADE;
TRUNCATE TABLE public.assessments CASCADE;
TRUNCATE TABLE public.students CASCADE;

-- Insert Students
INSERT INTO public.students (student_id, name, department, semester, mentor, cgpa, attendance_pct, assignment_completion_pct, placement_readiness_pct, skills_score, engagement_score) VALUES
('EP-101', 'Aarav Patel', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 9.15, 94.00, 96.00, 88.00, 92.00, 85.00),
('EP-102', 'Priya Sharma', 'AI & Data Science', 7, 'Prof. Radhika Rao', 9.40, 96.00, 98.00, 92.00, 95.00, 90.00),
('EP-103', 'Vikramaditya Roy', 'Information Technology', 7, 'Dr. Suresh Varma', 8.65, 88.00, 92.00, 84.00, 86.00, 75.00),
('EP-104', 'Rohan Gupta', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 8.85, 91.00, 95.00, 38.00, 58.00, 45.00),
('EP-105', 'Ananya Iyer', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 8.42, 89.00, 90.00, 42.00, 52.00, 50.00),
('EP-106', 'Aditya Deshmukh', 'Information Technology', 7, 'Prof. Radhika Rao', 8.15, 86.00, 88.00, 44.00, 60.00, 40.00),
('EP-107', 'Kabir Khan', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 5.60, 68.00, 55.00, 54.00, 62.00, 58.00),
('EP-108', 'Sneha Roy Chowdhury', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 5.45, 71.00, 62.00, 52.00, 55.00, 40.00),
('EP-109', 'Pooja Verma', 'AI & Data Science', 7, 'Prof. Radhika Rao', 7.20, 62.00, 70.00, 65.00, 72.00, 45.00),
('EP-110', 'Tanmay Bhattacharya', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 5.25, 58.00, 48.00, 32.00, 40.00, 30.00),
('EP-111', 'Manish Rawat', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 5.30, 64.00, 50.00, 36.00, 42.00, 35.00),
('EP-112', 'Simran Sandhu', 'Information Technology', 7, 'Prof. Radhika Rao', 8.20, 86.00, NULL, 75.00, 78.00, 65.00),
('EP-113', 'Kunal Singhal', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', NULL, 78.00, 82.00, 60.00, 68.00, 55.00),
('EP-114', 'Nisha Kulkarni', 'AI & Data Science', 7, 'Prof. Radhika Rao', 7.90, NULL, 88.00, 70.00, 75.00, 60.00),
('EP-115', 'Deepak Chawla', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 7.10, 82.00, 79.00, NULL, 70.00, 50.00),
('EP-116', 'Ritika Sen', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 7.60, 84.00, 85.00, 66.00, 74.00, 65.00),
('EP-117', 'Aryan Dixit', 'AI & Data Science', 7, 'Prof. Radhika Rao', 8.90, 92.00, 94.00, 86.00, 88.00, 82.00),
('EP-118', 'Karthik Nair', 'Information Technology', 7, 'Dr. Suresh Varma', 8.70, 88.00, 90.00, 40.00, 55.00, 48.00),
('EP-119', 'Meera Nair', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 7.35, 80.00, 82.00, 62.00, 68.00, 60.00),
('EP-120', 'Farhan Zaidi', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 6.80, 78.00, 76.00, 60.00, 70.00, 55.00),
('EP-121', 'Bhavna Chauhan', 'AI & Data Science', 7, 'Prof. Radhika Rao', 8.30, 86.00, 89.00, 78.00, 82.00, 70.00),
('EP-122', 'Siddharth Menon', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 7.10, 82.00, 78.00, 58.00, 64.00, 50.00),
('EP-123', 'Gauri Pillai', 'Information Technology', 7, 'Prof. Radhika Rao', 5.75, 80.00, 65.00, 55.00, 58.00, 45.00),
('EP-124', 'Harsh Vardhan', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 9.30, 95.00, 97.00, 94.00, 96.00, 90.00),
('EP-125', 'Ishaan Trivedi', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 6.90, 72.00, 74.00, 60.00, 66.00, 52.00),
('EP-126', 'Jayesh Sonawane', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 5.15, 66.00, 46.00, 35.00, 38.00, 30.00),
('EP-127', 'Divya Sen', 'AI & Data Science', 7, 'Prof. Radhika Rao', 8.60, 90.00, 92.00, 46.00, 56.00, 50.00),
('EP-128', 'Kavita Joshi', 'Information Technology', 7, 'Prof. Radhika Rao', 7.75, 82.00, 85.00, 72.00, 76.00, 65.00),
('EP-129', 'Lalit Mathur', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 6.45, 79.00, 75.00, 58.00, 65.00, 52.00),
('EP-130', 'Neelam Bagga', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 8.05, 85.00, 88.00, 70.00, 75.00, 68.00),
('EP-131', 'Ojasvi Saxena', 'AI & Data Science', 7, 'Prof. Radhika Rao', 7.40, 81.00, 80.00, 68.00, 70.00, 62.00),
('EP-132', 'Pranav Bajaj', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 7.80, 87.00, 84.00, 74.00, 76.00, 70.00),
('EP-133', 'Qasim Ali', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 5.80, 70.00, 60.00, 62.00, 68.00, 55.00),
('EP-134', 'Rupal Goswami', 'Information Technology', 7, 'Dr. Suresh Varma', 9.00, 93.00, 95.00, 85.00, 90.00, 80.00),
('EP-135', 'Soham Kulkarni', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 6.20, 76.00, 72.00, 48.00, 55.00, 45.00),
('EP-136', 'Trisha Sen', 'AI & Data Science', 7, 'Prof. Radhika Rao', 8.50, 88.00, 91.00, 80.00, 84.00, 75.00),
('EP-137', 'Utkarsh Pandey', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 5.50, 69.00, 54.00, 45.00, 48.00, 40.00),
('EP-138', 'Vaishnavi Rathi', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 7.95, 87.00, 89.00, 76.00, 80.00, 70.00),
('EP-139', 'Varun Kapoor', 'Information Technology', 7, 'Prof. Radhika Rao', 8.80, 90.00, 92.00, 39.00, 54.00, 42.00),
('EP-140', 'Waseem Akram', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 7.25, 81.00, 79.00, 64.00, 69.00, 55.00),
('EP-141', 'Yashwardhan Shukla', 'AI & Data Science', 7, 'Prof. Radhika Rao', 6.70, 78.00, 76.00, 58.00, 66.00, 50.00),
('EP-142', 'Zoya Farooqui', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 9.10, 94.00, 96.00, 89.00, 91.00, 85.00),
('EP-143', 'Abhishek Nambiar', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 6.85, 80.00, 75.00, 59.00, 62.00, 48.00),
('EP-144', 'Barkha Saxena', 'Information Technology', 7, 'Prof. Radhika Rao', 7.55, 83.00, 86.00, 68.00, 72.00, 64.00),
('EP-145', 'Chetan Gokhale', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 5.70, 67.00, 58.00, 54.00, 56.00, 42.00),
('EP-146', 'Damini Bose', 'AI & Data Science', 7, 'Prof. Radhika Rao', 8.75, 91.00, 93.00, 85.00, 87.00, 78.00),
('EP-147', 'Eklavya Prasad', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 7.05, 79.00, 81.00, 65.00, 73.00, 60.00),
('EP-148', 'Falguni Parekh', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 8.25, 88.00, 87.00, 72.00, 77.00, 68.00),
('EP-149', 'Girish Chandra', 'Information Technology', 7, 'Prof. Radhika Rao', 5.90, 74.00, 64.00, 46.00, 50.00, 40.00),
('EP-150', 'Himanshu Tyagi', 'AI & Data Science', 7, 'Prof. Radhika Rao', 8.00, 84.00, 86.00, 75.00, 79.00, 67.00),
('EP-151', 'Ira Trivedi', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 8.95, 92.00, 94.00, 44.00, 60.00, 48.00),
('EP-152', 'Jitin Mathew', 'Electronics & Communication', 7, 'Prof. Hemant Joshi', 7.45, 83.00, 81.00, 66.00, 70.00, 58.00),
('EP-153', 'Kamakshi Hegde', 'AI & Data Science', 7, 'Prof. Radhika Rao', 9.35, 95.00, 97.00, 91.00, 93.00, 88.00),
('EP-154', 'Lokesh Agrawal', 'Mechanical Engineering', 7, 'Prof. Hemant Joshi', 5.65, 72.00, 61.00, 51.00, 55.00, 44.00),
('EP-155', 'Manan Chopra', 'Computer Science & Engineering', 7, 'Dr. Suresh Varma', 7.70, 85.00, 87.00, 71.00, 77.00, 65.00);

-- Insert Sample Assessments
INSERT INTO public.assessments (student_id, subject_name, marks, max_marks, assessment_type) VALUES
('EP-101', 'Data Structures & Algorithms', 95.0, 100.0, 'Subject'),
('EP-101', 'Operating Systems', 88.0, 100.0, 'Subject'),
('EP-101', 'DSA Assessment', 92.0, 100.0, 'DSA Assessment'),
('EP-104', 'Theory of Computation', 92.0, 100.0, 'Subject'),
('EP-104', 'DSA Assessment (Timed)', 38.0, 100.0, 'DSA Assessment'),
('EP-104', 'Mock HR Interview', 32.0, 100.0, 'Interview'),
('EP-107', 'Data Structures', 52.0, 100.0, 'Subject'),
('EP-110', 'Data Structures', 46.0, 100.0, 'Subject'),
('EP-110', 'DSA Assessment', 28.0, 100.0, 'DSA Assessment');

-- Insert Sample Activities
INSERT INTO public.student_activity (student_id, activity_type, activity_description, completion_status) VALUES
('EP-101', 'Hackathon', 'Smart India Hackathon Finalist', 'Completed'),
('EP-101', 'Certification', 'AWS Cloud Practitioner Certification', 'Completed'),
('EP-102', 'Research', 'Published IEEE Paper on Vision Transformers', 'Completed'),
('EP-103', 'Open Source', 'Google Summer of Code Mentee', 'Completed'),
('EP-107', 'Sports', 'College Football Team Captain', 'Completed');

-- Insert Sample Historical Snapshots
INSERT INTO public.student_history (student_id, semester_label, cgpa_snapshot, attendance_snapshot, assignment_completion_snapshot, placement_readiness_snapshot, calculated_success_score) VALUES
('EP-101', 'Sem 5', 8.95, 92.0, 90.0, 75.0, 84.0),
('EP-101', 'Sem 6', 9.08, 95.0, 94.0, 82.0, 88.0),
('EP-101', 'Sem 7', 9.15, 94.0, 96.0, 88.0, 91.0),
('EP-104', 'Sem 5', 8.70, 90.0, 92.0, 35.0, 71.0),
('EP-104', 'Sem 6', 8.80, 92.0, 94.0, 36.0, 72.0),
('EP-104', 'Sem 7', 8.85, 91.0, 95.0, 38.0, 73.0);

-- Insert Sample Interventions
INSERT INTO public.interventions (student_id, intervention_type, description, assigned_faculty, due_date, status, follow_up_notes) VALUES
('EP-104', 'Schedule a mock interview', 'High CGPA (8.85) but low placement score (38%). Assigned to specialized DSA interview simulation with Alumni mentor.', 'Dr. Suresh Varma', '2026-04-20', 'In Progress', 'Completed session 1 on dynamic programming. Next session on system design interview scheduled for Friday.'),
('EP-107', 'Review attendance barriers', 'Attendance dropped to 68% and CGPA is 5.60. Need to investigate medical or commute challenges and outline makeup assignments.', 'Dr. Suresh Varma', '2026-04-12', 'Completed', 'Met student. Transportation issue resolved. Approved remedial lab schedule; student agreed to submit backlog tasks by Sem 7 end.'),
('EP-110', 'Arrange a follow-up discussion', 'Priority review triggered. CGPA 5.25 and attendance 58%. Dual academic and placement support required urgently.', 'Dr. Suresh Varma', '2026-04-15', 'Pending', 'Awaiting parent-faculty academic counseling slot.'),
('EP-118', 'Assign a coding-practice plan', 'CGPA 8.70 with low placement readiness (40%). Enrolled in 4-week LeetCode pattern sprint focused on graphs & trees.', 'Prof. Radhika Rao', '2026-05-01', 'In Progress', 'Sprint week 1 completed: 15 questions solved. Weekly review on Sundays.');
