# MessSync 🍽️

**MessSync** is an automated hostel mess management and attendance synchronization system designed to streamline meal tracking, leave requests, feedback, inventory, and administrative operations for students, mess staff, and wardens.

---

## 🌟 Key Features

### 👨‍🎓 Student Portal
- **Dashboard**: Overview of upcoming meals, daily menu, and meal schedule.
- **Leave Requests**: Submit mess leave requests with automatic rebate and attendance adjustments.
- **Meal History & QR Scanner**: Track consumed meals and scan QR codes for quick meal verification.
- **Feedback & Meal Voting**: Rate food quality and vote on proposed menu items.
- **Notifications**: Stay updated on announcements, menu updates, and leave approvals.

### 👨‍🍳 Mess Staff Portal
- **Real-Time Attendance**: Monitor headcount and meal verification via QR scanner.
- **Menu Management**: Manage weekly/monthly menus, special meal schedules, and dietary flags.
- **Analytics**: Real-time consumption metrics to reduce food wastage.
- **Inventory Tracking**: Stock levels and ingredient usage tracking.

### 🛡️ Warden Portal
- **Approval Workflows**: Review and approve student leave requests.
- **Student Lookup & Alerts**: Rapid student search, meal compliance, and automated emergency SMS alerts.
- **Reports & Audits**: Export comprehensive dining and absence analytics.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit & React-Redux
- **Routing**: React Router DOM v7
- **Icons & Charts**: Lucide React, Recharts

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with refresh token mechanism & Bcrypt password hashing

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or a MongoDB Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/ChaithanyaReddy322/MessSync.git
cd MessSync
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (or copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/messsync
JWT_SECRET=your_jwt_secret_access_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
NODE_ENV=development
```

Start the backend server in development mode:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal, navigate to the root folder:
```bash
npm install
npm run dev
```
The client app will be accessible at `http://localhost:5173`.

---

## 📁 Project Structure

```
MessSync/
├── public/                 # Static assets
├── server/                 # Express + TypeScript backend
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # API business logic
│   │   ├── middleware/     # Auth and validation middleware
│   │   ├── models/         # Mongoose database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # JWT and utility helpers
│   ├── .env.example        # Environment variable template
│   ├── package.json
│   └── tsconfig.json
├── src/                    # React + Vite frontend
│   ├── components/         # Reusable UI & layout components
│   ├── pages/              # Role-based pages (Student, Mess, Warden)
│   ├── services/           # Axios / API clients
│   ├── store/              # Redux slices and store setup
│   ├── utils/              # Helper utilities
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
