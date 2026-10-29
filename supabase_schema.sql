-- =========================================================================
-- Nexus AI (RAG A-I) Database Schema for Supabase (PostgreSQL + pgvector)
-- =========================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- to create the required tables, seed the HR and default user accounts,
-- and set up pgvector for RAG embeddings.

-- 1. Enable pgvector extension for RAG vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create app_users table
CREATE TABLE IF NOT EXISTS public.app_users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    avatar TEXT,
    department TEXT DEFAULT 'General Engineering',
    title TEXT DEFAULT 'Team Member',
    preferred_language TEXT DEFAULT 'auto',
    created_at TEXT DEFAULT to_char(now(), 'YYYY-MM-DD'),
    created_by TEXT,
    password_updated BOOLEAN DEFAULT FALSE,
    password_updated_at TEXT
);

-- 3. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT DEFAULT 'Engineering',
    lead_id TEXT,
    lead_name TEXT,
    member_ids JSONB DEFAULT '[]'::jsonb,
    members_count INTEGER DEFAULT 0,
    active_projects_count INTEGER DEFAULT 1,
    current_task JSONB,
    created_at TEXT DEFAULT to_char(now(), 'YYYY-MM-DD'),
    created_by TEXT
);

-- 4. Create documents table (Ready for RAG Knowledge Base & pgvector)
CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    filename TEXT,
    file_type TEXT,
    file_size_mb NUMERIC DEFAULT 0,
    category TEXT DEFAULT 'General',
    team TEXT DEFAULT 'General',
    access_level TEXT DEFAULT 'Internal',
    chunks_count INTEGER DEFAULT 0,
    upload_date TEXT DEFAULT to_char(now(), 'YYYY-MM-DD'),
    ingestion_status TEXT DEFAULT 'completed',
    embedding VECTOR(1536) -- Standard embedding dimension (OpenAI / Gemini text-embedding-004)
);

-- 5. Enable Row Level Security (RLS) & Policies for app_users
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 5.1 Grant schema and table privileges to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.app_users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.teams TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.documents TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Allow public read/write access via the anon key for Nexus AI frontend operations
DROP POLICY IF EXISTS "Allow anon read app_users" ON public.app_users;
CREATE POLICY "Allow anon read app_users" ON public.app_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert app_users" ON public.app_users;
CREATE POLICY "Allow anon insert app_users" ON public.app_users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update app_users" ON public.app_users;
CREATE POLICY "Allow anon update app_users" ON public.app_users FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete app_users" ON public.app_users;
CREATE POLICY "Allow anon delete app_users" ON public.app_users FOR DELETE USING (true);

-- Allow public read/write access for teams
DROP POLICY IF EXISTS "Allow anon all teams" ON public.teams;
CREATE POLICY "Allow anon all teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);

-- Allow public read/write access for documents
DROP POLICY IF EXISTS "Allow anon all documents" ON public.documents;
CREATE POLICY "Allow anon all documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);

-- 6. Seed Initial Accounts (HR Master + Default Team Members)
INSERT INTO public.app_users (
    id, name, email, password, role, avatar, department, title, preferred_language, created_at, created_by
)
VALUES 
(
    'usr-lohan-hr',
    'Lohan K J',
    'lohankanagaraj@gmail.com',
    'Lohan K J',
    'hr',
    'silhouette',
    'Human Resources & Talent Management',
    'Head of Human Resources (HR Lead)',
    'auto',
    '2025-01-01',
    'System Administrator'
),
(
    'USR-101',
    'Alex Rivera',
    'alex.rivera@nexuscorp.ai',
    'password123',
    'lead',
    'silhouette',
    'Product & AI Platform',
    'Lead AI Architect',
    'auto',
    '2025-01-15',
    'Lohan K J (HR)'
),
(
    'USR-102',
    'Priya Sharma',
    'priya.s@nexuscorp.ai',
    'password123',
    'member',
    'silhouette',
    'Engineering',
    'Full Stack Engineer',
    'auto',
    '2025-02-01',
    'Lohan K J (HR)'
)

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    role = EXCLUDED.role;
