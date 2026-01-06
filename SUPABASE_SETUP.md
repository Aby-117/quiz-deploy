# Connecting Quiztastic to Supabase

This guide will walk you through connecting your Quiztastic application to Supabase (a PostgreSQL database hosted in the cloud).

## Prerequisites

- A Supabase account (free tier is sufficient)
- Node.js and npm installed
- Your Quiztastic application code

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: `quiztastic` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be set up

## Step 2: Get Your Database Connection Details

1. In your Supabase project dashboard, go to **Settings** (gear icon in the left sidebar)
2. Click on **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. Select **"URI"** tab
5. Copy the connection string. It will look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
6. **Important**: Replace `[YOUR-PASSWORD]` with the database password you created in Step 1

## Step 3: Update Environment Variables

1. In your project root, create a `.env` file in the `backend` folder (if it doesn't exist)
2. Add the following environment variables:

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Or use individual connection parameters:
DB_USER=postgres
DB_HOST=db.[PROJECT-REF].supabase.co
DB_NAME=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_PORT=5432

# Frontend URL (keep your existing frontend URL)
FRONTEND_URL=http://localhost:3000

# JWT Secret (keep your existing secret or generate a new one)
JWT_SECRET=your-secret-key-here

# Server Port
PORT=5000
```

**Replace:**
- `[YOUR-PASSWORD]` with your actual database password
- `[PROJECT-REF]` with your Supabase project reference ID

## Step 4: Update Database Connection Code

The current code uses individual connection parameters. We'll update it to support Supabase's connection string format.

### Option A: Using Connection String (Recommended)

Update `backend/src/db/index.ts`:

```typescript
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Use connection string if available, otherwise use individual parameters
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false // Required for Supabase
        }
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'quiz_app',
        password: process.env.DB_PASSWORD || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432'),
      }
)

export const query = async (text: string, params?: any[]) => {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

// ... rest of your initDB function remains the same
```

### Option B: Using Individual Parameters

If you prefer using individual parameters, update the connection to include SSL:

```typescript
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'quiz_app',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
})
```

## Step 5: Run Database Schema Migration

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. The `initDB()` function will automatically create all tables when the server starts
3. Check the console for "Database initialized successfully" message
4. If you see any errors, check:
   - Your connection string is correct
   - Your database password is correct
   - Your network allows connections to Supabase

## Step 6: Verify Connection

1. Go to your Supabase dashboard
2. Click on **"Table Editor"** in the left sidebar
3. You should see all your tables:
   - `users`
   - `quizzes`
   - `questions`
   - `options`
   - `rooms`
   - `players`
   - `answers`
   - `quiz_sessions`
   - `session_leaderboards`

## Step 7: Test Your Application

1. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Test the application:
   - Create a user account
   - Create a quiz
   - Start a quiz room
   - Join as a player
   - Check that data is being saved in Supabase

## Troubleshooting

### Connection Errors

**Error: "Connection refused" or "ECONNREFUSED"**
- Check your connection string is correct
- Verify your database password
- Ensure your IP is not blocked (Supabase allows all IPs by default)

**Error: "SSL required"**
- Make sure you've added the SSL configuration to your Pool connection
- Use `ssl: { rejectUnauthorized: false }` for Supabase

**Error: "relation does not exist"**
- The tables haven't been created yet
- Check that `initDB()` is being called
- Look for errors in the console during initialization

### Performance Issues

- Supabase free tier has connection limits
- Consider using connection pooling for production
- Monitor your database usage in the Supabase dashboard

### Security Best Practices

1. **Never commit `.env` files to git**
   - Add `.env` to your `.gitignore`
   - Use environment variables in production

2. **Use Supabase Row Level Security (RLS)**
   - Consider enabling RLS for production
   - Create policies to protect user data

3. **Rotate passwords regularly**
   - Change your database password periodically
   - Update your `.env` file when you do

## Additional Supabase Features You Can Use

### 1. Supabase Auth (Optional)
Instead of custom JWT authentication, you could use Supabase's built-in authentication:
- Email/password authentication
- OAuth providers (Google, GitHub, etc.)
- Magic links

### 2. Supabase Storage (Optional)
Store quiz images in Supabase Storage instead of base64:
- Better performance
- Reduced database size
- CDN delivery

### 3. Real-time Subscriptions (Optional)
Use Supabase's real-time features alongside Socket.IO:
- Database change notifications
- Real-time leaderboard updates

## Migration Checklist

- [ ] Created Supabase project
- [ ] Copied connection string
- [ ] Created/updated `.env` file
- [ ] Updated `backend/src/db/index.ts` with SSL configuration
- [ ] Started backend server and verified tables are created
- [ ] Tested user registration
- [ ] Tested quiz creation
- [ ] Tested quiz room functionality
- [ ] Verified data appears in Supabase dashboard
- [ ] Added `.env` to `.gitignore`

## Next Steps

1. **Backup your data**: Export any existing data from your local database
2. **Test thoroughly**: Run through all application features
3. **Monitor usage**: Check Supabase dashboard for connection counts and storage
4. **Set up production**: Configure production environment variables when deploying

## Support

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- PostgreSQL Documentation: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)

