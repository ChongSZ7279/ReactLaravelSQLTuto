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

New components:

- `src/components/Login.js`
  - Simple form with `email` and `password`.
  - Calls `POST /login`.
  - On success:
    - Saves `token` to `localStorage` as `auth_token`.
    - Saves `user` to `localStorage` as `auth_user`.
    - Redirects to `/`.
- `src/components/Register.js`
  - Simple form with `name`, `email`, `password`.
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
  - Uses a small `<RequireAuth>` wrapper:
    - Checks `localStorage.getItem("auth_token")`.
    - If missing, redirects to `/login`.
    - If present, renders the requested page.
  - Routes:
    - `/login` → `Login`
    - `/register` → `Register`
    - `/` → protected `EmployeeList`
    - `/add` → protected `AddEmployee`
    - `/edit/:id` → protected `EditEmployee`
  - Navigation links: Home, Add Employee, Login, Register.

### How to switch the frontend to the auth-enabled version

By default, `src/App.js` and `src/services/api.js` were created first and may be used by your current React setup.

To use the **auth-enabled** versions:

1. In `src/index.js` (or wherever your React app is bootstrapped), change the import to:

   ```js
   import App from "./App.auth";
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

---

## API endpoints (Employee CRUD)

Base URL: `http://127.0.0.1:8000/api`

- `GET    /employees` (list)
- `POST   /employees` (create — JSON or `multipart/form-data` with optional `profile_picture` file)
- `GET    /employees/{id}` (read)
- `PUT    /employees/{id}` (update — JSON or fields without a new file)
- `POST   /employees/{id}` (update with `multipart/form-data` when uploading a new `profile_picture`; same controller as PUT)
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

### Profile pictures (backend)

Employees can store an optional image. The API saves files on the `public` disk under `storage/app/public/employee_profiles/` and exposes a computed `profile_picture_url` on each employee in JSON responses.

1. Run migrations (includes `profile_picture` on `employees`):

   ```bash
   cd backend
   php artisan migrate
   ```

2. Expose storage over HTTP (one-time per machine):

   ```bash
   php artisan storage:link
   ```

3. In `.env`, set **`APP_URL`** to the same origin clients use for the API (for example `http://127.0.0.1:8000`) so `profile_picture_url` points at a working file URL.

**Multipart fields** (create or update): `name`, `email`, `phone`, `position`, `salary`, `hire_date`, and optional file field **`profile_picture`** (JPEG, PNG, WebP, or GIF, max 2 MB). The React app sends `multipart/form-data` for create, and uses **`POST /api/employees/{id}`** for edit when a new file is chosen, because PHP file uploads on `PUT` are unreliable.

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
npm install axios react-router-dom
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

