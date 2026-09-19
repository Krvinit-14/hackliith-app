# AlumNexus

A closed, verified student-alumni networking platform for colleges.

## Structure
```
alumnexus/
  frontend/            HTML + CSS + vanilla JavaScript (runs on its own with demo data)
    index.html
    css/style.css
    js/state.js        demo data, colleges, accounts, app state
    js/matching.js     rule-based alumni matching (replace with ML later)
    js/components.js   cards and reusable UI pieces
    js/views.js        pages: landing, college, login, sign-up, dashboards
    js/actions.js      click handling and app logic
    js/api.js          client for the backend (not wired in yet)
  backend/             Node.js + Express + SQLite REST API
    src/server.js  src/db.js  src/schema.sql  src/seed.js
    src/routes/        auth, alumni, mentorship, opportunities, admin
    src/middleware/    JWT auth + role-based access
    src/services/      matching.js (server-side scoring)
```

## Run the frontend only (demo mode)
Open `frontend/index.html` in a browser. Demo IDs: CSE2022047 / Student@123 (student),
CSE2017031 / Alumni@123, FAC-1021 / Faculty@123, ADMIN-001 / Admin@123. College website: www.college.edu

## Run the backend (needs Node.js 18+)
```
cd backend
npm install
cp .env.example .env      # then set a long random JWT_SECRET
npm run seed
npm start                 # http://localhost:4000 (API under /api, frontend served too)
```

## API
| Method | Path | Who |
|---|---|---|
| GET | /api/colleges/lookup?url= | anyone |
| POST | /api/auth/register, /api/auth/login | anyone |
| GET | /api/alumni, /api/alumni/:id | signed in |
| GET | /api/alumni/match?goal= | student |
| POST | /api/mentorship | student |
| GET / PATCH | /api/mentorship, /api/mentorship/:id | student, alumni |
| GET / POST | /api/mentorship/:id/messages | the two participants |
| GET / POST | /api/opportunities | signed in / alumni, faculty, admin |
| PATCH | /api/opportunities/:id/approve | admin |
| GET / PATCH | /api/admin/registrations, /api/admin/stats | admin |

## Status
The frontend runs on in-memory demo data. The backend is a working scaffold that has not been
connected to the frontend yet: replace the logic in `actions.js` with the calls in `js/api.js`.
