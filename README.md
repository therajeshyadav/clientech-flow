# Customer & Lead Management System

A full-stack Customer and Lead Management System with authentication, role-based access, and responsive UI. Built using React, Redux Toolkit, Tailwind CSS for frontend, and Node.js, Express, MongoDB for backend.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User Authentication (Register / Login)
- Role-based access (optional)
- Add, Edit, Delete Customers
- Add, Edit, Delete Leads for Customers
- Status and value tracking for leads
- Search and filter functionality
- Responsive dashboard for mobile and desktop
- Pagination for leads/customers
- Form validation and error handling with toast notifications

---

## Tech Stack

**Frontend:**

- React 18
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Lucide Icons
- Axios

**Backend:**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/customer-lead-management.git
cd customer-lead-management
Environment Variables
Create a .env file in the backend folder with the following:

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Backend Setup
bash
Copy code
cd backend
npm install
npm run dev
Backend runs on http://localhost:5000

API endpoints available as described below

Frontend Setup
bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs on http://localhost:3000

API Endpoints
Auth
Method	Endpoint	Description
POST	/auth/register	Register a new user
POST	/auth/login	Login user and get token

Customers
Method	Endpoint	Description
GET	/customers	Get all customers (with pagination/search)
GET	/customers/:id	Get customer by ID
POST	/customers	Add new customer
PUT	/customers/:id	Update customer
DELETE	/customers/:id	Delete customer

Leads
Method	Endpoint	Description
GET	/leads?customerId=&status=	Get all leads for customer
POST	/leads	Add new lead
PUT	/leads/:id	Update lead
DELETE	/leads/:id	Delete lead

Project Structure
pgsql
Copy code
backend/
├─ models/
│  ├─ User.js
│  ├─ Customer.js
│  └─ Lead.js
├─ routes/
│  ├─ auth.js
│  ├─ customer.js
│  └─ lead.js
├─ controllers/
│  ├─ authController.js
│  ├─ customerController.js
│  └─ leadController.js
├─ middleware/
│  └─ authMiddleware.js
├─ server.js
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Navbar.tsx
│  │  ├─ CustomerForm.tsx
│  │  ├─ LeadForm.tsx
│  │  └─ Pagination.tsx
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  └─ CustomerDetail.tsx
│  ├─ store/
│  │  ├─ slices/
│  │  │  ├─ authSlice.ts
│  │  │  ├─ customerSlice.ts
│  │  │  └─ leadSlice.ts
│  │  └─ store.ts
│  ├─ api/
│  │  └─ axios.ts
│  └─ App.tsx
Usage
Register a new user

Login with credentials

Add customers via the dashboard

Click on a customer to view and manage their leads

Filter leads by status

Edit/Delete customers and leads as needed

