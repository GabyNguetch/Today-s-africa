"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RefreshCw, FolderOpen, ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/ui/ArticleCard";
import { PublicService } from "@/services/public";
import { ArticleReadDto, Rubrique } from "@/types/article";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// --- SQUELETTE DE CHARGEMENT ---
const CategorySkeleton = () => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden p-4 space-y-4 animate-pulse">
        {/* Image Fake */}
        <div className="h-48 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
        {/* Contenu Fake */}
        <div className="space-y-3">
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-6 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
        {/* Footer Card Fake */}
        <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 mt-auto">
            <div className="h-3 w-1/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
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
        // --- LOG DEBUT ---
        console.group(`🔍 [CATEGORY PAGE] Recherche Rubrique : "${slug}"`);
        setLoading(true);

        try {
            // 1. Charger la liste des rubriques
            const allRubriques = await PublicService.getRubriques();
            console.log("📥 Rubriques reçues du backend :", allRubriques);

            // Décoder le slug (ex: 'economie' ou '12' ou 'Politique%20Africaine')
            const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

            // 2. Recherche ROBUSTE (Sans crash sur les valeurs nulles)
            const matched = allRubriques.find(r => {
                // Protection contre les valeurs nulles (si r.nom est null, on utilise "")
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
                return; // Restera null -> notFound()
            }

            console.log("✅ Rubrique identifiée :", matched.nom, `(ID: ${matched.id})`);
            setCurrentRubrique(matched);

            // 3. Charger les articles
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

  // Si on a fini de charger et qu'il n'y a rien : 404
  if (!loading && !currentRubrique) {
      return notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 flex-1">
        
        {/* --- 1. HEADER (NOM CATÉGORIE) --- */}
        <div className="mb-12 border-b border-gray-200 dark:border-zinc-800 pb-8">
            {loading ? (
                // SQUELETTE DU HEADER
                <div className="space-y-4 animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-14 w-1/2 bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
                    <div className="h-6 w-3/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                </div>
            ) : (
                <>
                    {/* FIL D'ARIANE */}
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-[#3E7B52] dark:text-[#13EC13]">
                        <FolderOpen size={14}/>
                        <span>Rubrique</span>
                        <span className="text-gray-300">/</span>
                        <span>{currentRubrique?.nom}</span>
                    </div>

                    {/* TITRE & DESCRIPTION */}
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#111] dark:text-white tracking-tight mb-4 uppercase leading-[1.1]">
                        {currentRubrique?.nom}
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
                        {currentRubrique?.description || `Toute l'actualité et les dossiers spéciaux concernant la rubrique ${currentRubrique?.nom}.`}
                    </p>
                </>
            )}
        </div>

        {/* --- 2. CONTENU DES ARTICLES --- */}
        {loading ? (
            // GRILLE SQUELETTES (6 items)
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {[1,2,3,4,5,6].map(i => <CategorySkeleton key={i} />)}
            </div>
        ) : (
            // CONTENU RÉEL OU MESSAGE VIDE
            articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-zinc-900 border border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl text-center px-4">
                    <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full mb-4 text-gray-400 dark:text-gray-500">
                        <RefreshCw size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Aucun article pour le moment
                    </h3>
                    <p className="text-gray-500 text-sm max-w-sm">
                        La rédaction n'a pas encore publié d'article dans la rubrique <strong>{currentRubrique?.nom}</strong>.
                    </p>
                    <Link href="/" className="mt-6 flex items-center gap-2 text-sm font-bold text-[#3E7B52] border border-[#3E7B52] dark:border-[#13EC13] dark:text-[#13EC13] px-6 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                        <ArrowLeft size={16}/>
                        Retour à l'accueil
                    </Link>
                </div>
            )
        )}
      </main>
      <Footer />
    </div>
  );
}