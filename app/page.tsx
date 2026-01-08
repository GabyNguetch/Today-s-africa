// FICHIER: app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderOpen, Loader2, Clock, ArrowLeft, ChevronLeft, Quote } from "lucide-react"; 
import { Button } from "@/components/ui/Button";
import ArticleCard from "@/components/ui/ArticleCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicService } from "@/services/public";
import { ArticleReadDto, Rubrique } from "@/types/article";
import { OnboardingTour } from "@/components/ui/OnBoardingTour";

// Nouveaux imports
import InterculturelSidebar from "@/components/layout/InterculturalSidebar";
import ConsultingSidebar from "@/components/layout/ConsultingSidebar";
import { cn, getImageUrl } from "@/lib/utils";
import LandingArticleCard from "@/components/ui/LandingCard";

// --- COMPOSANT SKELETON CARD (Adapté à la nouvelle grille) ---
const SectionSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
      {/* Grand article (2 colonnes) */}
      <div className="md:col-span-2 lg:col-span-2 flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden p-4 space-y-4">
        <div className="h-48 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
        <div className="space-y-2">
           <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
           <div className="h-6 w-2/3 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
      {/* Petits articles (1 colonne chacun - 4 fois) */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="col-span-1 flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden p-4 space-y-4">
            <div className="h-32 w-full bg-gray-200 dark:bg-zinc-800 rounded-lg"></div>
            <div className="space-y-2">
               <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
            </div>
        </div>
      ))}
  </div>
);

type SectionData = {
  rubrique: Rubrique;
  articles: ArticleReadDto[];
};

