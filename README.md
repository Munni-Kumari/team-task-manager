# Team Task Manager (Full-Stack)

A professional team task management application built with React, Node.js, Express, and MySQL.

## Features
- **Authentication:** Secure Login and Signup system.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Can create projects and assign tasks.
  - **Member:** Can view projects, view tasks, and update task status.
- **Project Management:** Create and manage team projects.
- **Task Tracking:** Assign tasks with due dates and track their progress (To Do, In Progress, Done).
- **Responsive Dashboard:** Beautiful, modern UI with real-time stats.

## Tech Stack
- **Frontend:** React, Vite, Vanilla CSS (Glassmorphism design).
- **Backend:** Node.js, Express, JWT for authentication.
- **Database:** MySQL.

## Getting Started

### Prerequisites
- Node.js installed.
- MySQL server running.

### Installation

1. **Clone the repository.**
2. **Backend Setup:**
   - Go to `/backend`.
   - Run `npm install`.
   - Create a `.env` file with:
     ```env
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASS=your_password
     DB_NAME=task_manager
     JWT_SECRET=your_secret_key
     ```
   - Run `npm run dev`. (The database schema will be applied automatically).

3. **Frontend Setup:**
   - Go to `/frontend`.
   - Run `npm install`.
   - Create a `.env.local` file with:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```
   - Run `npm run dev`.

## Deployment
This app is ready for deployment on **Railway**.
- Ensure you set the environment variables in the Railway dashboard.
- The backend is configured to use `process.env.PORT`.
- The database schema is automatically initialized on the first connection.
