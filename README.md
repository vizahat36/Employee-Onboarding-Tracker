# Employee Onboarding Tracker

## Overview

A full-stack employee onboarding tracker built with Django REST Framework
(backend) and React + Vite (frontend). Admins manage employees, onboarding
tasks, private task notes, interviews, and track each employee's onboarding
progress. Attendees log in and manage only their own tasks and interviews.

The system uses role-based access control with two roles: **ADMIN** and
**ATTENDEE**. Private admin task notes are never exposed to attendees.

## Features

### ADMIN
- Employee management (create / read / update / delete)
- Task management (assign tasks to employees, set status)
- Private task notes (admin-only)
- Interview management
- Onboarding progress per employee (total / completed / in-progress / pending / completion %)

### ATTENDEE
- Login
- View own tasks
- Update own task status
- View own interviews
- Confirm own interviews

## Technology Stack

### Backend
- Python
- Django
- Django REST Framework
- MySQL

### Frontend
- React
- Vite
- Axios
- React Router

## Project Structure

```
Employee-Onboarding-Tracker/
├── Backend/            Django REST API
│   ├── accounts/       Users, roles, login, permissions
│   ├── employees/      Employee records
│   ├── tasks/          Tasks + private notes
│   ├── interviews/     Interviews
│   ├── config/         Project settings & root URLs
│   ├── requirements.txt
│   └── README.md       Backend setup + API docs
├── Frontend/           React + Vite SPA
│   ├── src/            Components, pages, routes, api, services
│   ├── package.json
│   └── README.md       Frontend setup + routes
├── .gitignore          Root ignore rules
└── README.md
```

### Major Django apps

- **accounts** — users, `ADMIN`/`ATTENDEE` role profiles, token login, DRF permissions.
- **employees** — employee records.
- **tasks** — onboarding tasks and admin-only private task notes.
- **interviews** — interview scheduling.

## Setup

### Backend

```bash
cd Backend
python -m venv empv
# activate (Windows: .\empv\Scripts\Activate.ps1 ; macOS/Linux: source empv/bin/activate)
pip install -r requirements.txt
cp .env.example .env    # fill in DB credentials + DJANGO_SECRET_KEY
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd Frontend
cp .env.example .env    # VITE_API_BASE_URL=http://127.0.0.1:8000/api
npm install
npm run dev
```

Open `http://localhost:5173`. See `Backend/README.md` and `Frontend/README.md`
for full, exact instructions.

## Authentication

The API uses Django REST Framework **TokenAuthentication**. Log in with
`POST /api/auth/login/` to obtain a token, then send it on every request:

```
Authorization: Token <token>
```

The frontend stores the token for the session and attaches it automatically via
an Axios interceptor.

## Roles

- **ADMIN** — full management access to employees, tasks, private notes,
  interviews, and progress.
- **ATTENDEE** — access only to their own tasks and interviews.

Role permissions are enforced by the backend (custom DRF permissions), and the
frontend additionally guards routes by role.

## API Endpoints

| Area | Endpoint | Role |
| --- | --- | --- |
| Auth | `POST /api/auth/login/` | anyone |
| Employees | `GET/POST /api/employees/` | ADMIN |
| Employees | `GET/PUT/PATCH/DELETE /api/employees/<id>/` | ADMIN |
| Tasks | `GET/POST /api/tasks/` | ADMIN |
| Tasks | `GET/PUT/PATCH/DELETE /api/tasks/<id>/` | ADMIN |
| Attendee tasks | `GET /api/my/tasks/` | ATTENDEE |
| Attendee tasks | `PATCH /api/my/tasks/<id>/` | ATTENDEE |
| Interviews | `GET/POST /api/interviews/` | ADMIN |
| Interviews | `GET/PUT/PATCH/DELETE /api/interviews/<id>/` | ADMIN |
| Attendee interviews | `GET /api/my/interviews/` | ATTENDEE |
| Attendee interviews | `PATCH /api/my/interviews/<id>/` | ATTENDEE |
| Private notes | `GET/POST /api/tasks/<task_id>/notes/` | ADMIN |
| Private notes | `GET/PUT/PATCH/DELETE /api/tasks/<task_id>/notes/<note_id>/` | ADMIN |

See `Backend/README.md` for request/response fields for each endpoint.

## Security

- **Role-based authorization** — `ADMIN` vs `ATTENDEE` enforced server-side.
- **Attendee data isolation** — attendees can only read and update their own
  tasks and interviews; touching another attendee's resource returns `404`.
- **Private admin notes** — notes are strictly admin-only and are **never
  exposed** through attendee task responses.
- **Protected APIs** — all endpoints except login require a valid token
  (`401` otherwise).
- **Environment-based secrets** — database credentials, `DJANGO_SECRET_KEY`,
  and API base URL come from git-ignored `.env` files. Only placeholder
  `.env.example` files are committed.

## Running the Project

1. Start the backend:
   ```bash
   cd Backend
   python manage.py runserver
   ```
2. Start the frontend:
   ```bash
   cd Frontend
   npm run dev
   ```
3. Log in with an ADMIN or ATTENDEE account created through the application.

## Testing / Verification

A comprehensive integration and security test pass (Phase 23) was executed with
**110/110 checks passing (0 failures, 0 errors)**, covering:

- Authentication (valid/invalid/missing credentials and tokens)
- Admin CRUD (employees, tasks, private notes, interviews)
- Attendee flows (own tasks, update status, own interviews, confirm)
- Cross-user isolation (attendee A vs attendee B)
- Role escalation blocking (attendee → admin endpoints = 403)
- Unauthenticated access rejection (401)
- Private-note leakage (attendee responses never contain note text/data)
- Frontend: `npm run build` and `npm run lint` passed.
- Backend: `python manage.py check`, `makemigrations --check`, and `migrate --check` passed.