export default function Home() {
  const [heroArticles, setHeroArticles] = useState<ArticleReadDto[]>([]);
  const [latestArticles, setLatestArticles] = useState<ArticleReadDto[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATES CARROUSEL ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        console.log("📥 [HOME] Chargement données API Public...");

        const [trendingData, feedData, allRubriques] = await Promise.all([
          PublicService.getTrendingArticles(),
          PublicService.getAllArticles(0, 6),
          PublicService.getRubriques()
        ]);

        console.log("✅ [HOME] Données Trending:", trendingData);
        console.log("✅ [HOME] Données Feed:", feedData);

        // On prend les 5 premiers pour le carrousel
        const carouselSource = trendingData.length > 0 ? trendingData : feedData.content || [];
        const heroData = carouselSource.slice(0, 5);
        
        setHeroArticles(heroData);
        console.log("🎠 [CAROUSEL] Articles chargés:", heroData.length, "articles");
        heroData.forEach((art, idx) => {
          console.log(`   [${idx}] ID: ${art.id}, Titre: ${art.titre}, Image: ${art.imageCouvertureUrl}`);
        });
        
        setLatestArticles(feedData.content || []);

        const rootCategories = allRubriques.filter(r => r.parentId === null);
        
        const sectionsPromises = rootCategories.map(async (rub) => {
          const arts = await PublicService.getArticlesByRubrique(rub.id);
          return { 
            rubrique: rub, 
            articles: arts ? arts.slice(0, 5) : [] 
          };
        });

        const loadedSections = await Promise.all(sectionsPromises);
        setSections(loadedSections);

      } catch(e) {
        console.error("❌ [HOME] Erreur chargement:", e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // 2. Logique du Timer (5 secondes) - Auto-play
  useEffect(() => {
    if (heroArticles.length <= 1) return;

    const timer = setInterval(() => {
      console.log("⏰ [CAROUSEL] Timer déclenché - Passage automatique");
      goToNextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [heroArticles.length, currentSlide]);

  // Fonctions de navigation avec transition
  const goToNextSlide = () => {
    if (isTransitioning) return;
    console.log(`➡️ [CAROUSEL] Navigation: ${currentSlide} → ${(currentSlide + 1) % heroArticles.length}`);
    setDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroArticles.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrevSlide = () => {
    if (isTransitioning) return;
    console.log(`⬅️ [CAROUSEL] Navigation: ${currentSlide} → ${(currentSlide - 1 + heroArticles.length) % heroArticles.length}`);
    setDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroArticles.length) % heroArticles.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    console.log(`🎯 [CAROUSEL] Navigation directe: ${currentSlide} → ${index}`);
    setDirection(index > currentSlide ? 'left' : 'right');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  // Article affiché actuellement
  const activeArticle = heroArticles[currentSlide];

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col relative">
      <Navbar />

      {/* --- GRID LAYOUT 3 COLONNES --- */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-16 gap-8 items-start relative">
            
            {/* --- SIDEBAR GAUCHE : INTERCULTUREL --- */}
            <div className="hidden lg:block lg:col-span-4 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
                <InterculturelSidebar />
            </div>

            {/* --- COLONNE CENTRALE : CONTENU --- */}
            <div className="col-span-1 lg:col-span-9 space-y-12">
                <main className="w-full space-y-5">
                    
                {/* === HERO CAROUSEL MODERNISÉ === */}
                <section className="relative w-full rounded-3xl overflow-hidden group">
                  {loading ? (
                    <div className="w-full aspect-[21/9] bg-gray-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                  ) : activeArticle ? (
                    <div className="flex flex-col gap-0 w-full">
                      
                      {/* --- PARTIE IMAGE & TITRE (CARD) --- */}
                      <div className="relative w-full aspect-[21/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-zinc-800">
                        
                        {/* Conteneur des slides avec animation */}
                        <div className="relative w-full h-full">
                          {heroArticles.map((article, idx) => (
                            <div
                              key={article.id}
                              className={cn(
                                "absolute inset-0 transition-all duration-500 ease-in-out",
                                idx === currentSlide 
                                  ? "opacity-100 translate-x-0 z-10" 
                                  : idx < currentSlide
                                  ? "opacity-0 -translate-x-full z-0"
                                  : "opacity-0 translate-x-full z-0"
                              )}
                            >
                              <Link href={`/article/${article.id}`}>
                                <Image 
                                  src={getImageUrl(article.imageCouvertureUrl)} 
                                  alt={article.titre}
                                  fill
                                  priority={idx === 0}
                                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                                  unoptimized={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                                
                                {/* Overlay Titre */}
                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
                                  <div className="flex flex-col items-start gap-3">
                                    {/* Badge animé */}
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E7B52] text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div> 
                                      À la une
                                    </span>
                                    
                                    {/* Titre */}
                                    <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-lg line-clamp-3">
                                      {article.titre}
                                    </h1>

                                    {/* Metadata */}
                                    <div className="flex items-center gap-4 text-xs font-medium text-gray-300">
                                      <span className="flex items-center gap-1.5">
                                        <FolderOpen size={14} className="text-[#3E7B52]"/> 
                                        <span className="uppercase tracking-wide">{article.rubriqueNom || "Actualité"}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>

                        {/* Navigation Arrows Overlay */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                          <button 
                            onClick={goToPrevSlide}
                            disabled={isTransitioning}
                            className="p-3 bg-black/40 backdrop-blur hover:bg-[#3E7B52] text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowLeft size={20}/>
                          </button>
                          <button 
                            onClick={goToNextSlide}
                            disabled={isTransitioning}
                            className="p-3 bg-black/40 backdrop-blur hover:bg-[#3E7B52] text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowRight size={20}/>
                          </button>
                        </div>
                      </div>

                      {/* --- PARTIE DESCRIPTION SÉPARÉE --- */}
                      <div className="pt-4 px-2 min-h-[90px]">
                        <div className="flex gap-4 items-start">
                          <Quote size={20} className="text-[#3E7B52]/50 rotate-180 shrink-0 mt-1" />
                          
                          <div className="flex-1 space-y-2">
                            <p 
                              key={`desc-${currentSlide}`}
                              className="text-sm italic font-serif text-gray-600 dark:text-zinc-400 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500"
                            >
                              "{activeArticle.description || "L'Afrique centrale amorce une transformation décisive. Découvrez les détails de cette analyse exclusive réservée à nos abonnés..."}"
                            </p>
                            
                            {/* Indicateurs (Dots) */}
                            <div className="flex gap-1.5 pt-2">
                              {heroArticles.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => goToSlide(idx)}
                                  disabled={isTransitioning}
                                  className={cn(
                                    "h-1 rounded-full transition-all duration-500 cursor-pointer disabled:cursor-not-allowed",
                                    idx === currentSlide 
                                      ? "w-8 bg-[#3E7B52]" 
                                      : "w-2 bg-gray-300 dark:bg-zinc-700 hover:bg-[#3E7B52]/50"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : null}
                </section>
                
                {/* ================================================================
                        2. SECTIONS DYNAMIQUES (MARQUEE INFINI)
                    ================================================================ */}
                    {loading ? (
                      <div className="space-y-16">
                          {[1, 2].map((k) => (
                            <div key={k}>
                                <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded mb-6 animate-pulse"/>
                                {/* Skeleton Horizontal */}
                                <div className="flex gap-4 overflow-hidden mask-fade-sides">
                                     {[1,2,3,4].map(i => <div key={i} className="min-w-[280px] h-64 bg-gray-200 dark:bg-zinc-800 rounded-xl shrink-0"></div>)}
                                </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                        sections.map((section) => {
                          if (section.articles.length === 0) return null;
                          
                          // On duplique les articles pour l'effet de boucle infinie (Seamless loop)
                          // Si moins de 4 articles, on duplique plusieurs fois pour remplir la largeur
                          const marqueeContent = section.articles.length < 5 
                              ? [...section.articles, ...section.articles, ...section.articles, ...section.articles] 
                              : [...section.articles, ...section.articles];

                          return (
                            <section key={section.rubrique.id} className="pt-8 border-t border-dashed border-gray-200 dark:border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-hidden">
                                
                                {/* --- Header de Section --- */}
                                <div className="flex flex-row items-center justify-between gap-4 mb-6 px-1">
                                    <h2 className="text-xl md:text-2xl font-black text-[#111] dark:text-white uppercase flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-[#3E7B52] rounded-full"></span>
                                        {section.rubrique.nom}
                                    </h2>
                                    <Link href={`/category/${section.rubrique.id}`}>
                                        <button className="text-xs font-bold text-gray-500 hover:text-[#3E7B52] flex items-center gap-1 transition-colors px-3 py-1 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-zinc-800">
                                            Tout voir <ArrowRight size={12}/>
                                        </button>
                                    </Link>
                                </div>

                                {/* --- ZONE MARQUEE AUTOMATIQUE --- */}
                                {/* Mask CSS pour fondre les bords (optionnel pour l'élégance) */}
                                <div className="relative w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                                    
                                    <div 
                                        className="flex gap-5 py-4 w-max animate-scroll hover:[animation-play-state:paused]"
                                        style={{ 
                                            // La vitesse s'ajuste selon le nombre d'éléments pour garder un rythme constant
                                            animationDuration: `${marqueeContent.length * 6}s` 
                                        }}
                                    >
                                        {marqueeContent.map((art, idx) => (
                                            <div 
                                                // La clé idx est nécessaire ici car on a dupliqué les articles (mêmes IDs)
                                                key={`${art.id}-${idx}`} 
                                                className="w-[280px] md:w-[300px] shrink-0" 
                                            >
                                                <LandingArticleCard 
                                                    article={art} 
                                                    // Tous la même taille compacte
                                                    imageHeight="h-40" 
                                                    className="h-full bg-white dark:bg-zinc-900 shadow-sm hover:shadow-lg hover:scale-[1.02] border border-gray-100 dark:border-zinc-800"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </section>
                          );
                        })
                    )}

                    {/* Styles Globaux injectés pour l'animation scroll */}
                    <style jsx global>{`
                        @keyframes scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .animate-scroll {
                            animation: scroll 40s linear infinite;
                        }
                        /* Ajout d'une pause au survol pour permettre le clic facile */
                        .animate-scroll:hover {
                            animation-play-state: paused;
                        }
                    `}</style>

                    {/* ================================================================
                        3. CTA FOOTER
                    ================================================================ */}
                    <section className="bg-[#111] dark:bg-zinc-900 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500"></div>
                    
                    <div className="relative z-10 max-w-lg mx-auto space-y-6">
                        <h3 className="text-2xl md:text-3xl font-black text-white">
                        L'Afrique change, nos récits aussi.
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base">
                        Rejoignez notre newsletter pour recevoir l'essentiel de l'économie et de la politique continentale.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        <input 
                            type="email" 
                            placeholder="Email professionnel" 
                            className="h-11 px-6 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 outline-none focus:border-[#13EC13] focus:bg-white/20 w-full text-sm transition-all"
                        />
                        <Button className="h-11 px-8 rounded-full bg-[#13EC13] hover:bg-[#0fd60f] text-black font-bold text-sm">
                            S'inscrire
                        </Button>
                        </div>
                    </div>
                    </section>
                </main>
            </div>

            {/* --- SIDEBAR DROITE : CONSULTING --- */}
            <div className="hidden lg:block lg:col-span-3 sticky top-28 h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
                <ConsultingSidebar />
            </div>

        </div>

        {/* --- MOBILE ONLY FOOTER LINKS --- */}
        <div className="lg:hidden mt-16 pt-8 border-t border-gray-200 dark:border-zinc-800 grid grid-cols-2 gap-4">
             <Link href="/intelligence-interculturelle" className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl text-center">
                 <h4 className="font-bold text-[#3E7B52] text-sm mb-1">Analyse</h4>
                 <p className="text-[10px] text-gray-500">Intelligence Interculturelle</p>
             </Link>
             <Link href="/consulting-cabinet" className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl text-center">
                 <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">Cabinet</h4>
                 <p className="text-[10px] text-gray-500">Services & Conseil</p>
             </Link>
        </div>

      </div>
      
      <Footer />
      <OnboardingTour /> 
    </div>
  );
}