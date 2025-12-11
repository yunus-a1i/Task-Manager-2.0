# 🚀 Advanced Task Management App - MERN Stack

A complete Level-2 Task Management application built with MongoDB, Express, React (with Redux), and Node.js.

## ✨ Features

### User Management
- ✅ User registration and login with JWT authentication
- ✅ Refresh token rotation for enhanced security
- ✅ Profile management (name, avatar, notifications, theme)
- ✅ Secure logout

### Task Management
- ✅ Create, edit, delete, and restore tasks
- ✅ Task properties: title, description, priority, due date, category, labels
- ✅ Status tracking: pending, completed, cancelled
- ✅ Reminder system with email/push notification readiness
- ✅ Repeat rules: daily, weekly, monthly
- ✅ Streak tracking for consistent task completion

### Advanced Features
- ✅ Filter tasks: today, upcoming, overdue, high priority, completed
- ✅ Sort by: date, priority, streak count
- ✅ Category management with colors and icons
- ✅ Trash system with 30-day auto-deletion
- ✅ Analytics dashboard with weekly stats and charts
- ✅ Real-time reminder checking (every minute)

### Streak Logic
- Same day completion: maintains current streak
- Next day completion: increments streak by 1
- Break in completion: resets streak to 1

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_key_change_this
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. **Start MongoDB** (if running locally):
```bash
mongod
```

6. **Run the backend:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

---

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Tailwind CSS:**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. **Create `.env` file:**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Run the frontend:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🗂️ Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── cron.js            # Cron job setup
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Task.js            # Task schema
│   │   └── Category.js        # Category schema
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── task.controller.js
│   │   └── category.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── task.routes.js
│   │   └── category.routes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   ├── streak.js          # Streak calculation
│   │   └── reminder.js        # Reminder logic
│   └── server.js              # Express app entry point
├── package.json
└── .env
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js           # Axios instance with interceptors
│   │   ├── auth.api.js        # Auth API calls
│   │   ├── task.api.js        # Task API calls
│   │   └── category.api.js    # Category API calls
│   ├── store/
│   │   ├── index.js           # Redux store
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── taskSlice.js
│   │       └── categorySlice.js
│   ├── components/
│   │   ├── TaskCard.jsx
│   │   ├── TaskForm.jsx
│   │   └── FilterBar.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TaskList.jsx
│   │   └── Profile.jsx
│   ├── utils/
│   │   ├── date.js            # Date formatting utilities
│   │   └── streak.js          # Streak UI utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Move task to trash
- `POST /api/tasks/:id/restore` - Restore from trash
- `PATCH /api/tasks/:id/complete` - Mark as complete
- `PATCH /api/tasks/:id/incomplete` - Mark as incomplete
- `GET /api/tasks/trash` - Get trashed tasks
- `GET /api/tasks/analytics` - Get analytics data

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

---

## 🎯 Key Features Explained

### 1. JWT Authentication with Refresh Tokens
- Access tokens expire in 15 minutes
- Refresh tokens are valid for 7 days
- Automatic token refresh on 401 errors
- Secure token storage in localStorage

### 2. Streak System
When a task is marked complete:
- **Same day**: Streak count stays the same
- **Yesterday's task**: Streak increments by 1
- **Missed days**: Streak resets to 1

### 3. Reminder System
- Cron job runs every minute
- Checks for tasks with `reminderTime <= now`
- Sends console log reminder (ready for email/push integration)
- Marks reminder as sent to prevent duplicates

### 4. Trash System
- Tasks marked as deleted move to trash
- Trash items auto-delete after 30 days
- Daily cron job cleans up old trash

### 5. Analytics Dashboard
- Tasks completed this week
- Total tasks and completion rate
- Top 5 tasks by streak count
- Priority breakdown visualization

---

## 🛠️ Technologies Used

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- node-cron for scheduled tasks
- express-validator for input validation

### Frontend
- React 18 with Vite
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons
- date-fns for date manipulation

---

## 🚦 Usage

1. **Register a new account** at `/register`
2. **Login** with your credentials at `/login`
3. **View Dashboard** to see your analytics
4. **Create tasks** with priority, due date, categories, and reminders
5. **Filter and sort** tasks based on your needs
6. **Mark tasks complete** to build streaks
7. **Manage categories** to organize your tasks
8. **Update profile** settings and preferences

---

## 🔮 Future Enhancements

- Email notifications using Nodemailer
- Push notifications using FCM
- Collaborative tasks and shared categories
- Task attachments and comments
- Mobile app using React Native
- Dark mode implementation
- Data export (CSV, PDF)
- Task templates
- Subtasks and checklists

---

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- The reminder cron job will log to console - integrate with email/push services for production
- Trash cleanup runs daily at midnight
- All API routes (except auth) require authentication
- Frontend uses JWT token auto-refresh for seamless user experience

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

---

## 📄 License

MIT License - feel free to use this project for learning and development.

---

## 👨‍💻 Developer

Built with ❤️ using the MERN stack

Happy Task Managing! 🎉