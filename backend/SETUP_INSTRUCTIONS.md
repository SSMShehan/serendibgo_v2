# Environment Setup Instructions

## The Issue
The backend server is not running because the `.env` file is missing. This file contains essential environment variables like database connection strings and JWT secrets.

## Quick Fix

1. **Create a `.env` file** in the backend directory (`serendibgo_v2/backend/.env`)

2. **Add these essential variables:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Replace with your MongoDB connection string)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serendibgo

# JWT (Change this secret in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. **Start the backend server:**
```bash
cd serendibgo_v2/backend
npm run dev
```

## For Development Testing

If you don't have a MongoDB database yet, you can use a local MongoDB instance or MongoDB Atlas free tier:

### Option 1: Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/serendibgo
```

### Option 2: MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace the MONGODB_URI in your .env file

## After Setup

Once you have the .env file and MongoDB running:

1. **Backend will start** on http://localhost:5000
2. **Registration will work** for guides
3. **Guide dashboard** will be accessible
4. **All API endpoints** will function properly

## Test Registration

Try registering with these details:
- **Name:** Test Guide
- **Email:** testguide@example.com  
- **Phone:** +94771234567
- **Role:** Tour Guide
- **Password:** Password123 (must have uppercase, lowercase, and number)

The registration should work once the backend is running!
