// FICHIER: components/ui/ArticleCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Article } from "@/lib/constant"; // Import de l'interface Article

interface ArticleCardProps {
  article: Article;
  className?: string;
  imageHeight?: string; // Optionnel : pour ajuster la hauteur de l'image (ex: h-48)
}

export default function ArticleCard({ article, className, imageHeight = "h-48" }: ArticleCardProps) {
  
  // Fonction utilitaire locale pour mapper les catégories aux couleurs (similaire à page.tsx précédent)
  const getCategoryColor = (categorySlug: string) => {
    switch (categorySlug) {
      case "economie": return "text-green-600";
      case "politique": return "text-blue-600";
      case "technologie": return "text-purple-600";
      case "developpement": return "text-emerald-600";
      default: return "text-orange-600";
    }
  };

  return (
    <Link 
      href={`/article/${article.id}`} 
      className={cn(
        "group flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg dark:hover:border-zinc-700 transition-all duration-300", 
        className
      )}
    >
      <div className={cn("relative w-full bg-gray-200 dark:bg-zinc-800 overflow-hidden", imageHeight)}>
        <Image 
          src={article.image} 
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1 gap-3">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider dark:text-[#13EC13]",
          getCategoryColor(article.categorySlug)
        )}>
          {article.category}
        </span>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight line-clamp-3 group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors">
          {article.title}
        </h3>
        
        {/* On masque le résumé sur les très petites cartes si besoin, sinon on l'affiche */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {article.summary}
        </p>
        
        <div className="pt-3 mt-auto border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-gray-400 uppercase truncate max-w-[60%]">
            {article.author}
          </span>
          <span className="text-[10px] text-gray-400">
            {article.date}
          </span>
        </div>
      </div>
    </Link>
  );
}