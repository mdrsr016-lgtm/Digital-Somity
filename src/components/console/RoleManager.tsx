import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeDollarSign, Briefcase, ChevronRight, Crown, Plus, Search, Shield, Trash2, User, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useToast } from "../../contexts/ToastContext";

type PermKey =
  | "administrator"
  | "view_overview"
  | "view_reports"
  | "manage_roles"
  | "manage_branches"
  | "view_audit"
  | "view_members"
  | "register_members"
  | "approve_kyc"
  | "suspend_members"
  | "view_vault"
  | "collect_deposits"
  | "disburse_loans"
  | "approve_loans"
  | "export_statements"
  | "manage_security"
  | "enforce_2fa"
  | "end_sessions";

interface Person {
  id: string;
  name: string;
  nameBn: string;
  detail: string;
}

type RoleIcon = "crown" | "shield" | "briefcase" | "cash" | "user";

interface SomitiRole {
  id: string;
  name: string;
  nameBn: string;
  color: string;
  badge: string;
  badgeBn: string;
  desc: string;
  descBn: string;
  icon: RoleIcon;
  hoist: boolean;
  mentionable: boolean;
  locked: boolean;
  everyone?: boolean;
  permissions: Record<PermKey, boolean>;
  memberIds: string[];
}

const COLORS = [
  "#99AAB5",
  "#1ABC9C",
  "#2ECC71",
  "#3498DB",
  "#9B59B6",
  "#E91E63",
  "#F1C40F",
  "#E67E22",
  "#E74C3C",
  "#95A5A6",
  "#11806A",
  "#206694",
  "#71368A",
  "#AD1457",
  "#C27C0E",
  "#992D22",
];

const PEOPLE: Person[] = [
  { id: "usr-01", name: "Aeysha Shahriyar", nameBn: "আয়েশা শাহরিয়ার", detail: "Central Somiti (HQ)" },
  { id: "usr-02", name: "Rashidul Hasan", nameBn: "রাশিদুল হাসান", detail: "Central Somiti (HQ)" },
  { id: "usr-03", name: "Tareq Rahman", nameBn: "তারেক রহমান", detail: "Motijheel Financial Branch" },
  { id: "usr-04", name: "Nadia Sultana", nameBn: "নদিয়া সুলতানা", detail: "Dhanmondi Cooperative" },
  { id: "usr-05", name: "Karim Uddin", nameBn: "করিম উদ্দিন", detail: "Motijheel Financial Branch" },
  { id: "usr-06", name: "Farhana Yasmin", nameBn: "ফারহানা ইয়াসমিন", detail: "Uttara Metropolitan Branch" },
];

