"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Globe, 
  Brain,
  Sparkles,
  TrendingUp,
  Award,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_CONFIG } from "@/lib/constant";
import ArticleCard from "@/components/ui/ArticleCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicService } from "@/services/public";
import { ArticleReadDto } from "@/types/article";
import { PageResponse } from "@/types/dashboard";

const SkeletonCard = () => (
  <div className="group relative flex flex-col h-full bg-white dark:bg-zinc-900 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl overflow-hidden animate-pulse">
    <div className="relative h-56 w-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      <div className="absolute top-4 left-4 flex gap-2">
        <div className="h-6 w-20 bg-emerald-200 dark:bg-emerald-800 rounded-full"></div>
      </div>
    </div>
    
    <div className="p-6 space-y-4 flex-1 flex flex-col">
      <div className="space-y-3">
        <div className="h-3 w-24 bg-emerald-100 dark:bg-emerald-900 rounded-full"></div>
        <div className="h-6 w-full bg-gray-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-6 w-4/5 bg-gray-200 dark:bg-zinc-800 rounded"></div>
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800/50 rounded"></div>
        <div className="h-4 w-full bg-gray-100 dark:bg-zinc-800/50 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-100 dark:bg-zinc-800/50 rounded"></div>
      </div>
      
      <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800">
        <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900 rounded-full"></div>
      </div>
    </div>
  </div>
);

export default function IntelligenceInterculturelle() {
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchAdminArticles = async () => {
      setLoading(true);
      try {
        const response: PageResponse<ArticleReadDto> = await PublicService.getAdminArticles(currentPage, 12);
        setArticles(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Erreur lors du chargement des articles admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminArticles();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-black dark:via-emerald-950/10 dark:to-black font-sans selection:bg-emerald-600 selection:text-white flex flex-col transition-colors duration-300">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-12 space-y-20">
        
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950 dark:via-teal-950 dark:to-green-950 rounded-[2.5rem] opacity-50 blur-3xl -z-10"></div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 p-8 md:p-16 lg:p-20 rounded-[2.5rem] border border-emerald-200 dark:border-emerald-800/30 relative overflow-hidden backdrop-blur-sm">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-500/10 dark:bg-teal-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 dark:bg-green-400/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>
            
            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
              {/* Icon Badge */}
              <div className="flex justify-center mb-8 animate-float">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-5 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                    <Brain size={56} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              
              {/* Main Title */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-300 dark:border-emerald-700">
                  <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 tracking-wide">TODAY'S AFRICA EDITORIAL</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  Introduction à la Théorie de 
                  <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent animate-gradient">
                    l'Intelligence Interculturelle
                  </span>
                </h1>
              </div>
              
              {/* Description */}
              <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Découvrez les analyses approfondies et les perspectives uniques de notre équipe éditoriale sur les enjeux interculturels qui façonnent l'Afrique moderne.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <div className="group flex items-center gap-3 bg-white/80 dark:bg-emerald-900/20 backdrop-blur-sm px-6 py-3.5 rounded-full border border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-full group-hover:bg-emerald-200 dark:group-hover:bg-emerald-700 transition-colors">
                    <Award className="text-emerald-600 dark:text-emerald-400" size={18} />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Analyses Expertes</span>
                </div>
                
                <div className="group flex items-center gap-3 bg-white/80 dark:bg-emerald-900/20 backdrop-blur-sm px-6 py-3.5 rounded-full border border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="bg-teal-100 dark:bg-teal-800 p-2 rounded-full group-hover:bg-teal-200 dark:group-hover:bg-teal-700 transition-colors">
                    <Globe className="text-teal-600 dark:text-teal-400" size={18} />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Vision Continentale</span>
                </div>
                
                <div className="group flex items-center gap-3 bg-white/80 dark:bg-emerald-900/20 backdrop-blur-sm px-6 py-3.5 rounded-full border border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-700 transition-colors">
                    <TrendingUp className="text-green-600 dark:text-green-400" size={18} />
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Recherche Approfondie</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Articles */}
        <section className="space-y-10">
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full border border-emerald-300 dark:border-emerald-700">
              <Eye size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 font-bold tracking-widest text-xs uppercase">Publications Spécialisées</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Articles de Recherche et d'Analyse
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Une collection d'articles approfondis explorant les dimensions culturelles, sociales et économiques de l'Afrique contemporaine.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                {articles.map((article, index) => (
                  <div 
                    key={article.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ArticleCard 
                      article={article}
                      className="h-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-emerald-100 dark:border-emerald-900/30"
                      imageHeight="h-56"
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 pt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="px-8 py-6 font-semibold border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    ← Précédent
                  </Button>
                  
                  <div className="flex items-center gap-3 bg-emerald-100 dark:bg-emerald-900/30 px-6 py-3 rounded-full border border-emerald-300 dark:border-emerald-700">
                    <span className="text-gray-800 dark:text-gray-200 font-bold">
                      Page {currentPage + 1}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">sur</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {totalPages}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-8 py-6 font-semibold border-2 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Suivant →
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/10 rounded-full blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full w-28 h-28 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <BookOpen size={40} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Aucun article disponible pour le moment
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
                  Les publications spécialisées seront bientôt disponibles. Revenez prochainement !
                </p>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[2.5rem] opacity-90 blur-2xl -z-10"></div>
          
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-[2.5rem] p-8 md:p-16 lg:p-20 text-center text-white relative overflow-hidden border border-emerald-400/30 shadow-2xl">
            {/* Animated Pattern Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Sparkles size={16} className="text-white" />
                <span className="text-sm font-bold text-white tracking-wide">REJOIGNEZ-NOUS</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black leading-tight">
                Approfondissez vos connaissances
              </h3>
              
              <p className="text-emerald-50 text-xl max-w-2xl mx-auto leading-relaxed">
                Rejoignez notre communauté de lecteurs passionnés par l'intelligence interculturelle et les enjeux africains.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 pt-6">
                <Link href="/">
                  <Button className="h-14 px-10 bg-white text-emerald-600 hover:bg-emerald-50 font-bold shadow-2xl rounded-full text-lg group transition-all duration-300 hover:scale-105">
                    Retour à l'accueil
                    <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button className="h-14 px-10 bg-emerald-800/50 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-emerald-700/50 font-bold shadow-xl rounded-full text-lg transition-all duration-300 hover:scale-105">
                  <Users size={20} className="mr-3" />
                  S'abonner
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}