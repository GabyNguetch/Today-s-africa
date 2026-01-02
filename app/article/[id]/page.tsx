// FICHIER: app/article/[id]/page.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArticleReadDto, CommentaireDto } from "@/types/article";
import { PublicService } from "@/services/public";
import { useAuth } from "@/context/AuthContext";
import { 
  Share2, Heart, MessageCircle, 
  Send, Copy, Globe, Facebook, Twitter
} from "lucide-react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { cn, getImageUrl } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

// ==========================================
// 1. COMPOSANT SQUELETTE (OPTIMISÉ & ESTHÉTIQUE)
// ==========================================
const ArticleSkeleton = () => (
  <div className="bg-[#FDFDFD] dark:bg-black min-h-screen animate-pulse">
    <Navbar /> {/* La Navbar reste fixe pour la stabilité visuelle */}
    
    <div className="max-w-[1100px] mx-auto w-full px-6 md:px-12 py-12">
        {/* --- Header Skeleton --- */}
        <div className="border-b border-gray-100 dark:border-zinc-800 pb-10 mb-12">
            <div className="flex justify-between mb-8">
                <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                <div className="flex gap-3">
                    <div className="h-10 w-10 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-200 dark:bg-zinc-800 rounded-full"></div>
                </div>
            </div>
            {/* Title mimic */}
            <div className="space-y-4 mb-8">
                <div className="h-12 w-[90%] bg-gray-300 dark:bg-zinc-800 rounded-lg"></div>
                <div className="h-12 w-[70%] bg-gray-300 dark:bg-zinc-800 rounded-lg"></div>
            </div>
            {/* Intro mimic */}
            <div className="border-l-4 border-gray-200 dark:border-zinc-800 pl-6 space-y-3">
                <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded"></div>
                <div className="h-4 w-[85%] bg-gray-100 dark:bg-zinc-900 rounded"></div>
            </div>
            {/* Author mimic */}
            <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800"></div>
                <div className="space-y-2">
                    <div className="h-3 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                    <div className="h-2 w-24 bg-gray-200 dark:bg-zinc-800 rounded"></div>
                </div>
            </div>
        </div>

        {/* --- Content Grid Skeleton --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Col 8 : Main Content */}
            <div className="lg:col-span-8">
                <div className="w-full aspect-[16/10] bg-gray-200 dark:bg-zinc-800 rounded-xl mb-12"></div>
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="space-y-3">
                             <div className="h-4 w-full bg-gray-100 dark:bg-zinc-900 rounded"></div>
                             <div className="h-4 w-[92%] bg-gray-100 dark:bg-zinc-900 rounded"></div>
                             <div className="h-4 w-[98%] bg-gray-100 dark:bg-zinc-900 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Col 4 : Sidebar Skeleton */}
            <aside className="lg:col-span-4 space-y-8">
                <div className="h-64 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl"></div>
                <div className="h-24 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl"></div>
            </aside>
        </div>
    </div>
  </div>
);

