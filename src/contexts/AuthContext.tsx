import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../utils/supabaseClient";

export type UserRole = "admin" | "cashier" | "investor" | "member";

export interface User {
  id: string;
  login_id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  role_name_en: string;
  role_name_bn: string;
  workspace_name: string;
  status: "active" | "suspended" | "fridge" | "disabled";
  initial: string;
  balance?: number;
}

export const DEMO_USERS: Record<string, User> = {
  adm00: {
    id: "usr-admin-01",
    login_id: "adm00",
    name: "Rashid Shahriyar",
    email: "admin@dsbd.com",
    phone: "+880 1711-234567",
    role: "admin",
    role_name_en: "System Admin / Owner",
    role_name_bn: "সিস্টেম অ্যাডমিন / মালিক",
    workspace_name: "Central Somiti (HQ)",
    status: "active",
    initial: "R",
    balance: 1450000,
  },
  csh01: {
    id: "usr-cashier-01",
    login_id: "csh01",
    name: "Anisur Rahman",
    email: "cashier@dsbd.com",
    phone: "+880 1819-876543",
    role: "cashier",
    role_name_en: "Chief Cashier",
    role_name_bn: "প্রধান ক্যাশিয়ার",
    workspace_name: "Motijheel Branch",
    status: "active",
    initial: "A",
    balance: 320000,
  },
  inv01: {
    id: "usr-investor-01",
    login_id: "inv01",
    name: "Tanvir Ahmed",
    email: "tanvir@invest.com",
    phone: "+880 1912-345678",
    role: "investor",
    role_name_en: "Founding Investor",
    role_name_bn: "প্রতিষ্ঠাতা বিনিয়োগকারী",
    workspace_name: "Central Somiti (HQ)",
    status: "active",
    initial: "T",
    balance: 850000,
  },
  mbr01: {
    id: "usr-member-01",
    login_id: "mbr01",
    name: "Kazi Nazrul Islam",
    email: "nazrul@member.com",
    phone: "+880 1611-987654",
    role: "member",
    role_name_en: "General Member",
    role_name_bn: "সাধারণ সদস্য",
    workspace_name: "Dhanmondi Branch",
    status: "active",
    initial: "K",
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

