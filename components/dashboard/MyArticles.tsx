// FICHIER: app/dashboard/my-articles/page.tsx
import React from 'react';

export default function MyArticlesPage() {
  return (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 min-h-[400px] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Mes Articles</h2>
        <p>Liste des articles publiés par le rédacteur.</p>
    </div>
  );
}