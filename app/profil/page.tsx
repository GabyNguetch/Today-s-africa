// FICHIER: app/profil/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LogOut, BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ProfilPage() {
    const { user, logout, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#FBFBFB] dark:bg-black font-sans flex flex-col">
            <Navbar />
            
            <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 shadow-sm">
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                        <div className="w-24 h-24 bg-gradient-to-tr from-[#3E7B52] to-green-300 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                            {user.prenom?.[0]}
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                                {user.prenom} {user.nom}
                            </h1>
                            <p className="text-gray-500 font-mono text-sm">{user.email}</p>
                            <span className="inline-block mt-3 px-3 py-1 bg-green-50 text-[#3E7B52] text-xs font-bold rounded-full uppercase">
                                Membre {user.role}
                            </span>
                        </div>
                        <div className="md:ml-auto">
                            <Button variant="outline" onClick={logout} className="text-red-500 border-red-100 p-3 hover:bg-red-50">
                                <LogOut size={16} className="mr-2"/> Déconnexion
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <BookOpen size={20} className="text-[#3E7B52]"/> Historique de lecture
                            </h3>
                            <p className="text-sm text-gray-500 italic">Bientôt disponible...</p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <MessageSquare size={20} className="text-blue-500"/> Mes Commentaires
                            </h3>
                            <p className="text-sm text-gray-500 italic">Bientôt disponible...</p>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
}