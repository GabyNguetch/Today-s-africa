"use client";

import React, { useEffect, useState } from "react";
import { User as UserIcon, Bell, Shield, LogOut } from "lucide-react";
import { authService, User } from "@/services/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Récupérer l'utilisateur courant pour l'affichage
    const currentUser = authService.getUser();
    if (currentUser) {
        setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Paramètres</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm mb-8">Gérez vos informations personnelles et vos préférences.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Colonne Gauche : Carte Profil */}
            <div className="md:col-span-1">
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 text-center sticky top-6 shadow-sm">
                    <div className="relative mx-auto w-24 h-24 mb-4 group cursor-pointer">
                         <div className="w-full h-full bg-[#3E7B52] dark:bg-[#13EC13] rounded-full flex items-center justify-center text-white dark:text-black font-bold text-3xl">
                            {user.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-white text-xs">Modifier</span>
                         </div>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{user.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{user.email}</p>
                    <span className="inline-block px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded-full tracking-wide">
                        {user.role}
                    </span>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                        <button 
                            onClick={handleLogout}
                            className="text-xs font-medium text-red-500 hover:text-red-700 dark:hover:text-red-400 flex items-center justify-center gap-2 w-full transition-colors"
                        >
                            <LogOut size={14}/>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            {/* Colonne Droite : Formulaires */}
            <div className="md:col-span-2 space-y-6">
                
                {/* Section Informations */}
                <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <UserIcon size={16} /> Informations Personnelles
                    </h3>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Nom complet</label>
                                <Input label="" placeholder={user.name} defaultValue={user.name} className="h-10 dark:bg-zinc-950 dark:border-zinc-700"/>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Rôle</label>
                                <Input label="" disabled value={user.role === 'editor' ? 'Rédacteur' : user.role} className="h-10 bg-gray-50 dark:bg-zinc-950/50 text-gray-500 border-gray-200 cursor-not-allowed"/>
                            </div>
                        </div>
                        <div>
                             <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                             <Input label="" type="email" defaultValue={user.email} className="h-10 dark:bg-zinc-950 dark:border-zinc-700"/>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <Button className="w-auto h-9 px-6 text-xs bg-[#3E7B52] dark:bg-[#13EC13] dark:text-black font-bold">Sauvegarder</Button>
                        </div>
                    </div>
                </section>

                {/* Section Notifications (Simulée) */}
                <section className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Bell size={16} /> Préférences de notifications
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Alerte commentaire sur mes articles</span>
                            <div className="w-10 h-5 bg-[#3E7B52] dark:bg-[#13EC13] rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Rapport hebdomadaire des vues</span>
                            <div className="w-10 h-5 bg-gray-200 dark:bg-zinc-700 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                        </div>
                    </div>
                </section>

                 {/* Zone Danger */}
                 <section className="border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-xl p-6">
                    <h3 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                        <Shield size={16} /> Zone Danger
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Une fois supprimé, votre compte de rédacteur ne peut plus être récupéré.</p>
                    <button className="text-xs font-semibold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-800/50 bg-white dark:bg-transparent px-4 py-2 rounded-lg transition-colors">
                        Demander la suppression du compte
                    </button>
                </section>

            </div>
        </div>
    </div>
  );
}