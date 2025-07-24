# SafariTrack

A modern, responsive Matatu scheduling and tracking platform for Nairobi, built with the MERN stack.

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [User Guide](#user-guide)
- [Technical Architecture Overview](#technical-architecture-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- npm, pnpm, or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/PLP-MERN-Stack-Development/week-8-capstone_-Sifa001/safaritrack.git
cd safaritrack
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Environment Variables

- Copy `.env.example` to `.env` in both `server/` and `client/` (if needed).
- Set your MongoDB URI, JWT secret, and other required variables.

### 4. Start the Application

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd ../client
npm run dev
```

- The frontend will run on [https://safariapp-git-main-vivian-sifas-projects.vercel.app/]
- The backend will run on [https://week-8-capstone-sifa001.onrender.com]

---

## API Documentation

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/auth/profile` — Get current user profile

### Routes

- `GET /api/routes` — List all routes
- `GET /api/routes/search?from=...&to=...` — Search for a route
- `GET /api/routes/:id` — Get route details

### Schedules

- `GET /api/schedules` — List schedules (filter by date, status, search)
- `POST /api/schedules` — Create a new schedule (driver only)
- `GET /api/schedules/:id` — Get schedule details
- `POST /api/schedules/:id/updates` — Add an update to a schedule

### Stages

- `GET /api/stages` — List all stages
- `GET /api/stages/nearby?lat=...&lng=...` — Find nearby stages

### Passengers

- `POST /api/passenger/bookings` — Book a schedule
- `GET /api/passenger/:id/upcoming-trips` — View upcoming trips

### Drivers

- `GET /api/drivers/:id/feedback` — Get feedback for a driver

> For full request/response details, see the code in `server/routes/` and `server/controllers/`.

---

## User Guide

### For Passengers

- **Browse Routes:** View all available matatu routes and schedules.
- **Search:** Find routes by origin/destination, date, or status.
- **Book a Trip:** Reserve a seat on a schedule.
- **View Upcoming Trips:** See your booked trips.
- **Language Switch:** Toggle between English and Kiswahili.
- **Theme Switch:** Toggle between light and dark mode.

### For Drivers

- **Dashboard:** View assigned routes, create schedules, and track earnings.
- **Create Schedule:** Add new matatu schedules.
- **View Feedback:** See passenger feedback and ratings.

### For Admins

- **Admin Dashboard:** Manage users, routes, and view system reports.

---

## Technical Architecture Overview

### Frontend

- **React + TypeScript**
- **Tailwind CSS** for styling and responsive design
- **Context API** for auth, theme, language, and socket state
- **Axios** for API requests
- **React Router** for navigation

### Backend

- **Node.js + Express**
- **MongoDB + Mongoose** for data storage
- **JWT** for authentication
- **Role-based access control** for admin/driver/passenger
- **RESTful API** with modular controllers and routes

### Real-Time Features

- **Socket.io** (planned/optional) for live schedule updates

### Directory Structure

```
client/
  src/
    components/
    contexts/
    pages/
    ...
server/
  controllers/
  models/
  routes/
  ...
```

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

## License

[MIT](LICENSE) 
