import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BadgeDollarSign,
  Banknote,
  Briefcase,
  Building2,
  Calculator,
  ChartLine,
  Check,
  ChevronRight,
  Clapperboard,
  Coins,
  CreditCard,
  Crown,
  Film,
  Gamepad2,
  HandCoins,
  Headphones,
  HeartHandshake,
  KeyRound,
  Landmark,
  Lock,
  Megaphone,
  Music,
  PartyPopper,
  PiggyBank,
  Pipette,
  Plus,
  Receipt,
  RotateCcw,
  Save,
  Scale,
  Search,
  Shield,
  Star,
  Ticket,
  Trash2,
  TrendingUp,
  Tv,
  User,
  Users,
  Vault,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
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

type RoleIcon =
  | "crown"
  | "shield"
  | "briefcase"
  | "cash"
  | "user"
  | "users"
  | "bank"
  | "wallet"
  | "card"
  | "piggy"
  | "coins"
  | "banknote"
  | "hand_coins"
  | "calculator"
  | "chart"
  | "trending"
  | "vault"
  | "receipt"
  | "music"
  | "film"
  | "game"
  | "clapper"
  | "party"
  | "headphones"
  | "tv"
  | "ticket"
  | "building"
  | "star"
  | "award"
  | "key"
  | "scale"
  | "handshake"
  | "megaphone";

const ROLE_ICON_MAP: Record<RoleIcon, LucideIcon> = {
  crown: Crown,
  shield: Shield,
  briefcase: Briefcase,
  cash: BadgeDollarSign,
  user: User,
  users: Users,
  bank: Landmark,
  wallet: Wallet,
  card: CreditCard,
  piggy: PiggyBank,
  coins: Coins,
  banknote: Banknote,
  hand_coins: HandCoins,
  calculator: Calculator,
  chart: ChartLine,
  trending: TrendingUp,
  vault: Vault,
  receipt: Receipt,
  music: Music,
  film: Film,
  game: Gamepad2,
  clapper: Clapperboard,
  party: PartyPopper,
  headphones: Headphones,
  tv: Tv,
  ticket: Ticket,
  building: Building2,
  star: Star,
  award: Award,
  key: KeyRound,
  scale: Scale,
  handshake: HeartHandshake,
  megaphone: Megaphone,
};

const ROLE_ICONS: { id: RoleIcon; label: string; labelBn: string }[] = [
  { id: "crown", label: "Crown", labelBn: "মুকুট" },
  { id: "shield", label: "Shield", labelBn: "ঢাল" },
  { id: "briefcase", label: "Briefcase", labelBn: "ব্রিফকেস" },
  { id: "cash", label: "Cash", labelBn: "নগদ" },
  { id: "user", label: "User", labelBn: "ব্যবহারকারী" },
  { id: "users", label: "Team", labelBn: "দল" },
  { id: "bank", label: "Bank", labelBn: "ব্যাংক" },
  { id: "wallet", label: "Wallet", labelBn: "ওয়ালেট" },
  { id: "card", label: "Card", labelBn: "কার্ড" },
  { id: "piggy", label: "Savings", labelBn: "সঞ্চয়" },
  { id: "coins", label: "Coins", labelBn: "কয়েন" },
  { id: "banknote", label: "Banknote", labelBn: "নোট" },
  { id: "hand_coins", label: "Payment", labelBn: "পেমেন্ট" },
  { id: "calculator", label: "Calculator", labelBn: "ক্যালকুলেটর" },
  { id: "chart", label: "Chart", labelBn: "চার্ট" },
  { id: "trending", label: "Growth", labelBn: "প্রবৃদ্ধি" },
  { id: "vault", label: "Vault", labelBn: "ভল্ট" },
  { id: "receipt", label: "Receipt", labelBn: "রসিদ" },
  { id: "building", label: "Branch", labelBn: "শাখা" },
  { id: "scale", label: "Compliance", labelBn: "কমপ্লায়েন্স" },
  { id: "key", label: "Access", labelBn: "অ্যাক্সেস" },
  { id: "handshake", label: "Partner", labelBn: "অংশীদার" },
  { id: "megaphone", label: "Announce", labelBn: "ঘোষণা" },
  { id: "star", label: "Star", labelBn: "স্টার" },
  { id: "award", label: "Award", labelBn: "অ্যাওয়ার্ড" },
  { id: "music", label: "Music", labelBn: "সঙ্গীত" },
  { id: "film", label: "Film", labelBn: "চলচ্চিত্র" },
  { id: "clapper", label: "Clapper", labelBn: "ক্ল্যাপার" },
  { id: "game", label: "Games", labelBn: "গেমস" },
  { id: "party", label: "Party", labelBn: "পার্টি" },
  { id: "headphones", label: "Audio", labelBn: "অডিও" },
  { id: "tv", label: "TV", labelBn: "টিভি" },
  { id: "ticket", label: "Ticket", labelBn: "টিকিট" },
];

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

