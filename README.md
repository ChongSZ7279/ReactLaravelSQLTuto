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