// ==========================================
// 2. PAGE PRINCIPALE
// ==========================================
interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ArticlePage({ params }: PageProps) {
  // Helpers Next 15
  const { id } = use(params);
  const articleId = parseInt(id);
  const router = useRouter();
  const { user } = useAuth();

  // --- ÉTATS ---
  const [article, setArticle] = useState<ArticleReadDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  // Interactions
  const [comments, setComments] = useState<CommentaireDto[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0); 
  const [showShare, setShowShare] = useState(false);

  // --- OPTIMIZED DATA LOADING ---
  useEffect(() => {
    if (isNaN(articleId)) {
        setNotFound(true);
        setLoading(false);
        return;
    }

    const initPage = async () => {
      setLoading(true);
      
      try {
        // 🚀 Optimisation Performance : Promise.all pour tout charger en //
        const [fetchedArticle, fetchedComments, fetchedLikeStatus] = await Promise.all([
             PublicService.getById(articleId), // Requête principale
             PublicService.getComments(articleId), // Requête secondaire
             user ? PublicService.checkIfLiked(articleId) : Promise.resolve(false) // Conditionnelle
        ]);

        if (!fetchedArticle) {
            setNotFound(true);
        } else {
            setArticle(fetchedArticle);
            setComments(fetchedComments);
            setIsLiked(fetchedLikeStatus);
            // Incrément "Vue" silencieux (Fire & Forget, on n'attend pas la réponse)
            PublicService.incrementView(articleId).catch(console.error);
        }

      } catch (err) {
        console.error("Critical Load Error", err);
        setNotFound(true);
      } finally {
        setLoading(false); // Le Skeleton disparaît ici
      }
    };

    initPage();
  }, [articleId, user]);


  // --- HANDLERS D'INTERACTION ---

  const handleToggleLike = async () => {
      if (!user) { router.push("/login"); return; }
      
      // Optimistic UI : Mise à jour immédiate avant appel réseau
      const prevLiked = isLiked;
      setIsLiked(!prevLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

      try {
          await PublicService.toggleLike(articleId, isLiked);
      } catch {
          setIsLiked(prevLiked); // Revert en cas d'erreur
          alert("Erreur lors de l'action");
      }
  };

  const handlePostComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim()) return;
      
      setSubmittingComment(true);
      try {
          const added = await PublicService.postComment(articleId, newComment);
          // Ajout Optimistic à la liste
          setComments(prev => [added, ...prev]);
          setNewComment("");
      } catch (e) {
          alert("Erreur envoi commentaire.");
      } finally {
          setSubmittingComment(false);
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(window.location.href);
      setShowShare(false);
      alert("Lien copié dans le presse-papier");
  };

  const formatDate = (dateStr?: string) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return isValid(d) ? format(d, "d MMMM yyyy", { locale: fr }) : "";
  };

  // --- RENDER CONDITIONNELS ---

  if (loading) return <ArticleSkeleton />;
  
  if (notFound || !article) {
      return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center">
            <Navbar/>
            <div className="text-center space-y-4 mt-20">
                <h1 className="text-4xl font-black">404</h1>
                <p>Cet article semble introuvable ou a été supprimé.</p>
                <Button onClick={() => router.push('/')} className="w-auto px-6">Retour accueil</Button>
            </div>
        </div>
      );
  }

  return (
    <div className="bg-[#FDFDFD] dark:bg-black min-h-screen font-sans selection:bg-[#3E7B52] selection:text-white flex flex-col">
      <Navbar />

      <main className="max-w-[1100px] mx-auto w-full px-6 md:px-12 py-12 relative flex-1 animate-in fade-in duration-500">
        
        {/* ================= HEADER STYLE NEW YORK TIMES ================= */}
        <header className="mb-12 border-b border-gray-200 dark:border-zinc-800 pb-10">
             
             {/* Top Metadata Line */}
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3E7B52] dark:text-[#13EC13] px-3 py-1 bg-[#3E7B52]/5 rounded-md border border-[#3E7B52]/10">
                         {article.rubriqueNom || "Dossier"}
                     </span>
                     <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                     <span className="text-gray-400 dark:text-zinc-500 text-xs font-mono">
                         {formatDate(article.datePublication)}
                     </span>
                </div>
                
                {/* Outils Interactifs (Sticky-like behaviour visually) */}
                <div className="flex items-center gap-3">
                     <button 
                        onClick={handleToggleLike} 
                        className={cn("p-2.5 rounded-full border transition-all duration-300 active:scale-95 group", 
                            isLiked ? "bg-red-50 border-red-200 text-red-500 shadow-inner" : "border-gray-100 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500 bg-white dark:bg-zinc-900 dark:border-zinc-800"
                        )}
                        title="Ajouter aux favoris"
                     >
                         <Heart size={20} className={cn("transition-transform", isLiked && "fill-current scale-110")} />
                     </button>

                     <div className="relative">
                         <button 
                             onClick={() => setShowShare(!showShare)} 
                             className="p-2.5 rounded-full border border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all active:scale-95"
                         >
                             <Share2 size={20} />
                         </button>
                         
                         {/* Dropdown Partage */}
                         {showShare && (
                             <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 rounded-xl p-2 z-30 flex flex-col gap-1 animate-in fade-in zoom-in-95 origin-top-right">
                                 <button onClick={copyToClipboard} className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors">
                                     <Copy size={16} /> Copier le lien
                                 </button>
                                 <div className="h-px bg-gray-100 dark:bg-zinc-800 my-1"/>
                                 <a 
                                    href={`https://twitter.com/intent/tweet?text=${article.titre}&url=${typeof window !== 'undefined' ? window.location.href : ''}`} 
                                    target="_blank" 
                                    className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-400 transition-colors"
                                 >
                                     <Twitter size={16}/> Twitter / X
                                 </a>
                                 <a 
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`} 
                                    target="_blank" 
                                    className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 rounded-lg text-xs font-medium text-gray-600 dark:text-zinc-400 transition-colors"
                                 >
                                     <Facebook size={16}/> Facebook
                                 </a>
                             </div>
                         )}
                     </div>
                </div>
             </div>

             {/* Headline */}
             <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-[900] text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-8">
                 {article.titre}
             </h1>

             {/* Intro / Chapeau */}
             <p className="text-xl md:text-2xl text-gray-600 dark:text-zinc-300 leading-relaxed font-serif font-light max-w-4xl border-l-[3px] border-[#3E7B52] pl-6 md:pl-8 py-2">
                 {article.description}
             </p>

             {/* Author Bio (Mini) */}
             <div className="mt-8 flex items-center gap-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700 rounded-full flex items-center justify-center font-bold text-lg text-gray-500 overflow-hidden ring-2 ring-white dark:ring-black">
                     {article.auteurNom ? article.auteurNom.substring(0,1).toUpperCase() : "T"}
                 </div>
                 <div className="flex flex-col">
                     <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {article.auteurNom || "La Rédaction"} 
                        {article.region && <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-[10px] font-medium text-gray-500 uppercase tracking-wide border border-gray-200 dark:border-zinc-700">Bureau {article.region}</span>}
                     </span>
                     <span className="text-xs text-gray-400 mt-0.5">
                        Journaliste Politique & Économie
                     </span>
                 </div>
             </div>
        </header>

        {/* ================= LAYOUT 2 COLONNES (Main + Sidebar) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
             
             {/* COL GAUCHE (8) : ARTICLE */}
             <div className="lg:col-span-8">
                 
                 {/* Main Image */}
                 {article.imageCouvertureUrl && (
                     <figure className="mb-12 group cursor-zoom-in">
                         <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800 bg-gray-50">
                             <Image 
                                 src={getImageUrl(article.imageCouvertureUrl)} 
                                 alt={article.titre} 
                                 fill className="object-cover transition-transform duration-700 group-hover:scale-105" 
                                 unoptimized priority
                             />
                         </div>
                         <figcaption className="mt-3 text-[11px] text-gray-400 text-right font-mono uppercase tracking-wider flex items-center justify-end gap-2">
                             <span className="w-8 h-px bg-gray-300 dark:bg-zinc-700"></span> Crédit Photo: Todays Africa ©
                         </figcaption>
                     </figure>
                 )}

                 {/* CONTENU PROSE HTML */}
                 <div className="article-body font-serif text-[18px] md:text-[20px] leading-[1.8] text-[#1a1a1a] dark:text-[#d4d4d8]">
                     {article.blocsContenu && article.blocsContenu
                         .sort((a,b) => a.ordre - b.ordre)
                         .map((bloc, i) => (
                             <ContentBlock key={i} bloc={bloc} />
                         ))
                     }
                 </div>
                 
                 {/* FOOTER ARTICLE : TAGS */}
                 <div className="mt-16 pt-8 border-t border-dashed border-gray-200 dark:border-zinc-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Sujets associés</p>
                    <div className="flex flex-wrap gap-2">
                        {article.tags && article.tags.map(t => (
                            <span key={t} className="px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-full uppercase tracking-wide cursor-pointer hover:bg-[#3E7B52] hover:text-white hover:border-[#3E7B52] transition-all">
                                #{t}
                            </span>
                        ))}
                    </div>
                 </div>

             </div>

             {/* COL DROITE (4) : SIDEBAR STICKY (Commentaires & Stats) */}
             <aside className="lg:col-span-4 relative h-full">
                 <div className="sticky top-24 space-y-8">
                     
                     {/* STATS RAPIDES */}
                     <div className="flex gap-4 items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                         <div className="text-center">
                             <span className="block font-black text-2xl text-gray-900 dark:text-white">{article.vues || 1}</span>
                             <span className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">Vues</span>
                         </div>
                         <div className="h-8 w-px bg-gray-200 dark:bg-zinc-700"></div>
                         <div className="text-center">
                             <span className="block font-black text-2xl text-[#3E7B52] dark:text-[#13EC13] transition-all">{likesCount}</span>
                             <span className="text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">Likes</span>
                         </div>
                     </div>

                     {/* BOITE COMMENTAIRES (Style iOS/Message) */}
                     <div className="bg-[#F8F9FA] dark:bg-zinc-900/30 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-zinc-800/60 shadow-inner max-h-[80vh] flex flex-col">
                         
                         <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800">
                             <MessageCircle className="text-[#3E7B52]" size={20}/>
                             <h3 className="font-bold text-gray-900 dark:text-white">Débat ({comments.length})</h3>
                         </div>

                         {/* Liste Commentaires */}
                         <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-4 min-h-[200px]">
                             {comments.length === 0 ? (
                                 <div className="text-center py-8">
                                     <p className="text-sm font-medium text-gray-500">Soyez le premier à réagir.</p>
                                     <p className="text-xs text-gray-400 mt-1">Partagez votre opinion respectueuse.</p>
                                 </div>
                             ) : (
                                 comments.map(c => (
                                     <div key={c.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                         <div className="bg-white dark:bg-zinc-800 p-3.5 rounded-2xl rounded-tl-sm border border-gray-100 dark:border-zinc-700/50 shadow-sm">
                                             <div className="flex justify-between items-baseline mb-2">
                                                 <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{c.auteurNom || "Utilisateur"}</span>
                                                 <span className="text-[10px] text-gray-400">{formatDate(c.dateCreation)}</span>
                                             </div>
                                             <p className="text-sm text-gray-600 dark:text-zinc-300 leading-snug">{c.contenu}</p>
                                         </div>
                                     </div>
                                 ))
                             )}
                         </div>

                         {/* Input Box */}
                         {user ? (
                             <form onSubmit={handlePostComment} className="relative mt-auto">
                                <textarea 
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    className="w-full p-4 pr-12 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52]/50 shadow-sm min-h-[60px] max-h-[120px] resize-none scroll-smooth transition-all"
                                    placeholder="Participer à la conversation..."
                                    maxLength={500}
                                />
                                <button 
                                    type="submit" 
                                    disabled={submittingComment || !newComment.trim()} 
                                    className="absolute bottom-2.5 right-2.5 p-2 bg-[#3E7B52] hover:bg-[#326342] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                     <Send size={16}/>
                                </button>
                             </form>
                         ) : (
                             <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20 text-center">
                                 <p className="text-xs text-blue-700 dark:text-blue-300 font-bold mb-3">Connectez-vous pour rejoindre le débat.</p>
                                 <Button onClick={() => router.push('/login')} variant="outline" className="w-full h-8 text-xs font-bold bg-white border-blue-200 text-blue-700 hover:bg-blue-50">Connexion</Button>
                             </div>
                         )}

                     </div>
                 </div>
             </aside>
        </div>

      </main>
      <Footer />
      
      {/* Styles globaux injectés pour ce fichier (ex: typographie du contenu) */}
      <style jsx global>{`
        .article-body p { margin-bottom: 1.5em; }
        .article-body h2 { font-weight: 900; margin-top: 2em; margin-bottom: 0.5em; font-size: 1.75em; line-height: 1.1; letter-spacing: -0.02em; font-family: var(--font-sans); }
        .article-body h3 { font-weight: 800; margin-top: 1.5em; margin-bottom: 0.5em; font-size: 1.5em; font-family: var(--font-sans); }
        .article-body a { color: #3E7B52; text-decoration: underline; text-underline-offset: 4px; font-weight: 600; }
        .article-body ul, .article-body ol { margin-bottom: 1.5em; padding-left: 1.5em; }
        .article-body li { margin-bottom: 0.5em; position: relative; }
        /* Light dark mode adjustment for body text */
        .dark .article-body p { color: #d4d4d8; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
      `}</style>
    </div>
  );
}

// ==========================================
// 3. HELPERS DE RENDU BLOCS
// ==========================================
function ContentBlock({ bloc }: { bloc: any }) {
    switch(bloc.type) {
        case 'IMAGE': 
            return (
                <figure className="my-10 w-full group">
                    <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
                         <Image src={getImageUrl(bloc.url || bloc.contenu)} alt={bloc.altText || "Illustration"} fill className="object-cover" unoptimized/>
                    </div>
                    {bloc.legende && <figcaption className="mt-3 text-xs text-gray-500 dark:text-zinc-500 font-mono tracking-wide text-center">▲ {bloc.legende}</figcaption>}
                </figure>
            );
        case 'CITATION':
            return (
                <div className="my-10 pl-6 border-l-4 border-[#3E7B52] py-2">
                    <blockquote className="font-serif text-2xl text-gray-800 dark:text-white italic leading-relaxed">
                        “{bloc.contenu}”
                    </blockquote>
                </div>
            );
        case 'VIDEO':
             return (
                 <div className="my-10 w-full aspect-video bg-black rounded-lg overflow-hidden">
                     {/* Basic video fallback */}
                     <iframe src={bloc.url || bloc.contenu} className="w-full h-full border-0" allowFullScreen></iframe>
                 </div>
             )
        case 'TEXTE':
        default:
            // Protection HTML basique, en prod utilisez DOMPurify
            return <div dangerouslySetInnerHTML={{__html: bloc.contenu}} />;
    }
}