export const RoleManager: React.FC<{ onRoleDetailChange?: (open: boolean) => void }> = ({
  onRoleDetailChange,
}) => {
  const { language } = useLanguage();
  const { success, info } = useToast();
  const bn = language === "bn";
  const [roles, setRoles] = useState<SomitiRole[]>(INITIAL_ROLES);
  const [openId, setOpenId] = useState<string | null>(null);
  const [tab, setTab] = useState<"display" | "permissions" | "members">("display");
  const [permQuery, setPermQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<SomitiRole | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeLockedRef = useRef(false);
  const DETAIL_TABS = ["display", "permissions", "members"] as const;

  const role = roles.find((r) => r.id === openId) ?? null;

  const isRoleHistoryState = () =>
    typeof window !== "undefined" && (window.history.state as { digiSomiti?: string } | null)?.digiSomiti === "role-detail";

  const goBackToList = useCallback(() => {
    if (isRoleHistoryState()) {
      window.history.back();
      return;
    }
    setOpenId(null);
  }, []);

  useEffect(() => {
    onRoleDetailChange?.(openId != null);
    return () => onRoleDetailChange?.(false);
  }, [openId, onRoleDetailChange]);

  useEffect(() => {
    if (!openId) {
      setSavedSnapshot(null);
      return;
    }
    const current = roles.find((r) => r.id === openId);
    if (current) setSavedSnapshot(structuredClone(current));
    // Snapshot only when opening a role — not on every edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  // Android / browser back closes role detail
  useEffect(() => {
    const onPopState = () => {
      setOpenId((current) => (current != null ? null : current));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const ranked = roles.filter((r) => !r.everyone);
  const everyone = roles.find((r) => r.everyone);

  const label = (r: SomitiRole) => (bn ? r.nameBn : r.name);

  const roleFingerprint = (r: SomitiRole) =>
    JSON.stringify({
      name: r.name,
      nameBn: r.nameBn,
      color: r.color,
      icon: r.icon,
      hoist: r.hoist,
      mentionable: r.mentionable,
      permissions: r.permissions,
      memberIds: r.memberIds,
    });

  const isDirty = !!role && !!savedSnapshot && roleFingerprint(role) !== roleFingerprint(savedSnapshot);
  const canEditRole = !!role && role.id !== "founder";

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

  const saveRoleChanges = () => {
    if (!role || !isDirty) return;
    setSavedSnapshot(structuredClone(role));
    success(
      bn ? "সংরক্ষণ হয়েছে" : "Changes saved",
      bn ? `${label(role)} আপডেট করা হয়েছে।` : `${label(role)} updated.`
    );
  };

  const resetRoleChanges = () => {
    if (!role || !savedSnapshot || !isDirty) return;
    const restored = structuredClone(savedSnapshot);
    setRoles((prev) => prev.map((r) => (r.id === role.id ? restored : r)));
    info(
      bn ? "রিসেট হয়েছে" : "Changes reset",
      bn ? "আগের সংরক্ষিত অবস্থায় ফিরে গেছে।" : "Restored to the last saved state."
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
    window.history.pushState({ digiSomiti: "role-detail", roleId: id }, "");
    info(bn ? "ভূমিকা তৈরি হয়েছে" : "Role created", bn ? "নাম, রং ও অনুমতি সেট করুন।" : "Set the name, color, and permissions.");
  };

  const deleteRole = (id: string) => {
    const target = roles.find((r) => r.id === id);
    if (!target || target.locked) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
    setConfirmDelete(false);
    success(bn ? "ভূমিকা মুছে ফেলা হয়েছে" : "Role deleted", label(target));
    if (isRoleHistoryState()) window.history.back();
    else setOpenId(null);
  };

  const openRole = (id: string) => {
    setTab("display");
    setConfirmDelete(false);
    setPermQuery("");
    setAdding(false);
    setOpenId(id);
    window.history.pushState({ digiSomiti: "role-detail", roleId: id }, "");
  };

  const handleDetailSwipeStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    swipeLockedRef.current = false;
    swipeStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleDetailSwipeEnd = (e: React.TouchEvent) => {
    if (swipeLockedRef.current) {
      swipeStartRef.current = null;
      swipeLockedRef.current = false;
      return;
    }
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start || e.changedTouches.length !== 1) return;

    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absX < 72 || absX < absY * 1.35) return;

    const idx = DETAIL_TABS.indexOf(tab);
    if (dx < 0) {
      // swipe left → next tab
      if (idx >= 0 && idx < DETAIL_TABS.length - 1) setTab(DETAIL_TABS[idx + 1]);
      return;
    }
    // swipe right → previous tab, or back to list from Display
    if (idx > 0) setTab(DETAIL_TABS[idx - 1]);
    else goBackToList();
  };

  const renderIcon = (icon: RoleIcon, color: string, size = 16) => {
    const Icon = ROLE_ICON_MAP[icon] ?? Shield;
    return <Icon size={size} color={color} strokeWidth={2.25} />;
  };

  const roleIcon = (r: SomitiRole, size = 16) => renderIcon(r.icon, r.color, size);

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
          <motion.div key="list" initial={{ opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
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
          <motion.div
            key={role.id}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 36 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onTouchStart={handleDetailSwipeStart}
            onTouchEnd={handleDetailSwipeEnd}
            style={{ display: "flex", flexDirection: "column", gap: role.id === "founder" ? 28 : 14, touchAction: "pan-y" }}
          >
            {role.id === "founder" ? (
              <>
                <button
                  type="button"
                  onClick={goBackToList}
                  style={{
                    alignSelf: "flex-start",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    color: "var(--color-text-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
                </button>

                <div
                  className="page-head"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "end",
                    columnGap: 16,
                    rowGap: 14,
                    paddingBottom: 18,
                    borderBottom: "1px solid var(--color-border-subtle)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--color-brand)",
                        marginBottom: 6,
                      }}
                    >
                      {bn ? "সিস্টেম ভূমিকা" : "System role"}
                    </div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 26,
                        fontWeight: 800,
                        color: "var(--color-text-primary)",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.15,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <span style={{ color: role.color, display: "inline-flex" }}>{roleIcon(role, 22)}</span>
                      {label(role)}
                    </h2>
                    <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--color-text-muted)", lineHeight: 1.45 }}>
                      {bn ? role.descBn : role.desc}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setTab("members")}
                      style={{
                        padding: "9px 14px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-text-primary)",
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {bn ? `সদস্য ${role.memberIds.length}` : `${role.memberIds.length} member${role.memberIds.length === 1 ? "" : "s"}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab("permissions")}
                      style={{
                        padding: "9px 16px",
                        borderRadius: "var(--radius-md)",
                        background: "var(--color-brand)",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {bn ? "অনুমতি দেখুন" : "View access"}
                    </button>
                  </div>
                </div>

                <section style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {bn ? "সারাংশ" : "Overview"}
                  </h3>
                  <div
                    className="founder-overview-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: 0,
                      borderTop: "1px solid var(--color-border-subtle)",
                      borderBottom: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    {(
                      [
                        {
                          label: bn ? "অনুমতি" : "Access",
                          value: bn ? "পূর্ণ" : "Full",
                          meta: bn ? "সব ক্ষমতা সক্রিয়" : "Administrator bypass",
                          pct: 100,
                          color: "var(--color-brand)",
                        },
                        {
                          label: bn ? "সদস্য" : "Members",
                          value: String(role.memberIds.length),
                          meta: bn ? "লকড অ্যাসাইনমেন্ট" : "Locked assignment",
                          pct: Math.min(100, role.memberIds.length * 34),
                          color: "#10B981",
                        },
                        {
                          label: bn ? "স্কোপ" : "Scope",
                          value: bn ? "ওয়ার্কস্পেস" : "Workspace",
                          meta: bn ? "সিস্টেম সুরক্ষিত" : "System protected",
                          pct: 100,
                          color: role.color,
                        },
                      ] as const
                    ).map((meter, i) => (
                      <div
                        key={meter.label}
                        style={{
                          padding: "16px 14px 18px",
                          borderLeft: i === 0 ? "none" : "1px solid var(--color-border-subtle)",
                          minWidth: 0,
                        }}
                      >
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--color-text-muted)", marginBottom: 8 }}>{meter.label}</div>
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color: "var(--color-text-primary)",
                            fontFamily: "var(--font-heading)",
                            letterSpacing: "-0.03em",
                            lineHeight: 1,
                          }}
                        >
                          {meter.value}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 6, marginBottom: 12 }}>{meter.meta}</div>
                        <div style={{ width: "100%", height: 3, borderRadius: 99, background: "var(--color-border)", overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${meter.pct}%` }}
                            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                            style={{ height: "100%", background: meter.color, borderRadius: 99 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  onClick={goBackToList}
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
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${role.color}22`,
                    border: `1px solid ${role.color}55`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {roleIcon(role, 16)}
                </span>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: role.color, fontFamily: "var(--font-heading)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {label(role)}
                </h2>
              </div>
            )}

            <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-subtle)" }}>
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

            {tab === "display" && role.id === "founder" && (
              <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {bn ? "প্রদর্শন" : "Identity"}
                  </h3>
                  <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    {bn ? "শুধুমাত্র পাঠযোগ্য" : "Read only"}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(
                    [
                      {
                        label: bn ? "নাম" : "Name",
                        value: label(role),
                        trailing: <span style={{ color: role.color, display: "inline-flex" }}>{roleIcon(role, 18)}</span>,
                      },
                      {
                        label: bn ? "রং" : "Color",
                        value: role.color.toUpperCase(),
                        trailing: (
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: role.color,
                              boxShadow: `0 0 0 2px ${role.color}33`,
                              display: "inline-block",
                            }}
                          />
                        ),
                      },
                      {
                        label: bn ? "আইকন" : "Icon",
                        value: ROLE_ICONS.find((o) => o.id === role.icon)?.[bn ? "labelBn" : "label"] ?? role.icon,
                        trailing: <span style={{ color: role.color, display: "inline-flex" }}>{roleIcon(role, 18)}</span>,
                      },
                      {
                        label: bn ? "স্থিতি" : "Status",
                        value: bn ? "লকড সিস্টেম ভূমিকা" : "Locked system role",
                        trailing: <Lock size={15} color="var(--color-text-muted)" />,
                      },
                    ] as const
                  ).map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "120px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                        padding: "14px 16px",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--color-border-subtle)",
                        background: "transparent",
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)" }}>{row.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-heading)", minWidth: 0 }}>
                        {row.value}
                      </span>
                      {row.trailing}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "display" && role.id !== "founder" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-muted)" }}>{bn ? "ভূমিকার নাম" : "Role name"}</span>
                  <div
                    className="borderless-search-bar"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 16px",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {roleIcon(role, 16)}
                    </span>
                    <input
                      className="search-input-field"
                      value={bn ? role.nameBn : role.name}
                      disabled={role.everyone}
                      onChange={(e) => patch(role.id, bn ? { nameBn: e.target.value } : { name: e.target.value })}
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        padding: 0,
                        minHeight: "unset",
                        fontSize: 13.5,
                        fontFamily: "var(--font-ui)",
                        minWidth: 0,
                      }}
                    />
                  </div>
                </label>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 8 }}>{bn ? "ভূমিকার রং" : "Role color"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={color}
                        onClick={() => patch(role.id, { color })}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: color,
                          border: role.color.toLowerCase() === color.toLowerCase() ? "2px solid #FFFFFF" : "2px solid transparent",
                          boxShadow: role.color.toLowerCase() === color.toLowerCase() ? `0 0 0 2px ${color}` : "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      />
                    ))}
                    <label
                      title={bn ? "কাস্টম রং" : "Custom color"}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        position: "relative",
                        overflow: "hidden",
                        border: COLORS.some((c) => c.toLowerCase() === role.color.toLowerCase())
                          ? "1px solid var(--color-border)"
                          : "2px solid #FFFFFF",
                        boxShadow: COLORS.some((c) => c.toLowerCase() === role.color.toLowerCase())
                          ? "none"
                          : `0 0 0 2px ${role.color}`,
                        cursor: "pointer",
                        background: `conic-gradient(#F43F5E, #F59E0B, #22C55E, #3B82F6, #A855F7, #F43F5E)`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "var(--color-surface)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <Pipette size={10} color="var(--color-text-primary)" />
                      </span>
                      <input
                        type="color"
                        value={role.color}
                        onChange={(e) => patch(role.id, { color: e.target.value })}
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          border: "none",
                          padding: 0,
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-muted)", marginBottom: 8 }}>{bn ? "ভূমিকার আইকন" : "Role icon"}</div>
                  <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 12, padding: 12 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {ROLE_ICONS.map((opt) => {
                        const selected = role.icon === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            aria-label={bn ? opt.labelBn : opt.label}
                            title={bn ? opt.labelBn : opt.label}
                            onClick={() => patch(role.id, { icon: opt.id })}
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 10,
                              border: selected ? `2px solid ${role.color}` : "1px solid var(--color-border)",
                              background: selected ? `${role.color}18` : "var(--color-bg)",
                              color: selected ? role.color : "var(--color-text-secondary)",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            {renderIcon(opt.id, selected ? role.color : "var(--color-text-secondary)", 20)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "permissions" && (
              <div style={{ display: "flex", flexDirection: "column", gap: role.id === "founder" ? 16 : 14 }}>
                {role.id === "founder" ? (
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {bn ? "অনুমতি" : "Permissions"}
                    </h3>
                    <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      {bn ? "সব অনুমতি সক্রিয়" : "Every permission enabled"}
                    </span>
                  </div>
                ) : (
                  role.permissions.administrator && (
                    <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(237, 66, 69, 0.12)", color: "#ED4245", fontSize: 12.5, fontWeight: 600 }}>
                      {bn ? "এই ভূমিকার সব অনুমতি চালু আছে।" : "This role has every permission."}
                    </div>
                  )
                )}
                <div
                  className={role.id === "founder" ? "borderless-search-bar" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: role.id === "founder" ? "12px 16px" : "8px 12px",
                    borderRadius: role.id === "founder" ? undefined : 8,
                    background: role.id === "founder" ? undefined : "var(--color-surface)",
                    border: role.id === "founder" ? undefined : "1px solid var(--color-border)",
                  }}
                >
                  <Search size={15} style={{ color: "var(--color-text-muted)" }} />
                  <input
                    className={role.id === "founder" ? "search-input-field" : undefined}
                    value={permQuery}
                    onChange={(e) => setPermQuery(e.target.value)}
                    placeholder={bn ? "অনুমতি খুঁজুন" : "Search permissions"}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: role.id === "founder" ? undefined : "var(--color-text-primary)",
                      fontSize: role.id === "founder" ? 13.5 : 14,
                      fontFamily: role.id === "founder" ? "var(--font-ui)" : undefined,
                    }}
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
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: role.id === "founder" ? 700 : 800,
                          letterSpacing: role.id === "founder" ? "0.06em" : "0.04em",
                          textTransform: "uppercase",
                          color: "var(--color-text-muted)",
                          margin: "4px 2px 8px",
                        }}
                      >
                        {bn ? group.labelBn : group.label}
                      </div>
                      <div
                        style={{
                          background: role.id === "founder" ? "transparent" : "var(--color-surface)",
                          border: role.id === "founder" ? "none" : "1px solid var(--color-border)",
                          borderRadius: role.id === "founder" ? 0 : 12,
                          overflow: "hidden",
                          display: role.id === "founder" ? "flex" : undefined,
                          flexDirection: role.id === "founder" ? "column" : undefined,
                          gap: role.id === "founder" ? 8 : undefined,
                        }}
                      >
                        {items.map((item, index) => {
                          const adminLocks = role.permissions.administrator && item.key !== "administrator";
                          const on = role.permissions[item.key];
                          if (role.id === "founder") {
                            return (
                              <div
                                key={item.key}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "1fr auto",
                                  gap: 12,
                                  alignItems: "center",
                                  padding: "14px 16px",
                                  borderRadius: "var(--radius-lg)",
                                  border: "1px solid var(--color-border-subtle)",
                                }}
                              >
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: item.danger ? "#ED4245" : "var(--color-text-primary)" }}>
                                    {bn ? item.nameBn : item.name}
                                  </div>
                                  <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2, lineHeight: 1.35 }}>
                                    {bn ? item.descBn : item.desc}
                                  </div>
                                </div>
                                <Check size={16} style={{ color: "var(--color-brand)", flexShrink: 0 }} />
                              </div>
                            );
                          }
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
                                disabled={adminLocks}
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
              <div style={{ display: "flex", flexDirection: "column", gap: role.id === "founder" ? 12 : 10 }}>
                {role.id === "founder" && (
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {bn ? "সদস্য" : "Members"}
                    </h3>
                    <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                      {bn ? "অ্যাসাইনমেন্ট লকড" : "Assignment locked"}
                    </span>
                  </div>
                )}
                {role.id !== "founder" && (
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
                )}
                {adding && role.id !== "founder" && (
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
                <div
                  style={{
                    background: role.id === "founder" ? "transparent" : "var(--color-surface)",
                    border: role.id === "founder" ? "none" : "1px solid var(--color-border)",
                    borderRadius: role.id === "founder" ? 0 : 12,
                    overflow: "hidden",
                    display: role.id === "founder" ? "flex" : undefined,
                    flexDirection: role.id === "founder" ? "column" : undefined,
                    gap: role.id === "founder" ? 8 : undefined,
                  }}
                >
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
                    if (role.id === "founder") {
                      return (
                        <div
                          key={id}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            gap: 12,
                            alignItems: "center",
                            padding: "14px 16px",
                            borderRadius: "var(--radius-lg)",
                            border: "1px solid var(--color-border-subtle)",
                          }}
                        >
                          <span
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              background: role.color,
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 13,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {person.name.charAt(0)}
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>{bn ? person.nameBn : person.name}</div>
                            <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>{person.detail}</div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid var(--color-border-subtle)" }}>
                        <span style={{ width: 32, height: 32, borderRadius: "50%", background: role.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {person.name.charAt(0)}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{bn ? person.nameBn : person.name}</div>
                          <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{person.detail}</div>
                        </div>
                        <button
                          type="button"
                          aria-label={bn ? "সরান" : "Remove"}
                          onClick={() => patch(role.id, { memberIds: role.memberIds.filter((m) => m !== id) })}
                          style={{ border: "none", background: "transparent", color: "var(--color-text-muted)", cursor: "pointer", display: "flex" }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {role.id !== "founder" && (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                type="button"
                onClick={resetRoleChanges}
                disabled={!canEditRole || !isDirty}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 8,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text-primary)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: !canEditRole || !isDirty ? "not-allowed" : "pointer",
                  opacity: !canEditRole || !isDirty ? 0.45 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <RotateCcw size={15} />
                {bn ? "রিসেট" : "Reset"}
              </button>
              <button
                type="button"
                onClick={saveRoleChanges}
                disabled={!canEditRole || !isDirty}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--color-brand)",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: !canEditRole || !isDirty ? "not-allowed" : "pointer",
                  opacity: !canEditRole || !isDirty ? 0.45 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <Save size={15} />
                {bn ? "সংরক্ষণ" : "Save"}
              </button>
            </div>
            )}

            {role.id === "founder" && (
              <style>{`
                @media (max-width: 720px) {
                  .founder-overview-grid {
                    grid-template-columns: 1fr !important;
                  }
                  .founder-overview-grid > div {
                    border-left: none !important;
                    border-top: 1px solid var(--color-border-subtle);
                  }
                  .founder-overview-grid > div:first-child {
                    border-top: none !important;
                  }
                }
              `}</style>
            )}

            {!role.locked && (
              <div style={{ marginTop: 4 }}>
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
