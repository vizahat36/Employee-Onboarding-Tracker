# Employee Onboarding Tracker — Backend

## Project purpose

A Django + Django REST Framework API that powers the Employee Onboarding Tracker.
It manages employee accounts, onboarding tasks, private admin task notes, and
interviews. Two roles exist: **ADMIN** and **ATTENDEE**.

- **ADMIN** manages employees, tasks, private notes, interviews, and views onboarding progress.
- **ATTENDEE** logs in and manages only their own tasks (update status) and interviews (confirm).

## Technology stack

- Python 3.12
- Django 5.2
- Django REST Framework 3.18
- MySQL (via `mysqlclient`)
- `django-cors-headers` (for the local React dev origin)
- Token authentication (`rest_framework.authtoken`)

## Django apps

| App | Purpose |
| --- | --- |
| `accounts` | Users, role profiles (`ADMIN`/`ATTENDEE`), login, permissions |
| `employees` | Employee records (one-to-one with a Django user) |
| `tasks` | Onboarding tasks and admin-only private task notes |
| `interviews` | Interview scheduling for attendees |
| `config` | Project settings and root URL configuration |

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Employee-Onboarding-Tracker
   ```

2. **Enter the Backend directory**

   ```bash
   cd Backend
   ```

3. **Create a virtual environment**

   ```bash
   python -m venv empv
   ```

   (The existing project uses a virtualenv named `empv`; you may choose any name.)

4. **Activate the virtual environment**

   - Windows (PowerShell):

     ```powershell
     .\empv\Scripts\Activate.ps1
     ```

   - Windows (Command Prompt):

     ```bat
     empv\Scripts\activate
     ```

   - macOS / Linux:

     ```bash
     source empv/bin/activate
     ```

5. **Install requirements**

   ```bash
   pip install -r requirements.txt
   ```

6. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in real values.

   ```bash
   cp .env.example .env
   ```

   Required variables (see `config/settings.py`):

   ```dotenv
   DB_NAME=employee_onboarding_tracker
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DJANGO_SECRET_KEY=your_secret_key
   ```

   `.env` is git-ignored and must **never** be committed. Only `.env.example`
   (containing safe placeholders) is committed.

7. **Configure the MySQL database**

   Create a MySQL database matching `DB_NAME` (default `employee_onboarding_tracker`).
   The `DB_USER` must have access to create/modify tables in that database.

8. **Run migrations**

   ```bash
   python manage.py migrate
   ```

9. **Create/use an admin account**

   ```bash
   python manage.py createsuperuser
   ```

   Logging in through the API requires a user whose `UserProfile.role` is `ADMIN`
   (or `ATTENDEE`). Existing employees are created via the admin frontend/API;
   attendees are created through the employees endpoint (role `ATTENDEE` is set
   automatically when an employee is created).

10. **Start the Django server**

    ```bash
    python manage.py runserver
    ```

    The API is served under `http://127.0.0.1:8000/api/`.

## Authentication

The API uses DRF **TokenAuthentication**.

- Log in to obtain a token (see AUTH endpoint below).
- Send it on every subsequent request:

  ```
  Authorization: Token <token>
  ```

- A missing or invalid token returns `401 Unauthorized`.

## Roles

Two roles are enforced by custom DRF permissions
(`Backend/accounts/permissions.py`):

| Role | Can access |
| --- | --- |
| `ADMIN` | Admin endpoints: employees, tasks, private notes, interviews (`/api/employees/`, `/api/tasks/`, `/api/tasks/<id>/notes/`, `/api/interviews/`) |
| `ATTENDEE` | Own data only: `/api/my/tasks/`, `/api/my/interviews/` |

Attempts by an attendee to reach admin endpoints return `403 Forbidden`.
Admin tokens cannot use the attendee-only ownership endpoints.

---

# API Documentation

All endpoints require token authentication and a JSON body where noted.
Private notes are **ADMIN-only** and are **never** included in attendee task
responses.

## Auth

### `POST /api/auth/login/`

- **Roles:** anyone (no token)
- **Purpose:** exchange credentials for a token + user info
- **Request fields:** `username`, `password`
- **Response fields:** `token`, `user: { id, username, role }`
- Invalid/missing credentials → `400`.

## Employees (ADMIN only)

### `GET /api/employees/`
- **Purpose:** list employees. Response fields: `id`, `user_id`, `username`, `first_name`, `last_name`, `email`.

### `POST /api/employees/`
- **Purpose:** create an employee (also creates a Django user + `ATTENDEE` profile).
- **Request fields:** `username`, `password` (min 8), `first_name`, `last_name`, `email`.

