// FICHIER: components/home/InterculturelSidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Brain, ArrowRight, BookOpen, Sparkles, TrendingUp } from "lucide-react";
import { PublicService } from "@/services/public";
import { ArticleReadDto } from "@/types/article";
import { PageResponse } from "@/types/dashboard";
import { cn, getImageUrl } from "@/lib/utils";

export default function InterculturelSidebar() {
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response: PageResponse<ArticleReadDto> = await PublicService.getAdminArticles(0, 4);
        setArticles(response.content || []);
      } catch (error) {
        console.error("Erreur Interculturel Sidebar:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <aside className="w-full h-full flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-700">
      
      {/* --- En-tête de section --- */}
      <div className="bg-gray-100 text-gray-900 dark:bg-zinc-900 p-6 rounded-2xl relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#13EC13]/10 transition-colors duration-500"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl shadow-inner border border-white/5">
                <Brain className="text-[#3E7B52] w-5 h-5 animate-pulse" />
             </div>
             <span className="text-[10px] font-bold text-[#3E7B52] tracking-widest uppercase border border-[#13EC13]/20 px-2 py-0.5 rounded-full bg-[#13EC13]/5">
                Editorial
             </span>
          </div>
          
          <div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white leading-tight">
              Intelligence Interculturelle
            </h3>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Analyses expertes et théories sur les dynamiques culturelles africaines.
            </p>
          </div>

          <Link href="/intelligence-interculturelle">
            <button className="text-xs font-bold text-gray-600 dark:text-white flex items-center gap-2 group-hover:gap-3 transition-all hover:text-[#13EC13]">
              Découvrir la théorie <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>

      {/* --- Liste des Articles --- */}
      <div className="flex flex-col gap-4">
        <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 px-1">
            <TrendingUp size={14} className="text-[#3E7B52]" /> Dernières Analyses
        </h4>

        {loading ? (
           Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="flex gap-3 items-center animate-pulse">
                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
                <div className="space-y-2 flex-1">
                   <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                   <div className="h-2 bg-gray-200 dark:bg-zinc-800 rounded w-2/3"></div>
                </div>
             </div>
           ))
        ) : (
           articles.map((article, idx) => (
             <Link href={`/article/${article.id}`} key={article.id} className="group">
                <div className="p-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl hover:border-[#3E7B52]/30 dark:hover:border-[#3E7B52]/50 hover:shadow-md transition-all duration-300 flex gap-3 items-start">
                    
                    {/* Miniature */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100 dark:border-zinc-700">
                        <Image 
                           src={getImageUrl(article.imageCouvertureUrl)} 
                           alt={article.titre}
                           fill
                           className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    
                    {/* Texte */}
                    <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-[#3E7B52] bg-green-50 dark:bg-[#3E7B52]/10 px-1.5 py-0.5 rounded uppercase">
                            Analyse
                        </span>
                        <h5 className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1 leading-snug line-clamp-2 group-hover:text-[#3E7B52] transition-colors">
                            {article.titre}
                        </h5>
                    </div>
                </div>
             </Link>
           ))
        )}
      </div>

      {/* --- Widget Newsletter rapide --- */}
      <div className="mt-auto bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 p-4 rounded-xl">
         <div className="flex items-start gap-3">
             <Sparkles size={16} className="text-yellow-600 dark:text-yellow-500 mt-1"/>
             <div>
                 <h4 className="text-xs font-bold text-yellow-800 dark:text-yellow-400 uppercase">Newsletter Expert</h4>
                 <p className="text-[10px] text-yellow-700 dark:text-yellow-500/80 mt-1">
                    Recevez chaque semaine le condensé de l'intelligence interculturelle.
                 </p>
             </div>
         </div>
      </div>

    </aside>
  );
}