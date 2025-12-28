"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  X, CheckCircle, Calendar, User, ArrowLeft, Loader2, 
  XCircle, Send, Archive, Globe, AlertTriangle, 
  Trash2, RotateCcw // ✅ Icônes ajoutées
} from "lucide-react";
import { ArticleReadDto } from "@/types/article"; 
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  article: ArticleReadDto | null;
  // Handlers d'actions (promesses pour gérer le loading local)
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onPublish?: (id: number) => Promise<void>;
  onArchive?: (id: number) => Promise<void>;
  // ✅ Nouveaux Handlers pour les Archives
  onRepublish?: (id: number) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  
  isLoading?: boolean; // Loading global du parent
}

export default function ArticlePreviewModal({ 
    isOpen, onClose, article, isLoading: parentLoading, 
    onApprove, onReject, onPublish, onArchive,
    onRepublish, onDelete // ✅ Destructuring des nouvelles props
}: PreviewProps) {
  
  // Gestion d'état local pour le loading des boutons d'action
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Bloque le scroll du body quand le modal est ouvert
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Handler wrapper pour gérer le state de chargement
  const handleAction = async (action: ((id: number) => Promise<void>) | undefined) => {
      if (!action || !article) return;
      setIsActionLoading(true);
      try {
          await action(article.id);
          // Le modal ne se ferme pas ici, c'est le parent qui décide
      } catch (e) {
          console.error(e);
      } finally {
          setIsActionLoading(false);
      }
  };

  if (!isOpen) return null;

  if (!article || parentLoading) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl flex flex-col items-center gap-3 border border-gray-100 dark:border-zinc-800 shadow-2xl">
                <Loader2 className="animate-spin text-[#3E7B52]" size={32}/>
                <span className="text-sm font-medium dark:text-white">Chargement...</span>
            </div>
        </div>
      );
  }

  // Sécurisation et tri des blocs de contenu
  const safeBlocs = (article.blocsContenu || []).sort((a: any, b: any) => a.ordre - b.ordre);

  // --- Rendu des Blocs (Fonction de rendu) ---
  const renderBlock = (bloc: any, idx: number) => {
      if(bloc.type === 'IMAGE') {
          return (
            <figure key={idx} className="my-8 relative w-full group">
                <div className="relative w-full h-[300px] md:h-[500px] rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-800">
                    <Image 
                        src={bloc.url || bloc.contenu || ""} 
                        alt={bloc.altText || "Illustration"} 
                        fill className="object-cover" unoptimized={true} 
                    />
                </div>
                {(bloc.legende) && (
                    <figcaption className="text-center text-xs text-gray-500 mt-2 italic border-b border-dashed border-gray-200 dark:border-zinc-800 pb-2 inline-block px-4">
                        {bloc.legende}
                    </figcaption>
                )}
            </figure>
          );
      }
      if(bloc.type === 'CITATION') {
          return (
            <blockquote key={idx} className="relative pl-6 my-10 italic text-xl md:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed font-serif">
                <span className="absolute left-0 top-0 text-6xl text-[#3E7B52] opacity-30 font-black h-4 leading-3">“</span>
                {bloc.contenu}
            </blockquote>
          );
      }
      // HTML Text
      return (
          <div key={idx} 
               className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-loose my-6 font-serif" 
               dangerouslySetInnerHTML={{ __html: bloc.contenu }} 
          />
      );
  };

  // Helper pour badge statut
  const getStatusInfo = (status: string) => {
      switch(status) {
          case 'PENDING_REVIEW': return { label: 'En attente de validation', class: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle };
          case 'APPROVED': return { label: 'Validé (Prêt à publier)', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle };
          case 'PUBLISHED': return { label: 'En ligne (Publique)', class: 'bg-green-100 text-green-700 border-green-200', icon: Globe };
          case 'REJECTED': return { label: 'Rejeté', class: 'bg-red-100 text-red-700 border-red-200', icon: XCircle };
          case 'ARCHIVED': return { label: 'Archivé', class: 'bg-gray-100 text-gray-700 border-gray-200', icon: Archive };
          default: return { label: status, class: 'bg-gray-100 text-gray-500', icon: CheckCircle };
      }
  };

  const statusInfo = getStatusInfo(article.statut);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="fixed inset-0 z-[60] flex justify-center items-end md:items-center animate-in fade-in duration-300">
      {/* Overlay Clsoing Click */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Main Card */}
      <div className="relative w-full h-[95vh] md:w-[90vw] md:h-[90vh] bg-white dark:bg-[#0a0a0a] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10 animate-in slide-in-from-bottom-10 duration-500">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur z-20 sticky top-0">
            <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 dark:text-white">
                    <ArrowLeft className="md:hidden" size={24} />
                    <X className="hidden md:block" size={24} />
                </button>
                <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm hidden md:block">
                        APERCU ARTICLE #{article.id}
                    </h3>
                    <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit border", statusInfo.class)}>
                        <StatusIcon size={10} /> {statusInfo.label}
                    </div>
                </div>
            </div>
            
            {/* Infos rapides Admin */}
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
                <span className="hidden sm:block">Auteur: {article.auteurNom}</span>
            </div>
        </div>

        {/* --- CONTENU DE L'ARTICLE (SCROLLABLE) --- */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-black scroll-smooth custom-scrollbar">
            <main className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
                 
                 {/* En-tête Article */}
                 <div className="text-center max-w-3xl mx-auto mb-12">
                     <span className="text-[#3E7B52] dark:text-[#13EC13] text-xs font-black uppercase tracking-[0.2em] mb-4 inline-block px-3 py-1 rounded border border-[#3E7B52]/20 dark:border-[#13EC13]/20">
                         {article.rubriqueNom || "Rubrique"}
                     </span>
                     
                     <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                        {article.titre}
                     </h1>
                     
                     <p className="text-lg md:text-xl text-gray-500 dark:text-zinc-400 font-serif leading-relaxed italic border-l-2 border-[#3E7B52] pl-6 md:pl-0 md:border-none">
                        {article.description}
                     </p>
                     
                     {/* Méta-données Auteur/Date */}
                     <div className="flex justify-center items-center gap-3 mt-10 pt-8 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-gray-400">
                        <span className="flex items-center gap-2 text-black dark:text-white bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                             <User size={14} className="text-[#3E7B52] dark:text-[#13EC13]"/> {article.auteurNom || "Rédaction"}
                        </span>
                        <span className="flex items-center gap-2 px-2">
                            <Calendar size={14}/> {article.dateCreation ? new Date(article.dateCreation).toLocaleDateString() : "Date N/A"}
                        </span>
                     </div>
                 </div>

                 {/* Cover Image (Grande) */}
                 {article.imageCouvertureUrl && (
                     <div className="relative w-full aspect-video md:aspect-[2/1] rounded-2xl overflow-hidden mb-16 shadow-2xl border-4 border-white dark:border-zinc-900 ring-1 ring-gray-100 dark:ring-zinc-800">
                         <Image src={article.imageCouvertureUrl} alt={article.titre} fill className="object-cover" priority unoptimized={true} />
                     </div>
                 )}

                 {/* Corps du texte */}
                 <div className="max-w-[700px] mx-auto article-content">
                    {safeBlocs.length > 0 
                        ? safeBlocs.map((b: any, i: number) => renderBlock(b, i)) 
                        : <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-dashed dark:border-zinc-800"><p className="text-gray-400">Contenu vide.</p></div>
                    }
                 </div>
            </main>
        </div>

        {/* --- FOOTER : BARRE D'ACTIONS ADMIN (Sticky Bottom) --- */}
        <div className="p-4 md:px-8 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] z-30 shrink-0">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between max-w-6xl mx-auto w-full">
                
                {/* Information contexte (Visible sur Desktop) */}
                <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-mono">ID:{article.id}</span>
                    <span className="h-4 w-px bg-gray-200 dark:bg-zinc-700"/>
                    <span>Zone: {article.region || "Global"}</span>
                </div>
                
                {/* Zone de Boutons dynamiques selon Workflow */}
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                    
                    {/* SCÉNARIO 1 : ARTICLE EN REVUE (DRAFT -> VALIDATED) */}
                    {article.statut === 'PENDING_REVIEW' && (
                        <>
                            {onReject && (
                                <Button 
                                    onClick={() => handleAction(onReject)}
                                    disabled={isActionLoading}
                                    variant="outline"
                                    className="border-red-200 p-3 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    <XCircle size={18} className="mr-2"/> Rejeter
                                </Button>
                            )}
                            {onApprove && (
                                <Button 
                                    onClick={() => handleAction(onApprove)} 
                                    disabled={isActionLoading}
                                    className="bg-blue-600 p-3 hover:bg-blue-700 text-white font-bold"
                                >
                                    {isActionLoading ? <Loader2 className="animate-spin mr-2" size={18}/> : <CheckCircle size={18} className="mr-2"/>}
                                    Approuver la rédaction
                                </Button>
                            )}
                        </>
                    )}

                    {/* SCÉNARIO 2 : ARTICLE VALIDÉ (APPROVED -> PUBLISHED) */}
                    {article.statut === 'APPROVED' && onPublish && (
                        <>
                            <div className="text-xs text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded hidden sm:block">
                                Cet article a été validé. Prêt pour mise en ligne.
                            </div>
                            <Button 
                                onClick={() => handleAction(onPublish)}
                                disabled={isActionLoading}
                                className="w-full p-3 sm:w-auto bg-[#3E7B52] hover:bg-[#326342] text-white font-bold shadow-lg shadow-green-900/20"
                            >
                                {isActionLoading ? <Loader2 className="animate-spin mr-2" size={18}/> : <Globe size={18} className="mr-2"/>}
                                Publier maintenant
                            </Button>
                        </>
                    )}

                    {/* SCÉNARIO 3 : ARTICLE EN LIGNE (PUBLISHED -> ARCHIVED) */}
                    {article.statut === 'PUBLISHED' && onArchive && (
                        <Button 
                            onClick={() => handleAction(onArchive)}
                            disabled={isActionLoading}
                            variant="outline"
                            className="text-gray-500 p-3 border-gray-300 hover:bg-gray-100 hover:text-black dark:border-zinc-700 dark:text-gray-400 dark:hover:text-white"
                        >
                            {isActionLoading ? <Loader2 className="animate-spin mr-2" size={18}/> : <Archive size={18} className="mr-2"/>}
                            Archiver / Retirer du site
                        </Button>
                    )}

                    {/* ✅ SCÉNARIO 4 : ARTICLE ARCHIVÉ (ARCHIVED -> RESTORE or DELETE) */}
                    {article.statut === 'ARCHIVED' && (
                        <>
                           <div className="text-xs text-gray-400 italic font-medium px-3 py-2 hidden sm:block">
                                Cet article est hors ligne.
                            </div>
                            {onDelete && (
                                <Button 
                                    onClick={() => handleAction(onDelete)}
                                    disabled={isActionLoading}
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20"
                                >
                                    <Trash2 size={18} className="mr-2"/> Supprimer
                                </Button>
                            )}
                            {onRepublish && (
                                <Button 
                                    onClick={() => handleAction(onRepublish)}
                                    disabled={isActionLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                >
                                    {isActionLoading ? <Loader2 className="animate-spin mr-2" size={18}/> : <RotateCcw size={18} className="mr-2"/>}
                                    Republier
                                </Button>
                            )}
                        </>
                    )}

                    {/* Default fallback */}
                    {['REJECTED', 'DRAFT'].includes(article.statut) && (
                        <span className="text-xs text-gray-400 italic">
                            Aucune action disponible pour le statut {article.statut}.
                        </span>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}