### `GET /api/employees/<id>/`
- **Purpose:** retrieve one employee.

### `PUT /api/employees/<id>/` / `PATCH /api/employees/<id>/`
- **Purpose:** update an employee.
- **Request fields:** `first_name`, `last_name`, `email`.

### `DELETE /api/employees/<id>/`
- **Purpose:** delete an employee. → `204` on success.

## Tasks (ADMIN only)

### `GET /api/tasks/`
- **Purpose:** list all tasks. Response fields: `id`, `employee`, `title`, `description`, `due_date`, `status`.

### `POST /api/tasks/`
- **Purpose:** create a task.
- **Request fields:** `employee` (employee id), `title`, `description`, `due_date`, `status`.
- `status` is one of: `PENDING`, `IN_PROGRESS`, `COMPLETED`.
- Invalid status → `400`.

### `GET /api/tasks/<id>/`
- **Purpose:** retrieve one task.

### `PUT /api/tasks/<id>/` / `PATCH /api/tasks/<id>/`
- **Purpose:** update a task.

### `DELETE /api/tasks/<id>/`
- **Purpose:** delete a task. → `204`.

## Attendee tasks (ATTENDEE only)

### `GET /api/my/tasks/`
- **Purpose:** list tasks belonging to the logged-in attendee only.
- **Response fields:** `id`, `title`, `description`, `due_date`, `status` (no `employee`, no notes).

### `PATCH /api/my/tasks/<id>/`
- **Purpose:** update the status of the attendee's own task.
- **Request fields:** `status` (only field writable). Writable values: `PENDING`, `IN_PROGRESS`, `COMPLETED`.
- Cannot change `title`, `description`, `due_date`, or `employee` (read-only / ignored).
- A task belonging to another attendee → `404`.

## Interviews (ADMIN only)

### `GET /api/interviews/`
- **Purpose:** list all interviews. Response fields: `id`, `employee`, `interviewer`, `scheduled_at`, `location`, `confirmed`.

### `POST /api/interviews/`
- **Purpose:** create an interview.
- **Request fields:** `employee`, `interviewer`, `scheduled_at` (datetime), `location`, `confirmed` (boolean).

### `GET /api/interviews/<id>/`
- **Purpose:** retrieve one interview.

### `PUT /api/interviews/<id>/` / `PATCH /api/interviews/<id>/`
- **Purpose:** update an interview.

### `DELETE /api/interviews/<id>/`
- **Purpose:** delete an interview. → `204`.

## Attendee interviews (ATTENDEE only)

### `GET /api/my/interviews/`
- **Purpose:** list interviews belonging to the logged-in attendee only.
- **Response fields:** `id`, `interviewer`, `scheduled_at`, `location`, `confirmed` (no `employee`).

### `PATCH /api/my/interviews/<id>/`
- **Purpose:** confirm the attendee's own interview.
- **Request fields:** `confirmed` (boolean) — the only writable field.
- Cannot change `interviewer`, `scheduled_at`, `location`, or `employee` (read-only / ignored).
- An interview belonging to another attendee → `404`.

## Private notes (ADMIN only)

### `GET /api/tasks/<task_id>/notes/`
- **Purpose:** list private notes for a task.

### `POST /api/tasks/<task_id>/notes/`
- **Purpose:** add a private note to a task.
- **Request fields:** `content`. Response fields: `id`, `task`, `content`.

### `GET /api/tasks/<task_id>/notes/<note_id>/`
- **Purpose:** retrieve one private note.

### `PUT /api/tasks/<task_id>/notes/<note_id>/` / `PATCH /api/tasks/<task_id>/notes/<note_id>/`
- **Purpose:** update a private note (fields: `content`).

### `DELETE /api/tasks/<task_id>/notes/<note_id>/`
- **Purpose:** delete a private note. → `204`.

> **IMPORTANT — Privacy:** Private task notes are **ADMIN-only**. Attendee
> endpoints (`/api/my/tasks/`, `/api/my/tasks/<id>/`) never include note
> `content`, note ids, or any note data. Creating or reading notes as an attendee
> returns `403 Forbidden`. Verification confirmed a private note's exact text
> never appears in any attendee API response.

## HTTP status codes used

- `200` success / `201` created
- `204` deleted (no body)
- `400` validation / bad request
- `401` missing or invalid token
- `403` authenticated but wrong role / forbidden
- `404` not found (including another attendee's resource)
- `405` method not allowed
