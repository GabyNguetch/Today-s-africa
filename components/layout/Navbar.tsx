// FICHIER: components/layout/Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Globe, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import { PublicService } from "@/services/public";
import { Rubrique } from "@/types/article";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

      {/* 2. LIENS BUREAU (Desktop) */}
      <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
        {rubriques.length === 0 ? (
            // Skeleton loader discret
            <div className="flex gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-2 w-16 bg-gray-200 dark:bg-zinc-800 rounded"></div>)}
            </div>
        ) : (
            rubriques.map((rub) => (
                <Link 
                  key={rub.id} 
                  href={`/category/${rub.id}`} // On utilise l'ID, plus sûr que le slug si non garanti
                  className="text-[13px] font-bold uppercase tracking-wide text-gray-500 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-white relative group py-2"
                >
                  {rub.nom}
                  {/* Petit dot indicateur au hover */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#3E7B52] dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
            ))
        )}
      </div>

      {/* 3. ACTIONS DROITE */}
      <div className="flex items-center gap-3 md:gap-5 shrink-0">
        
        {/* Recherche */}
        <button className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
            <Search size={20} strokeWidth={2.5} />
        </button>

        {/* Login Btn */}
        <Link href="/login" className="hidden sm:block">
            <Button variant="outline" className="h-10 px-5 text-xs font-extrabold border-gray-200 hover:bg-gray-50 dark:bg-transparent dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">
                CONNEXION
            </Button>
        </Link>
        
        {/* Subscribe Btn */}
        <Button 
          className="h-10 px-5 bg-[#3E7B52] hover:bg-[#326342] text-white rounded-lg text-xs font-extrabold uppercase tracking-wide shadow-green-200 dark:shadow-none hidden md:flex"
        >
          Abonnement
        </Button>
        
        {/* Mobile Toggle */}
        <button 
            className="lg:hidden text-black dark:text-white p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={26} strokeWidth={2.5} />
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
                {rubriques.map(rub => (
                    <Link 
                        key={rub.id} 
                        href={`/category/${rub.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl font-bold uppercase text-gray-800 dark:text-white flex items-center justify-between border-b border-gray-50 dark:border-zinc-900 pb-4"
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