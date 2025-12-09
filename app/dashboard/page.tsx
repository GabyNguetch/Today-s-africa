"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  PenSquare, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut, 
  Globe,
  Search,
  Bell,
  Menu,
  X
} from "lucide-react";
import { authService, User } from "@/services/auth";
import { APP_CONFIG } from "@/lib/constant";
import { cn } from "@/lib/utils";

// Imports des composants Onglets
import Overview from "@/components/dashboard/Overview";
import NewArticle from "@/components/dashboard/NewArticle";
import MyArticles from "@/components/dashboard/MyArticles";
import Settings from "@/components/dashboard/Settings";

// Définition des types d'onglets
type TabType = "overview" | "new-article" | "my-articles" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  // Etat principal pour gérer l'onglet actif (SPA style)
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  
  // Etat pour le menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Vérification authentification
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    setUser(authService.getUser());
  }, [router]);

  const handleLogout = () => {
    authService.logout();
  };

  // Liste des items de navigation
  const navItems = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "new-article", label: "Nouvel article", icon: PenSquare },
    { id: "my-articles", label: "Mes articles", icon: FileText },
    { id: "settings", label: "Paramètres", icon: SettingsIcon },
  ];

  if (!user) return null; // ou un loader

  // Fonction pour rendre le composant actif
  const renderContent = () => {
    switch (activeTab) {
        case "overview": return <Overview />;
        case "new-article": return <NewArticle onSuccess={() => setActiveTab('my-articles')} />;
        case "my-articles": return <MyArticles />;
        case "settings": return <Settings />;
        default: return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FBFBFB] dark:bg-black font-sans overflow-hidden">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col justify-between hidden lg:flex transition-all">
        
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
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                activeTab === item.id 
                  ? "bg-[#3E7B52]/10 text-[#3E7B52] dark:bg-[#13EC13]/10 dark:text-[#13EC13]" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#3E7B52] text-white flex items-center justify-center font-bold text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate uppercase tracking-wider">{user.role}</p>
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

      {/* --- SIDEBAR MOBILE (Overlay) --- */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
             <aside 
                className="w-64 bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300"
                onClick={(e) => e.stopPropagation()}
             >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-zinc-800">
                    <span className="font-bold dark:text-white">{APP_CONFIG.name}</span>
                    <button onClick={() => setMobileMenuOpen(false)}><X size={24} className="text-gray-500"/></button>
                </div>
                <div className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id as TabType); setMobileMenuOpen(false); }}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left",
                            activeTab === item.id 
                            ? "bg-green-50 text-[#3E7B52] dark:bg-green-900/20 dark:text-[#13EC13]" 
                            : "text-gray-500 dark:text-gray-400"
                        )}
                        >
                        <item.icon size={20} />
                        {item.label}
                        </button>
                    ))}
                    <div className="border-t border-gray-100 dark:border-zinc-800 my-2 pt-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500">
                            <LogOut size={20} /> Déconnexion
                        </button>
                    </div>
                </div>
             </aside>
          </div>
      )}


      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 shrink-0">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md dark:text-white dark:hover:bg-zinc-800"
                >
                    <Menu size={24} />
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:block">
                   Espace Rédacteur / <span className="text-gray-900 dark:text-white font-bold">{navItems.find(i => i.id === activeTab)?.label}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Rechercher..." 
                      className="h-9 pl-9 pr-4 text-xs bg-gray-100 dark:bg-zinc-800 border-none rounded-full w-48 lg:w-64 focus:outline-none focus:ring-1 focus:ring-[#3E7B52] dark:text-white dark:placeholder:text-gray-500"
                    />
                </div>
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white transition">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-[#3E7B52] flex items-center justify-center text-white text-xs font-bold lg:hidden">
                    {user.name.charAt(0)}
                </div>
            </div>
        </header>

        {/* CONTENT SCROLLABLE AREA */}
        <main className="flex-1 overflow-auto bg-[#FBFBFB] dark:bg-black p-4 md:p-8 lg:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto w-full h-full">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
}