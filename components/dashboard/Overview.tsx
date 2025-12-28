import React from 'react';
import { Eye, FileText, MessageSquare, TrendingUp } from 'lucide-react';
// Helper local pour ce fichier
import { cn } from "@/lib/utils";


// Données statiques pour l'exemple
const statsData = [
  { label: 'Articles Publiés', value: 12, icon: FileText, color: 'text-blue-500' },
  { label: 'Vues Totales', value: '8.5k', icon: Eye, color: 'text-[#3E7B52] dark:text-[#13EC13]' },
  { label: 'Commentaires', value: 64, icon: MessageSquare, color: 'text-orange-500' },
];

export default function Overview() {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Header local */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Tableau de bord</h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm">Bienvenue, voici ce qui se passe sur votre blog aujourd'hui.</p>
      </div>

      {/* Cartes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat) => (
          <div 
            id={stat.icon === Eye ? "dashboard-stats-card" : undefined} 
            key={stat.label} 
            className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-start justify-between group hover:border-[#3E7B52]/30 dark:hover:border-[#13EC13]/30 transition-all"
          >
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                {stat.label}
              </h3>
              <p className={cn("text-3xl font-extrabold", stat.color)}>
                {stat.value}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Graphique simulé ou Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-6">
             <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp size={18} className="text-[#3E7B52] dark:text-[#13EC13]"/> 
                    Performance
                 </h3>
                 <span className="text-xs text-gray-400 border border-gray-100 dark:border-zinc-700 px-2 py-1 rounded">Cette semaine</span>
             </div>
             <div className="h-64 flex items-end justify-between gap-2">
                {/* Simulation de barres de graph */}
                {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                    <div key={i} className="w-full bg-green-50 dark:bg-zinc-800 rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                        <div 
                            className="absolute bottom-0 left-0 right-0 bg-[#3E7B52] dark:bg-[#13EC13] rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity" 
                            style={{ height: `${h * 0.6}%` }} 
                        />
                    </div>
                ))}
             </div>
        </div>

        <div className="bg-[#3E7B52] dark:bg-zinc-800 rounded-xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
             
             <div>
                <h3 className="font-bold text-lg mb-2">Conseil Rédacteur</h3>
                <p className="text-green-100/80 text-sm leading-relaxed">
                    Les articles contenant des visuels (images ou graphiques) obtiennent 94% de vues en plus. Pensez à illustrer vos propos !
                </p>
             </div>
             <button className="w-full py-3 bg-white text-[#3E7B52] dark:bg-[#13EC13] dark:text-black font-bold rounded-lg text-sm mt-6 hover:bg-gray-100 transition">
                Voir le guide
             </button>
        </div>
      </div>
    </div>
  );
}

