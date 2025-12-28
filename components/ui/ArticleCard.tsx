"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArticleReadDto } from "@/types/article";
import { Clock, User, Eye, MessageCircle, Share2, Heart } from "lucide-react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

interface ArticleCardProps {
  article: ArticleReadDto;
  className?: string;
  imageHeight?: string; 
}

// Helper pour formater les gros chiffres (ex: 1200 -> 1.2k)
const compactNumber = (num?: number) => {
  if (num === undefined || num === null) return 0;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
};

export default function ArticleCard({ article, className, imageHeight = "h-48" }: ArticleCardProps) {
  
  // 1. Logique d'image optimisée
  const imageUrl = useMemo(() => {
    if (article.imageCouvertureUrl) return article.imageCouvertureUrl;

    if (Array.isArray(article.blocsContenu)) {
        const firstImg = article.blocsContenu.find(b => b.type === 'IMAGE' && (b.url || b.contenu));
        if (firstImg) return firstImg.url || firstImg.contenu;
    }
    return "/images/image4.jpeg"; 
  }, [article.imageCouvertureUrl, article.blocsContenu]);

  // 2. Formatage de date sécurisé
  const formattedDate = useMemo(() => {
      if (!article.datePublication) return "Récemment";
      const dateObj = new Date(article.datePublication);
      return isValid(dateObj) 
        ? format(dateObj, 'dd MMM yyyy', { locale: fr }) 
        : "Date inconnue";
  }, [article.datePublication]);

  return (
    <Link 
      href={`/article/${article.id}`} 
      className={cn(
        "group flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300", 
        "hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 dark:hover:border-[#13EC13]/30",
        className
      )}
    >
      {/* --- ZONE IMAGE --- */}
      <div className={cn("relative w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden shrink-0", imageHeight)}>
        <Image 
          src={imageUrl} 
          alt={article.titre || "Image de l'article"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          unoptimized={true} 
        />
        
        <div className="absolute top-3 left-3 z-10">
             <span className="bg-white/95 dark:bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-[#3E7B52] dark:text-[#13EC13] border border-gray-100 dark:border-zinc-800 shadow-sm">
                {article.rubriqueNom || "Actualité"}
             </span>
        </div>
      </div>
      
      {/* --- ZONE CONTENU --- */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Titre */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors" title={article.titre}>
          {article.titre || "Sans titre"}
        </h3>
        
        {/* Extrait */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {article.description || "Cliquez pour découvrir cet article..."}
        </p>
        
        {/* --- STATS ROW (Nouveau Bloc) --- */}
        {/* On pousse ce bloc vers le bas grâce à 'mt-auto' pour aligner toutes les cartes */}
        <div className="flex items-center gap-4 mt-auto py-2 text-xs font-medium text-gray-400 dark:text-zinc-500">
             <div className="flex items-center gap-1" title="Vues">
                 <Eye size={14} className="group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors"/>
                 <span>{compactNumber(article.vues)}</span>
             </div>
             <div className="flex items-center gap-1" title="Commentaires">
                 <MessageCircle size={14} className="group-hover:text-blue-500 transition-colors"/>
                 <span>{compactNumber(article.commentaires)}</span>
             </div>
             <div className="flex items-center gap-1" title="Partages">
                 <Share2 size={14} className="group-hover:text-indigo-500 transition-colors"/>
                 <span>{compactNumber(article.partages)}</span>
             </div>
             {/* Note: 'favoris' n'étant pas dans ArticleReadDto par défaut, j'utilise un champ fictif ou partages ici, 
                 ajustez si votre backend renvoie bien 'favoris' ou 'likes' */}
             {/* <div className="flex items-center gap-1 ml-auto" title="Likes">
                 <Heart size={14} className="group-hover:text-red-500 transition-colors"/>
                 <span>{compactNumber(article.telechargements)}</span> 
             </div> */}
        </div>

        {/* Footer Card (Divider + Auteur + Date) */}
        <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between text-gray-400">
          
          <div className="flex items-center gap-2 max-w-[65%]">
            <span className="p-1 rounded-full bg-gray-50 dark:bg-zinc-800 text-[#3E7B52] dark:text-[#13EC13]">
               <User size={10}/>
            </span>
            <span className="text-[10px] font-semibold uppercase truncate text-gray-500 dark:text-zinc-400 group-hover:text-gray-800 dark:group-hover:text-zinc-200 transition-colors">
                {article.auteurNom || "Rédaction"}
            </span>
          </div>

          <span className="text-[10px] font-medium flex items-center gap-1.5 whitespace-nowrap bg-gray-50 dark:bg-zinc-800/50 px-2 py-1 rounded text-gray-500 dark:text-zinc-500">
            <Clock size={10} />
            {formattedDate}
          </span>
        </div>
      </div>
    </Link>
  );
}