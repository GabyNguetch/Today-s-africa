// FICHIER: app/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, Globe, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG, HOME_DATA, ARTICLES_DATA, CATEGORY_MAP, ArticleCategory } from "@/lib/constant";

import ArticleCard from "@/components/ui/ArticleCard"; // Le nouveau composant

// --- Composants Locaux pour la propreté du code ---

const Navbar = () => (
  <nav className="sticky top-0 z-50 w-full bg-white dark:bg-black/95 dark:border-b dark:border-zinc-800 py-4 px-6 md:px-12 flex items-center justify-between shadow-sm/30 backdrop-blur-sm">
    <div className="flex items-center gap-10">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 font-extrabold text-lg tracking-wider text-black dark:text-white uppercase group">
        <div className="bg-[#3E7B52] text-white p-1 rounded-sm">
          <Globe size={18} strokeWidth={3} />
        </div>
        <span>{APP_CONFIG.name}</span>
      </Link>

      {/* Nav Links (Desktop) */}
      <div className="hidden lg:flex items-center gap-6">
        {HOME_DATA.navLinks.map((item) => (
          <Link 
            key={item.slug} 
            href="#" 
            className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-[#13EC13] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>

    <div className="flex items-center gap-4">
      <Button 
        
        className="h-9 px-4 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded text-xs font-bold uppercase tracking-wider dark:bg-[#2563EB]"
      >
        <Link href='/login'>Rédiger</Link>
        
      </Button>
      {/* Mobile Menu Icon */}
      <button className="lg:hidden text-black dark:text-white">
        <Menu size={24} />
      </button>
    </div>
  </nav>
);



const Footer = () => (
  <footer className="mt-24 border-t border-gray-100 dark:border-zinc-800 bg-[#FBFBFB] dark:bg-black py-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
      
      {/* Brand Column */}
      <div className="flex flex-col gap-4">
        <h4 className="font-black text-sm uppercase tracking-wider text-black dark:text-white">
          {APP_CONFIG.name}
        </h4>
        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed max-w-xs">
          {HOME_DATA.footer.description}
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">
          Sections
        </h4>
        <ul className="space-y-2.5">
          {HOME_DATA.footer.sections.map((item) => (
            <li key={item}>
              <Link href="#" className="text-xs text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* A propos */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">
          À propos
        </h4>
        <ul className="space-y-2.5">
          {HOME_DATA.footer.about.map((item) => (
            <li key={item}>
              <Link href="#" className="text-xs text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Langue */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-black dark:text-white">
          Langue
        </h4>
        <div className="relative max-w-[180px]">
          <select className="w-full appearance-none bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-medium py-2.5 px-4 rounded hover:border-gray-400 focus:outline-none cursor-pointer">
            <option>Français</option>
            <option>English</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 dark:border-zinc-800 text-center">
        <p className="text-[10px] text-gray-400 dark:text-zinc-600">
            © {APP_CONFIG.year} {APP_CONFIG.name}. Tous droits réservés.
        </p>
    </div>
  </footer>
);


export default function Home() {
  
  // Récupérer les 3 derniers articles globaux pour la section "Dernières Actualités"
  // Note: Dans une vraie app, on trierait par date. Ici on prend juste les 3 premiers du tableau complet.
  const latestArticles = ARTICLES_DATA.slice(0, 3);

  // Définir les catégories à afficher sur la Home (pour éviter d'avoir une page trop longue)
  const categoriesToShow: ArticleCategory[] = ["economie", "politique", "technologie"];

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 space-y-24">
        
        {/* --- HERO SECTION --- */}
        <section className="bg-white dark:bg-zinc-900 p-0 md:p-8 rounded-3xl dark:border dark:border-zinc-800 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="flex-1 flex flex-col gap-6 relative z-10 px-4 md:px-0 mt-8 md:mt-0">
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#111] dark:text-white leading-[1.1] tracking-tight">
                    {HOME_DATA.hero.titlePrefix}{" "}
                    <span className="text-[#13EC13] inline-block">{HOME_DATA.hero.year}</span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-normal leading-relaxed max-w-xl">
                    {HOME_DATA.hero.description}
                </p>
                <div className="pt-2">
                    <Button className="w-full sm:w-auto h-12 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] rounded-md font-bold text-sm shadow-xl shadow-blue-500/10">
                       <Link href="/articles/eco-1">{HOME_DATA.hero.cta}</Link>
                    </Button>
                </div>
            </div>

            {/* Right Content - IMAGE REELLE */}
            <div className="flex-1 w-full flex justify-end relative">
                {/* Cadre de l'image avec effet 'glass' subtil et bordure brillante */}
                <div className="relative w-full aspect-video md:aspect-[16/10] lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 group border-4 border-white dark:border-zinc-800/50">
                    <Image 
                        src="/images/im1.avif" 
                        alt="Vision de l'Afrique"
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Overlay Dégradé pour texte ou style */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-80" />
                    
                    {/* Badge ou Info sur l'image */}
                    <div className="absolute bottom-6 left-6 backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-xl max-w-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         <div className="flex items-center gap-2 mb-1">
                             <div className="w-2 h-2 rounded-full bg-[#13EC13] animate-pulse" />
                             <span className="text-[10px] uppercase font-bold text-green-300 tracking-wider">Focus</span>
                         </div>
                         <p className="text-white text-xs leading-snug font-medium">
                            La digitalisation rapide transforme le paysage économique continental.
                         </p>
                    </div>
                </div>
                
                {/* Element décoratif flottant arrière-plan */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 dark:invert z-[-1]" />
            </div>
        </section>

        {/* --- SECTION: DERNIÈRES ACTUALITÉS (MIX) --- */}
        <section>
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#111] dark:text-white tracking-tight flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-[#13EC13] rounded-full inline-block"></span>
                  À La Une
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestArticles.map((article) => (
                    <div key={article.id} className="h-full">
                        <ArticleCard article={article} />
                    </div>
                ))}
            </div>
        </section>

        {/* --- SECTIONS: EXPLORER PAR CATÉGORIE --- */}
        {/* On boucle sur les catégories choisies pour générer les sections */}
        {categoriesToShow.map((slug) => {
          
          // Récupération des infos de la catégorie et ses articles
          const catInfo = CATEGORY_MAP[slug];
          const catArticles = ARTICLES_DATA
            .filter(a => a.categorySlug === slug)
            .slice(0, 3);

          if (!catInfo || catArticles.length === 0) return null;

          return (
            <section key={slug} className="pt-8 border-t border-gray-100 dark:border-zinc-800">
                {/* Header de la section Catégorie */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-[#3E7B52] dark:text-[#13EC13]">
                          <catInfo.icon size={20} />
                       </div>
                       <h2 className="text-2xl font-bold text-[#111] dark:text-white tracking-tight">
                          {catInfo.label}
                       </h2>
                    </div>
                    
                    <Link 
                        href={`/category/${slug}`}
                        className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#3E7B52] dark:text-gray-400 dark:hover:text-[#13EC13] transition-colors"
                    >
                        Voir plus 
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Articles de la catégorie */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
          )
        })}

        {/* Banner CTA intermédiaire (Bonus UI) */}
        <section className="bg-[#3E7B52] dark:bg-zinc-900 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Restez informé de l'évolution de l'Afrique.</h3>
                <p className="text-green-100 text-sm md:text-base">Abonnez-vous à notre newsletter pour recevoir chaque semaine les analyses les plus pointues.</p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
                <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                    <input type="email" placeholder="Votre email" className="bg-transparent border-none outline-none text-white placeholder:text-green-100/60 px-4 text-sm w-full md:w-64" />
                    <Button className="bg-white text-[#3E7B52] hover:bg-gray-100 border-none">
                       Ok
                    </Button>
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}