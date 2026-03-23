-- SQL Schema for Digital Somiti
-- Execute this in the Supabase SQL Editor to set up your database.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type_en TEXT,
    type_bn TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disabled', 'removed'))
);

-- 3. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL UNIQUE,
    name_bn TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled'))
);

-- 4. Users table (Matches MockUser structure)
-- Note: 'id' is the internal UUID, 'login_id' is the user-visible ID (e.g., 'adm00')
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    login_id TEXT UNIQUE NOT NULL, -- This is your 'adm00', 'user01' etc.
    name TEXT NOT NULL,
    email TEXT UNIQUE, -- Optional fallback for Supabase Auth
    phone TEXT,
    password_hash TEXT, -- Use bcrypt to hash passwords before storing
    role_id UUID REFERENCES roles(id),
    workspace_id UUID REFERENCES workspaces(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disabled', 'removed')),
    initial TEXT, -- For avatar (e.g., 'R' for Rashid)
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_workspace_id ON users(workspace_id);

-- 5. Helper view to see users with role and workspace names
CREATE OR REPLACE VIEW user_details WITH (security_invoker = true) AS
SELECT 
    u.*,
    r.name_en AS role_name_en,
    r.name_bn AS role_name_bn,
    w.name AS workspace_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN workspaces w ON u.workspace_id = w.id;

-- 6. Insert default roles (matches user specification)
INSERT INTO roles (id, name_en, name_bn) VALUES 
('8b5cf600-0000-0000-0000-000000000000', 'System Admin / Owner', 'সিস্টেম অ্যাডমিন / মালিক'),
('f59e0b00-0000-0000-0000-000000000000', 'Cashier', 'ক্যাশিয়ার'),
('d946ef00-0000-0000-0000-000000000000', 'Investor', 'বিনিয়োগকারী'),
('a1a1aa00-0000-0000-0000-000000000000', 'Member', 'সদস্য')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert default workspace (matches mock 'workspaceId: 1')
INSERT INTO workspaces (id, name, type_en, type_bn) VALUES
('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'Central Somiti', 'Headquarters', 'প্রধান কাৰ্যালয়')
ON CONFLICT DO NOTHING;

-- 8. Insert default admin user (adm00)
INSERT INTO users (login_id, name, email, phone, password_hash, role_id, workspace_id, initial)
SELECT 
    'adm00', 
    'Rashid Shahriyar', 
    'admin@dsbd.com', 
    '+880 1711-234567', 
    'adm00', -- This should be hashed in a real scenario
    (SELECT id FROM roles WHERE name_en = 'System Admin / Owner'),
    (SELECT id FROM workspaces WHERE name = 'Central Somiti'),
    'R'
ON CONFLICT (login_id) DO NOTHING;

-- 9. Row Level Security Setup
-- Enable RLS and create blanket policies for the prototype
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies explicitly specifying the 'anon' role to satisfy the Supabase Security Advisor
DROP POLICY IF EXISTS "Allow all actions for anon" ON workspaces;
-- Workspaces
DROP POLICY IF EXISTS "Allow select for anon" ON workspaces;
DROP POLICY IF EXISTS "Allow insert for anon" ON workspaces;
DROP POLICY IF EXISTS "Allow update for anon" ON workspaces;
DROP POLICY IF EXISTS "Allow delete for anon" ON workspaces;

CREATE POLICY "Allow select for anon" ON workspaces FOR SELECT USING (true);
CREATE POLICY "Allow insert for anon" ON workspaces FOR INSERT WITH CHECK ((select auth.role()) = 'anon');
CREATE POLICY "Allow update for anon" ON workspaces FOR UPDATE USING ((select auth.role()) = 'anon') WITH CHECK ((select auth.role()) = 'anon');
CREATE POLICY "Allow delete for anon" ON workspaces FOR DELETE USING ((select auth.role()) = 'anon');

-- Roles
DROP POLICY IF EXISTS "Allow select for anon" ON roles;
DROP POLICY IF EXISTS "Allow insert for anon" ON roles;
DROP POLICY IF EXISTS "Allow update for anon" ON roles;
DROP POLICY IF EXISTS "Allow delete for anon" ON roles;

CREATE POLICY "Allow select for anon" ON roles FOR SELECT USING (true);
CREATE POLICY "Allow insert for anon" ON roles FOR INSERT WITH CHECK ((select auth.role()) = 'anon');
CREATE POLICY "Allow update for anon" ON roles FOR UPDATE USING ((select auth.role()) = 'anon') WITH CHECK ((select auth.role()) = 'anon');
CREATE POLICY "Allow delete for anon" ON roles FOR DELETE USING ((select auth.role()) = 'anon');

-- Users
DROP POLICY IF EXISTS "Allow select for anon" ON users;
DROP POLICY IF EXISTS "Allow insert for anon" ON users;
DROP POLICY IF EXISTS "Allow update for anon" ON users;
DROP POLICY IF EXISTS "Allow delete for anon" ON users;

CREATE POLICY "Allow select for anon" ON users FOR SELECT USING (true);
CREATE POLICY "Allow insert for anon" ON users FOR INSERT WITH CHECK ((select auth.role()) = 'anon');
CREATE POLICY "Allow update for anon" ON users FOR UPDATE USING ((select auth.role()) = 'anon') WITH CHECK ((select auth.role()) = 'anon');
CREATE POLICY "Allow delete for anon" ON users FOR DELETE USING ((select auth.role()) = 'anon');
