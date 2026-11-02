import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../utils/supabaseClient";

export type UserRole = "founder" | "admin" | "manager" | "cashier" | "investor" | "member";
export type RoleScope = "system" | "client";

export interface User {
  id: string;
  login_id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  scope: RoleScope;
  role_name_en: string;
  role_name_bn: string;
  role_color: string;
  workspace_name: string;
  status: "active" | "suspended" | "fridge" | "disabled";
  initial: string;
  avatar_url?: string;
  balance?: number;
}

export const DEMO_USERS: Record<string, User> = {
  // System Side (2 Roles)
  aye01: {
    id: "usr-founder-01",
    login_id: "aye01",
    name: "Aeysha",
    email: "aeysha@dsbd.com",
    phone: "+880 1711-000001",
    role: "founder",
    scope: "system",
    role_name_en: "Founder",
    role_name_bn: "প্রতিষ্ঠাতা",
    role_color: "#EAB308", // Yellow / Gold as in design
    workspace_name: "Digital Somiti HQ",
    status: "active",
    initial: "A",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    balance: 5000000,
  },
  adm00: {
    id: "usr-admin-01",
    login_id: "adm00",
    name: "Rafiq",
    email: "rafiq@dsbd.com",
    phone: "+880 1711-000002",
    role: "admin",
    scope: "system",
    role_name_en: "Admin",
    role_name_bn: "অ্যাডমিন",
    role_color: "#A855F7", // Purple as in design
    workspace_name: "Digital Somiti HQ",
    status: "active",
    initial: "R",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    balance: 1450000,
  },

  // Clients Side (4 Roles from design)
  mng01: {
    id: "usr-manager-01",
    login_id: "mng01",
    name: "Nasrin",
    email: "nasrin@somiti.com",
    phone: "+880 1819-000003",
    role: "manager",
    scope: "client",
    role_name_en: "Manager",
    role_name_bn: "ম্যানেজার",
    role_color: "#06B6D4", // Cyan as in design
    workspace_name: "Motijheel Financial Branch",
    status: "active",
    initial: "N",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    balance: 750000,
  },
  csh01: {
    id: "usr-cashier-01",
    login_id: "csh01",
    name: "Karim",
    email: "karim@somiti.com",
    phone: "+880 1819-000004",
    role: "cashier",
    scope: "client",
    role_name_en: "Cashier",
    role_name_bn: "ক্যাশিয়ার",
    role_color: "#10B981", // Green as in design
    workspace_name: "Motijheel Financial Branch",
    status: "active",
    initial: "K",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    balance: 320000,
  },
  inv01: {
    id: "usr-investor-01",
    login_id: "inv01",
    name: "Selim",
    email: "selim@invest.com",
    phone: "+880 1912-000005",
    role: "investor",
    scope: "client",
    role_name_en: "Investor",
    role_name_bn: "বিনিয়োগকারী",
    role_color: "#F97316", // Orange as in design
    workspace_name: "Central Somiti (HQ)",
    status: "active",
    initial: "S",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    balance: 850000,
  },
  mbr01: {
    id: "usr-member-01",
    login_id: "mbr01",
    name: "Tania",
    email: "tania@somiti.com",
    phone: "+880 1611-000006",
    role: "member",
    scope: "client",
    role_name_en: "Member",
    role_name_bn: "সদস্য",
    role_color: "#94A3B8", // Slate Gray as in design
    workspace_name: "Dhanmondi Branch",
    status: "active",
    initial: "T",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    balance: 64500,
  },
};

interface AuthContextType {
  currentUser: User | null;
  login: (loginId: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("ds_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("ds_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("ds_user");
    }
  }, [currentUser]);

  const login = async (loginId: string, _password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanId = loginId.trim().toLowerCase();

    // 1. Check Supabase first if online & configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("user_details")
          .select("*")
          .eq("login_id", cleanId)
          .single();

        if (data && !error) {
          const user: User = {
            id: data.id,
            login_id: data.login_id,
            name: data.name,
            email: data.email || `${data.login_id}@dsbd.com`,
            phone: data.phone || "+880 1700-000000",
            role: data.role_name_en?.toLowerCase().includes("admin") ? "admin" : "member",
            role_name_en: data.role_name_en || "Member",
            role_name_bn: data.role_name_bn || "সদস্য",
            workspace_name: data.workspace_name || "Central Somiti",
            status: data.status || "active",
            initial: data.initial || data.name.charAt(0).toUpperCase(),
            balance: 50000,
          };
          setCurrentUser(user);
          setIsLoading(false);
          return { success: true };
        }
      } catch (err) {
        console.warn("Supabase auth check bypassed to demo accounts:", err);
      }
    }

    // 2. Demo accounts fallback
    if (DEMO_USERS[cleanId]) {
      setCurrentUser(DEMO_USERS[cleanId]);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

