"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, PenSquare, FileText, Settings as SettingsIcon, 
  LogOut, Users, UserPlus, Globe
} from "lucide-react";
import { authService, User } from "@/services/auth";
import { APP_CONFIG } from "@/lib/constant";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// Composants (Restent identiques)
import Overview from "@/components/dashboard/Overview";
import NewArticle from "@/components/dashboard/NewArticle";
import MyArticles from "@/components/dashboard/MyArticles"; 
import AdminArticles from "@/components/dashboard/AdminArticles"; 
import Settings from "@/components/dashboard/Settings";
import CreateRedacteur from "@/components/dashboard/CreateRedacteur";
import AdminRedacteurs from "@/components/dashboard/AdminRedacteur";
import { OnboardingTour } from "@/components/ui/OnBoardingTour";

type TabType = "overview" | "new-article" | "articles" | "manage-redacteurs" | "create-redacteur" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Gestion d'État Edition
  const [editingId, setEditingId] = useState<number | null>(null);

 // Protection Route
  useEffect(() => {
    // Si chargement fini et pas authentifié -> Login
    if (!isLoading && !isAuthenticated) {
      console.log("⛔ [Dashboard] Accès refusé -> Redirection Login");
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loader d'attente (évite d'afficher "Access Denied" pdt le check du localStorage)
  if (isLoading) {
      return <div className="flex h-screen items-center justify-center dark:bg-black"><span className="text-[#3E7B52] font-bold">Chargement session...</span></div>;
  }


  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  // --- HANDLERS CLÉS POUR L'ÉDITION ---
  const handleEditRequest = (id: number) => {
      console.log(`✏️ Opening Editor for ID: ${id}`);
      setEditingId(id);
      setActiveTab("new-article");
  };

  const handleEditorClose = () => {
      // Retour à la liste après sauvegarde ou annulation
      setEditingId(null);
      // Redirection selon le rôle
      setActiveTab("articles"); 
  };

  const renderContent = () => {
    switch (activeTab) {
        case "overview": return <Overview />;
        case "new-article": return <NewArticle editArticleId={editingId} onSuccess={handleEditorClose} onCancel={handleEditorClose}/>;
        case "articles": return isAdmin ? <AdminArticles /> : <MyArticles onEdit={handleEditRequest} />;
        case "manage-redacteurs": return <AdminRedacteurs />;
        case "create-redacteur": return <CreateRedacteur />; // Fallback si modal pas utilisé directement
        case "settings": return <Settings />;
        default: return <Overview />;
    }
  };

  // --- MENU CONFIG ---
  const getMenuItems = () => {
      const base = [
          { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
          { id: "new-article", label: "Rédiger", icon: PenSquare },
      ];
      
      const adminItems = [
          { id: "articles", label: "Articles", icon: FileText },
          { id: "manage-redacteurs", label: "Équipe", icon: Users },
      ];
      
      const redacteurItems = [
          { id: "articles", label: "Mes Articles", icon: FileText },
      ];

      const footerItems = [
          { id: "settings", label: "Paramètres", icon: SettingsIcon }
      ];

      return [ ...base, ...(isAdmin ? adminItems : redacteurItems), ...footerItems ];
  };

  const menuItems = getMenuItems();

  if (!user) return null; // ou Loading...

  return (
    <div className="flex h-screen bg-[#FBFBFB] dark:bg-black font-sans overflow-hidden">
      
      {/* ============================================================ */}
      {/* 1. SIDEBAR DESKTOP (lg:flex)                                 */}
      {/* ============================================================ */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-100 shadow-sm dark:border-zinc-800 flex-col hidden lg:flex shrink-0">
        
        {/* LOGO */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-zinc-800">
            <span className="font-extrabold uppercase tracking-wider text-lg flex items-center gap-2 text-gray-900 dark:text-white">
               <Globe className="bg-[#3E7B52] text-white w-8 h-8 p-1.5 rounded-lg shadow-sm shadow-green-900/20"/> 
               {APP_CONFIG.name}
            </span>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
            {menuItems.map((item) => (
                <button
                    key={item.id}
                    id={item.id === "new-article" ? "nav-dashboard-new-article" 
                        : item.id === "articles" ? "nav-dashboard-articles" 
                        : item.id === "manage-redacteurs" ? "nav-dashboard-users" : undefined}
                    onClick={() => { setActiveTab(item.id as TabType); setEditingId(null); }}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all group relative",
                        activeTab === item.id 
                            ? "bg-[#3E7B52]/10 text-[#3E7B52] dark:bg-[#13EC13]/10 dark:text-[#13EC13] shadow-sm" 
                            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800/50 dark:text-zinc-400"
                    )}
                >
                    {/* Indicateur Actif Vertical */}
                    {activeTab === item.id && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#3E7B52] dark:bg-[#13EC13] rounded-r-full"/>
                    )}
                    <item.icon size={18} className={activeTab === item.id ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-zinc-300 transition-colors"}/> 
                    {item.label}
                </button>
            ))}
        </div>
        
        {/* USER PROFILE CARD */}
        <div className="p-4 mt-auto">
             <div className="p-3 bg-gray-50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl mb-2 flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3E7B52] to-green-400 flex items-center justify-center text-white font-black shadow-md text-xs">
                    {user.nom?.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{user.prenom}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{user.role}</p>
                </div>
            </div>

            <button 
                onClick={() => authService.logout()} 
                className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 py-2.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
            >
                <LogOut size={14}/> Déconnexion
            </button>
        </div>
      </aside>


      {/* ============================================================ */}
      {/* 2. BOTTOM NAVIGATION MOBILE (visible only small screens)     */}
      {/* ============================================================ */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex lg:hidden items-center justify-around h-16 pb-safe safe-area-inset-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        
        {/* On limite à 4-5 items max pour mobile, sinon ça déborde */}
        {menuItems.slice(0, 5).map((item) => (
            <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabType); setEditingId(null); }}
                className={cn(
                    "flex flex-col items-center justify-center gap-1 w-full h-full relative transition-colors",
                    activeTab === item.id 
                        ? "text-[#3E7B52] dark:text-[#13EC13]" 
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                )}
            >
                {activeTab === item.id && (
                     <span className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#3E7B52] dark:bg-[#13EC13] rounded-b-full shadow-[0_2px_8px_rgba(62,123,82,0.4)]"/>
                )}
                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} className="mt-1"/>
                <span className="text-[9px] font-bold uppercase tracking-tight truncate max-w-[60px]">{item.label}</span>
            </button>
        ))}
        
        {/* Bouton More / Menu si besoin (Optionnel) */}
      </nav>


      {/* ============================================================ */}
      {/* 3. MAIN CONTENT AREA (Padding bas pour la bottom nav)        */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
         {/* HEADER MOBILE (LOGO + LOGOUT) */}
         <header className="lg:hidden h-14 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between px-4 shrink-0">
             <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                <Globe className="text-[#3E7B52] w-5 h-5"/> {APP_CONFIG.name}
             </div>
             <button onClick={() => authService.logout()} className="p-2 text-gray-400 hover:text-red-500">
                <LogOut size={18}/>
             </button>
         </header>

         {/* Contenu Scrollable (pb-20 important pour ne pas cacher sous la navbar mobile) */}
         <main className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth pb-24 lg:pb-8 bg-[#FBFBFB] dark:bg-black">
            <div className="max-w-7xl mx-auto h-full">
                {renderContent()}
            </div>
         </main>
         <OnboardingTour />
      </div>

    </div>
  );
}