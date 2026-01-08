"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn, getImageUrl } from "@/lib/utils";
import { ArticleReadDto } from "@/types/article";
import { Clock, Eye, MessageCircle, User } from "lucide-react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

interface LandingArticleCardProps {
  article: ArticleReadDto;
  className?: string;
  imageHeight?: string; 
  hideDescription?: boolean; // Option pour gagner encore plus de place si besoin
}

// Helper pour formater les chiffres (1200 -> 1.2k)
const compactNumber = (num?: number) => {
  if (num === undefined || num === null) return 0;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export default function LandingArticleCard({ 
  article, 
  className, 
  imageHeight = "h-36", 
  hideDescription = false 
}: LandingArticleCardProps) {
  
  const imageUrl = useMemo(() => {
    if (article.imageCouvertureUrl) return getImageUrl(article.imageCouvertureUrl);
    if (Array.isArray(article.blocsContenu)) {
        const firstImg = article.blocsContenu.find(b => b.type === 'IMAGE' && (b.url || b.contenu));
        if (firstImg) return getImageUrl(firstImg.url || firstImg.contenu);
    }
    return getImageUrl(null);
  }, [article.imageCouvertureUrl, article.blocsContenu]);

  const formattedDate = useMemo(() => {
      if (!article.datePublication) return "";
      const dateObj = new Date(article.datePublication);
      return isValid(dateObj) ? format(dateObj, 'd MMM', { locale: fr }) : "";
  }, [article.datePublication]);

  return (
    <Link 
      href={`/article/${article.id}`} 
      className={cn(
        "group flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm transition-all duration-300", 
        "hover:shadow-md hover:border-[#3E7B52]/40 hover:-translate-y-0.5",
        className
      )}
    >
      {/* --- IMAGE AVEC BADGE INTÉGRÉ --- */}
      <div className={cn("relative w-full bg-gray-100 dark:bg-zinc-800 overflow-hidden shrink-0", imageHeight)}>
        <Image 
          src={imageUrl} 
          alt={article.titre || "Article"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        
        {/* Overlay ombré pour contraste badge */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
             <span className="bg-white/95 dark:bg-black/80 backdrop-blur-[2px] px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest text-[#3E7B52] dark:text-[#13EC13] shadow-sm">
                {article.rubriqueNom?.substring(0, 15) || "Actu"}
             </span>
             {formattedDate && (
               <span className="text-[9px] font-bold text-white flex items-center gap-1 drop-shadow-md">
                 <Clock size={10} /> {formattedDate}
               </span>
             )}
        </div>
      </div>
      
      {/* --- CONTENU COMPACT --- */}
      <div className="p-3 flex flex-col flex-1">
        {/* Titre */}
        <h3 className="text-[13px] md:text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 mb-1.5 group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors" title={article.titre}>
          {article.titre}
        </h3>
        
        {/* Extrait (optionnel ou très court) */}
        {!hideDescription && (
          <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
            {article.description}
          </p>
        )}
        
        {/* Footer Minimaliste : Auteur à gauche, Stats à droite */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50 dark:border-zinc-800/50">
           
           <div className="flex items-center gap-1.5 min-w-0 max-w-[50%]">
              <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-[8px] text-gray-500">
                <User size={10} />
              </div>
              <span className="text-[10px] font-medium text-gray-400 truncate dark:text-zinc-500">
                {article.auteurNom?.split(" ").pop() || "Tody"}
              </span>
           </div>

           <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-zinc-500 font-mono">
               <div className="flex items-center gap-1 group/stat" title="Vues">
                  <Eye size={12} className="group-hover/stat:text-[#3E7B52] transition-colors"/>
                  <span>{compactNumber(article.vues)}</span>
               </div>
               <div className="flex items-center gap-1 group/stat" title="Comms">
                  <MessageCircle size={12} className="group-hover/stat:text-blue-500 transition-colors"/>
                  <span>{compactNumber(article.commentaires)}</span>
               </div>
           </div>

        </div>
      </div>
    </Link>
  );
}