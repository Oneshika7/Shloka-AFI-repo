"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

const API = "";

export interface User {
  id: string;
  name: string;
  email: string | null;
  organization: string | null;
  theme: string;
}

interface UserContextType {
  activeUser: User | null;
  users: User[];
  setActiveUser: (user: User | null) => void;
  switchUser: (userId: string) => void;
  refreshUsers: () => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const fetchUsers = async () => {
    if (!(session as any)?.accessToken) return [];
    try {
      const res = await fetch(`${API}/api/v1/users`, {
        headers: {
          "Authorization": `Bearer ${(session as any).accessToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        return data.users;
      }
    } catch (e) {
      console.warn("Failed to fetch users", e);
    }
    return [];
  };

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    
    if (session?.user) {
      // Sync NextAuth session user to activeUser
      const userTheme = localStorage.getItem("theme") || "dark";
      setActiveUser({
        id: (session.user as any).id || "session-id",
        name: session.user.name || "Scholar",
        email: session.user.email || null,
        organization: "Vedic Institute",
        theme: userTheme
      });
      applyTheme(userTheme);
      setLoading(false);
      
      // Optionally fetch the full users list in the background
      fetchUsers();
    } else {
      setActiveUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const applyTheme = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActiveUser(user);
      localStorage.setItem("active_user_id", user.id);
      applyTheme(user.theme);
    }
  };

  return (
    <UserContext.Provider value={{ activeUser, users, setActiveUser, switchUser, refreshUsers: fetchUsers, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
