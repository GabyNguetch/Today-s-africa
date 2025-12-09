"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle, 
  Download,
  Clock,
  User,
  Share2
} from "lucide-react";
import { ARTICLES_DATA, APP_CONFIG } from "@/lib/constant";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { id } = use(params);
  
  const article = ARTICLES_DATA.find((a) => a.id === id);

  if (!article) return notFound();

  // Recherche des articles connexes (3 premiers différents de l'actuel)
  const relatedArticles = ARTICLES_DATA
    .filter(a => a.categorySlug === article.categorySlug && a.id !== article.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans selection:bg-[#3E7B52] selection:text-white">
      <Navbar />

      <main className="max-w-[1400px] mx-auto w-full px-4 md:px-12 py-8">
        
        {/* --- ARTICLE HEADER IMAGE --- */}
        <div className="w-full h-[300px] md:h-[500px] relative rounded-2xl overflow-hidden mb-10 shadow-lg dark:shadow-none dark:border dark:border-zinc-800">
            <Image 
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
            />
            {/* Overlay gradient pour lisibilité éventuelle */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* --- GRID LAYOUT : CONTENT (Left) vs SIDEBAR (Right) --- */}
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* LEFT: MAIN CONTENT */}
            <article className="flex-1 max-w-4xl">
                
                <h1 className="text-3xl md:text-[42px] font-extrabold text-[#111] dark:text-white leading-[1.2] mb-6">
                    {article.title}
                </h1>

                {/* META INFO */}
                <div className="flex items-center flex-wrap gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-100 dark:border-zinc-800">
                    <span className="flex items-center gap-1.5">
                        <User size={14} className="text-[#3E7B52] dark:text-[#13EC13]" />
                        Par {article.author}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {article.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <Link href={`/category/${article.categorySlug}`} className="uppercase tracking-wide text-[#3E7B52] dark:text-[#13EC13] hover:underline">
                        {article.category}
                    </Link>
                </div>

                {/* LEAD PARAGRAPH (BOLD) */}
                <p className="text-lg md:text-xl font-medium text-gray-800 dark:text-gray-200 leading-relaxed mb-8 font-serif">
                    {article.summary}
                </p>

                {/* DYNAMIC CONTENT PARAGRAPHS */}
                <div className="space-y-6 text-base text-gray-700 dark:text-gray-300 leading-[1.8] tracking-wide">
                    {article.content.map((paragraph, index) => (
                        <div key={index} className="space-y-6">
                            <p>{paragraph}</p>
                            {/* Insert image simulation after first paragraph */}
                            {index === 0 && (
                                <figure className="my-8">
                                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
                                        <Image 
                                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
                                            alt="Illustration content"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <figcaption className="text-center text-xs text-gray-400 mt-2 italic">
                                        Des jeunes talents camerounais sont au coeur de cette transformation.
                                    </figcaption>
                                </figure>
                            )}
                            {/* Quotation style after 2nd paragraph */}
                            {index === 1 && (
                                <blockquote className="border-l-4 border-[#13EC13] pl-6 my-8 italic text-lg text-gray-800 dark:text-gray-200 bg-green-50/50 dark:bg-green-900/10 py-4 rounded-r-lg">
                                    "L'innovation africaine ne consiste pas à copier l'Occident, mais à créer des solutions uniques pour des problèmes uniques." 
                                    <span className="block mt-2 text-xs font-bold not-italic text-gray-500 uppercase">- Fictional Tech CEO</span>
                                </blockquote>
                            )}
                        </div>
                    ))}
                    
                    <p>
                        Néanmoins, le financement reste le nerf de la guerre. Les entrepreneurs peinent à trouver des capitaux pour passer de l'idée au prototype, puis à la commercialisation à grande échelle. Le gouvernement, conscient de cet enjeu, a lancé plusieurs initiatives pour encourager l'investissement, mais les résultats se font encore attendre.
                    </p>
                </div>

            </article>

            {/* RIGHT: STICKY SIDEBAR (Partager) */}
            <aside className="w-full lg:w-[280px] space-y-8">
                {/* Boite de partage sticky */}
                <div className="sticky top-28 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                        <h3 className="font-bold text-sm uppercase text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Share2 size={16} /> Partager l'article
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 group">
                                <div className="p-2 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <Facebook size={18} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500">Facebook</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 group">
                                <div className="p-2 rounded-full bg-sky-50 text-sky-500 dark:bg-sky-900/30 dark:text-sky-400 group-hover:scale-110 transition-transform">
                                    <Twitter size={18} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500">Twitter</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 group">
                                <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 group-hover:scale-110 transition-transform">
                                    <Linkedin size={18} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500">LinkedIn</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 group">
                                <div className="p-2 rounded-full bg-green-50 text-green-500 dark:bg-green-900/30 dark:text-green-400 group-hover:scale-110 transition-transform">
                                    <MessageCircle size={18} />
                                </div>
                                <span className="text-[10px] font-medium text-gray-500">WhatsApp</span>
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                            <Button className="w-full flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold h-10 shadow-md shadow-green-200/50 dark:shadow-none">
                                <Download size={14} />
                                Télécharger en PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        {/* --- ARTICLES CONNEXES --- */}
        {relatedArticles.length > 0 && (
            <div className="mt-20 pt-10 border-t border-gray-200 dark:border-zinc-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                    Articles Connexes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedArticles.map((relItem) => (
                        <Link key={relItem.id} href={`/articles/${relItem.id}`} className="group flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-lg dark:hover:border-zinc-600 transition-all duration-300">
                            <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                                <Image 
                                    src={relItem.image}
                                    alt={relItem.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-4 flex flex-col gap-2 flex-1">
                                <span className="text-[10px] font-bold text-[#3E7B52] dark:text-[#13EC13] uppercase tracking-wide">
                                    {relItem.category}
                                </span>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors line-clamp-3">
                                    {relItem.title}
                                </h4>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

      </main>
      <Footer />
    </div>
  );
}