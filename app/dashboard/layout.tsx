// FICHIER: app/dashboard/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PenSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Globe,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";
import { authService, User } from "@/services/auth";
import { APP_CONFIG } from "@/lib/constant";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Vue d'ensemble", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Nouvel article", icon: PenSquare, href: "/dashboard/new-article" },
  { label: "Mes articles", icon: FileText, href: "/dashboard/my-articles" },
  { label: "Paramètres", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Vérification Auth (Basique pour le client-side)
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    setUser(authService.getUser());
  }, [router]);

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) return null; // Ou un loader

  return (
    <div className="flex h-screen bg-[#FBFBFB] dark:bg-black font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col justify-between hidden md:flex">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-zinc-800">
           <Link href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-wider text-black dark:text-white uppercase">
            <div className="bg-[#3E7B52] text-white p-1 rounded-sm">
              <Globe size={16} strokeWidth={3} />
            </div>
            {APP_CONFIG.name}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-[#3E7B52]/10 text-[#3E7B52] dark:bg-[#13EC13]/10 dark:text-[#13EC13]" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#3E7B52] text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-2 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-6 md:px-8">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
               Dashboard / <span className="text-gray-900 dark:text-white capitalize">{pathname.split('/').pop()?.replace('-', ' ')}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Rechercher..." 
                      className="h-9 pl-9 pr-4 text-xs bg-gray-100 dark:bg-zinc-800 border-none rounded-full w-64 focus:outline-none focus:ring-1 focus:ring-[#3E7B52] dark:text-white"
                    />
                </div>
                <button className="relative text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>

        {/* CONTENT SCROLLABLE */}
        <main className="flex-1 overflow-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}