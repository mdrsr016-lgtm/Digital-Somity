export interface Workspace {
  id: string;
  name: string;
  code: string;
  type_en: string;
  type_bn: string;
  members_count: number;
  total_vault: number;
  status: "active" | "suspended" | "fridge";
  created_at: string;
}

export interface Transaction {
  id: string;
  reference_no: string;
  member_id: string;
  member_name: string;
  type: "deposit" | "withdraw" | "loan_installment" | "loan_disbursement" | "profit_share";
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  branch: string;
  notes?: string;
}

export interface SomitiUser {
  id: string;
  login_id: string;
  name: string;
  email: string;
  phone: string;
  role_id: string;
  role_name: string;
  workspace_name: string;
  status: "active" | "fridge" | "suspended";
  savings: number;
  shares: number;
  loans: number;
  join_date: string;
}

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: "ws-01",
    name: "Central Somiti (HQ)",
    code: "DS-HQ",
    type_en: "Headquarters",
    type_bn: "প্রধান কার্যালয়",
    members_count: 142,
    total_vault: 14500000,
    status: "active",
    created_at: "2024-01-10",
  },
  {
    id: "ws-02",
    name: "Motijheel Financial Branch",
    code: "DS-MJ",
    type_en: "Commercial Branch",
    type_bn: "বাণিজ্যিক শাখা",
    members_count: 88,
    total_vault: 6850000,
    status: "active",
    created_at: "2024-03-15",
  },
  {
    id: "ws-03",
    name: "Dhanmondi Cooperative Branch",
    code: "DS-DH",
    type_en: "Sub-urban Branch",
    type_bn: "উপ-শাখা",
    members_count: 64,
    total_vault: 4200000,
    status: "active",
    created_at: "2024-06-01",
  },
  {
    id: "ws-04",
    name: "Agrabad Chittagong Hub",
    code: "DS-CTG",
    type_en: "Regional Hub",
    type_bn: "আঞ্চলিক হাব",
    members_count: 51,
    total_vault: 3950000,
    status: "active",
    created_at: "2024-08-20",
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1001",
    reference_no: "TRX-2026-9081",
    member_id: "mbr01",
    member_name: "Kazi Nazrul Islam",
    type: "deposit",
    amount: 15000,
    date: "2026-11-01 19:45",
    status: "completed",
    branch: "Central Somiti (HQ)",
    notes: "Monthly Recurring Savings",
  },
  {
    id: "tx-1002",
    reference_no: "TRX-2026-9080",
    member_id: "mbr05",
    member_name: "Farhana Yasmin",
    type: "loan_installment",
    amount: 8500,
    date: "2026-11-01 18:20",
    status: "completed",
    branch: "Motijheel Financial Branch",
    notes: "Micro-enterprise loan installment #4",
  },
  {
    id: "tx-1003",
    reference_no: "TRX-2026-9079",
    member_id: "mbr09",
    member_name: "Rafiqul Islam",
    type: "withdraw",
    amount: 5000,
    date: "2026-11-01 16:10",
    status: "completed",
    branch: "Dhanmondi Cooperative Branch",
    notes: "Emergency withdrawal",
  },
  {
    id: "tx-1004",
    reference_no: "TRX-2026-9078",
    member_id: "inv01",
    member_name: "Tanvir Ahmed",
    type: "profit_share",
    amount: 32500,
    date: "2026-11-01 14:00",
    status: "completed",
    branch: "Central Somiti (HQ)",
    notes: "Q3 Co-op dividend distribution",
  },
  {
    id: "tx-1005",
    reference_no: "TRX-2026-9077",
    member_id: "mbr12",
    member_name: "Shahidul Alam",
    type: "loan_disbursement",
    amount: 100000,
    date: "2026-10-31 11:30",
    status: "completed",
    branch: "Agrabad Chittagong Hub",
    notes: "Agro equipment loan disburse",
  },
];

export const INITIAL_MEMBERS: SomitiUser[] = [
  {
    id: "usr-01",
    login_id: "adm00",
    name: "Rashid Shahriyar",
    email: "admin@dsbd.com",
    phone: "+880 1711-234567",
    role_id: "r-admin",
    role_name: "System Admin / Owner",
    workspace_name: "Central Somiti (HQ)",
    status: "active",
    savings: 450000,
    shares: 1000000,
    loans: 0,
    join_date: "2024-01-01",
  },
  {
    id: "usr-02",
    login_id: "csh01",
    name: "Anisur Rahman",
    email: "cashier@dsbd.com",
    phone: "+880 1819-876543",
    role_id: "r-cashier",
    role_name: "Cashier",
    workspace_name: "Motijheel Financial Branch",
    status: "active",
    savings: 120000,
    shares: 200000,
    loans: 0,
    join_date: "2024-02-15",
  },
  {
    id: "usr-03",
    login_id: "inv01",
    name: "Tanvir Ahmed",
    email: "tanvir@invest.com",
    phone: "+880 1912-345678",
    role_id: "r-investor",
    role_name: "Investor",
    workspace_name: "Central Somiti (HQ)",
    status: "active",
    savings: 350000,
    shares: 500000,
    loans: 0,
    join_date: "2024-03-01",
  },
  {
    id: "usr-04",
    login_id: "mbr01",
    name: "Kazi Nazrul Islam",
    email: "nazrul@member.com",
    phone: "+880 1611-987654",
    role_id: "r-member",
    role_name: "Member",
    workspace_name: "Dhanmondi Cooperative Branch",
    status: "active",
    savings: 64500,
    shares: 50000,
    loans: 25000,
    join_date: "2024-05-10",
  },
  {
    id: "usr-05",
    login_id: "mbr02",
    name: "Shamsur Rahman",
    email: "shamsur@member.com",
    phone: "+880 1722-112233",
    role_id: "r-member",
    role_name: "Member",
    workspace_name: "Motijheel Financial Branch",
    status: "fridge",
    savings: 18200,
    shares: 10000,
    loans: 45000,
    join_date: "2024-06-12",
  },
  {
    id: "usr-06",
    login_id: "mbr03",
    name: "Begum Rokeya",
    email: "rokeya@member.com",
    phone: "+880 1533-445566",
    role_id: "r-member",
    role_name: "Member",
    workspace_name: "Agrabad Chittagong Hub",
    status: "fridge",
    savings: 95000,
    shares: 40000,
    loans: 0,
    join_date: "2024-04-22",
  },
];

