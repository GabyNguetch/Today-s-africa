"use client";

import React, { useEffect, useState } from 'react';
import { AdminService } from '@/services/admin'; // ✅ Logique déplacée ici
import { Users, User, ShieldCheck, UserPlus, X, Search, Loader2, Mail, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth';

interface UserData {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
    dateCreation?: string;
    actif?: boolean;
    stats?: {
        totalArticles: number;
        vues: number;
    };
}

export default function AdminRedacteurs() {
  const [activeTab, setActiveTab] = useState<'TEAM' | 'USERS'>('TEAM');
  const [dataList, setDataList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
        if (activeTab === 'TEAM') {
            const rawRedacteurs = await AdminService.getAllRedacteurs();
            
            // Enrichissement réel par l'API de Stats
            const enriched = await Promise.all(rawRedacteurs.map(async (u) => {
                const s = await AdminService.getAuthorStats(u.id);
                return {
                    ...u,
                    stats: {
                        totalArticles: s?.totalArticles || 0,
                        vues: s?.vues || s?.totalVues || 0 // Gestion des variantes de noms de champs
                    }
                };
            }));
            setDataList(enriched);
        } else {
            const all = await AdminService.getAllUsers();
            setDataList(all);
        }
    } catch(e) {
        console.error("Erreur de chargement de l'annuaire");
    } finally {
        setLoading(false);
    }
  };

  const handleSuccessCreate = () => {
      setIsModalOpen(false);
      setActiveTab('TEAM');
      loadData(); 
  };

  const filteredList = dataList.filter(u => 
      `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* --- HEADER (Couleurs passées en Vert #3E7B52) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 dark:border-zinc-800 pb-6">
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <Users className="text-[#3E7B52]" />
                        Annuaire des Membres
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Supervisez l'équipe de rédaction et les comptes utilisateurs.</p>
                </div>
                
                <div className="flex p-1 bg-gray-100 dark:bg-zinc-900 rounded-lg w-fit">
                    <button
                        onClick={() => { setActiveTab('TEAM'); setSearchQuery(""); }}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                            activeTab === 'TEAM' 
                                ? "bg-white dark:bg-zinc-800 text-[#3E7B52] shadow-sm" 
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <ShieldCheck size={14}/> Équipe
                    </button>
                    <button
                        onClick={() => { setActiveTab('USERS'); setSearchQuery(""); }}
                        className={cn(
                            "px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                            activeTab === 'USERS' 
                                ? "bg-white dark:bg-zinc-800 text-[#3E7B52] shadow-sm" 
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <User size={14}/> Tous les membres
                    </button>
                </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto items-center">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                    <input 
                        type="text" 
                        placeholder="Rechercher..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 h-10 w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52]/20"
                    />
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-auto h-10 px-4 font-bold bg-[#3E7B52] hover:bg-[#326342] text-white border-none"
                >
                    <UserPlus size={16} className="mr-2"/> Rédacteur
                </Button>
            </div>
        </div>

        {/* --- LISTING --- */}
        {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                <Loader2 className="animate-spin text-[#3E7B52]" size={32}/>
                <p className="text-xs font-bold uppercase tracking-widest">Récupération des données...</p>
            </div>
        ) : filteredList.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/50 dark:bg-zinc-900 rounded-xl border border-dashed dark:border-zinc-800">
                <p className="text-gray-500">Aucun profil ne correspond à cette recherche.</p>
            </div>
        ) : (
            <>
            {activeTab === 'TEAM' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredList.map((r) => (
                        <div key={r.id} className="group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#3E7B52] text-white rounded-xl flex items-center justify-center text-lg font-bold">
                                    {r.prenom?.[0]}{r.nom?.[0]}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{r.prenom} {r.nom}</h3>
                                    <p className="text-[10px] font-black uppercase text-[#3E7B52] mt-0.5">{r.role}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 border-t dark:border-zinc-800 pt-4">
                                <div className="text-center">
                                    <p className="text-xl font-black text-gray-900 dark:text-white">{compactNumber(r.stats?.totalArticles)}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Articles</p>
                                </div>
                                <div className="text-center border-l dark:border-zinc-800">
                                    <p className="text-xl font-black text-[#13EC13]">{compactNumber(r.stats?.vues)}</p>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase">Lectures</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'USERS' && (
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Nom Complet</th>
                                <th className="px-6 py-4">Contact Email</th>
                                <th className="px-6 py-4">Rôle Système</th>
                                <th className="px-6 py-4 text-right">Identifiant</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {filteredList.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                        {u.prenom} {u.nom}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                            u.role === 'ADMIN' ? "bg-purple-50 text-purple-700 border-purple-200" :
                                            u.role === 'REDACTEUR' ? "bg-green-50 text-[#3E7B52] border-[#3E7B52]/20" :
                                            "bg-gray-100 text-gray-500 border-gray-200"
                                        )}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-300 font-mono text-[10px]">#{u.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            </>
        )}

        {/* --- MODAL (Logique d'inscription Staff) --- */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}/>
                <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border dark:border-zinc-800 animate-in zoom-in-95">
                    <div className="px-6 py-4 border-b dark:border-zinc-800 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-[#3E7B52] uppercase text-xs">Ajouter à l'équipe</h3>
                        <button onClick={() => setIsModalOpen(false)}><X size={18} className="text-gray-400"/></button>
                    </div>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const data = new FormData(e.currentTarget);
                        try {
                            await authService.createRedacteur({
                                prenom: data.get('prenom') as string,
                                nom: data.get('nom') as string,
                                email: data.get('email') as string,
                                motDePasse: data.get('password') as string,
                            });
                            handleSuccessCreate();
                        } catch { alert("Échec de création. Vérifiez l'email."); }
                    }} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Prénom</label>
                                <input name="prenom" required className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border rounded text-sm outline-none dark:text-white dark:border-zinc-700"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Nom</label>
                                <input name="nom" required className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border rounded text-sm outline-none dark:text-white dark:border-zinc-700"/>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Email Pro</label>
                            <input name="email" type="email" required className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border rounded text-sm outline-none dark:text-white dark:border-zinc-700"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Mot de passe temporaire</label>
                            <input name="password" type="password" required className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border rounded text-sm outline-none dark:text-white dark:border-zinc-700"/>
                        </div>
                        <Button type="submit" className="w-full h-11 bg-[#3E7B52] font-black uppercase text-xs">Créer le profil Staff</Button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}

function compactNumber(num?: number) {
    if (!num) return '0';
    return Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(num);
}