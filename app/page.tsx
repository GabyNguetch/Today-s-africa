// FICHIER: app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react"; // Retrait de Loader2 et Globe si non utilisés ou ajoutés via CSS
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import ArticleCard from "@/components/ui/ArticleCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicService } from "@/services/public";
import { ArticleReadDto, Rubrique } from "@/types/article";
import { OnboardingTour } from "@/components/ui/OnBoardingTour";

// --- COMPOSANT SKELETON CARD (Interne) ---
const SkeletonCard = () => (
  <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden p-4 space-y-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
      {/* Contenu Skeleton */}
      <div className="space-y-2">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-6 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
      </div>
      <div className="pt-2">
          <div className="h-3 w-1/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
      </div>
  </div>
);

// Type local pour les sections
type SectionData = {
    rubrique: Rubrique;
    articles: ArticleReadDto[];
};

export default function Home() {
  
  const [heroArticles, setHeroArticles] = useState<ArticleReadDto[]>([]); // Trending
  const [latestArticles, setLatestArticles] = useState<ArticleReadDto[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  
  // Le loader ne concerne maintenant que les fetchs (Hero reste statique/déjà chargé si SSR ou gestion différente, mais ici tout est Client)
  const [loading, setLoading] = useState(true);

  // Initialisation
  useEffect(() => {
    const initData = async () => {
        setLoading(true);
        try {
            console.log("📥 [HOME] Chargement données API Public...");

            // 1. Appel en parallèle pour Trending (Hero) + Latest (Flux) + Menu (Sections)
            const [trendingData, feedData, allRubriques] = await Promise.all([
                PublicService.getTrendingArticles(),
                PublicService.getAllArticles(0, 6),
                PublicService.getRubriques()
            ]);

            setHeroArticles(trendingData);
            setLatestArticles(feedData.content || []); // Paginé -> content

            // 2. Logique Sections dynamiques (Récupérer les rubriques Racines)
            // On filtre uniquement les catégories principales (niveau 0)
            const rootCategories = allRubriques.filter(r => r.parentId === null).slice(0, 3);
            
            // 3. Charger les articles pour ces 3 sections spécifiques
            const sectionsPromises = rootCategories.map(async (rub) => {
                // Route spécifique rubrique /{id}/articles
                const arts = await PublicService.getArticlesByRubrique(rub.id);
                // On garde la section seulement si elle a du contenu
                if(arts && arts.length > 0) {
                    return { rubrique: rub, articles: arts.slice(0, 5) }; // Limit 5
                }
                return null;
            });

            const loadedSections = (await Promise.all(sectionsPromises)).filter(Boolean) as SectionData[];
            setSections(loadedSections);

        } catch(e) {
            console.error("❌ Erreur chargement Home:", e);
        } finally {
            setLoading(false);
        }
    };
    initData();
  }, []);

  // Le Hero prend le premier article "Tendance", ou le plus récent si pas de tendance
  const heroArticle = heroArticles.length > 0 ? heroArticles[0] : latestArticles[0];
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 space-y-24">
        
        {/* ================================================================
            1. HERO SECTION (PAS TOUCHÉ / GARDE SA STRUCTURE FIXE)
           ================================================================ */}
        <section className="bg-white dark:bg-zinc-900 p-0 md:p-8 rounded-3xl dark:border dark:border-zinc-800 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left Content */}
            <div className="flex-1 flex flex-col gap-6 relative z-10 px-4 md:px-0 mt-8 md:mt-0">
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#111] dark:text-white leading-[1.1] tracking-tight">
                    {heroArticle ? heroArticle.titre : (
                       <span>Les Histoires les Plus Importantes qui Façonnent l'Afrique en <span className="text-[#13EC13] inline-block">2026</span></span>
                    )}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-normal leading-relaxed max-w-xl line-clamp-3">
                    {heroArticle ? heroArticle.description : "Informations vérifiées et analyses approfondies sur l'économie, la politique et le développement à travers le continent."}
                </p>
                <div className="pt-2">
                    {heroArticle && (
                        <Link href={`/article/${heroArticle.id}`}>
                            <Button className="w-full sm:w-auto h-12 px-8 bg-[#2563EB] hover:bg-[#1d4ed8] rounded-md font-bold text-sm shadow-xl shadow-blue-500/10">
                            Lire l'Article Principal
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Right Content - IMAGE */}
            <div className="flex-1 w-full flex justify-end relative">
                <div className="relative w-full aspect-video md:aspect-[16/10] lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 group border-4 border-white dark:border-zinc-800/50">
                    <Image 
                        src={heroArticle?.imageCouvertureUrl || "/images/image1.png"} 
                        alt="Vision de l'Afrique"
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent opacity-80" />
                </div>
            </div>
        </section>


        {/* ================================================================
            2. LE MILIEU (AFFECTÉ PAR LE LOADING - SKELETONS)
           ================================================================ */}
        

        {/* --- AUTRES SECTIONS (RUBRIQUES) --- */}
        {loading ? (
            // MODE CHARGEMENT SECTIONS
            <div className="space-y-16">
                {[1, 2].map((s) => (
                    <div key={s} className="pt-8">
                         {/* Fake Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"/>
                            <div className="h-10 w-32 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse"/>
                        </div>
                        {/* Fake Grid (Layout spécifique demandé: 1er gros, 4 petits) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-2 h-64 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"/>
                            <div className="h-40 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"/>
                            <div className="h-40 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"/>
                            <div className="h-40 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"/>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // MODE DONNÉES SECTIONS
            sections.map((section) => (
                <section key={section.rubrique.id} className="pt-8 border-t border-dashed border-gray-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold tracking-widest text-[10px] uppercase mb-1 block">Explorer</span>
                            <h2 className="text-3xl font-black text-[#111] dark:text-white uppercase">{section.rubrique.nom}</h2>
                        </div>
                        <Link href={`/category/${section.rubrique.id}`}>
                            <Button variant="outline" className="w-auto h-10 px-5 text-xs font-bold border-gray-300 dark:border-zinc-700 hover:border-[#3E7B52] dark:hover:border-[#13EC13]">
                                Voir plus dans {section.rubrique.nom}
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {section.articles.map((art, idx) => (
                            <div 
                                key={art.id} 
                                // Layout Style : Le premier article prend 2 colonnes en largeur pour casser la grille
                                className={`${idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1'} h-full`}
                            >
                                <ArticleCard 
                                    article={art} 
                                    // Image plus grande pour le premier élément
                                    imageHeight={idx === 0 ? "h-64" : "h-40"} 
                                    className="h-full"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            ))
        )}


        {/* ================================================================
            3. CTA FOOTER (PAS TOUCHÉ) 
           ================================================================ */}
        <section className="bg-[#111] dark:bg-zinc-900 rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden my-12 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <h3 className="text-3xl md:text-4xl font-black text-white">
                    L'Afrique change, nos récits aussi.
                </h3>
                <p className="text-gray-400 text-lg">
                    Rejoignez notre newsletter pour recevoir chaque matin l'essentiel de l'économie et de la politique continentale.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <input 
                        type="email" 
                        placeholder="Votre adresse email pro" 
                        className="h-12 px-6 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-500 outline-none focus:border-[#13EC13] w-full sm:w-80"
                    />
                    <Button className="h-12 px-8 bg-[#13EC13] hover:bg-[#0fd60f] text-black font-bold">
                        S'inscrire gratuitement
                    </Button>
                </div>
            </div>
        </section>

      </main>
      
      <Footer />
     <OnboardingTour /> 
    </div>

  );
}