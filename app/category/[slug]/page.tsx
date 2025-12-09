"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Grid, List } from "lucide-react";
import { ARTICLES_DATA, CATEGORY_MAP, APP_CONFIG } from "@/lib/constant";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  // Déballage des params avec React.use (Pattern Next.js 15/16)
  const { slug } = use(params);

  // Vérification et récupération des infos de la catégorie
  const categoryKey = Object.keys(CATEGORY_MAP).find(k => k === slug) as keyof typeof CATEGORY_MAP;
  
  if (!categoryKey) {
    return notFound();
  }

  const categoryInfo = CATEGORY_MAP[categoryKey];
  const articles = ARTICLES_DATA.filter(article => article.categorySlug === slug);

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-8 md:py-12">
        
        {/* HEADER CATEGORIE */}
        <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111] dark:text-white tracking-tight mb-2">
                {categoryInfo.label}
            </h1>
            <p className="text-gray-500 dark:text-zinc-400 text-sm">
                Informations vérifiées sur {categoryInfo.label.toLowerCase()} africaine.
            </p>
        </div>

        {/* TOOLBAR (Filtres fictifs) */}
        <div className="flex items-center justify-between py-4 border-y border-gray-100 dark:border-zinc-800 mb-8">
            <div className="flex gap-2">
               <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-800 transition">
                  Trier par : Popularité <span className="ml-1">↓</span>
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-800 transition">
                  Date de publication <span className="ml-1">↓</span>
               </button>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
               <Calendar size={18} className="cursor-pointer hover:text-gray-600 dark:hover:text-white" />
               <Grid size={18} className="cursor-pointer text-gray-900 dark:text-white" /> {/* Vue Active */}
               <List size={18} className="cursor-pointer hover:text-gray-600 dark:hover:text-white" />
            </div>
        </div>

        {/* GRID D'ARTICLES */}
        {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} className="group flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:border-zinc-700 transition-all duration-300">
                    <div className="relative w-full h-52 bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                        <Image 
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="p-5 flex flex-col flex-1 gap-3">
                        <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            // Couleur dynamique en fonction de la catégorie (simulation)
                            article.category === "Économie" ? "text-green-600" :
                            article.category === "Politique" ? "text-blue-600" :
                            article.category === "Technologie" ? "text-purple-600" : "text-orange-600",
                            "dark:text-[#13EC13]" 
                        )}>
                            {article.category}
                        </span>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50 leading-tight line-clamp-3 group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors">
                            {article.title}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-3 leading-relaxed flex-1">
                            {article.summary}
                        </p>
                        <div className="pt-4 mt-auto border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">{article.author}</span>
                            <span className="text-[10px] text-gray-400">{article.date}</span>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-gray-500 dark:text-gray-400">Aucun article disponible pour cette catégorie pour le moment.</p>
            </div>
        )}

        {/* PAGINATION SIMPLIFIÉE */}
        <div className="mt-16 flex justify-center items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"><span className="text-xs">&lt;</span></button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-white font-bold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#13EC13]/10 text-[#3E7B52] dark:text-[#13EC13] font-bold rounded-md text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-500 text-sm">3</button>
            <span className="text-gray-400 text-xs">...</span>
            <button className="w-8 h-8 flex items-center justify-center text-gray-500 text-sm">10</button>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"><span className="text-xs">&gt;</span></button>
        </div>

      </main>
      <Footer />
    </div>
  );
}