const PERM_GROUPS: {
  id: string;
  label: string;
  labelBn: string;
  items: { key: PermKey; name: string; nameBn: string; desc: string; descBn: string; danger?: boolean }[];
}[] = [
  {
    id: "general",
    label: "General",
    labelBn: "সাধারণ",
    items: [
      { key: "administrator", name: "Administrator", nameBn: "প্রশাসক", desc: "Members with this permission have every permission and bypass role restrictions.", descBn: "এই অনুমতি সব ক্ষমতা দেয় এবং ভূমিকার সীমা এড়িয়ে যায়।", danger: true },
      { key: "view_overview", name: "View Overview", nameBn: "সংক্ষিপ্ত দেখুন", desc: "Open the workspace home and daily totals.", descBn: "ওয়ার্কস্পেস হোম ও দৈনিক হিসাব দেখা।" },
      { key: "view_reports", name: "View Reports", nameBn: "প্রতিবেদন দেখুন", desc: "Read branch and network reports.", descBn: "শাখা ও নেটওয়ার্ক প্রতিবেদন পড়া।" },
      { key: "manage_roles", name: "Manage Roles", nameBn: "ভূমিকা পরিচালনা", desc: "Create roles and edit permissions below this role.", descBn: "ভূমিকা তৈরি ও নিচের অনুমতি বদলানো।", danger: true },
      { key: "manage_branches", name: "Manage Branches", nameBn: "শাখা পরিচালনা", desc: "Create branches and assign managers.", descBn: "শাখা খোলা ও ব্যবস্থাপক নিয়োগ।", danger: true },
      { key: "view_audit", name: "View Audit Log", nameBn: "অডিট লগ দেখুন", desc: "Read the security and vault activity log.", descBn: "নিরাপত্তা ও ভল্টের কার্যক্রম দেখা।" },
    ],
  },
  {
    id: "members",
    label: "Membership",
    labelBn: "সদস্যপদ",
    items: [
      { key: "view_members", name: "View Members", nameBn: "সদস্য দেখুন", desc: "Open the member directory.", descBn: "সদস্য তালিকা খোলা।" },
      { key: "register_members", name: "Register Members", nameBn: "সদস্য নিবন্ধন", desc: "Add a new member to a branch.", descBn: "শাখায় নতুন সদস্য যোগ করা।" },
      { key: "approve_kyc", name: "Approve KYC", nameBn: "কেওয়াইসি অনুমোদন", desc: "Verify identity documents and NID matches.", descBn: "পরিচয়পত্র ও এনআইডি যাচাই করা।" },
      { key: "suspend_members", name: "Suspend Members", nameBn: "সদস্য স্থগিত", desc: "Freeze a member account.", descBn: "সদস্য অ্যাকাউন্ট স্থগিত করা।", danger: true },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    labelBn: "অর্থ",
    items: [
      { key: "view_vault", name: "View Vault", nameBn: "ভল্ট দেখুন", desc: "See branch and central balances.", descBn: "শাখা ও কেন্দ্রীয় ব্যালেন্স দেখা।" },
      { key: "collect_deposits", name: "Collect Deposits", nameBn: "জমা সংগ্রহ", desc: "Record savings and DPS collections.", descBn: "সঞ্চয় ও ডিপিএস জমা লেখা।" },
      { key: "disburse_loans", name: "Disburse Loans", nameBn: "ঋণ বিতরণ", desc: "Release an approved loan from the vault.", descBn: "অনুমোদিত ঋণ ভল্ট থেকে ছাড়া।", danger: true },
      { key: "approve_loans", name: "Approve Loans", nameBn: "ঋণ অনুমোদন", desc: "Accept or decline a loan request.", descBn: "ঋণ আবেদন মঞ্জুর বা বাতিল।", danger: true },
      { key: "export_statements", name: "Export Statements", nameBn: "বিবরণী রপ্তানি", desc: "Download ledgers and audit statements.", descBn: "খতিয়ান ও অডিট বিবরণী ডাউনলোড।" },
    ],
  },
  {
    id: "security",
    label: "Security",
    labelBn: "নিরাপত্তা",
    items: [
      { key: "manage_security", name: "Manage Security", nameBn: "নিরাপত্তা পরিচালনা", desc: "Change vault freeze, IP lock, and session rules.", descBn: "ভল্ট লক, আইপি লক ও সেশন নিয়ম বদলানো।", danger: true },
      { key: "enforce_2fa", name: "Enforce Two-Factor", nameBn: "টু-ফ্যাক্টর বাধ্যতামূলক", desc: "Require a second step at sign-in.", descBn: "সাইন-ইনে দ্বিতীয় ধাপ বাধ্য করা।" },
      { key: "end_sessions", name: "End Sessions", nameBn: "সেশন বন্ধ", desc: "Sign every staff device out of the workspace.", descBn: "সব কর্মীর ডিভাইস থেকে সাইন আউট।", danger: true },
    ],
  },
];

const ALL_KEYS = PERM_GROUPS.flatMap((g) => g.items.map((i) => i.key));

function perms(on: PermKey[]): Record<PermKey, boolean> {
  const map = {} as Record<PermKey, boolean>;
  for (const key of ALL_KEYS) map[key] = on.includes(key);
  return map;
}

const INITIAL_ROLES: SomitiRole[] = [
  {
    id: "founder",
    name: "Founder",
    nameBn: "প্রতিষ্ঠাতা",
    color: "#8B5CF6",
    badge: "Superuser",
    badgeBn: "সুপারইউজার",
    desc: "Full root access, legal governance, multi-branch vault control, financial audits.",
    descBn: "সম্পূর্ণ রুট অ্যাক্সেস, আইনি শাসন, বহু-শাখা ভল্ট নিয়ন্ত্রণ ও আর্থিক অডিট।",
    icon: "crown",
    hoist: true,
    mentionable: false,
    locked: true,
    permissions: perms(ALL_KEYS),
    memberIds: ["usr-01"],
  },
  {
    id: "admin",
    name: "Admin",
    nameBn: "প্রশাসক",
    color: "#0F5BE4",
    badge: "Operations",
    badgeBn: "অপারেশন",
    desc: "Branch setup, member approvals, KYC validation, platform compliance.",
    descBn: "শাখা সেটআপ, সদস্য অনুমোদন, কেওয়াইসি যাচাই ও প্ল্যাটফর্ম কমপ্লায়েন্স।",
    icon: "shield",
    hoist: true,
    mentionable: true,
    locked: false,
    permissions: perms(ALL_KEYS.filter((k) => k !== "administrator")),
    memberIds: ["usr-02"],
  },
  {
    id: "manager",
    name: "Branch Manager",
    nameBn: "শাখা ব্যবস্থাপক",
    color: "#10B981",
    badge: "Regional",
    badgeBn: "আঞ্চলিক",
    desc: "Local vault custody, loan approvals up to ৳500K, teller authorization.",
    descBn: "স্থানীয় ভল্ট হেফাজত, ৳৫ লাখ পর্যন্ত ঋণ অনুমোদন ও টেলার ক্ষমতা।",
    icon: "briefcase",
    hoist: true,
    mentionable: true,
    locked: false,
    permissions: perms([
      "view_overview",
      "view_reports",
      "view_members",
      "register_members",
      "approve_kyc",
      "view_vault",
      "collect_deposits",
      "approve_loans",
      "export_statements",
    ]),
    memberIds: ["usr-03", "usr-04", "usr-06"],
  },
  {
    id: "cashier",
    name: "Cashier",
    nameBn: "ক্যাশিয়ার",
    color: "#EA580C",
    badge: "Teller",
    badgeBn: "টেলার",
    desc: "Cash drawer in/out, savings deposits, daily collection ledger, member receipts.",
    descBn: "ক্যাশ ড্রয়ার, সঞ্চয় জমা, দৈনিক কালেকশন খতিয়ান ও সদস্য রসিদ।",
    icon: "cash",
    hoist: false,
    mentionable: true,
    locked: false,
    permissions: perms(["view_overview", "view_members", "view_vault", "collect_deposits"]),
    memberIds: ["usr-05"],
  },
  {
    id: "everyone",
    name: "Member",
    nameBn: "সদস্য",
    color: "#64748B",
    badge: "Default",
    badgeBn: "ডিফল্ট",
    desc: "Baseline access for anyone who has not been given another role.",
    descBn: "যাদের আলাদা ভূমিকা নেই তাদের প্রাথমিক অ্যাক্সেস।",
    icon: "user",
    hoist: false,
    mentionable: false,
    locked: true,
    everyone: true,
    permissions: perms(["view_overview", "view_members"]),
    memberIds: [],
  },
];

function Switch({ on, disabled, onClick }: { on: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 42,
        height: 24,
        borderRadius: 999,
        border: "none",
        padding: 2,
        background: on ? "#23A559" : "#4F545C",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <motion.span
        animate={{ x: on ? 18 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
          display: "block",
        }}
      />
    </button>
  );
}

export const RoleManager: React.FC = () => {
  const { language } = useLanguage();
  const { success, info } = useToast();
  const bn = language === "bn";
  const [roles, setRoles] = useState<SomitiRole[]>(INITIAL_ROLES);
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<"display" | "permissions" | "members">("display");
  const [permQuery, setPermQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const role = roles.find((r) => r.id === openId) ?? null;
  const ranked = roles.filter((r) => !r.everyone);
  const everyone = roles.find((r) => r.everyone);

  const label = (r: SomitiRole) => (bn ? r.nameBn : r.name);

  const patch = (id: string, next: Partial<SomitiRole>) => {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, ...next } : r)));
  };

  const togglePerm = (id: string, key: PermKey) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== id || r.id === "founder") return r;
        const permissions = { ...r.permissions, [key]: !r.permissions[key] };
        if (key === "administrator" && permissions.administrator) {
          for (const k of ALL_KEYS) permissions[k] = true;
        }
        return { ...r, permissions };
      })
    );
  };

  const createRole = () => {
    const id = `role-${Date.now()}`;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const created: SomitiRole = {
      id,
      name: "new role",
      nameBn: "নতুন ভূমিকা",
      color,
      badge: "Custom",
      badgeBn: "কাস্টম",
      desc: "Custom role. Open it to set the name, color, and permissions.",
      descBn: "কাস্টম ভূমিকা। নাম, রং ও অনুমতি সেট করতে খুলুন।",
      icon: "shield",
      hoist: false,
      mentionable: false,
      locked: false,
      permissions: perms([]),
      memberIds: [],
    };
    setRoles((prev) => {
      const base = prev.filter((r) => !r.everyone);
      const tail = prev.find((r) => r.everyone);
      return tail ? [...base, created, tail] : [...base, created];
    });
    setTab("display");
    setConfirmDelete(false);
    setOpenId(id);
    info(bn ? "ভূমিকা তৈরি হয়েছে" : "Role created", bn ? "নাম, রং ও অনুমতি সেট করুন।" : "Set the name, color, and permissions.");
  };

  const deleteRole = (id: string) => {
    const target = roles.find((r) => r.id === id);
    if (!target || target.locked) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setOpenId(null);
    setConfirmDelete(false);
    success(bn ? "ভূমিকা মুছে ফেলা হয়েছে" : "Role deleted", label(target));
  };

  const openRole = (id: string) => {
    setTab("display");
    setConfirmDelete(false);
    setPermQuery("");
    setAdding(false);
    setOpenId(id);
  };

  const roleIcon = (r: SomitiRole) => {
    const props = { size: 16, color: r.color, strokeWidth: 2.25 };
    if (r.icon === "crown") return <Crown {...props} />;
    if (r.icon === "briefcase") return <Briefcase {...props} />;
    if (r.icon === "cash") return <BadgeDollarSign {...props} />;
    if (r.icon === "user") return <User {...props} />;
    return <Shield {...props} />;
  };

  const roleCard = (r: SomitiRole) => (
    <button
      key={r.id}
      type="button"
      onClick={() => openRole(r.id)}
      style={{
        width: "100%",
        textAlign: "left",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
          {roleIcon(r)}
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-heading)" }}>
            {label(r)}
          </span>
        </div>
        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: `${r.color}18`, color: r.color, fontWeight: 700, flexShrink: 0 }}>
          {bn ? r.badgeBn : r.badge}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-muted)", lineHeight: 1.4 }}>
        {bn ? r.descBn : r.desc}
      </p>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <AnimatePresence mode="wait">
        {!role ? (
          <motion.div key="list" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
            <div className="page-head" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", columnGap: 12, rowGap: 4 }}>
              <div style={{ display: "contents" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-text-primary)", margin: 0, fontFamily: "var(--font-heading)" }}>
                  {bn ? "ভূমিকা ও অনুমতি" : "Roles & Permissions"}
                </h2>
                <p style={{ fontSize: 12.5, color: "var(--color-text-muted)", margin: "2px 0 0", gridColumn: "1 / -1", gridRow: 2, width: "100%" }}>
                  {bn
                    ? "প্রশাসনিক ভূমিকা বিন্যাস, শাখা ব্যবস্থাপক নির্ধারণ ও নতুন কর্মী অ্যাক্সেস নিয়ন্ত্রণ"
                    : "Hierarchical RBAC governance: configure authority tiers, reassign branch managers, and manage credentials"}
                </p>
              </div>
              <button
                type="button"
                onClick={createRole}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-brand)",
                  color: "#FFFFFF",
                  border: "none",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Plus size={15} />
                <span>{bn ? "ভূমিকা যোগ" : "Add Role"}</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              {ranked.map((r) => roleCard(r))}
              {everyone && roleCard(everyone)}
            </div>
          </motion.div>
        ) : (
          <motion.div key={role.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.18 }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
              </button>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: role.color }} />
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: role.color, fontFamily: "var(--font-heading)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {label(role)}
              </h2>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)" }}>
              {(
                [
                  ["display", bn ? "প্রদর্শন" : "Display"],
                  ["permissions", bn ? "অনুমতি" : "Permissions"],
                  ["members", bn ? "সদস্য" : "Members"],
                ] as const
              ).map(([id, text]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    background: "none",
                    border: "none",
                    borderBottom: tab === id ? "2px solid var(--color-brand)" : "2px solid transparent",
                    color: tab === id ? "var(--color-text-primary)" : "var(--color-text-muted)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {text}
                  {id === "members" ? ` ${role.memberIds.length}` : ""}
                </button>
              ))}
            </div>

            {tab === "display" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-muted)" }}>{bn ? "ভূমিকার নাম" : "Role name"}</span>
                  <input
                    value={bn ? role.nameBn : role.name}
                    disabled={role.id === "founder" || role.everyone}
                    onChange={(e) => patch(role.id, bn ? { nameBn: e.target.value } : { name: e.target.value })}
                    style={{
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text-primary)",
                      fontSize: 15,
                      outline: "none",
                    }}
                  />
                </label>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 8 }}>{bn ? "ভূমিকার রং" : "Role color"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={color}
                        disabled={role.id === "founder"}
                        onClick={() => patch(role.id, { color })}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: color,
                          border: role.color.toLowerCase() === color.toLowerCase() ? "2px solid #FFFFFF" : "2px solid transparent",
                          boxShadow: role.color.toLowerCase() === color.toLowerCase() ? `0 0 0 2px ${color}` : "none",
                          cursor: role.id === "founder" ? "not-allowed" : "pointer",
                          padding: 0,
                        }}
                      />
                    ))}
                    <label style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", border: "1px solid var(--color-border)", cursor: "pointer" }}>
                      <input
                        type="color"
                        value={role.color}
                        disabled={role.id === "founder"}
                        onChange={(e) => patch(role.id, { color: e.target.value })}
                        style={{ border: "none", padding: 0, width: 36, height: 36, margin: -4, cursor: "pointer", background: "transparent" }}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: "1px solid var(--color-border-subtle)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{bn ? "আলাদা করে দেখান" : "Display separately"}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{bn ? "সদস্য তালিকায় এই ভূমিকা আলাদা অংশে থাকবে।" : "Show members of this role in their own group."}</div>
                    </div>
                    <Switch on={role.hoist} disabled={role.id === "founder"} onClick={() => patch(role.id, { hoist: !role.hoist })} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{bn ? "সবাই উল্লেখ করতে পারবে" : "Allow anyone to mention"}</div>
                      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{bn ? "যেকোনো কর্মী এই ভূমিকাকে ট্যাগ করতে পারবে।" : "Anyone can @mention this role."}</div>
                    </div>
                    <Switch on={role.mentionable} disabled={role.id === "founder"} onClick={() => patch(role.id, { mentionable: !role.mentionable })} />
                  </div>
                </div>
              </div>
            )}

            {tab === "permissions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {role.permissions.administrator && (
                  <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(237, 66, 69, 0.12)", color: "#ED4245", fontSize: 12.5, fontWeight: 600 }}>
                    {bn ? "এই ভূমিকার সব অনুমতি চালু আছে।" : "This role has every permission."}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                  <Search size={15} style={{ color: "var(--color-text-muted)" }} />
                  <input
                    value={permQuery}
                    onChange={(e) => setPermQuery(e.target.value)}
                    placeholder={bn ? "অনুমতি খুঁজুন" : "Search permissions"}
                    style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "var(--color-text-primary)", fontSize: 14 }}
                  />
                </div>
                {PERM_GROUPS.map((group) => {
                  const q = permQuery.trim().toLowerCase();
                  const items = group.items.filter((item) => {
                    if (!q) return true;
                    return item.name.toLowerCase().includes(q) || item.nameBn.includes(permQuery.trim()) || item.desc.toLowerCase().includes(q);
                  });
                  if (items.length === 0) return null;
                  return (
                    <div key={group.id}>
                      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--color-text-muted)", margin: "4px 2px 8px" }}>
                        {bn ? group.labelBn : group.label}
                      </div>
                      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
                        {items.map((item, index) => {
                          const adminLocks = role.permissions.administrator && item.key !== "administrator";
                          const on = role.permissions[item.key];
                          return (
                            <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderTop: index === 0 ? "none" : "1px solid var(--color-border-subtle)" }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: item.danger ? "#ED4245" : "var(--color-text-primary)" }}>
                                  {bn ? item.nameBn : item.name}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2, lineHeight: 1.35 }}>
                                  {bn ? item.descBn : item.desc}
                                </div>
                              </div>
                              <Switch
                                on={on}
                                disabled={role.id === "founder" || adminLocks}
                                onClick={() => togglePerm(role.id, item.key)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab === "members" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setAdding((v) => !v)}
                  disabled={role.everyone}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-primary)",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: role.everyone ? "not-allowed" : "pointer",
                    opacity: role.everyone ? 0.5 : 1,
                  }}
                >
                  <Plus size={15} />
                  {bn ? "সদস্য যোগ করুন" : "Add members"}
                </button>
                {adding && (
                  <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
                    {PEOPLE.filter((p) => !role.memberIds.includes(p.id)).map((person) => (
                      <button
                        key={person.id}
                        type="button"
                        onClick={() => {
                          setRoles((prev) =>
                            prev.map((r) =>
                              r.id === role.id
                                ? { ...r, memberIds: r.memberIds.includes(person.id) ? r.memberIds : [...r.memberIds, person.id] }
                                : { ...r, memberIds: r.memberIds.filter((id) => id !== person.id) }
                            )
                          );
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "10px 14px",
                          border: "none",
                          borderBottom: "1px solid var(--color-border-subtle)",
                          background: "transparent",
                          color: "var(--color-text-primary)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{bn ? person.nameBn : person.name}</div>
                        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{person.detail}</div>
                      </button>
                    ))}
                    {PEOPLE.every((p) => role.memberIds.includes(p.id)) && (
                      <div style={{ padding: 14, fontSize: 13, color: "var(--color-text-muted)" }}>{bn ? "সবাই ইতিমধ্যে আছে" : "Everyone is already in a listed role"}</div>
                    )}
                  </div>
                )}
                <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, overflow: "hidden" }}>
                  {role.memberIds.length === 0 && (
                    <div style={{ padding: 16, fontSize: 13, color: "var(--color-text-muted)" }}>
                      {role.everyone
                        ? bn
                          ? "যাদের আলাদা ভূমিকা নেই তারা এই অনুমতি পায়।"
                          : "People without another role use these permissions."
                        : bn
                          ? "এই ভূমিকায় কেউ নেই।"
                          : "No members in this role."}
                    </div>
                  )}
                  {role.memberIds.map((id) => {
                    const person = PEOPLE.find((p) => p.id === id);
                    if (!person) return null;
                    return (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid var(--color-border-subtle)" }}>
                        <span style={{ width: 32, height: 32, borderRadius: "50%", background: role.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {person.name.charAt(0)}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{bn ? person.nameBn : person.name}</div>
                          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{person.detail}</div>
                        </div>
                        {role.id !== "founder" && (
                          <button
                            type="button"
                            aria-label={bn ? "সরান" : "Remove"}
                            onClick={() => patch(role.id, { memberIds: role.memberIds.filter((m) => m !== id) })}
                            style={{ border: "none", background: "transparent", color: "var(--color-text-muted)", cursor: "pointer", display: "flex" }}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!role.locked && (
              <div style={{ marginTop: 8 }}>
                {confirmDelete ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => setConfirmDelete(false)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid var(--color-border)", background: "transparent", color: "var(--color-text-primary)", fontWeight: 700, cursor: "pointer" }}>
                      {bn ? "বাতিল" : "Cancel"}
                    </button>
                    <button type="button" onClick={() => deleteRole(role.id)} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: "#ED4245", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                      {bn ? "মুছুন" : "Delete"}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      color: "#ED4245",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Trash2 size={15} />
                    {bn ? "ভূমিকা মুছুন" : "Delete Role"}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
