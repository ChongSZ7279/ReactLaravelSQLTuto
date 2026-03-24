# React + Laravel + MySQL — Employee CRUD

This repository contains:

- `backend/`: Laravel API (MySQL)
- `frontend/`: React (Create React App) UI

The working API base URL is **`http://127.0.0.1:8000/api`**.

---

## Run the project (Windows + XAMPP)

### 1) Start MySQL and create the database

- Open **XAMPP Control Panel** → Start **Apache** and **MySQL**
- Create the database:
  - Open `http://localhost/phpmyadmin`
  - Create a DB named **`employee_db`**

### 2) Backend (Laravel)

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan migrate --path=database/migrations/2026_03_04_000001_add_api_token_to_users_table.php
php artisan serve --host=127.0.0.1 --port=8000
```

Backend should respond:

- `GET` `http://127.0.0.1:8000/`
- `GET` `http://127.0.0.1:8000/api/employees`

### 3) Frontend (React)

```bash
cd frontend
npm install
npm start
```

Open the UI at `http://localhost:3000`.

The auth UI (`App.auth.js` and related screens) uses **Material UI (MUI)** for layout, forms, tables, and navigation. See **[Material UI](#material-ui-mui)** below for install steps and how it is wired in.

---

## Material UI (MUI)

This frontend uses [MUI v6](https://mui.com/material-ui/getting-started/) with the default **Emotion** styling engine (recommended for CRA).

### 1) Install packages (plug in MUI)

From the `frontend` folder, install the core library, styling peers, and icons:

```bash
cd frontend
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

These are already listed in `frontend/package.json` for this project; running `npm install` pulls them in.

**Why these packages?**

| Package | Role |
|--------|------|
| `@mui/material` | Components (`Button`, `TextField`, `Table`, `AppBar`, …) |
| `@emotion/react` / `@emotion/styled` | Required peer dependencies for MUI’s default styling |
| `@mui/icons-material` | Icon set used in the app bar and employee table actions |

### 2) Wrap the app with theme + baseline

In `src/index.js`, the root render is wrapped with:

- **`ThemeProvider`** — supplies the theme from `src/theme.js` to all MUI components.
- **`CssBaseline`** — normalizes browser defaults (similar to a light reset) for a consistent look.

Example (this project’s setup):

```js
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App.auth";
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### 3) Customize the look (`src/theme.js`)

`src/theme.js` calls `createTheme()` and exports a theme object. Edit **palette**, **typography**, **shape.borderRadius**, or **`components` overrides** there to change colors and component defaults app-wide.

### 4) How this project uses MUI

- **`src/App.auth.js`** — `AppBar` / `Toolbar` navigation; `Button` + React Router via `component={RouterLink}` and `to="..."`.
- **`Login.js` / `Register.js`** — `Paper`, `TextField`, `Alert`, `Stack`, `Typography`.
- **`EmployeeList.js`** — `Table`, `Paper`, delete confirmation `Dialog`, icon buttons.
- **`AddEmployee.js` / `EditEmployee.js`** — form layout with `Paper`, `TextField`, actions.
- **`Logout.js`** — `CircularProgress` + `Paper` while signing out.

### 5) Using MUI in your own components

```js
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function Example() {
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Button variant="contained">Save</Button>
    </Stack>
  );
}
```

- Use the **`sx` prop** for one-off layout/spacing (it understands theme tokens like `theme.spacing(2)`).
- Browse components and APIs in the [MUI documentation](https://mui.com/material-ui/all-components/).

---

## Login & Register (Authentication)

This project now has a very simple **token-based** authentication layer:

- **Register**: `POST http://127.0.0.1:8000/api/register`
- **Login**: `POST http://127.0.0.1:8000/api/login`
- **Current user**: `GET http://127.0.0.1:8000/api/me` (requires token)
- **Logout**: `POST http://127.0.0.1:8000/api/logout` (requires token)

The Laravel backend stores an `api_token` on the `users` table.  
The React frontend stores that token in `localStorage` as `auth_token` and sends it in an `Authorization: Bearer <token>` header.

### How it works (backend)

- New migration: `database/migrations/2026_03_04_000001_add_api_token_to_users_table.php`
  - Adds `api_token` (string, unique, nullable) to the `users` table.
- Model: `app/Models/User.php`
  - `api_token` is added to `$fillable`.
- Middleware: `app/Http/Middleware/AuthToken.php`
  - Reads `Authorization: Bearer <token>` or `X-API-TOKEN` header.
  - Finds the user by `api_token` and attaches it to the request.
  - If invalid/missing, returns **401 JSON**.
- Registered middleware alias in `bootstrap/app.php`:
  - `'auth.token' => \App\Http\Middleware\AuthToken::class`
- Controller: `app/Http/Controllers/AuthController.php`
  - `register(name, email, password)` → creates user, generates `api_token`, returns `{ user, token }`.
  - `login(email, password)` → validates credentials, generates new `api_token`, returns `{ user, token }`.
  - `me()` → returns the currently authenticated user.
  - `logout()` → nulls out `api_token` and returns a small JSON message.
- Routes: `routes/api.php`
  - Public:
    - `POST /register` → `AuthController@register`
    - `POST /login` → `AuthController@login`
  - Protected by `auth.token`:
    - `GET /me`
    - `POST /logout`
    - `Route::apiResource('employees', EmployeeController::class);`

### How it works (frontend)

New components (UI built with **Material UI** — see [Material UI](#material-ui-mui)):

- `src/components/Login.js`
  - MUI form (`TextField`, `Paper`, `Alert`) with `email` and `password`.
  - Calls `POST /login`.
  - On success:
    - Saves `token` to `localStorage` as `auth_token`.
    - Saves `user` to `localStorage` as `auth_user`.
    - Redirects to `/`.
- `src/components/Register.js`
  - MUI form with `name`, `email`, `password`.
  - Calls `POST /register`.
  - On success:
    - Same behaviour as login (stores token + user, redirects to `/`).

New helper files (for authenticated setup):

- `src/services/api.auth.js`
  - Same base URL as `src/services/api.js`.
  - Adds a request interceptor that reads `auth_token` from `localStorage` and sets:
    - `Authorization: Bearer <token>`

New App (protected routes example):

- `src/App.auth.js`
  - Top **AppBar** navigation (MUI) and main content in a **Container**.
  - Re-reads `auth_token` on route changes so the nav switches Login/Register vs Logout after login/logout.
  - Uses a small `<RequireAuth>` wrapper:
    - Checks `localStorage.getItem("auth_token")`.
    - If missing, redirects to `/login`.
    - If present, renders the requested page.
  - Routes:
    - `/login` → `Login`
    - `/register` → `Register`
    - `/logout` → `Logout`
    - `/` → protected `EmployeeList`
    - `/add` → protected `AddEmployee`
    - `/edit/:id` → protected `EditEmployee`
  - Navigation links:
    - When **not authenticated** (no `auth_token`): Home, Add Employee, Login, Register.
    - When **authenticated** (has `auth_token`): Home, Add Employee, Logout.

- `src/components/Logout.js`
  - Calls `POST /logout` using the stored token.
  - Clears `auth_token` and `auth_user` from `localStorage`.
  - Redirects you back to the Login page.

### How to switch the frontend to the auth-enabled version

By default, `src/App.js` and `src/services/api.js` were created first and may be used by your current React setup.

To use the **auth-enabled** versions:

1. In `src/index.js` (or wherever your React app is bootstrapped), use the auth app and **Material UI** root setup:

   ```js
   import { ThemeProvider, CssBaseline } from "@mui/material";
   import App from "./App.auth";
   import theme from "./theme";

   // wrap <App /> with <ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider>
   ```

2. In your components that call the API, you can either:
   - Keep using `../services/api` and manually add the `Authorization` header, **or**
   - Change imports to use the interceptor version:

   ```js
   import API from "../services/api.auth";
   ```

3. Restart the React dev server if it is running:

   ```bash
   npm start
   ```

4. In the browser:
   - Visit `http://localhost:3000/register` and create a new user.
   - You should be redirected to `/` and see the employees list.
   - Next time, use `http://localhost:3000/login` to log in with the same credentials.
   - After logging in, you can log out via the **Logout** link in the top navigation (this will also invalidate the token on the backend).

---

## API endpoints (Employee CRUD)

Base URL: `http://127.0.0.1:8000/api`

- `GET    /employees` (list)
- `POST   /employees` (create)
- `GET    /employees/{id}` (read)
- `PUT    /employees/{id}` (update)
- `DELETE /employees/{id}` (delete)

### Example JSON body (create/update)

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "phone": "0123456789",
  "position": "Developer",
  "salary": 4500.50,
  "hire_date": "2026-03-04"
}
```

---

## Tutorial: Create the project, model, controller, view

### A) Create a Laravel backend (API)

1) Create project:

```bash
composer create-project laravel/laravel backend
cd backend
```

2) Configure `.env` for MySQL:

- `DB_DATABASE=employee_db`
- `DB_USERNAME=root`
- `DB_PASSWORD=`

3) Create **model + migration**:

```bash
php artisan make:model Employee -m
```

4) Create **API controller**:

```bash
php artisan make:controller EmployeeController --api
```

5) Define the **migration** columns (in `database/migrations/...create_employees_table.php`):

- `name`, `email`, `phone`, `position`, `salary`, `hire_date`, timestamps

6) Define the **fillable** fields (in `app/Models/Employee.php`):

- `$fillable = ['name','email','phone','position','salary','hire_date'];`

7) Add **API routes** (in `routes/api.php`):

```php
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::apiResource('employees', EmployeeController::class);
```

8) Implement CRUD methods in `EmployeeController`:

- `index`, `store`, `show`, `update`, `destroy`
- Add validation so bad requests return **422** instead of a **500**

9) Enable **CORS** (Laravel 11+):

- In `bootstrap/app.php`, append:
  - `\Illuminate\Http\Middleware\HandleCors::class`
- In `config/cors.php`, allow your React dev origin(s), e.g.:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`

10) Run migrations + serve:

```bash
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

---

### B) Create the React frontend (Views)

1) Create project:

```bash
npx create-react-app frontend
cd frontend
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled @mui/icons-material
```

2) Create an Axios client (in `src/services/api.js`):

- Use base URL: **`http://127.0.0.1:8000/api`**

3) Create React “views” (components):

- `src/components/EmployeeList.js` (Read + Delete)
- `src/components/AddEmployee.js` (Create)
- `src/components/EditEmployee.js` (Update)

4) Add routes (in `src/App.js`) using `react-router-dom`:

- `/` → list employees
- `/add` → add employee
- `/edit/:id` → edit employee

5) Run:

```bash
npm start
```

---

## Common problems

### Axios “Network Error” in the browser

Usually means **CORS** or wrong URL.

- Confirm backend is running: `http://127.0.0.1:8000/api/employees`
- Confirm React API base URL is `/api`:
  - `REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api`
- Confirm CORS middleware is enabled and `config/cors.php` allows your React origin.

