-- ==================================================
-- DIGITAL-SOMITI DATABASE SCHEMA (Supabase PostgreSQL)
-- ==================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Workspaces / Branches
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    type_en TEXT,
    type_bn TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disabled', 'fridge'))
);

-- 2. Roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL UNIQUE,
    name_bn TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'fridge'))
);

-- 3. Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    login_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    password_hash TEXT,
    role_id UUID REFERENCES roles(id),
    workspace_id UUID REFERENCES workspaces(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'disabled', 'fridge')),
    initial TEXT,
    balance NUMERIC DEFAULT 0,
    shares NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transactions Ledger
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_no TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    workspace_id UUID REFERENCES workspaces(id),
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'loan_installment', 'loan_disbursement', 'profit_share')),
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Helper View
CREATE OR REPLACE VIEW user_details WITH (security_invoker = true) AS
SELECT 
    u.*,
    r.name_en AS role_name_en,
    r.name_bn AS role_name_bn,
    w.name AS workspace_name
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN workspaces w ON u.workspace_id = w.id;

-- 6. Default Seeds
INSERT INTO roles (id, name_en, name_bn) VALUES 
('8b5cf600-0000-0000-0000-000000000000', 'System Admin / Owner', 'সিস্টেম অ্যাডমিন / মালিক'),
('f59e0b00-0000-0000-0000-000000000000', 'Cashier', 'ক্যাশিয়ার'),
('d946ef00-0000-0000-0000-000000000000', 'Investor', 'বিনিয়োগকারী'),
('a1a1aa00-0000-0000-0000-000000000000', 'Member', 'সদস্য')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspaces (id, name, code, type_en, type_bn) VALUES
('1a1a1a1a-1a1a-1a1a-1a1a-1a1a1a1a1a1a', 'Central Somiti (HQ)', 'DS-HQ', 'Headquarters', 'প্রধান কার্যালয়')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (login_id, name, email, phone, role_id, workspace_id, initial, balance)
SELECT 
    'adm00', 
    'Rashid Shahriyar', 
    'admin@dsbd.com', 
    '+880 1711-234567', 
    (SELECT id FROM roles WHERE name_en = 'System Admin / Owner'),
    (SELECT id FROM workspaces WHERE name = 'Central Somiti (HQ)'),
    'R',
    1450000
ON CONFLICT (login_id) DO NOTHING;

-- 7. Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow select for all" ON workspaces FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON roles FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON users FOR SELECT USING (true);
CREATE POLICY "Allow select for all" ON transactions FOR SELECT USING (true);

