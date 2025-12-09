import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

const mockMyArticles = [
    { id: 1, title: "L'essor de l'IA au Nigeria", status: "Publié", date: "12 Oct 2025", views: 1240 },
    { id: 2, title: "Les enjeux climatiques en RDC", status: "Brouillon", date: "10 Oct 2025", views: 0 },
    { id: 3, title: "Startup : Qui sera la prochaine licorne ?", status: "Publié", date: "05 Oct 2025", views: 890 },
];

export default function MyArticles() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mes Articles</h2>

        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Titre</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Date</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider">Statut</th>
                        <th className="px-6 py-4 font-bold uppercase text-[10px] tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {mockMyArticles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{article.title}</td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{article.date}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    article.status === 'Publié' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}>
                                    {article.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 text-gray-400">
                                    <button className="hover:text-blue-500 transition"><Eye size={16} /></button>
                                    <button className="hover:text-orange-500 transition"><Edit size={16} /></button>
                                    <button className="hover:text-red-500 transition"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}