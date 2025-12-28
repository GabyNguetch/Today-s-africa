"use client";

import React, { useEffect, useState } from 'react';
import { Edit, Trash2, RefreshCw, Eye, Send, FileClock, CheckCircle, FileText } from 'lucide-react';
import { ArticleReadDto } from '@/types/article';
import { ArticleService } from '@/services/article';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../ui/Button';

interface MyArticlesProps {
  onEdit: (id: number) => void;
}

export default function MyArticles({ onEdit }: MyArticlesProps) {
  const { user } = useAuth();
  
  // Onglets pour filtrer la vue (pas des statuts API directs, mais des filtres UI)
  const [activeTab, setActiveTab] = useState<'BROUILLONS' | 'EN_COURS' | 'PUBLIES'>('BROUILLONS');
  
  const [articles, setArticles] = useState<ArticleReadDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Rechargement des données selon l'onglet
  useEffect(() => {
    if (user?.id) fetchTabContent();
  }, [activeTab, user?.id]);

  const fetchTabContent = async () => {
    if (!user) return;
    setLoading(true);
    setArticles([]);

    try {
        let data: ArticleReadDto[] = [];
        
        // Logique Swagger spécifique par Onglet
        if (activeTab === 'BROUILLONS') {
                        // ✅ APPEL DE LA BONNE ROUTE
            console.log("📂 Récupération des brouillons pour l'auteur", user.id);
            data = await ArticleService.getRedacteurBrouillons(user.id);

        } else if (activeTab === 'PUBLIES') {
            data = await ArticleService.getRedacteurPublies(user.id);
        } else {
            // EN_COURS : On prend tout et on filtre car il n'y a pas de route "/articles/en-attente"
            const allResponse = await ArticleService.getRedacteurTousArticles(user.id, 0, 100);
            const allContent = Array.isArray(allResponse) ? allResponse : (allResponse.content || []);
            // Filtrage Client : PENDING_REVIEW + APPROVED (Avant publication finale)
            data = allContent.filter((a: ArticleReadDto) => 
                a.statut === 'PENDING_REVIEW' || a.statut === 'APPROVED' || a.statut === 'REJECTED'
            );
        }

                // Sécurisation Array (Correction de l'erreur TypeScript ici)
        const cleanList = Array.isArray(data) ? data : ((data as any).content || []);
        
        // On type explicitement 'a' et 'b'
        cleanList.sort((a: ArticleReadDto, b: ArticleReadDto) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
        setArticles(cleanList);
    } catch (e) {
        console.error("Erreur Fetch", e);
    } finally {
        setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleDelete = async (id: number) => {
      if(!confirm("⚠️ Confirmer la suppression définitive du brouillon ?")) return;
      setActionLoading(id);
      try {
          await ArticleService.delete(id);
          // Optimistic UI Update
          setArticles(prev => prev.filter(a => a.id !== id));
      } catch(e) { 
          alert("Erreur: Impossible de supprimer cet article."); 
      } finally {
          setActionLoading(null);
      }
  };

  const handleSubmit = async (id: number) => {
      if (!user) return;
      if (!confirm("Envoyer pour relecture éditoriale ?\nVous ne pourrez plus modifier l'article après cet envoi.")) return;
      
      setActionLoading(id);
      try {
          await ArticleService.submitForReview(id, user.id);
          // Après soumission, il disparaît des brouillons (passe en Pending)
          setArticles(prev => prev.filter(a => a.id !== id));
          // Idéalement on afficherait un Toast ici
      } catch(e) {
          alert("Erreur lors de la soumission.");
      } finally {
          setActionLoading(null);
      }
  };

  // --- HELPERS UI ---

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'DRAFT': return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Brouillon
            </span>
          );
          case 'PENDING_REVIEW': return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-50 text-orange-600 border border-orange-100">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span> En Revue
            </span>
          );
          case 'APPROVED': return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100">
                <CheckCircle size={10} strokeWidth={3}/> Validé
            </span>
          );
          case 'PUBLISHED': return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-[#13EC13]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> En Ligne
            </span>
          );
          case 'REJECTED': return (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-50 text-red-600 border border-red-200">
                Rejeté
            </span>
          );
          default: return <span className="bg-gray-100 px-2 py-1 rounded text-xs">{status}</span>;
      }
  };

  const tabs = [
      { id: 'BROUILLONS', label: 'Brouillons', icon: FileText },
      { id: 'EN_COURS', label: 'En Attente', icon: FileClock },
      { id: 'PUBLIES', label: 'Publiés', icon: CheckCircle },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* --- HEADER AVEC ONGLETS --- */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 dark:border-zinc-800 pb-2">
            <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Mes Articles</h2>
                <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">
                    Gérez vos contenus de la rédaction à la publication.
                </p>
            </div>
            
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-900 rounded-lg self-start sm:self-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-md transition-all",
                            activeTab === tab.id
                                ? "bg-white dark:bg-zinc-800 text-[#3E7B52] dark:text-[#13EC13] shadow-sm text-shadow-sm"
                                : "text-gray-500 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-zinc-300"
                        )}
                    >
                        <tab.icon size={14} className={activeTab === tab.id ? "" : "opacity-70"} />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* --- ACTIONS SECONDAIRES --- */}
        <div className="flex justify-end">
            <button 
                onClick={fetchTabContent} 
                disabled={loading}
                className="text-xs font-medium text-gray-500 hover:text-[#3E7B52] flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Actualiser la liste
            </button>
        </div>

        {/* --- LISTING CARDS (DESIGN PRO) --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800">
                <RefreshCw className="animate-spin text-gray-300 mb-2" size={24}/>
                <p className="text-xs text-gray-400 font-medium">Chargement de vos articles...</p>
            </div>
        ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 dark:bg-zinc-900/50 border border-dashed border-gray-200 dark:border-zinc-800 rounded-xl">
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-full shadow-sm mb-3">
                    <FileText className="text-gray-300" size={24}/>
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-zinc-400">Aucun article dans la section {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}.</p>
                {activeTab === 'BROUILLONS' && (
                    <p className="text-xs text-gray-400 mt-1">Commencez par rédiger un nouvel article.</p>
                )}
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {articles.map((art) => (
                    <div 
                        key={art.id} 
                        className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 hover:border-[#3E7B52]/30 dark:hover:border-[#13EC13]/30 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                    >
                        {/* Info Principales */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {getStatusBadge(art.statut)}
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                    {art.rubriqueNom || "Général"}
                                </span>
                            </div>
                            
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#3E7B52] dark:group-hover:text-[#13EC13] transition-colors mb-1 line-clamp-1" title={art.titre}>
                                {art.titre || "Article Sans Titre"}
                            </h3>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-500">
                                <span>Créé le {format(new Date(art.dateCreation), 'dd MMMM yyyy à HH:mm', {locale: fr})}</span>
                                {art.datePublication && (
                                    <>
                                        <span>•</span>
                                        <span className="text-green-600 dark:text-green-400">Publié le {format(new Date(art.datePublication), 'dd/MM/yyyy')}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Zone Actions - Change selon le statut */}
                        <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50 dark:border-zinc-800">
                            
                            {/* CASE BROUILLON ou REJETÉ -> Editable */}
                            {(art.statut === 'DRAFT' || art.statut === 'REJECTED') && (
                                <>
                                    <button 
                                        onClick={() => handleDelete(art.id)}
                                        disabled={actionLoading === art.id}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                                        title="Supprimer définitivement"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                    
                                    <button 
                                        onClick={() => onEdit(art.id)} // Déclenche le mode Edition dans le parent Dashboard
                                        className="h-9 px-4 rounded-lg bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-bold border border-gray-200 dark:border-zinc-700 flex items-center gap-2 transition-all"
                                    >
                                        <Edit size={14}/> Modifier
                                    </button>

                                    <Button 
                                        onClick={() => handleSubmit(art.id)}
                                        disabled={actionLoading === art.id}
                                        className="w-auto h-9 px-4 bg-[#3E7B52] hover:bg-[#326342] text-xs font-bold"
                                    >
                                        {actionLoading === art.id ? <RefreshCw className="animate-spin" size={14}/> : <Send size={14} className="mr-2"/>}
                                        Soumettre
                                    </Button>
                                </>
                            )}

                            {/* CASE PENDING ou APPROVED -> Read Only */}
                            {(art.statut === 'PENDING_REVIEW' || art.statut === 'APPROVED') && (
                                <>
                                    <span className="text-xs text-orange-500 italic mr-2 bg-orange-50 px-2 py-1 rounded">Verrouillé pendant la revue</span>
                                    <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                                        <Eye size={16}/>
                                    </button>
                                </>
                            )}

                            {/* CASE PUBLISHED -> Analytics link ou Voir */}
                            {art.statut === 'PUBLISHED' && (
                                <a 
                                    href={`/article/${art.id}`} // Lien public vers l'article
                                    target="_blank"
                                    rel="noreferrer" 
                                    className="h-9 px-4 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:text-[#3E7B52] dark:hover:text-white flex items-center gap-2 text-xs font-bold transition-colors"
                                >
                                    <Eye size={14}/> Voir en ligne
                                </a>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}