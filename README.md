# Calendar Application

A full-stack calendar application built with React.js and Node.js that allows users to manage their events and schedules efficiently.

Here are some snapshots of the application in action:

| **Login Page** | **Dashboard** |
|:--------------:|:-------------:|
| ![Login Page](![Screenshot (962)](https://github.com/user-attachments/assets/9843dc63-4fc3-4318-bfef-930de971ff7a)
) | ![Dashboard](./images/dashboard.png) |

| **Event Creation** | **Responsive Design** |
|:------------------:|:---------------------:|
| ![Event Creation](./images/event-creation.png) | ![Responsive Design](./images/responsive-design.png) |

---

## Features

- 👤 User Authentication (Register/Login)
- 📅 Create, Read, Update, and Delete Events
- ⏰ Event Scheduling with Start and End Times
- 🔔 Reminder System for Events
- 🔒 Secure JWT Authentication
- 💾 MongoDB Database Integration

## Tech Stack

### Frontend
- React.js
- React Router DOM (for routing)
- Axios (for API calls)
- Context API (for state management)
- CSS/SCSS (for styling)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (JSON Web Tokens)
- bcryptjs (for password hashing)
- CORS

## Project Structure

```
/
├── client/              # Frontend React Application
│   ├── src/
│   ├── public/
│   └── package.json
│
└── server/              # Backend Node.js Application
    ├── index.js
    ├── package.json
    └── .env
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas Account
- npm or yarn package manager

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events for authenticated user
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an existing event
- `DELETE /api/events/:id` - Delete an event

## Deployment

### Backend
- Deploy the server to Render
- Add environment variables in Render dashboard
- Enable MongoDB Atlas IP whitelist for Render's IPs

### Frontend
- Deploy the client to Netlify
- Add environment variables in Netlify dashboard
- Update CORS settings in backend to allow Netlify domain

## Environment Variables

### Backend (.env)
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=your_frontend_url
```

### Frontend (.env)
```env
REACT_APP_API_URL=your_backend_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
