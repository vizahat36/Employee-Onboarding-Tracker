# Employee Onboarding Tracker — Frontend

## Project purpose

A React + Vite single-page application that consumes the Django REST API in
`../Backend`. It provides separate ADMIN and ATTENDEE interfaces behind
role-based route protection.

## Technology stack

- React 18
- Vite 6
- React Router
- Axios (API client)
- JavaScript / JSX
- ESLint (flat config, `eslint.config.js`)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Employee-Onboarding-Tracker/Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure the API base URL**

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

   `.env` is git-ignored. Only `.env.example` (safe placeholder) is committed.

## Running

```bash
npm run dev
```

The dev server runs on `http://localhost:5173` by default. The Django backend
must be running on `http://127.0.0.1:8000` (see `../Backend/README.md`).

## Build & lint

```bash
npm run build
npm run lint
```

- `npm run build` — production build into `dist/`.
- `npm run lint` — runs ESLint over the source.

## Frontend routes

**ADMIN** (protected by `ProtectedRoute role="ADMIN"` → `AdminLayout`):

| Route | Purpose |
| --- | --- |
| `/admin` | Admin dashboard |
| `/admin/employees` | Manage employees |
| `/admin/tasks` | Manage tasks (+ private notes) |
| `/admin/interviews` | Manage interviews |
| `/admin/progress` | Onboarding progress per employee |

**ATTENDEE** (protected by `ProtectedRoute role="ATTENDEE"` → `AttendeeLayout`):

| Route | Purpose |
| --- | --- |
| `/attendee` | Attendee dashboard |
| `/attendee/tasks` | View / update own task status |
| `/attendee/interviews` | View / confirm own interviews |

## Role-based route protection

`src/routes/ProtectedRoute.jsx` guards routes:

- Not authenticated → redirect to `/login`.
- Authenticated user with the wrong role → redirect to their home (`/admin` or `/attendee`).

`src/api/axios.js` attaches `Authorization: Token <token>` to every request and
clears the stored token when the API returns `401`. `src/services/authService.js`
manages the token/user in `localStorage` (`auth_token`, `auth_user`) and a `logout()`
helper.

> The frontend route protection is a convenience layer. Backend authorization is
> enforced independently by the Django API (see Backend README); manually changing
> a frontend URL cannot bypass backend role checks.

## Key directories

| Path | Purpose |
| --- | --- |
| `src/api/` | Axios API modules (auth, employee, task, interview, note) |
| `src/components/` | Reusable UI (Button, PageHeader, Loading, ErrorMessage, StatusBadge, Sidebar, Navbar) |
| `src/layouts/` | Admin and attendee layouts |
| `src/pages/` | Route pages (admin + attendee) |
| `src/routes/` | Route definitions + ProtectedRoute |
| `src/services/` | Auth service |
| `src/utils/` | Shared helpers (API error handling) |
