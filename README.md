# LeaveFlow - Leave Management System (Frontend Only)

## Project Overview
LeaveFlow is a complete Leave Management System built with React and Vite. This version is a standalone frontend application that uses a **Mock API** service backed by LocalStorage to simulate backend operations. It features role-based access control for Employees and Admins without requiring a server or database.

## Tech Stack
- **Frontend**: React.js (Vite), Context API, React Router, Vanilla CSS (Modern UI).
- **Data Persistence**: LocalStorage (Mock API implementation).
- **Deployment**: Vercel/Netlify (Static Site capable).

## Features
### Employee
- Register/Login (Data stored locally).
- Apply for Leave (Date range, Type, Reason).
- View Leave History & Status.

### Admin
- View all leave applications.
- Approve/Reject leaves.
- Dashboard stats.

## Setup Instructions

### Prerequisites
- Node.js installed.

### 1. Installation
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 2. Running Locally
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser at `http://localhost:5173` (or the port shown in terminal).

## Demo Accounts
The application comes pre-seeded with the following accounts (if local storage is empty):

- **Admin**: 
  - Email: `admin@example.com`
  - Password: `password123`

- **Employee**: 
  - Email: `john@example.com`
  - Password: `password123`

## Resetting Data
To reset the application data, simply clear your browser's LocalStorage for the site. On next reload, the app will re-seed the default accounts.
