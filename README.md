# Swiftly — Leave & Reimbursement Portal

A full-stack web application for managing employee leaves and reimbursement claims with role-based access control.

## Features

- **Authentication** — JWT-based login & signup
- **Role-Based Dashboards** — Employee, Manager, and Admin views
- **Leave Management** — Apply, approve, and reject leave requests
- **Reimbursement Claims** — Submit claims with optional bill uploads (via ImageKit)
- **Bill Management** — Upload, replace, delete, and download bills (images/PDFs)
- **Charts & Analytics** — Donut charts showing status breakdown on dashboards
- **Toast Notifications** — Real-time feedback for all actions
- **Dark / Light Mode** — Theme toggle with system preference support

## Tech Stack

| Layer    | Technology                              |
|----------|-----------------------------------------|
| Frontend | React, Vite, TailwindCSS, Recharts      |
| Backend  | Node.js, Express, Mongoose              |
| Database | MongoDB Atlas                           |
| Storage  | ImageKit (bill uploads)                 |
| Auth     | JWT (jsonwebtoken + bcryptjs)           |

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas connection string
- ImageKit account (for bill uploads)

### 1. Clone the repo

```bash
git clone https://github.com/Abhishek-Verma0/Employee-Leave-Management-System.git
cd Employee-Leave-Management-System
```

### 2. Setup the server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```
MONGO_DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Start the server:

```bash
npm start
```

### 3. Setup the client

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```
VITE_API_BASE_URL=http://localhost:3000
```

Start the client:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Roles

| Role     | Capabilities                                              |
|----------|-----------------------------------------------------------|
| Employee | Apply for leaves & reimbursements, upload bills            |
| Manager  | All employee actions + approve/reject employee requests    |
| Admin    | Manage users, approve/reject manager requests, view all data |

## Project Structure

```
├── client/             # React frontend (Vite)
│   └── src/
│       ├── components/ # Reusable UI components
│       ├── context/    # Auth & Theme context providers
│       ├── pages/      # Dashboard & auth pages
│       └── utils/      # Axios instance
└── server/             # Express backend
    ├── config/         # DB & ImageKit config
    ├── controllers/    # Route handlers
    ├── middleware/      # Auth middleware
    ├── models/         # Mongoose schemas
    └── routes/         # API routes
```

## Contributing

Contributions are welcome! If you'd like to improve this project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## Author

**Abhishek Verma** — [@Abhishek-Verma0](https://github.com/Abhishek-Verma0)
