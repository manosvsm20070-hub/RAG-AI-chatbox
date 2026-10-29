# Supabase Database Setup Guide for Nexus AI (RAG A-I)

Nexus AI now supports **Supabase (PostgreSQL with pgvector)** for permanent multi-user storage, authentication, team synchronization, and RAG vector search.

---

## 1. How to Log In Right Now (Default Accounts)

Until you connect your Supabase project, the app uses local storage with the following pre-configured credentials:

### HR Master Account
- **User ID / Email**: `lohankanagaraj@gmail.com` *(or ID: `usr-lohan-hr` or `hr`)*
- **Password**: `Lohan K J`
- **Access**: Full administration, HR Workspace, squad allocation, document management, and password resets.

### Sample Team Member Accounts
- **Account 1**: `alex.rivera@nexuscorp.ai` (or ID: `USR-101`) / **Password**: `password123`
- **Account 2**: `priya.s@nexuscorp.ai` (or ID: `USR-102`) / **Password**: `password123`

---

## 2. Connect Your Supabase Cloud Database (3 Quick Steps)

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **New Project**, choose a project name (e.g. `nexus-ai`) and set a database password.

### Step 2: Run the Database Schema Script
1. In your Supabase project dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Copy all contents from [supabase_schema.sql](file:///Users/manoranjankumar.s/Documents/RAG%20A-I%20/supabase_schema.sql) in this repository and paste it into the editor.
4. Click **Run** (green button).
   *This automatically enables `pgvector`, creates `app_users`, `teams`, `documents` tables, configures security policies, and seeds the HR and default user accounts.*

### Step 3: Add Your API Keys to `.env`
1. In your Supabase dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy the **Project URL** and the **anon / public key**.
3. Open [frontend/.env](file:///Users/manoranjankumar.s/Documents/RAG%20A-I%20/frontend/.env) and update:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
4. Restart your frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

When connected, the Sign In screen will display a green badge: **"Supabase PostgreSQL Active"**. Any user or squad created by HR will now be permanently stored in your PostgreSQL database and accessible from any browser or device!

