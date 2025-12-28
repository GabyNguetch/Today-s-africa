"use client";

import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, AlertTriangle, Archive, Calendar, 
  FileText, Loader2, ArrowUpRight, Check, X, Shield, 
  Eye, LayoutGrid, RotateCcw, Trash2
} from 'lucide-react';
import { ArticleService } from '@/services/article';
import { ArticleReadDto } from '@/types/article';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ArticlePreviewModal from './ArticlePreviewModal'; 

// Petit helper interne pour les cards stat
const StatCard = ({ label, value, icon: Icon, colorClass, borderClass }: any) => (
    <div className={cn("p-5 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between animate-in fade-in zoom-in-95 duration-500 hover:shadow-md transition-shadow", borderClass)}>
        <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className={cn("text-3xl font-black", colorClass)}>{value !== null ? value : "-"}</p>
        </div>
        <div className={cn("p-3 rounded-xl opacity-20", colorClass.replace('text-', 'bg-'))}>
            <Icon size={24} className={colorClass} style={{ opacity: 1 }}/>
        </div>
    </div>
);

export default function AdminArticles() {
  
  // -- STATES --
  const [activeTab, setActiveTab] = useState<'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'>('PENDING_REVIEW');
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  
  // -- MODAL --
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<ArticleReadDto | null>(null);
  
  // States Stats 
  const [stats, setStats] = useState({ 
      total: 0,
      pending: 0, 
      approved: 0, 
      published: 0,
      archived: 0
  });

  // -- INIT LOAD --
  useEffect(() => {
    loadArticles();
    updateStats(); 
  }, [activeTab]);

  const loadArticles = async () => {
    setLoading(true);
    try {
        console.log(`📡 ADMIN LOAD LIST [${activeTab}]...`);
        // Note: Assurez-vous que votre backend gère bien le status 'ARCHIVED' dans /articles/by-status/
        const res = await ArticleService.getArticlesByStatus(activeTab, 0, 100);
        const list = Array.isArray(res) ? res : (res.content || []);
        setArticles(list);
    } catch (e) {
        console.error("❌ ERROR LIST:", e);
        setArticles([]);
    } finally {
        setLoading(false);
    }
  };

  // Chargement des compteurs pour les Stats
  const updateStats = async () => {
      try {
          const [p, a, pub, arc] = await Promise.all([
              ArticleService.getArticlesByStatus('PENDING_REVIEW', 0, 1),
              ArticleService.getArticlesByStatus('APPROVED', 0, 1),
              ArticleService.getArticlesByStatus('PUBLISHED', 0, 1),
              ArticleService.getArticlesByStatus('ARCHIVED', 0, 1) // On suppose que cette route existe ou retourne vide
          ]);

          const countPending = p.totalElements ?? p.length ?? 0;
          const countApproved = a.totalElements ?? a.length ?? 0;
          const countPublished = pub.totalElements ?? pub.length ?? 0;
          const countArchived = arc.totalElements ?? arc.length ?? 0;

          setStats({
              pending: countPending,
              approved: countApproved,
              published: countPublished,
              archived: countArchived,
              total: countPending + countApproved + countPublished + countArchived
          });
      } catch (e) { console.error("Stats Error", e); }
  };

  // --- ACTIONS PRINCIPALES (Passées au Modal) ---
  
  const openPreview = (article: ArticleReadDto) => {
      setPreviewArticle(article);
      setIsPreviewOpen(true);
  };

  const handleApprove = async (id: number) => {
    try {
        await ArticleService.approve(id);
        closeModalAndRefresh("✅ Article approuvé !");
    } catch (e: any) { alert(`Erreur: ${e.message}`); }
  };

  const handlePublish = async (id: number) => {
    try {
        await ArticleService.publish(id);
        closeModalAndRefresh("🎉 Article mis en ligne !");
    } catch (e: any) { alert(`Erreur: ${e.message}`); }
  };

  const handleReject = async (id: number) => {
      const motif = prompt("Motif du rejet :", "Non conforme à la ligne éditoriale.");
      if (motif === null) return;
      if (!motif.trim()) return alert("Motif requis.");

      try {
          await ArticleService.reject(id, motif);
          closeModalAndRefresh("Article rejeté.");
      } catch (e) { alert("Erreur lors du rejet."); }
  };

  const handleArchive = async (id: number) => {
      if(!confirm("⚠️ Confirmer l'archivage ? L'article ne sera plus visible publiquement.")) return;
      try {
          await ArticleService.archive(id);
          closeModalAndRefresh("Article archivé.");
      } catch (e) { alert("Erreur archivage."); }
  };

  // --- ACTIONS SPECIFIQUES ARCHIVAGE (Utilisées dans le Tableau) ---

  const handleRepublish = async (id: number) => {
      if(!confirm("📢 Voulez-vous remettre cet article en ligne immédiatement ?")) return;
      setActionLoadingId(id);
      try {
          // On réutilise publish car le backend permet souvent Archive -> Publish directement
          // Sinon il faut faire un restore (pending) -> approve -> publish
          await ArticleService.publish(id); 
          
          setArticles(prev => prev.filter(a => a.id !== id));
          updateStats();
          alert("L'article est de nouveau en ligne !");
      } catch(e: any) {
          alert(`Impossible de republier: ${e.message}`);
      } finally {
          setActionLoadingId(null);
      }
  };

  const handleDeletePermanently = async (id: number) => {
      if(!confirm("⛔ DANGER : Suppression DÉFINITIVE.\n\nCette action est irréversible. Voulez-vous vraiment supprimer cet article de la base de données ?")) return;
      
      setActionLoadingId(id);
      try {
          await ArticleService.delete(id);
          setArticles(prev => prev.filter(a => a.id !== id));
          updateStats();
      } catch(e) {
          alert("Erreur lors de la suppression.");
      } finally {
          setActionLoadingId(null);
      }
  };

  const closeModalAndRefresh = (msg?: string) => {
      if(msg) alert(msg);
      setIsPreviewOpen(false);
      setPreviewArticle(null);
      // Optimistic update pour fluidité
      if (previewArticle) {
          setArticles(prev => prev.filter(a => a.id !== previewArticle.id));
      }
      updateStats(); // Mise à jour réelle des compteurs
      loadArticles(); // Reload complet au cas où
  };

  // -- CONFIG TABS --
  const tabs = [
      { id: 'PENDING_REVIEW', label: 'En attente', icon: AlertTriangle, color: "text-orange-500" },
      { id: 'APPROVED', label: 'Validés', icon: CheckCircle, color: "text-blue-500" },
      { id: 'PUBLISHED', label: 'En Ligne', icon: ArrowUpRight, color: "text-green-600" },
      { id: 'ARCHIVED', label: 'Archivés', icon: Archive, color: "text-gray-500" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-32">
        
        {/* --- MODAL INTERACTIF --- */}
        <ArticlePreviewModal 
            isOpen={isPreviewOpen} 
            onClose={() => setIsPreviewOpen(false)} 
            article={previewArticle}
            isLoading={false} 
            // Passage des handlers au modal pour l'affichage Preview
            onApprove={handleApprove}
            onReject={handleReject}
            onPublish={handlePublish}
            onArchive={handleArchive}
        />

        {/* --- HEADER --- */}
        <div>
            <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
                <Shield className="text-[#3E7B52] dark:text-[#13EC13] h-8 w-8"/> 
                Administration
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium">Pilotage du flux éditorial, validation et gestion des archives.</p>
        </div>

        {/* --- STATS CARDS (GRID OPTIMISÉE) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard 
                label="Total Articles" 
                value={stats.total} 
                icon={LayoutGrid} 
                colorClass="text-indigo-600 dark:text-indigo-400" 
                borderClass="border-transparent bg-indigo-50/50 dark:bg-indigo-900/10"
            />
            <StatCard 
                label="À Valider" 
                value={stats.pending} 
                icon={AlertTriangle} 
                colorClass="text-orange-600" 
                borderClass={activeTab === 'PENDING_REVIEW' ? "border-orange-500 ring-1 ring-orange-500" : "border-transparent"}
            />
            <StatCard 
                label="Prêts" 
                value={stats.approved} 
                icon={Check} 
                colorClass="text-blue-600 dark:text-blue-400" 
                borderClass={activeTab === 'APPROVED' ? "border-blue-500 ring-1 ring-blue-500" : "border-transparent"}
            />
            <StatCard 
                label="En Ligne" 
                value={stats.published} 
                icon={ArrowUpRight} 
                colorClass="text-green-600 dark:text-green-400" 
                borderClass={activeTab === 'PUBLISHED' ? "border-green-500 ring-1 ring-green-500" : "border-transparent"}
            />
            <StatCard 
                label="Archivés" 
                value={stats.archived} 
                icon={Archive} 
                colorClass="text-gray-500 dark:text-zinc-400" 
                borderClass={activeTab === 'ARCHIVED' ? "border-gray-400 ring-1 ring-gray-400" : "border-transparent"}
            />
        </div>

        {/* --- TABS --- */}
        <div className="border-b border-gray-100 dark:border-zinc-800 pb-1 flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "flex items-center gap-2 pb-3 px-1 text-xs font-bold uppercase tracking-widest transition-all border-b-2 shrink-0",
                        activeTab === tab.id 
                            ? `border-[#3E7B52] dark:border-[#13EC13] text-black dark:text-white` 
                            : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    )}
                >
                    <tab.icon size={16} className={activeTab === tab.id ? "text-[#3E7B52] dark:text-[#13EC13]" : "text-gray-300"} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* --- TABLEAU LISTING --- */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 min-h-[400px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <Loader2 className="animate-spin text-[#3E7B52] dark:text-[#13EC13]" size={40}/>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider animate-pulse">Synchronisation...</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 dark:bg-zinc-950/30 text-gray-400 uppercase text-[10px] font-extrabold border-b border-gray-100 dark:border-zinc-800 tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Article</th>
                                <th className="px-6 py-5">Auteur</th>
                                <th className="px-6 py-5">Dates</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                            {articles.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-40">
                                            <div className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-full">
                                                <FileText size={32} className="text-gray-400 dark:text-zinc-500"/>
                                            </div>
                                            <p className="text-sm font-semibold">Aucun article ici pour le moment.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {articles.map((art) => (
                                <tr key={art.id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors">
                                    
                                    {/* TITRE & ID */}
                                    <td className="px-8 py-5 max-w-xs md:max-w-md cursor-pointer" onClick={() => openPreview(art)}>
                                        <div className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors line-clamp-1">
                                            {art.titre || "Sans titre"}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                                                {art.rubriqueNom || "Général"}
                                            </span>
                                            {art.id && <span className="text-[10px] font-mono text-gray-300">#{art.id}</span>}
                                        </div>
                                    </td>

                                    {/* AUTEUR */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-zinc-300 shadow-sm shrink-0">
                                                {art.auteurNom ? art.auteurNom.substring(0,2).toUpperCase() : "U"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xs text-gray-900 dark:text-gray-200 whitespace-nowrap">{art.auteurNom || "Rédacteur Inconnu"}</span>
                                                <span className="text-[10px] text-gray-400 hidden sm:inline">Rédacteur</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* DATES */}
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-500 whitespace-nowrap">
                                                <Calendar size={12}/>
                                                <span>{art.dateCreation ? format(new Date(art.dateCreation), "d MMM yyyy", { locale: fr }) : "-"}</span>
                                            </div>
                                            {art.statut === 'PUBLISHED' && art.datePublication && (
                                                <span className="text-[#3E7B52] dark:text-[#13EC13] font-bold text-[10px] whitespace-nowrap">Publié le {format(new Date(art.datePublication), "dd/MM")}</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            
                                            {/* Action Spécifique Archivé: Supprimer / Republier */}
                                            {activeTab === 'ARCHIVED' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleRepublish(art.id)}
                                                        disabled={actionLoadingId === art.id}
                                                        className="h-8 w-8 flex items-center justify-center rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="Republier"
                                                    >
                                                        {actionLoadingId === art.id ? <Loader2 className="animate-spin" size={16}/> : <RotateCcw size={16}/>}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeletePermanently(art.id)}
                                                        disabled={actionLoadingId === art.id}
                                                        className="h-8 w-8 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                        title="Supprimer définitivement"
                                                    >
                                                        <Trash2 size={16}/>
                                                    </button>
                                                    <span className="w-px h-4 bg-gray-200 dark:bg-zinc-800 mx-1"></span>
                                                </>
                                            )}

                                            {/* Bouton Principal (Voir/Valider) */}
                                            <button 
                                                onClick={() => openPreview(art)}
                                                className={cn(
                                                    "h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm whitespace-nowrap",
                                                    activeTab === 'PENDING_REVIEW' 
                                                        ? "bg-[#3E7B52] hover:bg-[#2e623f] text-white hover:shadow-md dark:bg-[#13EC13] dark:text-black dark:hover:bg-[#0dbd0d]" 
                                                        : "bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-300"
                                                )}
                                            >
                                                {activeTab === 'PENDING_REVIEW' ? <CheckCircle size={14}/> : <Eye size={14}/>}
                                                <span className="hidden md:inline">{activeTab === 'PENDING_REVIEW' ? "Décider" : "Aperçu"}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
  );
}