CREATE TABLE IF NOT EXISTS colleges(id INTEGER PRIMARY KEY, name TEXT NOT NULL, domain TEXT UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY, college_id INTEGER NOT NULL REFERENCES colleges(id),
  role TEXT NOT NULL CHECK(role IN('student','alumni','faculty','admin')),
  reg_id TEXT NOT NULL, name TEXT NOT NULL, email TEXT, phone TEXT, dob TEXT, gender TEXT, city TEXT,
  branch TEXT, batch_year INTEGER, company TEXT, job_role TEXT, designation TEXT, expertise TEXT, skills TEXT DEFAULT '',
  password_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN('pending','approved','rejected')),
  mentoring INTEGER DEFAULT 1, UNIQUE(college_id, reg_id));
CREATE TABLE IF NOT EXISTS mentorship(
  id INTEGER PRIMARY KEY, student_id INTEGER NOT NULL REFERENCES users(id), alumni_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', session_time TEXT, rating INTEGER, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY, mentorship_id INTEGER NOT NULL REFERENCES mentorship(id), sender_id INTEGER NOT NULL REFERENCES users(id),
  body TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS opportunities(
  id INTEGER PRIMARY KEY, college_id INTEGER NOT NULL REFERENCES colleges(id), posted_by INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL, type TEXT NOT NULL, branch TEXT DEFAULT 'All', mode TEXT DEFAULT 'Remote', level TEXT DEFAULT 'Beginner',
  status TEXT NOT NULL DEFAULT 'pending', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS reports(id INTEGER PRIMARY KEY, reporter_id INTEGER, target_user_id INTEGER, reason TEXT, status TEXT DEFAULT 'open');
