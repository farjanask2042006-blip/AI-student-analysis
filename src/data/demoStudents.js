/**
 * EduPulse AI - Fictional Demo Dataset
 * 
 * DISCLAIMER: All student records, names, IDs, and metrics are synthetic and fictional.
 * Generated specifically for hackathon evaluation and technical decision-support demonstration.
 */

export const INITIAL_DEMO_STUDENTS = [
  // --- High Academics, Placement Ready ---
  {
    student_id: 'EP-101',
    name: 'Aarav Patel',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 9.15,
    attendance_pct: 94,
    assignment_completion_pct: 96,
    placement_readiness_pct: 88,
    skills_score: 92,
    engagement_score: 85,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Data Structures & Algorithms', marks: 95, max: 100 },
      { subject: 'Operating Systems', marks: 88, max: 100 },
      { subject: 'Database Management Systems', marks: 92, max: 100 },
      { subject: 'Computer Networks', marks: 91, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 92, max: 100 },
      { type: 'Aptitude & Reasoning', score: 86, max: 100 },
      { type: 'Technical Interview', score: 88, max: 100 },
      { type: 'Mock HR Interview', score: 85, max: 100 },
    ],
    activities: [
      { title: 'Smart India Hackathon Finalist', type: 'Hackathon', date: '2026-03-15' },
      { title: 'AWS Cloud Practitioner Certification', type: 'Certification', date: '2026-01-20' },
      { title: 'ACM Student Chapter Vice Lead', type: 'Club', date: '2025-08-10' }
    ],
    history: [
      { semester: 'Sem 5', cgpa: 8.95, attendance: 92, placement: 75, score: 84 },
      { semester: 'Sem 6', cgpa: 9.08, attendance: 95, placement: 82, score: 88 },
      { semester: 'Sem 7', cgpa: 9.15, attendance: 94, placement: 88, score: 91 }
    ]
  },
  {
    student_id: 'EP-102',
    name: 'Priya Sharma',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 9.40,
    attendance_pct: 96,
    assignment_completion_pct: 98,
    placement_readiness_pct: 92,
    skills_score: 95,
    engagement_score: 90,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Deep Learning', marks: 96, max: 100 },
      { subject: 'Natural Language Processing', marks: 94, max: 100 },
      { subject: 'Big Data Analytics', marks: 92, max: 100 },
      { subject: 'Linear Algebra', marks: 95, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 90, max: 100 },
      { type: 'Aptitude & Reasoning', score: 94, max: 100 },
      { type: 'Technical Interview', score: 95, max: 100 },
      { type: 'Mock HR Interview', score: 90, max: 100 },
    ],
    activities: [
      { title: 'Published IEEE Paper on Vision Transformers', type: 'Research', date: '2026-02-10' },
      { title: 'Kaggle Grandmaster Contributor', type: 'Project', date: '2025-11-20' }
    ],
    history: [
      { semester: 'Sem 5', cgpa: 9.20, attendance: 94, placement: 85, score: 89 },
      { semester: 'Sem 6', cgpa: 9.35, attendance: 96, placement: 89, score: 92 },
      { semester: 'Sem 7', cgpa: 9.40, attendance: 96, placement: 92, score: 94 }
    ]
  },
  {
    student_id: 'EP-103',
    name: 'Vikramaditya Roy',
    department: 'Information Technology',
    semester: 7,
    cgpa: 8.65,
    attendance_pct: 88,
    assignment_completion_pct: 92,
    placement_readiness_pct: 84,
    skills_score: 86,
    engagement_score: 75,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Cloud Computing', marks: 88, max: 100 },
      { subject: 'Information Security', marks: 84, max: 100 },
      { subject: 'Full Stack Development', marks: 90, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 85, max: 100 },
      { type: 'Aptitude & Reasoning', score: 82, max: 100 },
      { type: 'Technical Interview', score: 84, max: 100 },
    ],
    activities: [
      { title: 'Google Summer of Code Mentee', type: 'Open Source', date: '2025-09-01' }
    ],
    history: [
      { semester: 'Sem 5', cgpa: 8.40, attendance: 86, placement: 70, score: 80 },
      { semester: 'Sem 6', cgpa: 8.55, attendance: 87, placement: 78, score: 83 },
      { semester: 'Sem 7', cgpa: 8.65, attendance: 88, placement: 84, score: 86 }
    ]
  },

  // --- Strong Academics, Low Placement Readiness (Target Cohort) ---
  {
    student_id: 'EP-104',
    name: 'Rohan Gupta',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 8.85,
    attendance_pct: 91,
    assignment_completion_pct: 95,
    placement_readiness_pct: 38, // LOW PLACEMENT!
    skills_score: 58,
    engagement_score: 45,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Theory of Computation', marks: 92, max: 100 },
      { subject: 'Design & Analysis of Algorithms', marks: 89, max: 100 },
      { subject: 'Database Management Systems', marks: 90, max: 100 },
      { subject: 'Compiler Design', marks: 86, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment (Timed)', score: 38, max: 100 },
      { type: 'Aptitude & Quantitative', score: 45, max: 100 },
      { type: 'Mock HR Interview', score: 32, max: 100 },
      { type: 'Technical Live Coding', score: 36, max: 100 },
    ],
    activities: [],
    history: [
      { semester: 'Sem 5', cgpa: 8.70, attendance: 90, placement: 35, score: 71 },
      { semester: 'Sem 6', cgpa: 8.80, attendance: 92, placement: 36, score: 72 },
      { semester: 'Sem 7', cgpa: 8.85, attendance: 91, placement: 38, score: 73 }
    ]
  },
  {
    student_id: 'EP-105',
    name: 'Ananya Iyer',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 8.42,
    attendance_pct: 89,
    assignment_completion_pct: 90,
    placement_readiness_pct: 42, // LOW PLACEMENT
    skills_score: 52,
    engagement_score: 50,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Digital Signal Processing', marks: 88, max: 100 },
      { subject: 'VLSI Design', marks: 86, max: 100 },
      { subject: 'Embedded Systems', marks: 82, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 40, max: 100 },
      { type: 'Aptitude & Reasoning', score: 48, max: 100 },
      { type: 'Technical Interview', score: 42, max: 100 },
      { type: 'Mock HR Interview', score: 38, max: 100 },
    ],
    activities: [
      { title: 'Robotics Club Member', type: 'Club', date: '2025-10-12' }
    ],
    history: [
      { semester: 'Sem 5', cgpa: 8.30, attendance: 87, placement: 40, score: 70 },
      { semester: 'Sem 6', cgpa: 8.38, attendance: 88, placement: 41, score: 71 },
      { semester: 'Sem 7', cgpa: 8.42, attendance: 89, placement: 42, score: 72 }
    ]
  },
  {
    student_id: 'EP-106',
    name: 'Aditya Deshmukh',
    department: 'Information Technology',
    semester: 7,
    cgpa: 8.15,
    attendance_pct: 86,
    assignment_completion_pct: 88,
    placement_readiness_pct: 44, // LOW PLACEMENT
    skills_score: 60,
    engagement_score: 40,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Web Technologies', marks: 85, max: 100 },
      { subject: 'Computer Networks', marks: 82, max: 100 },
      { subject: 'Software Engineering', marks: 84, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 42, max: 100 },
      { type: 'Aptitude & Reasoning', score: 45, max: 100 },
      { type: 'Mock HR Interview', score: 45, max: 100 },
    ],
    activities: [],
    history: [
      { semester: 'Sem 5', cgpa: 8.00, attendance: 84, placement: 40, score: 68 },
      { semester: 'Sem 6', cgpa: 8.10, attendance: 85, placement: 42, score: 70 },
      { semester: 'Sem 7', cgpa: 8.15, attendance: 86, placement: 44, score: 71 }
    ]
  },

  // --- Needs Academic Support (CGPA < 6.0 or Attendance < 75%) ---
  {
    student_id: 'EP-107',
    name: 'Kabir Khan',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 5.60, // LOW CGPA (<6.0)
    attendance_pct: 68, // LOW ATTENDANCE (<75%)
    assignment_completion_pct: 55,
    placement_readiness_pct: 54,
    skills_score: 62,
    engagement_score: 58,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Data Structures', marks: 52, max: 100 },
      { subject: 'Operating Systems', marks: 54, max: 100 },
      { subject: 'Formal Languages & Automata', marks: 48, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 55, max: 100 },
      { type: 'Aptitude & Reasoning', score: 56, max: 100 },
      { type: 'Mock HR Interview', score: 52, max: 100 },
    ],
    activities: [
      { title: 'College Football Team Captain', type: 'Sports', date: '2025-11-15' }
    ],
    history: [
      { semester: 'Sem 5', cgpa: 6.10, attendance: 76, placement: 48, score: 61 },
      { semester: 'Sem 6', cgpa: 5.85, attendance: 71, placement: 50, score: 58 },
      { semester: 'Sem 7', cgpa: 5.60, attendance: 68, placement: 54, score: 56 }
    ]
  },
  {
    student_id: 'EP-108',
    name: 'Sneha Roy Chowdhury',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 5.45, // LOW CGPA
    attendance_pct: 71, // LOW ATTENDANCE
    assignment_completion_pct: 62,
    placement_readiness_pct: 52,
    skills_score: 55,
    engagement_score: 40,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Thermodynamics', marks: 50, max: 100 },
      { subject: 'Fluid Mechanics', marks: 52, max: 100 },
      { subject: 'Machine Design', marks: 56, max: 100 },
    ],
    placement_assessments: [
      { type: 'Core Aptitude', score: 54, max: 100 },
      { type: 'Technical Interview', score: 50, max: 100 },
    ],
    activities: [],
    history: [
      { semester: 'Sem 5', cgpa: 5.90, attendance: 78, placement: 45, score: 59 },
      { semester: 'Sem 6', cgpa: 5.65, attendance: 74, placement: 48, score: 56 },
      { semester: 'Sem 7', cgpa: 5.45, attendance: 71, placement: 52, score: 55 }
    ]
  },
  {
    student_id: 'EP-109',
    name: 'Pooja Verma',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 7.20,
    attendance_pct: 62, // LOW ATTENDANCE (<75%)
    assignment_completion_pct: 70,
    placement_readiness_pct: 65,
    skills_score: 72,
    engagement_score: 45,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Machine Learning', marks: 74, max: 100 },
      { subject: 'Data Mining', marks: 70, max: 100 },
    ],
    placement_assessments: [
      { type: 'Coding Round', score: 68, max: 100 },
      { type: 'Aptitude', score: 62, max: 100 },
    ],
    activities: [],
    history: [
      { semester: 'Sem 5', cgpa: 7.40, attendance: 70, placement: 60, score: 68 },
      { semester: 'Sem 6', cgpa: 7.30, attendance: 65, placement: 62, score: 67 },
      { semester: 'Sem 7', cgpa: 7.20, attendance: 62, placement: 65, score: 66 }
    ]
  },

  // --- Dual Support Needed (Academic Risk AND Placement Risk) ---
  {
    student_id: 'EP-110',
    name: 'Tanmay Bhattacharya',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 5.25, // LOW CGPA
    attendance_pct: 58, // LOW ATTENDANCE
    assignment_completion_pct: 48,
    placement_readiness_pct: 32, // LOW PLACEMENT
    skills_score: 40,
    engagement_score: 30,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Data Structures', marks: 46, max: 100 },
      { subject: 'Computer Architecture', marks: 50, max: 100 },
      { subject: 'Algorithms', marks: 44, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 28, max: 100 },
      { type: 'Aptitude Test', score: 35, max: 100 },
      { type: 'Mock HR Interview', score: 32, max: 100 },
    ],
    activities: [],
    history: [
      { semester: 'Sem 5', cgpa: 5.90, attendance: 70, placement: 40, score: 55 },
      { semester: 'Sem 6', cgpa: 5.50, attendance: 64, placement: 35, score: 49 },
      { semester: 'Sem 7', cgpa: 5.25, attendance: 58, placement: 32, score: 44 }
    ]
  },
  {
    student_id: 'EP-111',
    name: 'Manish Rawat',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 5.30,
    attendance_pct: 64,
    assignment_completion_pct: 50,
    placement_readiness_pct: 36,
    skills_score: 42,
    engagement_score: 35,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Signals & Systems', marks: 48, max: 100 },
      { subject: 'Microprocessors', marks: 52, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Test', score: 34, max: 100 },
      { type: 'Aptitude', score: 38, max: 100 },
    ],
    activities: [],
    history: [
      { semester: 'Sem 5', cgpa: 5.80, attendance: 72, placement: 42, score: 54 },
      { semester: 'Sem 6', cgpa: 5.50, attendance: 68, placement: 38, score: 48 },
      { semester: 'Sem 7', cgpa: 5.30, attendance: 64, placement: 36, score: 45 }
    ]
  },

  // --- Incomplete Data Records (Audit / Data Quality) ---
  {
    student_id: 'EP-112',
    name: 'Simran Sandhu',
    department: 'Information Technology',
    semester: 7,
    cgpa: 8.20,
    attendance_pct: 86,
    assignment_completion_pct: null, // MISSING ASSIGNMENT
    placement_readiness_pct: 75,
    skills_score: 78,
    engagement_score: 65,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Web Technologies', marks: 82, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 74, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-113',
    name: 'Kunal Singhal',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: null, // MISSING CGPA (Late credit transfer)
    attendance_pct: 78,
    assignment_completion_pct: 82,
    placement_readiness_pct: 60,
    skills_score: 68,
    engagement_score: 55,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [],
    placement_assessments: [],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-114',
    name: 'Nisha Kulkarni',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 7.90,
    attendance_pct: null, // MISSING ATTENDANCE (Biometric transfer pending)
    assignment_completion_pct: 88,
    placement_readiness_pct: 70,
    skills_score: 75,
    engagement_score: 60,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [],
    placement_assessments: [],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-115',
    name: 'Deepak Chawla',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 7.10,
    attendance_pct: 82,
    assignment_completion_pct: 79,
    placement_readiness_pct: null, // MISSING PLACEMENT (Missed assessment slot)
    skills_score: 70,
    engagement_score: 50,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [],
    placement_assessments: [],
    activities: [],
    history: []
  },

  // --- Balanced / Developing Cohort & Additional Diverse Students ---
  {
    student_id: 'EP-116',
    name: 'Ritika Sen',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 7.60,
    attendance_pct: 84,
    assignment_completion_pct: 85,
    placement_readiness_pct: 66,
    skills_score: 74,
    engagement_score: 65,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Software Testing', marks: 78, max: 100 },
      { subject: 'Database Systems', marks: 75, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 68, max: 100 },
      { type: 'DSA Round', score: 64, max: 100 }
    ],
    activities: [
      { title: 'Tech Fest Coordinator', type: 'Event', date: '2026-02-18' }
    ],
    history: [
      { semester: 'Sem 6', cgpa: 7.50, attendance: 82, placement: 62, score: 72 },
      { semester: 'Sem 7', cgpa: 7.60, attendance: 84, placement: 66, score: 75 }
    ]
  },
  {
    student_id: 'EP-117',
    name: 'Aryan Dixit',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 8.90,
    attendance_pct: 92,
    assignment_completion_pct: 94,
    placement_readiness_pct: 86,
    skills_score: 88,
    engagement_score: 82,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Data Science with Python', marks: 90, max: 100 },
      { subject: 'Neural Networks', marks: 88, max: 100 }
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 86, max: 100 },
      { type: 'Aptitude Test', score: 88, max: 100 }
    ],
    activities: [
      { title: 'AI Society Secretary', type: 'Club', date: '2025-08-20' }
    ],
    history: [
      { semester: 'Sem 6', cgpa: 8.75, attendance: 90, placement: 80, score: 85 },
      { semester: 'Sem 7', cgpa: 8.90, attendance: 92, placement: 86, score: 88 }
    ]
  },
  {
    student_id: 'EP-118',
    name: 'Karthik Nair',
    department: 'Information Technology',
    semester: 7,
    cgpa: 8.70,
    attendance_pct: 88,
    assignment_completion_pct: 90,
    placement_readiness_pct: 40, // HIGH CGPA, LOW PLACEMENT!
    skills_score: 55,
    engagement_score: 48,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Operating Systems', marks: 88, max: 100 },
      { subject: 'Object Oriented Programming', marks: 86, max: 100 }
    ],
    placement_assessments: [
      { type: 'DSA Round 1', score: 38, max: 100 },
      { type: 'Aptitude', score: 42, max: 100 }
    ],
    activities: [],
    history: [
      { semester: 'Sem 6', cgpa: 8.60, attendance: 87, placement: 38, score: 70 },
      { semester: 'Sem 7', cgpa: 8.70, attendance: 88, placement: 40, score: 72 }
    ]
  },
  {
    student_id: 'EP-119',
    name: 'Meera Nair',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 7.35,
    attendance_pct: 80,
    assignment_completion_pct: 82,
    placement_readiness_pct: 62,
    skills_score: 68,
    engagement_score: 60,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Control Systems', marks: 74, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude', score: 64, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-120',
    name: 'Farhan Zaidi',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 6.80,
    attendance_pct: 78,
    assignment_completion_pct: 76,
    placement_readiness_pct: 60,
    skills_score: 70,
    engagement_score: 55,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Web Architecture', marks: 72, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 62, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-121',
    name: 'Bhavna Chauhan',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 8.30,
    attendance_pct: 86,
    assignment_completion_pct: 89,
    placement_readiness_pct: 78,
    skills_score: 82,
    engagement_score: 70,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Statistical Inference', marks: 84, max: 100 },
    ],
    placement_assessments: [
      { type: 'Python Screening', score: 80, max: 100 },
    ],
    activities: [
      { title: 'Women in STEM Club Treasurer', type: 'Club', date: '2025-10-01' }
    ],
    history: []
  },
  {
    student_id: 'EP-122',
    name: 'Siddharth Menon',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 7.10,
    attendance_pct: 82,
    assignment_completion_pct: 78,
    placement_readiness_pct: 58,
    skills_score: 64,
    engagement_score: 50,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'CAD/CAM Analysis', marks: 75, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude', score: 60, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-123',
    name: 'Gauri Pillai',
    department: 'Information Technology',
    semester: 7,
    cgpa: 5.75, // ACADEMIC REVIEW (<6.0)
    attendance_pct: 80,
    assignment_completion_pct: 65,
    placement_readiness_pct: 55,
    skills_score: 58,
    engagement_score: 45,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Operating Systems', marks: 54, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 55, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-124',
    name: 'Harsh Vardhan',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 9.30,
    attendance_pct: 95,
    assignment_completion_pct: 97,
    placement_readiness_pct: 94,
    skills_score: 96,
    engagement_score: 90,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Distributed Systems', marks: 95, max: 100 },
      { subject: 'Cloud Native Arch', marks: 92, max: 100 }
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 96, max: 100 },
      { type: 'System Design', score: 92, max: 100 }
    ],
    activities: [
      { title: 'Red Hat Certified Engineer', type: 'Certification', date: '2026-01-14' }
    ],
    history: []
  },
  {
    student_id: 'EP-125',
    name: 'Ishaan Trivedi',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 6.90,
    attendance_pct: 72, // ATTENDANCE REVIEW (<75%)
    assignment_completion_pct: 74,
    placement_readiness_pct: 60,
    skills_score: 66,
    engagement_score: 52,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Analog Circuits', marks: 68, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Test', score: 62, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-126',
    name: 'Jayesh Sonawane',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 5.15, // DUAL RISK
    attendance_pct: 66,
    assignment_completion_pct: 46,
    placement_readiness_pct: 35,
    skills_score: 38,
    engagement_score: 30,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Kinematics of Machinery', marks: 48, max: 100 },
    ],
    placement_assessments: [
      { type: 'Core Aptitude', score: 36, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-127',
    name: 'Divya Sen',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 8.60,
    attendance_pct: 90,
    assignment_completion_pct: 92,
    placement_readiness_pct: 46, // HIGH CGPA, LOW PLACEMENT!
    skills_score: 56,
    engagement_score: 50,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Machine Learning Theory', marks: 88, max: 100 },
    ],
    placement_assessments: [
      { type: 'Coding Test', score: 44, max: 100 },
      { type: 'HR Interview', score: 48, max: 100 }
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-128',
    name: 'Kavita Joshi',
    department: 'Information Technology',
    semester: 7,
    cgpa: 7.75,
    attendance_pct: 82,
    assignment_completion_pct: 85,
    placement_readiness_pct: 72,
    skills_score: 76,
    engagement_score: 65,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Cyber Law & Ethics', marks: 80, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 74, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-129',
    name: 'Lalit Mathur',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 6.45,
    attendance_pct: 79,
    assignment_completion_pct: 75,
    placement_readiness_pct: 58,
    skills_score: 65,
    engagement_score: 52,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Microprocessors', marks: 66, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 58, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-130',
    name: 'Neelam Bagga',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 8.05,
    attendance_pct: 85,
    assignment_completion_pct: 88,
    placement_readiness_pct: 70,
    skills_score: 75,
    engagement_score: 68,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Antenna & Wave Propagation', marks: 82, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 70, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-131',
    name: 'Ojasvi Saxena',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 7.40,
    attendance_pct: 81,
    assignment_completion_pct: 80,
    placement_readiness_pct: 68,
    skills_score: 70,
    engagement_score: 62,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Linear Algebra', marks: 76, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 70, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-132',
    name: 'Pranav Bajaj',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 7.80,
    attendance_pct: 87,
    assignment_completion_pct: 84,
    placement_readiness_pct: 74,
    skills_score: 76,
    engagement_score: 70,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Thermal Engineering', marks: 80, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 72, max: 100 },
    ],
    activities: [
      { title: 'Formula Student Chassis Team', type: 'Project', date: '2025-12-05' }
    ],
    history: []
  },
  {
    student_id: 'EP-133',
    name: 'Qasim Ali',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 5.80, // ACADEMIC REVIEW (<6.0)
    attendance_pct: 70, // ATTENDANCE REVIEW (<75%)
    assignment_completion_pct: 60,
    placement_readiness_pct: 62,
    skills_score: 68,
    engagement_score: 55,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Computer Networks', marks: 58, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 64, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-134',
    name: 'Rupal Goswami',
    department: 'Information Technology',
    semester: 7,
    cgpa: 9.00,
    attendance_pct: 93,
    assignment_completion_pct: 95,
    placement_readiness_pct: 85,
    skills_score: 90,
    engagement_score: 80,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Database Internals', marks: 92, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Interview', score: 88, max: 100 },
    ],
    activities: [
      { title: 'Google Cloud Certified Associate', type: 'Certification', date: '2026-02-02' }
    ],
    history: []
  },
  {
    student_id: 'EP-135',
    name: 'Soham Kulkarni',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 6.20,
    attendance_pct: 76,
    assignment_completion_pct: 72,
    placement_readiness_pct: 48, // PLACEMENT SUPPORT (<50%)
    skills_score: 55,
    engagement_score: 45,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Embedded Systems', marks: 64, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 46, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-136',
    name: 'Trisha Sen',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 8.50,
    attendance_pct: 88,
    assignment_completion_pct: 91,
    placement_readiness_pct: 80,
    skills_score: 84,
    engagement_score: 75,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Computer Vision', marks: 86, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 82, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-137',
    name: 'Utkarsh Pandey',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 5.50, // ACADEMIC REVIEW
    attendance_pct: 69, // ATTENDANCE REVIEW
    assignment_completion_pct: 54,
    placement_readiness_pct: 45, // PLACEMENT REVIEW
    skills_score: 48,
    engagement_score: 40,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Applied Mechanics', marks: 52, max: 100 },
    ],
    placement_assessments: [
      { type: 'Core Aptitude', score: 42, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-138',
    name: 'Vaishnavi Rathi',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 7.95,
    attendance_pct: 87,
    assignment_completion_pct: 89,
    placement_readiness_pct: 76,
    skills_score: 80,
    engagement_score: 70,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Data Mining', marks: 82, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 76, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-139',
    name: 'Varun Kapoor',
    department: 'Information Technology',
    semester: 7,
    cgpa: 8.80,
    attendance_pct: 90,
    assignment_completion_pct: 92,
    placement_readiness_pct: 39, // HIGH CGPA, LOW PLACEMENT!
    skills_score: 54,
    engagement_score: 42,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Distributed Computing', marks: 88, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 36, max: 100 },
      { type: 'Mock HR Interview', score: 42, max: 100 }
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-140',
    name: 'Waseem Akram',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 7.25,
    attendance_pct: 81,
    assignment_completion_pct: 79,
    placement_readiness_pct: 64,
    skills_score: 69,
    engagement_score: 55,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Microcontrollers', marks: 74, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Test', score: 65, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-141',
    name: 'Yashwardhan Shukla',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 6.70,
    attendance_pct: 78,
    assignment_completion_pct: 76,
    placement_readiness_pct: 58,
    skills_score: 66,
    engagement_score: 50,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Data Warehousing', marks: 68, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 60, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-142',
    name: 'Zoya Farooqui',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 9.10,
    attendance_pct: 94,
    assignment_completion_pct: 96,
    placement_readiness_pct: 89,
    skills_score: 91,
    engagement_score: 85,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Cryptography', marks: 92, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Assessment', score: 90, max: 100 },
    ],
    activities: [
      { title: 'Cybersecurity Club Lead', type: 'Club', date: '2025-09-12' }
    ],
    history: []
  },
  {
    student_id: 'EP-143',
    name: 'Abhishek Nambiar',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 6.85,
    attendance_pct: 80,
    assignment_completion_pct: 75,
    placement_readiness_pct: 59,
    skills_score: 62,
    engagement_score: 48,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Manufacturing Processes', marks: 70, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 60, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-144',
    name: 'Barkha Saxena',
    department: 'Information Technology',
    semester: 7,
    cgpa: 7.55,
    attendance_pct: 83,
    assignment_completion_pct: 86,
    placement_readiness_pct: 68,
    skills_score: 72,
    engagement_score: 64,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'E-Commerce Tech', marks: 78, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 70, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-145',
    name: 'Chetan Gokhale',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 5.70, // ACADEMIC REVIEW
    attendance_pct: 67, // ATTENDANCE REVIEW
    assignment_completion_pct: 58,
    placement_readiness_pct: 54,
    skills_score: 56,
    engagement_score: 42,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Digital Communication', marks: 55, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 52, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-146',
    name: 'Damini Bose',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 8.75,
    attendance_pct: 91,
    assignment_completion_pct: 93,
    placement_readiness_pct: 85,
    skills_score: 87,
    engagement_score: 78,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Reinforcement Learning', marks: 89, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 86, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-147',
    name: 'Eklavya Prasad',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 7.05,
    attendance_pct: 79,
    assignment_completion_pct: 81,
    placement_readiness_pct: 65,
    skills_score: 73,
    engagement_score: 60,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Compiler Construction', marks: 72, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 68, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-148',
    name: 'Falguni Parekh',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 8.25,
    attendance_pct: 88,
    assignment_completion_pct: 87,
    placement_readiness_pct: 72,
    skills_score: 77,
    engagement_score: 68,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Heat Transfer', marks: 84, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 74, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-149',
    name: 'Girish Chandra',
    department: 'Information Technology',
    semester: 7,
    cgpa: 5.90, // ACADEMIC REVIEW (<6.0)
    attendance_pct: 74, // ATTENDANCE REVIEW (<75%)
    assignment_completion_pct: 64,
    placement_readiness_pct: 46, // PLACEMENT SUPPORT (<50%) -> DUAL
    skills_score: 50,
    engagement_score: 40,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Data Communications', marks: 58, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 45, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-150',
    name: 'Himanshu Tyagi',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 8.00,
    attendance_pct: 84,
    assignment_completion_pct: 86,
    placement_readiness_pct: 75,
    skills_score: 79,
    engagement_score: 67,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Cloud AI Services', marks: 82, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 76, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-151',
    name: 'Ira Trivedi',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 8.95,
    attendance_pct: 92,
    assignment_completion_pct: 94,
    placement_readiness_pct: 44, // HIGH CGPA, LOW PLACEMENT!
    skills_score: 60,
    engagement_score: 48,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Advanced Algorithms', marks: 90, max: 100 },
    ],
    placement_assessments: [
      { type: 'Mock Technical Interview', score: 42, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-152',
    name: 'Jitin Mathew',
    department: 'Electronics & Communication',
    semester: 7,
    cgpa: 7.45,
    attendance_pct: 83,
    assignment_completion_pct: 81,
    placement_readiness_pct: 66,
    skills_score: 70,
    engagement_score: 58,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Wireless Communications', marks: 76, max: 100 },
    ],
    placement_assessments: [
      { type: 'Technical Screening', score: 68, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-153',
    name: 'Kamakshi Hegde',
    department: 'AI & Data Science',
    semester: 7,
    cgpa: 9.35,
    attendance_pct: 95,
    assignment_completion_pct: 97,
    placement_readiness_pct: 91,
    skills_score: 93,
    engagement_score: 88,
    mentor: 'Prof. Radhika Rao',
    subject_marks: [
      { subject: 'Generative AI', marks: 95, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 92, max: 100 },
    ],
    activities: [
      { title: 'National Hackathon 1st Runner Up', type: 'Hackathon', date: '2026-03-01' }
    ],
    history: []
  },
  {
    student_id: 'EP-154',
    name: 'Lokesh Agrawal',
    department: 'Mechanical Engineering',
    semester: 7,
    cgpa: 5.65, // ACADEMIC REVIEW
    attendance_pct: 72, // ATTENDANCE REVIEW
    assignment_completion_pct: 61,
    placement_readiness_pct: 51,
    skills_score: 55,
    engagement_score: 44,
    mentor: 'Prof. Hemant Joshi',
    subject_marks: [
      { subject: 'Dynamics of Machines', marks: 54, max: 100 },
    ],
    placement_assessments: [
      { type: 'Aptitude Test', score: 50, max: 100 },
    ],
    activities: [],
    history: []
  },
  {
    student_id: 'EP-155',
    name: 'Manan Chopra',
    department: 'Computer Science & Engineering',
    semester: 7,
    cgpa: 7.70,
    attendance_pct: 85,
    assignment_completion_pct: 87,
    placement_readiness_pct: 71,
    skills_score: 77,
    engagement_score: 65,
    mentor: 'Dr. Suresh Varma',
    subject_marks: [
      { subject: 'Network Security', marks: 78, max: 100 },
    ],
    placement_assessments: [
      { type: 'DSA Round', score: 72, max: 100 },
    ],
    activities: [],
    history: []
  }
];

export const INITIAL_INTERVENTIONS = [
  {
    id: 'INT-001',
    student_id: 'EP-104',
    student_name: 'Rohan Gupta',
    department: 'Computer Science & Engineering',
    intervention_type: 'Schedule a mock interview',
    description: 'High CGPA (8.85) but low placement score (38%). Assigned to specialized DSA interview simulation with Alumni mentor.',
    assigned_faculty: 'Dr. Suresh Varma',
    created_at: '2026-04-02T10:30:00Z',
    due_date: '2026-04-20',
    status: 'In Progress',
    follow_up_notes: 'Completed session 1 on dynamic programming. Next session on system design interview scheduled for Friday.'
  },
  {
    id: 'INT-002',
    student_id: 'EP-107',
    student_name: 'Kabir Khan',
    department: 'Computer Science & Engineering',
    intervention_type: 'Review attendance barriers',
    description: 'Attendance dropped to 68% and CGPA is 5.60. Need to investigate medical or commute challenges and outline makeup assignments.',
    assigned_faculty: 'Dr. Suresh Varma',
    created_at: '2026-03-28T14:15:00Z',
    due_date: '2026-04-12',
    status: 'Completed',
    follow_up_notes: 'Met student. Transportation issue resolved. Approved remedial lab schedule; student agreed to submit backlog tasks by Sem 7 end.'
  },
  {
    id: 'INT-003',
    student_id: 'EP-110',
    student_name: 'Tanmay Bhattacharya',
    department: 'Computer Science & Engineering',
    intervention_type: 'Arrange a follow-up discussion',
    description: 'Priority review triggered. CGPA 5.25 and attendance 58%. Dual academic and placement support required urgently.',
    assigned_faculty: 'Dr. Suresh Varma',
    created_at: '2026-04-05T09:00:00Z',
    due_date: '2026-04-15',
    status: 'Pending',
    follow_up_notes: 'Awaiting parent-faculty academic counseling slot.'
  },
  {
    id: 'INT-004',
    student_id: 'EP-118',
    student_name: 'Karthik Nair',
    department: 'Information Technology',
    intervention_type: 'Assign a coding-practice plan',
    description: 'CGPA 8.70 with low placement readiness (40%). Enrolled in 4-week LeetCode pattern sprint focused on graphs & trees.',
    assigned_faculty: 'Prof. Radhika Rao',
    created_at: '2026-04-04T11:00:00Z',
    due_date: '2026-05-01',
    status: 'In Progress',
    follow_up_notes: 'Sprint week 1 completed: 15 questions solved. Weekly review on Sundays.'
  }
];
