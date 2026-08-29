# Digital Library

A full-stack digital library application with role-based access (Admin, Teacher, Student), book and study-content management, Excel bulk imports, file uploads, and a Redis-backed visitor counter.

## Tech Stack

- **Backend:** Node.js, Express, multer (uploads), bcrypt, mysql2 (and legacy mysql), Redis (visitor count)
- **Frontend:** React 18 (Create React App), MUI, Axios, React Router
- **Databases:** MySQL 9 (4 separate databases), Redis

## Prerequisites

- Node.js (v18+), npm
- Homebrew, then:
  ```bash
  brew install mysql redis
  brew services start mysql
  brew services start redis
  ```
- MySQL root user with an **empty password** (Homebrew default). If yours differs, set `DB_USER` / `DB_PASSWORD` in `backend/.env`.

## One-Time Database Setup

The schema is not checked into the app code; it was derived from the route queries and lives in `backend/schema.sql`. It creates 4 databases:

| Database        | Used by                              | Tables            |
| --------------- | ------------------------------------ | ----------------- |
| `student_records` | `db.js` (student routes/login)     | `students`        |
| `digital_library` | `bookDb.js` (book routes)          | `books`           |
| `content_db`      | `contentDb.js`, `teacherDb.js`     | `teachers`, `content` |
| `adminDb`         | `routes/adminLogin.js`, `admin.js` | `admins`          |

```bash
mysql -u root < backend/schema.sql
# Seed the admin account (username: mrrobot, password: 1234)
cd backend && node admin.js
```

## Running the App

### Everything at once

```bash
./start.sh
```

Starts MySQL/Redis services (if not running), the backend with nodemon hot-reload on port **3000**, and the frontend on port **3001**. Ctrl+C stops both.

### Manually

```bash
# Backend (hot-reload)
cd backend
npm install
npm run dev          # or: npm start

# Frontend (separate terminal)
cd frontend
npm install --legacy-peer-deps   # react-file-viewer pins react 16 peers
PORT=3001 npm start
```

- Backend: http://localhost:3000
- Frontend: http://localhost:3001

The frontend hardcodes `http://localhost:3000` for all API calls, so the backend **must** run on port 3000 and the frontend on a different port (3001).

## Environment Variables

Backend reads `backend/.env` (all optional; defaults match local Homebrew setup):

| Variable      | Default                   | Purpose                          |
| ------------- | ------------------------- | -------------------------------- |
| `PORT`        | `3000`                    | Backend HTTP port                |
| `DB_HOST`     | `localhost`               | MySQL host (all 4 databases)     |
| `DB_USER`     | `root`                    | MySQL user                       |
| `DB_PASSWORD` | *(empty)*                 | MySQL password                   |
| `REDIS_URL`   | `redis://localhost:6379`  | Redis connection for visitor counter |

## Default Credentials

- Admin: username `mrrobot`, password `1234` (seeded by `backend/admin.js`).

## Key API Endpoints

| Endpoint | Description |
| --- | --- |
| `POST /api/adminlogin/adminLogin` | Admin login (bcrypt) |
| `POST /api/teacherlogin/teacherLogin` | Teacher login |
| `POST /api/studentlogin/...` | Student login |
| `GET/POST /api/books/*` | Book CRUD (multipart: `bookposter`, `bookpdf`) |
| `GET/POST /api/content/*` | Study content CRUD (multipart: `study_material`) |
| `GET/POST /api/teachers/*` | Teacher CRUD (multipart field: `profilePhoto`; body field: `contactNumber`) |
| `GET/POST /api/students/*` | Student CRUD |
| `GET /api/visitors/count` | Redis-backed visitor count |

Uploaded files are stored in `backend/uploads/` and served at `/api/books/uploads/`, `/api/content/uploads/`, `/api/teachers/uploads/`.

## Hot Reload

- Backend: `npm run dev` uses nodemon (installed as devDependency).
- Frontend: built-in CRA hot reload.

## Notes and Known Gotchas

- **Redis v4:** `index.js` uses the promise-based API (`client.connect()`, `await client.incr/get`). The old callback style does not work with `redis@^4`.
- **MySQL 9 auth:** the legacy `mysql` package cannot authenticate against `caching_sha2_password`; `bookDb.js` was switched to `mysql2`. Keep all DB access on `mysql2`.
- **Redis config:** if `redis-server` aborts at startup with a `loadmodule` error, comment out the `loadmodule` lines in `/opt/homebrew/etc/redis.conf` (this app needs only core Redis).
- **Security:** MySQL root has no password and CORS is wide open (`app.use(cors())`). Acceptable for local development only; do not deploy as-is.
- Teacher add expects multipart fields `name`, `contactNumber`, `department`, `username`, `password`, `profilePhoto`.
