"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RefreshCw, FolderOpen, ArrowLeft, Loader2, Sparkles, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/ui/ArticleCard";
import { PublicService } from "@/services/public";
import { ArticleReadDto, Rubrique } from "@/types/article";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// --- SQUELETTE DE CHARGEMENT MODERNISÉ ---
const CategorySkeleton = () => (
    <div className="group relative flex flex-col h-full bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
        {/* Effet de brillance animé */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        
        <div className="p-5 space-y-4">
            {/* Image Fake avec effet pulse */}
            <div className="relative h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300/50 to-transparent dark:from-zinc-900/50"></div>
            </div>
            
            {/* Contenu Fake */}
            <div className="space-y-3">
                <div className="h-3 w-1/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-full"></div>
                <div className="h-6 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-lg"></div>
                <div className="h-6 w-2/3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-lg"></div>
            </div>
            
            {/* Footer Card Fake */}
            <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 mt-auto">
                <div className="h-3 w-1/3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full"></div>
            </div>
        </div>
    </div>
);

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);

  // États
  const [currentRubrique, setCurrentRubrique] = useState<Rubrique | null>(null);
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        console.group(`🔍 [CATEGORY PAGE] Recherche Rubrique : "${slug}"`);
        setLoading(true);

        try {
            const allRubriques = await PublicService.getRubriques();
            console.log("📥 Rubriques reçues du backend :", allRubriques);

            const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

            const matched = allRubriques.find(r => {
                const rId = String(r.id);
                const rSlug = r.slug?.toLowerCase() || ""; 
                const rNom = r.nom?.toLowerCase() || "";

                return (
                    rId === decodedSlug || 
                    rSlug === decodedSlug || 
                    rNom === decodedSlug
                );
            });

            if (!matched) {
                console.warn("⚠️ Aucune rubrique trouvée pour ce slug/id.");
                console.log("Liste dispo:", allRubriques.map(r => `${r.id} - ${r.nom}`));
                setLoading(false);
                return;
            }

            console.log("✅ Rubrique identifiée :", matched.nom, `(ID: ${matched.id})`);
            setCurrentRubrique(matched);

            console.log(`📡 Fetching articles pour ID: ${matched.id}`);
            const arts = await PublicService.getArticlesByRubrique(matched.id);
            console.log(`📦 ${arts.length} Articles reçus`);
            
            setArticles(arts);

        } catch(error) {
            console.error("❌ CRASH Fetch :", error);
        } finally {
            setLoading(false);
            console.groupEnd();
        }
    };

    fetchData();
  }, [slug]);

  if (!loading && !currentRubrique) {
      return notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 flex-1">
        
        {/* --- 1. HEADER MODERNISÉ --- */}
        <div className="mb-16 relative">
            {/* Effet de fond décoratif */}
            <div className="absolute -top-8 -left-8 w-72 h-72 bg-[#3E7B52]/5 dark:bg-[#13EC13]/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-[#3E7B52]/3 dark:bg-[#13EC13]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative bg-gradient-to-br from-white to-gray-50/50 dark:from-zinc-900 dark:to-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-lg backdrop-blur-sm">
                {loading ? (
                    // SQUELETTE DU HEADER
                    <div className="space-y-6 animate-pulse">
                        <div className="h-4 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-full"></div>
                        <div className="h-16 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-2xl"></div>
                        <div className="h-6 w-full max-w-2xl bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 rounded-xl"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* FIL D'ARIANE MODERNISÉ */}
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3E7B52]/10 to-[#3E7B52]/5 dark:from-[#13EC13]/10 dark:to-[#13EC13]/5 rounded-full border border-[#3E7B52]/20 dark:border-[#13EC13]/20">
                                <FolderOpen size={14} className="text-[#3E7B52] dark:text-[#13EC13]"/>
                                <span className="text-[#3E7B52] dark:text-[#13EC13]">Rubrique</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-zinc-700"></div>
                            <span className="text-gray-600 dark:text-zinc-400">{currentRubrique?.nom}</span>
                        </div>

                        {/* TITRE AVEC EFFET */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#111] to-[#3E7B52] dark:from-white dark:to-[#13EC13] tracking-tight uppercase leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {currentRubrique?.nom}
                            </h1>
                            
                            {/* Badge compteur d'articles */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3E7B52] to-[#2d5f3e] dark:from-[#13EC13] dark:to-[#0fc910] rounded-full shadow-lg shadow-[#3E7B52]/20 dark:shadow-[#13EC13]/20">
                                    <TrendingUp size={14} className="text-white animate-bounce"/>
                                    <span className="text-white text-xs font-bold">{articles.length} Articles</span>
                                </div>
                                <Sparkles size={20} className="text-[#3E7B52] dark:text-[#13EC13] animate-pulse"/>
                            </div>
                        </div>
                        
                        {/* DESCRIPTION */}
                        <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-3xl leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                            {currentRubrique?.nom || `Toute l'actualité et les dossiers spéciaux concernant la rubrique ${currentRubrique?.nom}.`}
                        </p>
                    </div>
                )}
            </div>
        </div>

        {/* --- 2. CONTENU DES ARTICLES MODERNISÉ --- */}
        {loading ? (
            // GRILLE SQUELETTES
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="animate-in fade-in duration-500" style={{animationDelay: `${i * 100}ms`}}>
                        <CategorySkeleton />
                    </div>
                ))}
            </div>
        ) : (
            // CONTENU RÉEL OU MESSAGE VIDE
            articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <div 
                            key={article.id} 
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{animationDelay: `${index * 100}ms`}}
                        >
                            <ArticleCard article={article} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="relative animate-in fade-in zoom-in-95 duration-700">
                    {/* Effet de fond pour l'état vide */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-transparent dark:from-zinc-900/50 dark:to-transparent rounded-3xl blur-2xl"></div>
                    
                    <div className="relative flex flex-col items-center justify-center py-32 bg-gradient-to-br from-white via-gray-50 to-white dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900 border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl text-center px-6 overflow-hidden">
                        {/* Décoration d'arrière-plan */}
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#3E7B52]/5 dark:bg-[#13EC13]/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#3E7B52]/3 dark:bg-[#13EC13]/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        
                        {/* Contenu */}
                        <div className="relative z-10 space-y-6">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#3E7B52]/20 to-[#3E7B52]/5 dark:from-[#13EC13]/20 dark:to-[#13EC13]/5 rounded-3xl blur-xl animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 p-6 rounded-3xl shadow-xl">
                                    <RefreshCw size={48} className="text-gray-400 dark:text-gray-500 animate-spin" style={{animationDuration: '3s'}}/>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    Aucun article pour le moment
                                </h3>
                                <p className="text-gray-500 dark:text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
                                    La rédaction n'a pas encore publié d'article dans la rubrique <span className="font-bold text-[#3E7B52] dark:text-[#13EC13]">{currentRubrique?.nom}</span>.
                                </p>
                            </div>
                            
                            <Link 
                                href="/" 
                                className="group inline-flex items-center gap-3 text-sm font-bold text-white bg-gradient-to-r from-[#3E7B52] to-[#2d5f3e] dark:from-[#13EC13] dark:to-[#0fc910] px-8 py-4 rounded-xl shadow-lg shadow-[#3E7B52]/30 dark:shadow-[#13EC13]/30 hover:shadow-xl hover:shadow-[#3E7B52]/40 dark:hover:shadow-[#13EC13]/40 hover:scale-105 transition-all duration-300"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300"/>
                                <span>Retour à l'accueil</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )
        )}
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}