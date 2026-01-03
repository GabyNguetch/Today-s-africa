// FICHIER: components/layout/Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Menu, Search, UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import { PublicService } from "@/services/public";
import { Rubrique } from "@/types/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth(); // Utilisation du contexte Auth
  const router = useRouter();
  
  // Hook de fetch simple au montage
  useEffect(() => {
    const fetchMenu = async () => {
        try {
            console.log("🧩 Chargement du Menu...");
            const all = await PublicService.getRubriques();
            
            // On filtre pour n'afficher que les parents (Niveau 1)
            // On peut aussi trier par 'ordre' si votre backend le gère
            const roots = all.filter(r => r.parentId === null); // .sort((a,b) => a.ordre - b.ordre)
            
            // Sécurité : On ne prend que les 7 premiers pour éviter de casser le design
            // Les autres pourraient aller dans un "Plus..."
            setRubriques(roots); // slice(0, 7) si besoin
        } catch (e) {
            console.error("Erreur chargement menu Navbar", e);
        }
    };
    fetchMenu();
  }, []);

  // --- 🔥 LOGIQUE DE REDIRECTION INTELLIGENTE ---
  const handleActionClick = () => {
      if (user) {
          // Si Staff (Rédacteur/Admin) -> Dashboard
          if (['REDACTEUR', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
              router.push("/dashboard");
          } else {
              // Si Utilisateur lambda -> Page Profil Lecteur
              router.push("/profil");
          }
      } else {
          // Si non connecté -> Login/Register
          router.push("/login");
      }
  };


  return (
    <>
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 py-3 px-6 md:px-12 flex items-center justify-between transition-all duration-300">
      
      {/* 1. LOGO */}
      <Link href="/" className="flex items-center gap-3 group mr-8 shrink-0">
        <div className="bg-[#111] dark:bg-white text-white dark:text-black p-1.5 rounded-lg shadow-lg group-hover:rotate-12 transition-transform duration-300">
          <Globe size={22} strokeWidth={2.5} />
        </div>
        <span className="font-black text-xl tracking-tighter text-black dark:text-white uppercase hidden sm:block">
            {APP_CONFIG.name}
        </span>
      </Link>

      {/* 3. LIENS RUBRIQUES (Desktop) - Déplacé après les boutons principaux */}
      <div id="nav-categories" className="hidden lg:flex items-center gap-6 ml-8">
        {rubriques.length === 0 ? (
            // Skeleton loader discret
            <div className="flex gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-2 w-16 bg-gray-200 dark:bg-zinc-800 rounded"></div>)}
            </div>
        ) : (
            rubriques.slice(0, 5).map((rub) => (
                <Link 
                  key={rub.id} 
                  href={`/category/${rub.id}`}
                  className="text-[11px] font-bold uppercase tracking-wide text-gray-500 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white relative group py-2"
                >
                  {rub.nom}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#3E7B52] dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
            ))
        )}
      </div>

 {/* 4. ACTIONS */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        
        {/* Affichage conditionnel Bouton Connexion */}
        {!user && (
            <Link href="/login" className="hidden sm:block">
                <Button variant="outline" className="h-9 px-5 text-xs font-bold border-gray-200 dark:border-zinc-700">
                    CONNEXION
                </Button>
            </Link>
        )}
        
        {/* Bouton Intelligent : Profil ou Abonnement */}
        <Button 
          id={user ? "btn-action-profile" : "cta-subscribe"} // ✅ ID dynamique
          onClick={handleActionClick}
          className="h-9 px-5 bg-[#3E7B52] hover:bg-[#326342] text-white rounded-lg text-xs font-bold uppercase shadow-lg shadow-green-900/20 flex items-center gap-2"
        >
          {user ? (
            <>
                <UserIcon size={14} /> 
                <span className="max-w-[100px] truncate">Mon Profil</span>
            </>
          ) : (
            "S'abonner"
          )}
        </Button>
        
        {/* Menu Mobile Toggle */}
        <button className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>
    </nav>

    {/* 4. MENU MOBILE FULLSCREEN OVERLAY */}
    {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-black animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Header Mobile */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-900">
                <span className="font-black text-xl tracking-tighter uppercase">{APP_CONFIG.name}</span>
                <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-gray-100 dark:bg-zinc-900 rounded-full"
                >
                    <X size={24}/>
                </button>
            </div>

            {/* Links Mobile */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                {/* Nouveaux boutons principaux en mobile */}
                <Link 
                    href="/intelligence-interculturelle"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold uppercase text-blue-600 dark:text-blue-400 flex items-center justify-between border-b border-blue-100 dark:border-blue-900 pb-4"
                >
                    Intelligence Interculturelle
                    <ArrowRight size={20} className="-rotate-45 text-blue-300"/>
                </Link>
                
                <Link 
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold uppercase text-green-600 dark:text-green-400 flex items-center justify-between border-b border-green-100 dark:border-green-900 pb-4"
                >
                    Écran Principal (Actualité)
                    <ArrowRight size={20} className="-rotate-45 text-green-300"/>
                </Link>
                
                <Link 
                    href="/consulting-cabinet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-bold uppercase text-purple-600 dark:text-purple-400 flex items-center justify-between border-b border-purple-100 dark:border-purple-900 pb-4"
                >
                    Consulting Cabinet
                    <ArrowRight size={20} className="-rotate-45 text-purple-300"/>
                </Link>
                
                {/* Séparateur */}
                <div className="border-t border-gray-200 dark:border-zinc-800 my-4"></div>
                
                {/* Rubriques existantes */}
                {rubriques.map(rub => (
                    <Link 
                        key={rub.id} 
                        href={`/category/${rub.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xl font-bold uppercase text-gray-800 dark:text-white flex items-center justify-between border-b border-gray-50 dark:border-zinc-900 pb-4"
                    >
                        {rub.nom}
                        <ArrowRight size={20} className="-rotate-45 text-gray-300"/>
                    </Link>
                ))}
                
                <div className="mt-8 flex flex-col gap-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="h-12 text-sm font-bold w-full justify-center">Espace Rédacteur</Button>
                    </Link>
                    <Button className="h-12 text-sm font-bold w-full justify-center bg-[#3E7B52]">S'abonner au Premium</Button>
                </div>
            </div>
        </div>
    )}
    </>
  );
}